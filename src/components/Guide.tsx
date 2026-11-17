"use client";
import Link from "next/link";
import { wrongFeel } from "@/lib/exercise-extras";
import { findExerciseById, isCustomExercise } from "@/lib/exercise-lookup";
import { videoUrl } from "@/lib/exercises";
import { getState, useApp } from "@/lib/store";
import type { CustomExercise, Exercise, Guide as G } from "@/lib/types";
import AttachmentTip from "./AttachmentTip";
import ExerciseCover from "./ExerciseCover";

export function guideFor(
  item: { exerciseId?: string; custom?: G },
  customExercises: CustomExercise[] = getState().customExercises,
): G | null {
  if (item.exerciseId) {
    const hit = findExerciseById(item.exerciseId, customExercises);
    if (hit) return hit;
  }
  return item.custom ?? null;
}

/**
 * How to do an exercise. Library exercises lead with the three key points in
 * large type; the long step-by-step text is tucked behind a tap.
 */
export default function Guide({
  guide,
  name,
  nameEn,
  showAnim = true,
}: {
  guide: G;
  name: string;
  nameEn?: string;
  /** Show the looping demo photos / custom cover when the guide is a library exercise. */
  showAnim?: boolean;
}) {
  const { customExercises } = useApp();
  const lib: Exercise | CustomExercise | undefined =
    "id" in guide ? findExerciseById((guide as { id: string }).id, customExercises) : undefined;
  const hasCues = !!lib && lib.cues.length > 0;
  const sourceUrl = lib && isCustomExercise(lib) ? lib.sourceUrl : undefined;
  const sourcePlatform = lib && isCustomExercise(lib) ? lib.sourcePlatform : undefined;

  return (
    <div className="space-y-4">
      {showAnim && lib && <ExerciseCover exerciseId={lib.id} name={lib.name} compact />}

      {hasCues && (
        <div>
          <Label>记住这 3 点</Label>
          <ol className="mt-2 space-y-2">
            {lib.cues.map((c, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-2xl bg-primary-soft px-3 py-3 text-[18px] font-semibold leading-snug"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-base text-white">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ol>
        </div>
      )}

      {lib?.attachment && <AttachmentTip attachment={lib.attachment} />}

      <div>
        <Label>怎么准备</Label>
        <p className="mt-1 text-[17px] leading-[1.75]">{guide.setup}</p>
        <p className="mt-1 text-sm text-sub">器械:{guide.equipment}</p>
      </div>

      <div className="rounded-2xl bg-mint-soft px-3 py-2.5 text-[16px] leading-relaxed text-mint">
        <span className="font-semibold">哪里该有感觉:</span>
        {guide.feel}
      </div>

      <details className="group rounded-2xl border border-line" open={!hasCues}>
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-[16px] font-semibold">
          完整步骤({guide.steps.length} 步)
          <span className="text-sub group-open:rotate-180">▾</span>
        </summary>
        <ol className="space-y-3 px-3 pb-3">
          {guide.steps.map((s, i) => (
            <li key={i} className="flex gap-2.5 text-[17px] leading-[1.7]">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[13px] font-semibold text-primary">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </details>

      {guide.mistakes.length > 0 && (
        <details className="group rounded-2xl border border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-[16px] font-semibold">
            常见错误({guide.mistakes.length})
            <span className="text-sub group-open:rotate-180">▾</span>
          </summary>
          <ul className="space-y-2 px-3 pb-3">
            {guide.mistakes.map((s, i) => (
              <li key={i} className="text-[16px] leading-relaxed">
                • {s}
              </li>
            ))}
          </ul>
        </details>
      )}

      {lib && wrongFeel(lib).length > 0 && (
        <div>
          <Label>感觉不对?点一下问动作侦探 / 教练</Label>
          <div className="mt-2 space-y-2">
            {wrongFeel(lib).map((w) => (
              <Link
                key={w}
                href={`/detective?exercise=${encodeURIComponent(lib.id)}&q=${encodeURIComponent(`我做${lib.name}(${lib.nameEn || lib.name})的时候,${w}。请用动作侦探流程帮我排查原因并调整。`)}`}
                className="flex items-center justify-between gap-2 rounded-2xl border border-primary/40 bg-white px-3 py-3 text-[16px] font-semibold text-primary active:scale-[0.99]"
              >
                <span>{w}?</span>
                <span className="shrink-0 text-sm">侦探排查 ›</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {lib && (
        <Link
          href={`/detective?exercise=${encodeURIComponent(lib.id)}`}
          className="flex items-center justify-between gap-2 rounded-2xl border border-mint/40 bg-mint-soft/50 px-3 py-3 text-[15px] font-semibold text-mint active:scale-[0.99]"
        >
          <span>打开「AI 动作侦探」排查发力或上传视频</span>
          <span className="shrink-0 text-sm">进入 ›</span>
        </Link>
      )}

      <div className="flex flex-wrap gap-4">
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-[15px] font-semibold text-primary underline underline-offset-2"
          >
            ▶ 打开原视频 ({sourcePlatform || "来源"})
          </a>
        )}
        <a
          href={videoUrl(name, nameEn)}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-[15px] font-semibold text-primary underline underline-offset-2"
        >
          ▶ YouTube 搜示范视频
        </a>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[13px] font-semibold text-sub">{children}</div>;
}
