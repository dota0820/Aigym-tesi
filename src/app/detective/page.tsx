"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import DetectiveMuscleMap from "@/components/DetectiveMuscleMap";
import MD from "@/components/MD";
import ProfileChip from "@/components/ProfileChip";
import { btnGhost, btnPrimary, btnSoft, Card, H1 } from "@/components/ui";
import { visibleText } from "@/lib/actions";
import {
  mediaFileToVisualStrip,
  sendToDetective,
  useDetectiveBusy,
} from "@/lib/detective-actions";
import {
  BODY_LOCATIONS,
  DETECTIVE_CATEGORIES,
  DETECTIVE_EXERCISES,
  findBodyLocation,
  findDetectiveExercise,
  SENSATION_TYPES,
  type ExerciseCategory,
} from "@/lib/movement-detective";
import { setState, useApp } from "@/lib/store";
import { canSpeak, speak, stopSpeaking, useDictation } from "@/lib/voice";

type SubTab = "investigate" | "visual" | "encyclopedia";

type VisualAngle = "front" | "side" | "rear" | "setup" | "equipment";

const VISUAL_ANGLES: { id: VisualAngle; zh: string; en: string; icon: string }[] = [
  { id: "front", zh: "正面动作视频/照片", en: "Front-view video / photo", icon: "🧍" },
  { id: "side", zh: "侧面动作视频/照片", en: "Side-view video / photo", icon: "📐" },
  { id: "rear", zh: "背面动作视频/照片", en: "Rear-view video / photo", icon: "🔙" },
  { id: "setup", zh: "器械座椅与位置设置", en: "Machine setup photo", icon: "⚙️" },
  { id: "equipment", zh: "器械识别与用法", en: "Equipment photo", icon: "🏋️" },
];

const STARTERS = [
  {
    zh: "我做哑铃侧平举的时候，脖子两侧特别累。",
    en: "When I do lateral raises, the sides of my neck become very tired.",
  },
  {
    zh: "做坐姿推胸的时候，我感觉肩膀比胸更有感觉。",
    en: "When I do chest press, I feel my shoulders more than my chest.",
  },
  {
    zh: "做高位下拉的时候，总是手臂（二头）先累，背没感觉。",
    en: "When I do lat pulldown, my biceps get tired first.",
  },
  {
    zh: "我觉得右边背部比左边背部更有力量、更有感觉。",
    en: "My right back feels stronger than my left back.",
  },
  {
    zh: "我不知道自己发力的肌肉到底对不对，想学会怎么判断。",
    en: "I don't know whether I'm using the correct muscles.",
  },
];

