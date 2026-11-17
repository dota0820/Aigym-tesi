import { z } from "zod";
import { COACH_TOOLS } from "./coach-tools";

const ENDPOINT = `${process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"}/chat/completions`;

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

export const OPENROUTER_VISION_MODEL =
  process.env.OPENROUTER_VISION_MODEL || OPENROUTER_MODEL;

export class OpenRouterError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}
type Msg =
  | { role: "system" | "user"; content: unknown }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

async function post(
  body: Record<string, unknown>,
  model = OPENROUTER_MODEL,
  apiKey?: string,
): Promise<Response> {
  const key = apiKey || process.env.OPENROUTER_API_KEY;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "X-Title": "Gym Coach",
    },
    body: JSON.stringify({ model, ...body }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => null);
    throw new OpenRouterError(res.status, j?.error?.message ?? res.statusText);
  }
  return res;
}

function systemMessage(system: string, context: string, model = OPENROUTER_MODEL): Msg {
  // Anthropic models cache the stable part of the prompt when marked.
  if (model.startsWith("anthropic/"))
    return {
      role: "system",
      content: [
        { type: "text", text: system, cache_control: { type: "ephemeral" } },
        { type: "text", text: context },
      ],
    };
  return { role: "system", content: `${system}\n\n---\n\n${context}` };
}

const tools = COACH_TOOLS.map((t) => ({
  type: "function",
  function: {
    name: t.name,
    description: t.description,
    parameters: cleanJsonSchema(z.toJSONSchema(t.schema) as Record<string, unknown>),
  },
}));

/** Remove top-level `$schema` metadata that some OpenRouter providers reject. */
function cleanJsonSchema(raw: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...raw };
  delete copy.$schema;
  return copy;
}

/** One streamed model turn: forwards text, returns the text and any tool calls. */
async function streamTurn(
  messages: Msg[],
  send: (ev: unknown) => void,
  model = OPENROUTER_MODEL,
  apiKey?: string,
  useTools = true,
): Promise<{ text: string; calls: ToolCall[] }> {
  const payload: Record<string, unknown> = { messages, stream: true, max_tokens: 8000 };
  if (useTools) payload.tools = tools;
  const res = await post(payload, model, apiKey);
  const reader = res.body!.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  const calls: ToolCall[] = [];

  const handle = (line: string) => {
    if (!line.startsWith("data:")) return; // SSE comments / keep-alives
    const data = line.slice(5).trim();
    if (!data || data === "[DONE]") return;
    const chunk = JSON.parse(data);
    if (chunk.error)
      throw new OpenRouterError(chunk.error.code ?? 502, chunk.error.message ?? "");
    const delta = chunk.choices?.[0]?.delta;
    if (!delta) return;
    if (typeof delta.content === "string" && delta.content) {
      text += delta.content;
      send({ type: "text", text: delta.content });
    }
    for (const tc of delta.tool_calls ?? []) {
      let i = tc.index as number | undefined;
      if (i == null) {
        if (tc.id) {
          const found = calls.findIndex((c) => c?.id === tc.id);
          i = found >= 0 ? found : calls.length;
        } else {
          i = Math.max(0, calls.length - 1);
        }
      }
      if (!calls[i]) {
        calls[i] = { id: "", type: "function", function: { name: "", arguments: "" } };
      }
      if (tc.id) calls[i].id = tc.id;
      if (tc.function?.name) {
        calls[i].function.name += tc.function.name;
        send({ type: "tool", name: calls[i].function.name });
      }
      if (tc.function?.arguments) calls[i].function.arguments += tc.function.arguments;
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      handle(buf.slice(0, i).trim());
      buf = buf.slice(i + 1);
    }
  }
  handle(buf.trim());
  const cleanCalls = calls.filter(Boolean).map((c, idx) => ({
    ...c,
    id: c.id || `call_${idx}_${Date.now()}`,
  }));
  return { text, calls: cleanCalls };
}

