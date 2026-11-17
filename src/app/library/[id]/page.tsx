"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import ExerciseCover from "@/components/ExerciseCover";
import Guide from "@/components/Guide";
import MuscleMap from "@/components/MuscleMap";
import { btnGhost, btnPrimary, btnSoft, Card } from "@/components/ui";
import { findExerciseById, isCustomExercise } from "@/lib/exercise-lookup";
import { fmtDate, lastPerformance, removeCustomExercise, setsSummary, useApp } from "@/lib/store";
import { GROUPS, SUBS } from "@/lib/types";

function Detail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { workouts, customExercises } = useApp();
  const e = findExerciseById(id, customExercises);
  if (!e)
    return (
      <div className="pt-20 text-center">
        <p className="text-sub">找不到这个动作。</p>
        <Link href="/library" className={`${btnPrimary} mt-4`}>
          返回动作库
        </Link>
      </div>
    );
  const group = GROUPS.find((x) => x.id === e.group)!;
  const sub = SUBS[e.group].find((x) => x.id === e.sub);
  const last = lastPerformance(workouts, { exerciseId: e.id, name: e.name });
  const custom = isCustomExercise(e);

  return (
    <div className="space-y-3">
      <button className="text-[17px] text-primary" onClick={() => router.back()}>
        ‹ 返回
      </button>
      <header>
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <span>
            {group.label}
            {sub ? ` › ${sub.label}` : ""}
          </span>
          {custom && (
            <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[11px] text-mint">
              {e.sourcePlatform ? e.sourcePlatform : "自定义动作"}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">{e.name}</h1>
        <p className="text-sm text-sub">
          {e.nameEn ? `${e.nameEn} · ` : ""}新手起始 {e.startWeight}
        </p>
      </header>

      <ExerciseCover exerciseId={e.id} name={e.name} />

      <Card>
        <Guide guide={e} name={e.name} nameEn={e.nameEn} showAnim={false} />
      </Card>

      <Card>
        <h2 className="mb-3 text-base font-semibold">练到哪里</h2>
        <MuscleMap primary={e.primary} secondary={e.secondary} />
      </Card>

      {last && (
        <Card>
          <div className="text-xs font-semibold text-sub">
            你上次做这个动作({fmtDate(last.workout.startedAt)})
          </div>
          <div className="mt-1 font-semibold">{setsSummary(last.exercise)}</div>
        </Card>
      )}

      <Link
        href={`/coach?q=${encodeURIComponent(`${e.name}${e.nameEn ? `(${e.nameEn})` : ""}我有点不确定动作对不对,能再仔细讲讲要点吗?`)}`}
        className={`${btnSoft} w-full`}
      >
        还是不懂?问教练
      </Link>

      {custom && (
        <button
          type="button"
          className={`${btnGhost} w-full text-sub`}
          onClick={() => {
            if (confirm(`确定从我的动作库删除「${e.name}」吗?`)) {
              removeCustomExercise(e.id);
              router.replace("/library?g=custom");
            }
          }}
        >
          删除这个自定义动作
        </button>
      )}
    </div>
  );
}

export default function ExerciseDetail() {
  return (
    <Suspense>
      <Detail />
    </Suspense>
  );
}