function DetectiveInner() {
  const { detectiveChat, profile, lang } = useApp();
  const busy = useDetectiveBusy();
  const params = useSearchParams();
  const router = useRouter();
  const isEn = lang === "en";

  const initialTabParam = params.get("tab");
  const initialExParam = findDetectiveExercise(params.get("exercise"));
  const initialQParam = params.get("q");

  const [tab, setTab] = useState<SubTab>(() =>
    initialTabParam === "visual" || initialTabParam === "encyclopedia"
      ? initialTabParam
      : "investigate",
  );
  const [builderOpen, setBuilderOpen] = useState(
    () => !initialQParam && (!!initialExParam || detectiveChat.length === 0),
  );

  // Symptom builder state
  const [selectedExId, setSelectedExId] = useState<string>(() => initialExParam?.id ?? "");
  const [selectedLocId, setSelectedLocId] = useState<string>("");
  const [selectedSensCode, setSelectedSensCode] = useState<string>("A");
  const [selectedSide, setSelectedSide] = useState<"both" | "left" | "right">("both");

  // Chat composer state
  const [text, setText] = useState("");
  const [media, setMedia] = useState<{ full: string; thumb: string; isVideo: boolean } | null>(null);
  const [mediaErr, setMediaErr] = useState("");
  const [processingMedia, setProcessingMedia] = useState(false);

  // Visual lab state
  const [visualAngle, setVisualAngle] = useState<VisualAngle>("side");
  const [visualExId, setVisualExId] = useState<string>("");
  const [visualNote, setVisualNote] = useState<string>("");
  const [visualMedia, setVisualMedia] = useState<{
    full: string;
    thumb: string;
    isVideo: boolean;
  } | null>(null);
  const [visualErr, setVisualErr] = useState("");

  // Encyclopedia state
  const [encLocId, setEncLocId] = useState<string>(BODY_LOCATIONS[0].id);
  const [encCategory, setEncCategory] = useState<ExerciseCategory>(
    () => initialExParam?.category ?? "chest",
  );
  const [expandedExId, setExpandedExId] = useState<string>(
    () => initialExParam?.id ?? "chest-press",
  );

  const endRef = useRef<HTMLDivElement>(null);
  const chatFileRef = useRef<HTMLInputElement>(null);
  const visualFileRef = useRef<HTMLInputElement>(null);
  const handledQuery = useRef<string | null>(null);
  const dictation = useDictation((spoken) => setText(spoken));

  // Support URL query prefill (?exercise=...&q=...&tab=...)
  const qParam = params.get("q");
  const exParam = params.get("exercise");
  const tabParam = params.get("tab");

  useEffect(() => {
    const key = `${exParam ?? ""}|${qParam ?? ""}|${tabParam ?? ""}`;
    if (!qParam && !exParam && !tabParam) return;
    if (handledQuery.current === key) return;
    handledQuery.current = key;
    router.replace("/detective");
    if (qParam) {
      void sendToDetective(qParam, { lang });
    }
  }, [qParam, exParam, tabParam, router, lang]);

  const lastLen = detectiveChat[detectiveChat.length - 1]?.text.length ?? 0;
  useEffect(() => {
    if (tab === "investigate" && detectiveChat.length > 0) {
      endRef.current?.scrollIntoView({ block: "end" });
    }
  }, [detectiveChat.length, lastLen, tab]);

  // Auto-read aloud if profile.speak is enabled
  const wasBusy = useRef(false);
  useEffect(() => {
    if (wasBusy.current && !busy && profile.speak) {
      const last = detectiveChat[detectiveChat.length - 1];
      if (last?.role === "assistant") speak(visibleText(last.text));
    }
    wasBusy.current = busy;
  }, [busy, detectiveChat, profile.speak]);
  useEffect(() => stopSpeaking, []);

  const selectedEx = useMemo(() => findDetectiveExercise(selectedExId), [selectedExId]);
  const selectedLoc = useMemo(() => findBodyLocation(selectedLocId), [selectedLocId]);
  const selectedSens = useMemo(
    () => SENSATION_TYPES.find((s) => s.code === selectedSensCode) ?? SENSATION_TYPES[0],
    [selectedSensCode],
  );
  const isSafetyStop =
    selectedSens.level === "stop" || selectedSens.level === "emergency";

  const encLoc = useMemo(
    () => BODY_LOCATIONS.find((b) => b.id === encLocId) ?? BODY_LOCATIONS[0],
    [encLocId],
  );
  const encExercises = useMemo(
    () => DETECTIVE_EXERCISES.filter((e) => e.category === encCategory),
    [encCategory],
  );

  async function handleMediaPick(
    file: File,
    target: "chat" | "visual",
  ) {
    if (target === "chat") setMediaErr("");
    else setVisualErr("");
    setProcessingMedia(true);
    try {
      const res = await mediaFileToVisualStrip(file);
      if (target === "chat") setMedia(res);
      else setVisualMedia(res);
    } catch {
      const msg = isEn
        ? "Could not open this photo or video. Please try another file."
        : "这个照片或视频打不开，换一个文件试试。";
      if (target === "chat") setMediaErr(msg);
      else setVisualErr(msg);
    } finally {
      setProcessingMedia(false);
    }
  }

  function submitChat(override?: string) {
    const t = override ?? text;
    if ((!t.trim() && !media) || busy) return;
    stopSpeaking();
    dictation.stop();
    setBuilderOpen(false);
    void sendToDetective(t, {
      photo: media ? { full: media.full, thumb: media.thumb } : undefined,
      lang,
      mode: media ? "visual" : "investigate",
    });
    setText("");
    setMedia(null);
  }

  function startStructuredInvestigation() {
    const exText = selectedEx
      ? isEn
        ? selectedEx.nameEn
        : `${selectedEx.nameZh} (${selectedEx.nameEn})`
      : isEn
        ? "an exercise"
        : "一个训练动作";
    const locText = selectedLoc
      ? isEn
        ? selectedLoc.phraseEn.toLowerCase()
        : selectedLoc.phraseZh
      : isEn
        ? "an unexpected area"
        : "一个不该累的位置";
    const sensText = isEn ? selectedSens.labelEn : selectedSens.labelZh;
    const sideText =
      selectedSide === "both"
        ? isEn
          ? "on both sides"
          : "两边都有"
        : selectedSide === "left"
          ? isEn
            ? "mainly on my left side"
            : "主要在左侧"
          : isEn
            ? "mainly on my right side"
            : "主要在右侧";

    const prompt = isEn
      ? `When I do ${exText}, I feel "${sensText}" in ${locText} (${sideText}). Please investigate why and guide me step by step.`
      : `我做「${exText}」的时候，感觉「${locText}」出现「${sensText}」（${sideText}）。请帮我一步步排查原因并教我怎么调整。`;

    setBuilderOpen(false);
    void sendToDetective(prompt, { lang, mode: "investigate" });
  }

  function submitVisualAnalysis() {
    if (!visualMedia || busy) return;
    const angle = VISUAL_ANGLES.find((a) => a.id === visualAngle)!;
    const ex = findDetectiveExercise(visualExId);
    const exPart = ex
      ? isEn
        ? `Exercise: ${ex.nameEn}. `
        : `动作：${ex.nameZh} (${ex.nameEn})。`
      : "";
    const notePart = visualNote.trim()
      ? isEn
        ? `User note: ${visualNote.trim()}`
        : `补充感受：${visualNote.trim()}`
      : "";
    const mediaKind = visualMedia.isVideo
      ? isEn
        ? "4-frame sequence extracted from my exercise video"
        : "从训练视频抽取的 4 帧连续分解图"
      : isEn
        ? "exercise/setup photo"
        : "动作/器械照片";

    const prompt = isEn
      ? `Visual analysis request (${angle.en} — ${mediaKind}). ${exPart}${notePart}`
      : `视觉动作分析请求（${angle.zh} · ${mediaKind}）。${exPart}${notePart}`;

    setTab("investigate");
    setBuilderOpen(false);
    void sendToDetective(prompt, {
      photo: { full: visualMedia.full, thumb: visualMedia.thumb },
      lang,
      mode: "visual",
    });
    setVisualMedia(null);
    setVisualNote("");
  }

  const iconBtn =
    "flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-xl disabled:opacity-40";

  return (
    <div className="flex flex-col">
      <div className="mb-3">
        <ProfileChip />
      </div>

      <header className="mb-3 flex items-start justify-between gap-2">
        <H1
          sub={
            isEn
              ? "Understand which muscles work, spot compensation & fix form step-by-step"
              : "排查代偿发力、解读身体感受、一步步教新手练对动作"
          }
        >
          🕵️ {isEn ? "AI Movement Detective" : "AI 动作侦探"}
        </H1>
        <div className="flex shrink-0 items-center gap-2 pt-1">
          {canSpeak() && (
            <button
              aria-pressed={profile.speak}
              onClick={() => {
                if (profile.speak) stopSpeaking();
                else speak(isEn ? "Voice readout enabled" : "已开启语音朗读");
                setState((s) => ({ ...s, profile: { ...s.profile, speak: !s.profile.speak } }));
              }}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                profile.speak ? "bg-primary text-white" : "border border-line bg-card text-sub"
              }`}
            >
              {profile.speak ? "🔊" : "🔈"}
            </button>
          )}
          {detectiveChat.length > 0 && (
            <button
              className="text-xs text-sub underline"
              onClick={() => {
                if (
                  confirm(
                    isEn
                      ? "Clear Movement Detective conversation?"
                      : "清空动作侦探对话记录？",
                  )
                ) {
                  setState((s) => ({ ...s, detectiveChat: [] }));
                  setBuilderOpen(true);
                }
              }}
            >
              {isEn ? "Clear" : "清空"}
            </button>
          )}
        </div>
      </header>

      {/* Sub-navigation */}
      <div className="mb-4 grid grid-cols-3 gap-1.5 rounded-2xl border border-line bg-card p-1">
        {(
          [
            { id: "investigate", icon: "🔍", zh: "互动问诊", en: "Investigate" },
            { id: "visual", icon: "🎥", zh: "视觉分析", en: "Visual Lab" },
            { id: "encyclopedia", icon: "🧬", zh: "部位/32动作", en: "Body & 32" },
          ] as const
        ).map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${
                active ? "bg-primary text-white shadow-sm" : "text-sub hover:text-ink"
              }`}
            >
              {item.icon} {isEn ? item.en : item.zh}
            </button>
          );
        })}
      </div>

      {/* ═══════════════ TAB 1: INTERACTIVE DIAGNOSTIC INVESTIGATION ═══════════════ */}
      {tab === "investigate" && (
        <div className="space-y-4 pb-36">
          {/* Quick Symptom Builder */}
          <Card className="border-primary/20">
            <button
              type="button"
              onClick={() => setBuilderOpen((v) => !v)}
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <div className="text-sm font-bold text-ink">
                  🧭 {isEn ? "Symptom & Muscle Check-In" : "快速描述问题（不用懂术语）"}
                </div>
                <div className="text-xs text-sub">
                  {isEn
                    ? "Pick the exercise, where you feel it, and sensation type"
                    : "选动作 + 点哪里不舒服 + 什么感觉，再开始一对一排查"}
                </div>
              </div>
              <span className="text-sm text-sub">{builderOpen ? "▴" : "▾"}</span>
            </button>

            {builderOpen && (
              <div className="mt-4 space-y-4 border-t border-line pt-3">
                {/* 1. Exercise */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-ink">
                    1. {isEn ? "Which exercise are you doing?" : "你在做什么动作？"}
                  </label>
                  <select
                    value={selectedExId}
                    onChange={(e) => setSelectedExId(e.target.value)}
                    className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">
                      {isEn
                        ? "Not sure / General movement question"
                        : "不确定 / 通用体态与左右平衡问题"}
                    </option>
                    {DETECTIVE_CATEGORIES.map((cat) => (
                      <optgroup
                        key={cat.id}
                        label={`${cat.emoji} ${isEn ? cat.en : cat.zh}`}
                      >
                        {DETECTIVE_EXERCISES.filter((e) => e.category === cat.id).map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {isEn ? `${ex.nameEn} (${ex.nameZh})` : `${ex.nameZh} (${ex.nameEn})`}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* 2. Body Area (Part 2 Everyday Descriptions) */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">
                      2. {isEn ? "Where do you feel it?" : "哪里觉得累、酸或不舒服？"}
                    </span>
                    {selectedLoc && (
                      <button
                        type="button"
                        onClick={() => setSelectedLocId("")}
                        className="text-[11px] text-sub underline"
                      >
                        {isEn ? "Reset" : "清除"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BODY_LOCATIONS.map((loc) => {
                      const on = selectedLocId === loc.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setSelectedLocId(on ? "" : loc.id)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            on
                              ? "bg-primary text-white"
                              : "border border-line bg-bg text-ink"
                          }`}
                        >
                          {isEn ? loc.phraseEn : loc.phraseZh}
                        </button>
                      );
                    })}
                  </div>
                  {selectedLoc && (
                    <div className="mt-2 rounded-xl bg-primary-soft/60 p-2.5 text-xs leading-relaxed text-ink">
                      <span className="font-bold text-primary">
                        {isEn ? "Possible anatomy (not a diagnosis): " : "可能涉及部位（仅作参考，非诊断）："}
                      </span>
                      {isEn ? selectedLoc.possibleStructuresEn : selectedLoc.possibleStructuresZh}
                    </div>
                  )}
                </div>

                {/* 3. Side & Sensation Type (Part 9 & Part 11) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink">
                      3. {isEn ? "Which side?" : "哪一侧有感觉？"}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: "both", zh: "两边都有", en: "Both" },
                          { id: "left", zh: "偏左侧", en: "Left" },
                          { id: "right", zh: "偏右侧", en: "Right" },
                        ] as const
                      ).map((side) => (
                        <button
                          key={side.id}
                          type="button"
                          onClick={() => setSelectedSide(side.id)}
                          className={`rounded-xl py-2 text-xs font-semibold ${
                            selectedSide === side.id
                              ? "bg-ink text-white"
                              : "border border-line bg-bg text-ink"
                          }`}
                        >
                          {isEn ? side.en : side.zh}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-ink">
                      4. {isEn ? "Type of sensation (Safety check)" : "属于哪种感觉（安全分级）？"}
                    </label>
                    <select
                      value={selectedSensCode}
                      onChange={(e) => setSelectedSensCode(e.target.value)}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-xs outline-none focus:border-primary"
                    >
                      {SENSATION_TYPES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {isEn ? `${s.code}. ${s.labelEn}` : s.labelZh}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Part 11 Instant Safety Alert */}
                {isSafetyStop && (
                  <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-3.5 text-red-900">
                    <div className="text-sm font-bold">
                      🛑{" "}
                      {selectedSens.level === "emergency"
                        ? isEn
                          ? "STOP IMMEDIATELY — SEEK URGENT MEDICAL CARE"
                          : "请立刻停止训练 — 必要时立即就医！"
                        : isEn
                          ? "STOP THIS EXERCISE IMMEDIATELY"
                          : "请立刻停止当前动作，不要硬撑！"}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed">
                      {isEn ? selectedSens.guidanceEn : selectedSens.guidanceZh}
                    </p>
                  </div>
                )}

                {selectedSens.level === "caution" && (
                  <div className="rounded-2xl border border-amber-400 bg-amber-50 p-3 text-amber-950">
                    <div className="text-xs font-bold">
                      ⚠️ {isEn ? "Joint Caution" : "关节不适提醒"}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed">
                      {isEn ? selectedSens.guidanceEn : selectedSens.guidanceZh}
                    </p>
                  </div>
                )}

                {/* Visual Anatomy Comparison */}
                {(selectedEx || selectedLoc) && (
                  <div className="rounded-2xl border border-line bg-bg/60 p-3">
                    <div className="mb-2 text-xs font-bold text-ink">
                      🗺️{" "}
                      {isEn
                        ? "Expected Target vs. Felt Area"
                        : "目标肌肉 vs. 你目前发酸的位置"}
                    </div>
                    <DetectiveMuscleMap
                      primary={selectedEx?.primaryMuscles ?? []}
                      secondary={selectedEx?.secondaryMuscles ?? []}
                      compensated={selectedLoc?.muscles ?? []}
                      lang={lang}
                    />
                  </div>
                )}

                <button
                  type="button"
                  disabled={busy}
                  onClick={startStructuredInvestigation}
                  className={`${btnPrimary} w-full`}
                >
                  🔍{" "}
                  {isEn
                    ? "Start Detective Investigation"
                    : "开始动作侦探排查（一次只问 1 个关键问题）"}
                </button>
              </div>
            )}
          </Card>

          {/* Starter examples when chat is empty */}
          {detectiveChat.length === 0 && (
            <div className="space-y-2">
              <div className="px-1 text-xs font-semibold text-sub">
                {isEn
                  ? "Or tap a common beginner mystery to try:"
                  : "也可以直接点下面常见的新手发力困惑："}
              </div>
              {STARTERS.map((s) => {
                const msg = isEn ? s.en : s.zh;
                return (
                  <button
                    key={s.en}
                    type="button"
                    onClick={() => {
                      setBuilderOpen(false);
                      void sendToDetective(msg, { lang, mode: "investigate" });
                    }}
                    className="block w-full rounded-2xl border border-line bg-card px-4 py-3 text-left text-sm active:scale-[0.99]"
                  >
                    “{msg}”
                  </button>
                );
              })}
            </div>
          )}

          {/* Chat messages */}
          <div className="space-y-3">
            {detectiveChat.map((m, i) => {
              const isLast = i === detectiveChat.length - 1;
              const streaming = busy && isLast && m.role === "assistant";
              const shown = m.role === "assistant" ? visibleText(m.text) : m.text;

              return m.role === "user" ? (
                <div key={m.id} className="flex flex-col items-end gap-1">
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={isEn ? "Uploaded movement media" : "上传的动作画面"}
                      className="max-h-52 max-w-[75%] rounded-2xl border border-line"
                    />
                  ) : m.image === "" ? (
                    <span className="text-xs text-sub">
                      📷 {isEn ? "Photo/video analyzed" : "画面已分析"}
                    </span>
                  ) : null}
                  <div className="max-w-[86%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[15px] text-white">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="space-y-2">
                  {(shown || streaming) && (
                    <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-line bg-card px-4 py-3 shadow-[0_1px_2px_rgba(42,39,51,0.03)]">
                      {shown ? (
                        <MD text={shown} />
                      ) : (
                        <span className="animate-pulse text-sm text-sub">
                          {isEn
                            ? "Movement Detective is analyzing…"
                            : "动作侦探正在分析线索…"}
                        </span>
                      )}
                    </div>
                  )}

                  {isLast && !busy && m.choices && m.choices.length > 0 && (
                    <div
                      className="flex flex-col gap-2 pt-1"
                      role="group"
                      aria-label={isEn ? "Quick diagnostic answers" : "快捷诊断回答"}
                    >
                      {m.choices.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => submitChat(c)}
                          className="w-full rounded-2xl border border-primary/40 bg-primary-soft px-4 py-3 text-left text-[15px] font-semibold text-primary active:scale-[0.99]"
                        >
                          {c}
                        </button>
                      ))}
                      <p className="text-center text-xs text-sub">
                        {isEn
                          ? "Tap an option above, or type/speak/upload a photo or video below"
                          : "点一下就能回答，也可以在下方打字、说话或传照片/视频"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>

          {/* Fixed Bottom Composer */}
          <div className="fixed inset-x-0 bottom-[calc(58px+env(safe-area-inset-bottom))] z-10 bg-gradient-to-t from-bg via-bg to-transparent px-4 pt-4 pb-2">
            <div className="mx-auto max-w-md">
              {(media ||
                mediaErr ||
                processingMedia ||
                dictation.error ||
                dictation.listening) && (
                <div className="mb-2 flex items-center gap-3 rounded-2xl border border-line bg-card p-2 text-xs">
                  {media && (
                    <>
                      <img
                        src={media.thumb}
                        alt={isEn ? "Ready to send" : "待发送的画面"}
                        className="h-14 w-20 rounded-xl bg-black object-cover"
                      />
                      <span className="flex-1 text-sub">
                        {media.isVideo
                          ? isEn
                            ? "4 video frames extracted! Add a note or tap Send."
                            : "已自动抽取视频 4 帧关键动作！可补充感受后点击发送。"
                          : isEn
                            ? "Photo ready. Add a note or tap Send."
                            : "照片已选好，可以补充一句话后发送。"}
                      </span>
                      <button
                        type="button"
                        className="px-2 text-sub"
                        onClick={() => setMedia(null)}
                      >
                        ✕
                      </button>
                    </>
                  )}
                  {!media && processingMedia && (
                    <span className="flex-1 animate-pulse px-2 font-semibold text-primary">
                      🎞️{" "}
                      {isEn
                        ? "Processing photo / extracting video frames…"
                        : "正在处理照片/抽取视频动作帧…"}
                    </span>
                  )}
                  {!media && !processingMedia && dictation.listening && (
                    <span className="flex-1 animate-pulse px-2 font-semibold text-primary">
                      🎙 {isEn ? "Listening…" : "正在听…说完会自动停"}
                    </span>
                  )}
                  {!media &&
                    !processingMedia &&
                    !dictation.listening &&
                    (mediaErr || dictation.error) && (
                      <span className="flex-1 px-2 text-sub">{mediaErr || dictation.error}</span>
                    )}
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  ref={chatFileRef}
                  type="file"
                  accept="image/*,video/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleMediaPick(f, "chat");
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  className={iconBtn}
                  aria-label={isEn ? "Upload photo or video" : "上传照片或动作视频"}
                  disabled={busy || processingMedia}
                  onClick={() => chatFileRef.current?.click()}
                >
                  📷
                </button>
                {dictation.supported && (
                  <button
                    type="button"
                    className={`${iconBtn} ${
                      dictation.listening ? "border-primary bg-primary text-white" : ""
                    }`}
                    aria-label={isEn ? "Voice input" : "语音输入"}
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
                      submitChat();
                    }
                  }}
                  rows={1}
                  placeholder={
                    isEn
                      ? "Describe what you feel or which exercise…"
                      : "描述动作和哪里酸痛/没感觉…"
                  }
                  className="max-h-32 min-h-[46px] min-w-0 flex-1 resize-none rounded-2xl border border-line bg-white px-3 py-2.5 outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => submitChat()}
                  disabled={busy || processingMedia || (!text.trim() && !media)}
                  className="h-[46px] shrink-0 rounded-2xl bg-primary px-4 font-semibold text-white disabled:opacity-40"
                >
                  {busy ? "…" : isEn ? "Send" : "发送"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ TAB 2: VISUAL MOVEMENT ANALYSIS (PART 10) ═══════════════ */}
      {tab === "visual" && (
        <div className="space-y-4">
          <Card className="space-y-4">
            <div>
              <h2 className="text-base font-bold">
                🎥 {isEn ? "Visual Movement & Setup Lab" : "视频 / 照片动作评估"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-sub">
                {isEn
                  ? "Upload a front/side/rear workout video or machine setup photo. Videos automatically extract 4 key frames (Start → Mid → Peak → End) for trajectory, alignment & symmetry checks."
                  : "支持上传正面/侧面/背面训练视频，或器械座椅设置照片。上传视频会自动抽取「起→中→顶→回」4 帧连续画面，帮你排查姿势、轨迹与左右对称。"}
              </p>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-bold text-ink">
                1. {isEn ? "Select view or photo type" : "选择拍摄角度或照片类型"}
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {VISUAL_ANGLES.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setVisualAngle(a.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold ${
                      visualAngle === a.id
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-line bg-bg text-ink"
                    }`}
                  >
                    <span>{a.icon}</span>
                    <span>{isEn ? a.en : a.zh}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink">
                2. {isEn ? "Exercise (optional)" : "对应动作（可选）"}
              </label>
              <select
                value={visualExId}
                onChange={(e) => setVisualExId(e.target.value)}
                className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">
                  {isEn ? "Let AI identify from image/video" : "由 AI 自动识别动作或器械"}
                </option>
                {DETECTIVE_EXERCISES.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {isEn ? `${ex.nameEn} (${ex.nameZh})` : `${ex.nameZh} (${ex.nameEn})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-bold text-ink">
                3. {isEn ? "Upload photo or video" : "上传照片或短视频"}
              </div>
              <input
                ref={visualFileRef}
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void handleMediaPick(f, "visual");
                  e.target.value = "";
                }}
              />
              {visualMedia ? (
                <div className="space-y-2 rounded-2xl border border-line bg-bg p-3">
                  <img
                    src={visualMedia.full}
                    alt={isEn ? "Preview" : "预览"}
                    className="max-h-72 w-full rounded-xl bg-black object-contain"
                  />
                  <div className="flex items-center justify-between text-xs text-sub">
                    <span>
                      {visualMedia.isVideo
                        ? isEn
                          ? "4-frame movement strip ready"
                          : "4 帧视频动作分解图已生成"
                        : isEn
                          ? "Photo ready"
                          : "照片已就绪"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setVisualMedia(null)}
                      className="font-semibold text-primary underline"
                    >
                      {isEn ? "Replace" : "换一个文件"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={processingMedia}
                  onClick={() => visualFileRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-line bg-bg px-4 py-8 text-center active:bg-primary-soft/30"
                >
                  <span className="text-3xl">{processingMedia ? "⏳" : "📹"}</span>
                  <span className="text-sm font-bold text-ink">
                    {processingMedia
                      ? isEn
                        ? "Extracting frames from video…"
                        : "正在从视频抽取动作关键帧…"
                      : isEn
                        ? "Tap to choose Video (.mp4/.mov) or Photo"
                        : "点击选择训练视频或照片"}
                  </span>
                  <span className="text-xs text-sub">
                    {isEn
                      ? "Best tip: shoot 3–8 seconds showing 2–3 clean reps"
                      : "建议拍 3–8 秒包含 2–3 个完整动作的视频，或清晰拍到座椅刻度"}
                  </span>
                </button>
              )}
              {visualErr && <p className="mt-1 text-xs text-red-600">{visualErr}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-ink">
                4. {isEn ? "What do you feel? (optional)" : "做了之后哪里有感觉？（可选）"}
              </label>
              <input
                type="text"
                value={visualNote}
                onChange={(e) => setVisualNote(e.target.value)}
                placeholder={
                  isEn
                    ? "e.g., My left shoulder rises higher, or neck feels tight"
                    : "例如：总觉得右肩抬得更高，或者脖子很紧"
                }
                className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="button"
              disabled={!visualMedia || busy || processingMedia}
              onClick={submitVisualAnalysis}
              className={`${btnPrimary} w-full`}
            >
              🔎 {isEn ? "Run Visual Movement Analysis" : "开始视觉动作与设置评估"}
            </button>
          </Card>

          <Card className="bg-bg/70 text-xs leading-relaxed text-sub">
            <strong className="text-ink">
              {isEn ? "Scientific Transparency (Part 10):" : "科学评估边界说明："}
            </strong>{" "}
            {isEn
              ? "Every visual analysis clearly separates WHAT I CAN SEE, POTENTIAL ISSUE, CORRECTION, and WHAT I CANNOT CONFIRM. Ordinary video cannot measure exact muscle EMG activation or serve as a medical diagnosis."
              : "每一次视觉评估都会严格区分「我能看到的画面」「可能的问题」「调整建议」以及「画面无法确认的部分」。普通视频和照片无法精确测定单块肌肉激活度，也不替代医学诊断。"}
          </Card>
        </div>
      )}

      {/* ═══════════════ TAB 3: BODY LOCATIONS & 32-EXERCISE KNOWLEDGE BASE ═══════════════ */}
      {tab === "encyclopedia" && (
        <div className="space-y-5">
          {/* Part 2: Everyday Body Location Translator */}
          <Card className="space-y-3">
            <div>
              <h2 className="text-base font-bold">
                📍{" "}
                {isEn
                  ? "Body Location Translator (12 Everyday Descriptions)"
                  : "日常身体描述 → 肌肉线索翻译器"}
              </h2>
              <p className="mt-1 text-xs text-sub">
                {isEn
                  ? "Don't know anatomical names? Tap where you feel it to explore possibilities."
                  : "不用记住肌肉学名！点一下你日常描述的位置，看看可能涉及哪些结构。"}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {BODY_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setEncLocId(loc.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    encLocId === loc.id
                      ? "bg-primary text-white"
                      : "border border-line bg-bg text-ink"
                  }`}
                >
                  {isEn ? loc.phraseEn : loc.phraseZh}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-line bg-bg/60 p-3.5">
              <div className="mb-2">
                <div className="text-sm font-bold text-ink">
                  “{isEn ? encLoc.phraseEn : encLoc.phraseZh}”
                </div>
                <div className="mt-0.5 text-xs font-semibold text-primary">
                  {isEn ? "Possible structures: " : "可能相关的解剖结构："}
                  {isEn ? encLoc.possibleStructuresEn : encLoc.possibleStructuresZh}
                </div>
              </div>
              <DetectiveMuscleMap compensated={encLoc.muscles} lang={lang} />
              <p className="mt-3 text-xs leading-relaxed text-ink">
                {isEn ? encLoc.beginnerNoteEn : encLoc.beginnerNoteZh}
              </p>
              <p className="mt-2 rounded-xl bg-card p-2 text-[11px] text-sub">
                ⚠️{" "}
                {isEn
                  ? "These are anatomical possibilities, not confirmed diagnoses. Multiple muscles and tissues can create sensation in the same spot."
                  : "以上仅属于解剖学可能性参考，并非医学确诊；同一部位的不适可能由多块肌肉或关节结构共同造成。"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedLocId(encLoc.id);
                  setBuilderOpen(true);
                  setTab("investigate");
                }}
                className={`${btnSoft} mt-3 w-full py-2.5 text-xs`}
              >
                🔍{" "}
                {isEn
                  ? "Investigate this area in Movement Detective"
                  : "带这个位置去「互动问诊」排查"}
              </button>
            </div>
          </Card>

          {/* Part 3, 8, 12: 32 Exercise Biomechanics & Muscle Feeling Education */}
          <div className="space-y-3">
            <div>
              <h2 className="text-base font-bold">
                🧬{" "}
                {isEn
                  ? "32-Exercise Biomechanics & Muscle Feeling Guide"
                  : "32 个核心动作生物力学与发力教育库"}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-sub">
                {isEn
                  ? "Important (Part 8): Feeling a strong muscle burn is NOT proof of optimal activation—and not feeling a burn does not mean an exercise failed."
                  : "重要观念（第8条）：觉得肌肉灼烧充血并不等于练得最对；没感到强烈烧灼感也不代表白练，新手应先追求动作控制，不要盲目追痛。"}
              </p>
            </div>

            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
              {DETECTIVE_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setEncCategory(c.id);
                    const first = DETECTIVE_EXERCISES.find((x) => x.category === c.id);
                    if (first) setExpandedExId(first.id);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    encCategory === c.id
                      ? "bg-primary text-white"
                      : "border border-line bg-card text-ink"
                  }`}
                >
                  {c.emoji} {isEn ? c.en : c.zh}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {encExercises.map((ex) => {
                const open = expandedExId === ex.id;
                const firstComp = ex.compensations[0];
                return (
                  <Card key={ex.id} className="overflow-hidden p-0">
                    <button
                      type="button"
                      onClick={() => setExpandedExId(open ? "" : ex.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-ink">
                          {isEn ? ex.nameEn : `${ex.nameZh} · ${ex.nameEn}`}
                        </div>
                        <div className="truncate text-xs text-sub">
                          {isEn ? ex.primaryLabelEn : ex.primaryLabelZh}
                        </div>
                      </div>
                      <span className="text-sub">{open ? "▴" : "▾"}</span>
                    </button>

                    {open && (
                      <div className="space-y-4 border-t border-line px-4 py-4 text-xs leading-relaxed">
                        <DetectiveMuscleMap
                          primary={ex.primaryMuscles}
                          secondary={ex.secondaryMuscles}
                          compensated={firstComp?.compensatedMuscles ?? []}
                          lang={lang}
                        />

                        <div className="space-y-2 rounded-2xl bg-bg p-3">
                          <div>
                            <strong className="text-mint">
                              {isEn ? "Primary Target: " : "主要目标肌群："}
                            </strong>
                            {isEn ? ex.primaryLabelEn : ex.primaryLabelZh}
                          </div>
                          <div>
                            <strong className="text-ink">
                              {isEn ? "Secondary Helpers: " : "正常辅助肌群："}
                            </strong>
                            {isEn ? ex.secondaryLabelEn : ex.secondaryLabelZh}
                          </div>
                          <div>
                            <strong className="text-ink">
                              {isEn ? "Stabilizers: " : "稳定肌群："}
                            </strong>
                            {isEn ? ex.stabilizersEn : ex.stabilizersZh}
                          </div>
                        </div>

                        {/* Part 8: Muscle Feeling Education */}
                        <div className="space-y-1.5 rounded-2xl bg-mint-soft/60 p-3 text-ink">
                          <div className="font-bold text-mint">
                            💡{" "}
                            {isEn
                              ? "Muscle Feeling Education"
                              : "肌肉感受教育（正常 vs 紧张）"}
                          </div>
                          <p>
                            <strong>{isEn ? "Normal Feel: " : "正常应该哪里有感觉："}</strong>
                            {isEn ? ex.normalFeelEn : ex.normalFeelZh}
                          </p>
                          <p>
                            <strong>
                              {isEn ? "Common Beginner Tension: " : "新手常出现的多余紧张部位："}
                            </strong>
                            {isEn ? ex.beginnerTensionEn : ex.beginnerTensionZh}
                          </p>
                          <p className="text-sub">
                            <strong>{isEn ? "Burn / Pump Reality: " : "关于酸胀/泵感："}</strong>
                            {isEn ? ex.burnNoteEn : ex.burnNoteZh}
                          </p>
                          <p className="text-red-700">
                            <strong>{isEn ? "Do Not Ignore: " : "不可忽视的信号："}</strong>
                            {isEn ? ex.warningSignsEn : ex.warningSignsZh}
                          </p>
                        </div>

                        {/* Technique Rules */}
                        <div>
                          <div className="mb-1 font-bold text-ink">
                            ✅ {isEn ? "Key Technique Rules" : "关键动作规则"}
                          </div>
                          <ul className="list-disc space-y-1 pl-4 text-ink">
                            {(isEn ? ex.techniqueRulesEn : ex.techniqueRulesZh).map(
                              (rule, idx) => (
                                <li key={idx}>{rule}</li>
                              ),
                            )}
                          </ul>
                        </div>

                        {/* Common Compensations */}
                        {ex.compensations.map((comp) => (
                          <div
                            key={comp.id}
                            className="space-y-1.5 rounded-2xl border border-primary/25 bg-primary-soft/40 p-3"
                          >
                            <div className="font-bold text-primary">
                              🕵️ {isEn ? "Common Compensation: " : "常见代偿模式："}
                              {isEn ? comp.symptomEn : comp.symptomZh}
                            </div>
                            <p>
                              <strong>{isEn ? "Why it happens: " : "发生原因："}</strong>
                              {(isEn ? comp.causesEn : comp.causesZh).join(" ")}
                            </p>
                            <div>
                              <strong>{isEn ? "Corrections: " : "调整指令："}</strong>
                              <ul className="mt-0.5 list-disc space-y-0.5 pl-4">
                                {(isEn ? comp.correctionsEn : comp.correctionsZh).map(
                                  (c, idx) => (
                                    <li key={idx}>{c}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <p>
                              <strong>{isEn ? "Practice Drill: " : "练习方法："}</strong>
                              {isEn ? comp.practiceEn : comp.practiceZh}
                            </p>
                          </div>
                        ))}

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedExId(ex.id);
                              if (firstComp?.compensatedMuscles.length) {
                                const matchingLoc = BODY_LOCATIONS.find((l) =>
                                  l.muscles.some((m) =>
                                    firstComp.compensatedMuscles.includes(m),
                                  ),
                                );
                                if (matchingLoc) setSelectedLocId(matchingLoc.id);
                              }
                              setBuilderOpen(true);
                              setTab("investigate");
                            }}
                            className={`${btnPrimary} flex-1 py-2.5 text-xs`}
                          >
                            🔍{" "}
                            {isEn
                              ? "Investigate My Form"
                              : "排查我做这个动作的问题"}
                          </button>
                          <Link
                            href={`/library/${ex.libraryId}`}
                            className={`${btnGhost} flex-1 py-2.5 text-xs`}
                          >
                            📖 {isEn ? "View Step Guide & GIF" : "看动作动图与步骤"}
                          </Link>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DetectivePage() {
  return (
    <Suspense>
      <DetectiveInner />
    </Suspense>
  );
}