export async function runOpenRouterChat(opts: {
  system: string;
  context: string;
  messages: { role: "user" | "assistant"; text: string }[];
  image?: string;
  model?: string;
  apiKey?: string;
  useTools?: boolean;
  send: (ev: unknown) => void;
}) {
  const { send } = opts;
  const useTools = opts.useTools ?? true;
  const model = opts.model || OPENROUTER_MODEL;
  const messages: Msg[] = [
    systemMessage(opts.system, opts.context, model),
    ...opts.messages.map((m, i): Msg => {
      if (opts.image && i === opts.messages.length - 1 && m.role === "user")
        return {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: opts.image } },
            { type: "text", text: m.text },
          ],
        };
      return { role: m.role, content: m.text };
    }),
  ];

  for (let iter = 0; iter < 6; iter++) {
    const { text, calls } = await streamTurn(messages, send, model, opts.apiKey, useTools);
    if (!calls.length || !useTools) return;
    messages.push({ role: "assistant", content: text || null, tool_calls: calls });
    for (const call of calls) {
      const tool = COACH_TOOLS.find((t) => t.name === call.function.name);
      let content: string;
      if (!tool) {
        content = `错误:没有名为 ${call.function.name} 的工具。`;
      } else {
        let args: unknown = null;
        try {
          args = JSON.parse(call.function.arguments || "{}");
        } catch {
          // handled by the schema check below
        }
        const parsed = tool.schema.safeParse(args);
        if (parsed.success) {
          send(tool.event(parsed.data));
          content = tool.result;
        } else {
          content = `错误:参数不符合要求,请修正后重新调用。${parsed.error.message.slice(0, 500)}`;
        }
      }
      messages.push({ role: "tool", tool_call_id: call.id, content });
    }
    send({ type: "text", text: "\n\n" });
  }
}

function extractJsonObject(raw: string): unknown {
  const m = /\{[\s\S]*\}/.exec(raw);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

export async function structuredOpenRouter<T>(opts: {
  schema: z.ZodType<T>;
  schemaName: string;
  prompt: string;
  image?: string;
  maxTokens?: number;
  model?: string;
  apiKey?: string;
}): Promise<T | null> {
  const model = opts.model || OPENROUTER_VISION_MODEL;
  const max_tokens = opts.maxTokens ?? 1800;
  const jsonSchema = cleanJsonSchema(z.toJSONSchema(opts.schema) as Record<string, unknown>);

  const buildMessages = (extraSuffix = ""): Msg[] => [
    {
      role: "user",
      content: opts.image
        ? [
            { type: "image_url", image_url: { url: opts.image } },
            { type: "text", text: `${opts.prompt}${extraSuffix}` },
          ]
        : `${opts.prompt}${extraSuffix}`,
    },
  ];

  let res: Response;
  try {
    res = await post(
      {
        max_tokens,
        response_format: {
          type: "json_schema",
          json_schema: { name: opts.schemaName, strict: true, schema: jsonSchema },
        },
        messages: buildMessages("\n只输出符合 schema 的 JSON。"),
      },
      model,
      opts.apiKey,
    );
  } catch (err) {
    // Fallback if a specific OpenRouter upstream rejects strict json_schema.
    if (err instanceof OpenRouterError && (err.status === 400 || err.status === 422)) {
      res = await post(
        {
          max_tokens,
          messages: buildMessages(
            `\n\n请严格只输出一个合法的 JSON 对象（不要用 markdown 代码块包裹，也不要附加说明文字），结构示例参考:\n${JSON.stringify(jsonSchema)}`,
          ),
        },
        model,
        opts.apiKey,
      );
    } else {
      throw err;
    }
  }

  const j = await res.json();
  const raw: string = j.choices?.[0]?.message?.content ?? "";
  const parsed = opts.schema.safeParse(extractJsonObject(raw));
  return parsed.success ? parsed.data : null;
}
