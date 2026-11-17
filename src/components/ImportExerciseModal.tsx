"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { fileToJpegDataUrl } from "@/lib/actions";
import { addCustomExercise, aiHeaders, uid } from "@/lib/store";
import { GROUPS, SUBS, type CustomExercise, type Group, type Muscle } from "@/lib/types";
import { btnGhost, btnPrimary, btnSoft, input } from "./ui";

interface ParsedDraft {
  name: string;
  nameEn: string;
  group: Group;
  sub: string;
  primary: Muscle[];
  secondary: Muscle[];
  startWeight: string;
  equipment: string;
  setup: string;
  cues: string[];
  steps: string[];
  mistakes: string[];
  feel: string;
  sourceUrl?: string;
  sourcePlatform?: string;
  imageUrl?: string;
}

export default function ImportExerciseModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (ex: CustomExercise) => void;
}) {
  const [rawInput, setRawInput] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<{ full: string; thumb: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<ParsedDraft | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPickPhoto(file: File) {
    setError("");
    try {
      const [full, thumb] = await Promise.all([
        fileToJpegDataUrl(file, 1280),
        fileToJpegDataUrl(file, 720),
      ]);
      setPhoto({ full, thumb });
    } catch {
      setError("这张图片打不开，换一张试试。");
    }
  }

  async function parseLink() {
    if (!rawInput.trim() && !note.trim() && !photo) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/exercise-import", {
        method: "POST",
        headers: aiHeaders(),
        body: JSON.stringify({
          input: rawInput.trim() || undefined,
          note: note.trim() || undefined,
          image: photo?.full,
        }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error ?? "解析失败，请补充说明或图片再试。");
        return;
      }
      setDraft({
        ...j.exercise,
        sourceUrl: j.sourceUrl,
        sourcePlatform: j.sourcePlatform,
        imageUrl: photo?.thumb || j.imageUrl,
      });
    } catch {
      setError("网络出错了，请再试一次。");
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!draft || !draft.name.trim()) return;
    const custom: CustomExercise = {
      id: `custom-${uid()}`,
      isCustom: true,
      name: draft.name.trim(),
      nameEn: draft.nameEn.trim(),
      group: draft.group,
      sub: draft.sub,
      alsoIn: [],
      primary: draft.primary,
      secondary: draft.secondary,
      startWeight: draft.startWeight.trim() || "从轻重量开始",
      equipment: draft.equipment.trim() || "请参考原视频",
      setup: draft.setup.trim(),
      cues: draft.cues,
      steps: draft.steps,
      mistakes: draft.mistakes,
      feel: draft.feel.trim(),
      sourceUrl: draft.sourceUrl,
      sourcePlatform: draft.sourcePlatform,
      imageUrl: draft.imageUrl,
      createdAt: new Date().toISOString(),
    };
    addCustomExercise(custom);
    onSaved(custom);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/45" onClick={onClose}>
      <div
        className="safe-b mx-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-bg p-5"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="从链接导入动作"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">从视频 / 链接添加动作</h2>
            <p className="text-xs text-sub">支持 YouTube、小红书、Facebook 分享文案或截图</p>
          </div>
          <button className="text-sm text-sub" onClick={onClose}>
            关闭
          </button>
        </div>

        {!draft ? (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-semibold text-sub">粘贴视频链接或完整分享文案</span>
              <textarea
                className={`${input} mt-1`}
                rows={3}
                placeholder="例如：https://youtube.com/shorts/... 或直接粘贴小红书/FB 分享的一整段话"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-sub">
                补充动作名称或笔记（可选；FB/小红书需要登录时写几个字超有用）
              </span>
              <input
                className={`${input} mt-1`}
                placeholder="例如：保加利亚单腿蹲 练臀大肌"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </label>

            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onPickPhoto(f);
                  e.target.value = "";
                }}
              />
              {photo ? (
                <div className="flex items-center gap-3 rounded-2xl bg-card p-2">
                  <img src={photo.thumb} alt="动作截图" className="h-16 w-24 rounded-xl object-cover" />
                  <div className="flex-1 text-xs text-sub">已附带参考截图，保存后也会作为动作封面图</div>
                  <button
                    type="button"
                    className="px-2 text-xs text-sub underline"
                    onClick={() => setPhoto(null)}
                  >
                    移除
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={`${btnGhost} w-full text-sm`}
                  onClick={() => fileRef.current?.click()}
                >
                  顺便附一张视频截图（可选）
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-2xl bg-primary-soft px-3 py-2.5 text-sm text-primary">
                {error}
              </div>
            )}

            <button
              type="button"
              className={`${btnPrimary} w-full`}
              disabled={busy || (!rawInput.trim() && !note.trim() && !photo)}
              onClick={() => void parseLink()}
            >
              {busy ? "AI 正在读取并整理动作要点…" : "AI 解析并生成动作卡"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {draft.imageUrl && (
              <div className="overflow-hidden rounded-2xl bg-[#141418]">
                <img
                  src={draft.imageUrl}
                  alt={draft.name}
                  referrerPolicy="no-referrer"
                  className="aspect-[3/2] w-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs font-semibold text-sub">动作中文名</span>
                <input
                  className={`${input} mt-1`}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-sub">英文名</span>
                <input
                  className={`${input} mt-1`}
                  value={draft.nameEn}
                  onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs font-semibold text-sub">所属部位</span>
                <select
                  className={`${input} mt-1`}
                  value={draft.group}
                  onChange={(e) => {
                    const g = e.target.value as Group;
                    setDraft({ ...draft, group: g, sub: SUBS[g][0]?.id ?? "" });
                  }}
                >
                  {GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.emoji} {g.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-sub">细分类</span>
                <select
                  className={`${input} mt-1`}
                  value={draft.sub}
                  disabled={SUBS[draft.group].length === 0}
                  onChange={(e) => setDraft({ ...draft, sub: e.target.value })}
                >
                  {SUBS[draft.group].length === 0 ? (
                    <option value="">默认</option>
                  ) : (
                    SUBS[draft.group].map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))
                  )}
                </select>
              </label>
            </div>

            <div className="rounded-2xl bg-card p-3 text-sm">
              <div className="font-semibold">记住这 3 点：</div>
              <ul className="mt-1 space-y-1 text-ink/85">
                {draft.cues.map((c, i) => (
                  <li key={i}>
                    {i + 1}. {c}
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-xs text-sub">器械：{draft.equipment} · 起步：{draft.startWeight}</div>
              <div className="mt-1 text-xs text-mint">发力感：{draft.feel}</div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className={`${btnSoft} flex-1`}
                onClick={() => setDraft(null)}
              >
                ← 重新解析
              </button>
              <button
                type="button"
                className={`${btnPrimary} flex-1`}
                disabled={!draft.name.trim()}
                onClick={save}
              >
                保存到动作库
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
