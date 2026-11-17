import { z } from "zod";
import { buildDetectiveSystemPrompt } from "@/lib/movement-detective";
import { runOpenRouterChat } from "@/lib/openrouter";
import {
  anthropic,
  apiErrorMessage,
  guard,
  MODEL,
  requestedModel,
  resolveOpenRouterKey,
  viaOpenRouter,
} from "@/lib/server";

export const maxDuration = 300;

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), text: z.string() }))
    .min(1),
  context: z.string().max(20000),
  lang: z.enum(["zh", "en"]).optional(),
  mode: z.enum(["investigate", "visual"]).optional(),
  /** Optional photo or 4-frame video strip (data URL) attached to the newest user message. */
  image: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp);base64,/)
    .max(6_000_000)
    .optional(),
});

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Invalid request format / 请求格式不对" }, { status: 400 });
  }

  const { messages, context, image, lang: bodyLang, mode } = parsed.data;
  const headerLang = req.headers.get("x-app-lang");
  const lang = bodyLang ?? (headerLang === "en" ? "en" : "zh");
  const systemPrompt =
    buildDetectiveSystemPrompt(lang) +
    (mode === "visual"
      ? "\n\n[ACTIVE MODE: VISUAL MOVEMENT ANALYSIS — Apply Part 10 format strictly (WHAT I CAN SEE / POTENTIAL ISSUE / CORRECTION / WHAT I CANNOT CONFIRM) and attach <choices> on the final line.]"
      : "");

  const model = requestedModel(req);
  const apiKey = resolveOpenRouterKey(req);
  const enc = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(enc.encode(JSON.stringify(obj) + "\n"));

      if (viaOpenRouter(req)) {
        try {
          await runOpenRouterChat({
            system: systemPrompt,
            context,
            messages,
            image,
            model,
            apiKey,
            useTools: false,
            send,
          });
          send({ type: "done" });
        } catch (err) {
          console.error("detective openrouter error", err);
          send({ type: "error", error: apiErrorMessage(err) });
        } finally {
          controller.close();
        }
        return;
      }

      try {
        const messageStream = anthropic().messages.stream({
          model: MODEL,
          max_tokens: 4096,
          system: [
            {
              type: "text" as const,
              text: systemPrompt,
              cache_control: { type: "ephemeral" as const },
            },
            { type: "text" as const, text: context },
          ],
          messages: messages.map((m, i) => {
            if (!image || i !== messages.length - 1 || m.role !== "user") {
              return { role: m.role, content: m.text };
            }
            const [head, data] = image.split(",");
            return {
              role: m.role,
              content: [
                {
                  type: "image" as const,
                  source: {
                    type: "base64" as const,
                    media_type: head.slice(5, head.indexOf(";")) as
                      | "image/jpeg"
                      | "image/png"
                      | "image/webp",
                    data,
                  },
                },
                { type: "text" as const, text: m.text },
              ],
            };
          }),
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send({ type: "text", text: event.delta.text });
          }
        }
        send({ type: "done" });
      } catch (err) {
        console.error("detective anthropic error", err);
        send({ type: "error", error: apiErrorMessage(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
