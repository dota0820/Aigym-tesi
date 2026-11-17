"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import MD from "@/components/MD";
import PlanCard from "@/components/PlanCard";
import { fileToJpegDataUrl, sendToCoach, useCoachBusy, visibleText } from "@/lib/actions";
import { setState, useApp } from "@/lib/store";
import { canSpeak, speak, stopSpeaking, useDictation } from "@/lib/voice";

const STARTERS = [
  "今天想练背,帮我安排一下",
  "我是完全的新手,第一次去健身房应该做什么?",
  "下次我应该练什么?",
  "高位下拉我总是手臂酸、背没感觉,怎么办?",
];

function Coach() {
  const { chat, profile } = useApp();
  const busy = useCoachBusy();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<{ full: string; thumb: string } | null>(null);
  const [photoErr, setPhotoErr] = useState("");
  const params = useSearchParams();
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sentQ = useRef<string | null>(null);
  const dictation = useDictation((t) => setText(t));

  const q = params.get("q");
  useEffect(() => {
    if (!q || sentQ.current === q) return;
    sentQ.current = q;
    router.replace("/coach");
    void sendToCoach(q);
  }, [q, router]);

  const lastLen = chat[chat.length - 1]?.text.length ?? 0;
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chat.length, lastLen]);

  // Read the reply aloud once it has finished streaming.
  const wasBusy = useRef(false);
  useEffect(() => {
    if (wasBusy.current && !busy && profile.speak) {
      const last = chat[chat.length - 1];
      if (last?.role === "assistant") speak(visibleText(last.text));
    }
    wasBusy.current = busy;
  }, [busy, chat, profile.speak]);
  useEffect(() => stopSpeaking, []);

  const submit = (override?: string) => {
    const t = override ?? text;
    if ((!t.trim() && !photo) || busy) return;
    stopSpeaking();
    dictation.stop();
    void sendToCoach(t, photo ?? undefined);
    setText("");
    setPhoto(null);
  };

  async function onPhoto(file: File) {
    setPhotoErr("");
    try {
      const [full, thumb] = await Promise.all([
        fileToJpegDataUrl(file, 1568),
        fileToJpegDataUrl(file, 360),
      ]);
      setPhoto({ full, thumb });
    } catch {
      setPhotoErr("这张照片打不开,换一张试试。");
    }
  }

  const iconBtn =
    "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl bg-card text-xl disabled:opacity-40";

  return (
    <div className="flex flex-col">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI 教练</h1>
          <p className="text-sm text-sub">打字、说话、拍照都可以</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {canSpeak() && (
            <button
              aria-pressed={profile.speak}
              onClick={() => {
                if (profile.speak) stopSpeaking();
                else speak("好的,我会把回复读给你听");
                setState((s) => ({ ...s, profile: { ...s.profile, speak: !s.profile.speak } }));
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                profile.speak ? "bg-primary text-white" : "border border-line bg-card text-sub"
              }`}
            >
              {profile.speak ? "🔊 朗读开" : "🔈 朗读关"}
            </button>
          )}
          {chat.length > 0 && (
            <button
              className="text-sm text-sub underline"
              onClick={() => {
                if (confirm("清空聊天记录?(训练记录和计划不会被删除)"))
                  setState((s) => ({ ...s, chat: [] }));
              }}
            >
              清空
            </button>
          )}
        </div>
      </header>

      {chat.length === 0 && (
        <div className="space-y-2">
          <p className="rounded-2xl bg-card p-4 text-[15px] leading-relaxed">
            嗨,我是你的健身教练 💪 告诉我今天想练哪里,我会看你之前的记录,帮你排好动作、组数和重量。看到不会用的器械,拍张照发给我就行。
          </p>
          {STARTERS.map((s) => (
            <button
              key={s}
              onClick={() => void sendToCoach(s)}
              className="block w-full rounded-2xl bg-card px-4 py-3 text-left text-[15px] active:scale-[0.99]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3 pb-36">
        {chat.map((m, i) => {
          const isLast = i === chat.length - 1;
          const streaming = busy && isLast && m.role === "assistant";
          const shown = m.role === "assistant" ? visibleText(m.text) : m.text;
          return m.role === "user" ? (
            <div key={m.id} className="flex flex-col items-end gap-1">
              {m.image ? (
                <img src={m.image} alt="你发的照片" className="max-h-48 max-w-[60%] rounded-2xl" />
              ) : m.image === "" ? (
                <span className="text-xs text-sub">📷 照片(已不保留预览)</span>
              ) : null}
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[15px] text-white">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="space-y-2">
              {(shown || streaming) && (
                <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-card px-4 py-2.5">
                  {shown ? (
                    <MD text={shown} />
                  ) : (
                    <span className="animate-pulse text-sm text-sub">教练正在想…</span>
                  )}
                </div>
              )}
              {m.plan && <PlanCard plan={m.plan} />}
              {m.logged && (
                <div className="inline-block rounded-full bg-mint-soft px-3 py-1 text-xs font-semibold text-mint">
                  ✓ 已记录:{m.logged}
                </div>
              )}
              {m.mealLogged && (
                <div className="inline-block rounded-full bg-mint-soft px-3 py-1 text-xs font-semibold text-mint">
                  🥗 已记录饮食:{m.mealLogged}
                </div>
              )}
              {isLast && !busy && m.choices && m.choices.length > 0 && (
                <div className="flex flex-col gap-2 pt-1" role="group" aria-label="快捷回复">
                  {m.choices.map((c) => (
                    <button
                      key={c}
                      onClick={() => submit(c)}
                      className="w-full rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-left text-[15px] font-semibold text-primary active:scale-[0.99]"
                    >
                      {c}
                    </button>
                  ))}
                  <p className="text-center text-xs text-sub">点一下就能回答,也可以打字、说话或拍照</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-[calc(58px+env(safe-area-inset-bottom))] z-10 bg-gradient-to-t from-bg via-bg to-transparent px-4 pt-4 pb-2">
        <div className="mx-auto max-w-md">
          {(photo || photoErr || dictation.error || dictation.listening) && (
            <div className="mb-2 flex items-center gap-3 rounded-2xl bg-card p-2 text-sm">
              {photo && (
                <>
                  <img src={photo.thumb} alt="待发送的照片" className="h-14 w-14 rounded-xl object-cover" />
                  <span className="flex-1 text-sub">照片已选好,可以再补一句话,然后点发送</span>
                  <button className="px-2 text-sub" aria-label="移除照片" onClick={() => setPhoto(null)}>
                    ✕
                  </button>
                </>
              )}
              {!photo && dictation.listening && (
                <span className="flex-1 animate-pulse px-2 font-semibold text-primary">
                  🎙 正在听…说完会自动停
                </span>
              )}
              {!photo && !dictation.listening && (photoErr || dictation.error) && (
                <span className="flex-1 px-2 text-sub">{photoErr || dictation.error}</span>
              )}
            </div>
          )}
          <div className="flex items-end gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onPhoto(f);
                e.target.value = "";
              }}
            />
            <button
              className={iconBtn}
              aria-label="拍照或选照片发给教练"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              📷
            </button>
            {dictation.supported && (
              <button
                className={`${iconBtn} ${dictation.listening ? "border-primary bg-primary text-white" : ""}`}
                aria-label={dictation.listening ? "停止语音输入" : "语音输入"}
                aria-pressed={dictation.listening}
                disabled={busy}
                onClick={() => (dictation.listening ? dictation.stop() : dictation.start())}
              >
                {dictation.listening ? "■" : "🎙"}
              </button>
            )}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={1}
              placeholder="跟教练说点什么…"
              aria-label="给教练发消息"
              className="max-h-32 min-h-[46px] min-w-0 flex-1 resize-none rounded-2xl bg-card px-3 py-2.5 outline-none focus:border-primary"
            />
            <button
              onClick={() => submit()}
              disabled={busy || (!text.trim() && !photo)}
              className="h-[46px] shrink-0 rounded-2xl bg-primary px-4 font-semibold text-white disabled:opacity-40"
            >
              {busy ? "…" : "发送"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CoachPage() {
  return (
    <Suspense>
      <Coach />
    </Suspense>
  );
}
