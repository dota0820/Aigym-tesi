"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { findExerciseById, isCustomExercise } from "@/lib/exercise-lookup";
import { useApp } from "@/lib/store";
import ExerciseAnim from "./ExerciseAnim";

/**
 * Large demonstration visual for either a built-in exercise (looping start/end anim)
 * or a user-imported custom exercise (cover photo / video thumbnail).
 */
export default function ExerciseCover({
  exerciseId,
  name,
  compact = false,
}: {
  exerciseId?: string;
  name: string;
  compact?: boolean;
}) {
  const { customExercises } = useApp();
  const [imgFailed, setImgFailed] = useState(false);

  if (!exerciseId) return null;
  const ex = findExerciseById(exerciseId, customExercises);
  if (!ex) return null;

  if (!isCustomExercise(ex)) {
    return <ExerciseAnim id={ex.id} name={ex.name} note={ex.imageNote} compact={compact} />;
  }

  if (!ex.imageUrl && !ex.sourceUrl) return null;

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-[#141418]">
      {ex.imageUrl && !imgFailed ? (
        <div className="relative aspect-[3/2] w-full">
          <img
            src={ex.imageUrl}
            alt={name}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
          {ex.sourcePlatform && (
            <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {ex.sourcePlatform}
            </span>
          )}
          {ex.sourceUrl && (
            <a
              href={ex.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2 right-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
            >
              ▶ 打开原视频
            </a>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between bg-primary-soft px-4 py-3 text-sm">
          <span className="font-semibold text-primary">
            {ex.sourcePlatform ? `${ex.sourcePlatform} 导入动作` : "自定义动作"}
          </span>
          {ex.sourceUrl && (
            <a
              href={ex.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"
            >
              ▶ 打开原视频
            </a>
          )}
        </div>
      )}
    </figure>
  );
}
