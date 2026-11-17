"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import WatchForm from "@/components/WatchForm";
import { btnGhost, btnPrimary, btnSoft, Card } from "@/components/ui";
import {
  durationMin,
  fmtDate,
  lastPerformance,
  setState,
  setsSummary,
  useApp,
  useHydrated,
  volume,
} from "@/lib/store";
import type { WatchData, WorkoutExercise } from "@/lib/types";

const FEELINGS = ["😵", "😮‍💨", "🙂", "😄", "🔥"];

function best(e: WorkoutExercise) {
  const done = e.sets.filter((s) => s.done);
  const w = Math.max(0, ...done.map((s) => s.weight ?? 0));
  const reps = done.reduce((n, s) => n + (s.reps ?? 0), 0);
  return { w, reps };
}

function Delta({ cur, prev }: { cur: WorkoutExercise; prev: WorkoutExercise }) {
  const a = best(cur);
  const b = best(prev);
  let text = "和上次持平";
  let cls = "bg-bg text-sub";
  if (a.w > b.w) {
    text = `重量 +${+(a.w - b.w).toFixed(1)} kg ↑`;
    cls = "bg-mint-soft text-mint";
  } else if (a.w < b.w) {
    text = `重量 −${+(b.w - a.w).toFixed(1)} kg`;
  } else if (a.reps > b.reps) {
    text = `总次数 +${a.reps - b.reps} ↑`;
    cls = "bg-mint-soft text-mint";
  } else if (a.reps < b.reps) {
    text = `总次数 −${b.reps - a.reps}`;
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{text}</span>
  );
}

function Detail() {
  const { id } = useParams<{ id: string }>();
  const { workouts } = useApp();
  const ready = useHydrated();
  const router = useRouter();
  const [editWatch, setEditWatch] = useState(false);
  if (!ready) return null;
  const w = workouts.find((x) => x.id === id);
  if (!w)
    return (
      <div className="pt-20 text-center">
        <p className="text-sub">找不到这条记录。</p>
        <Link href="/history" className={`${btnPrimary} mt-4`}>
          返回记录
        </Link>
      </div>
    );

  const setWatch = (watch: WatchData) =>
    setState((s) => ({
      ...s,
      workouts: s.workouts.map((x) => (x.id === w.id ? { ...x, watch } : x)),
    }));
  const reviewQ = `我完成了 ${w.startedAt.slice(0, 10)} 的「${w.title}」,请点评这次训练,和上一次比怎么样,并告诉我下次的目标。`;

  return (
    <div className="space-y-3">
      <Link href="/history" className="text-sm text-sub">
        ‹ 训练记录
      </Link>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{w.title}</h1>
        <p className="mt-1 text-sm text-sub">
          {fmtDate(w.startedAt)}
          {w.feeling ? ` · 感受 ${FEELINGS[w.feeling - 1]}` : ""}
        </p>
      </header>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { l: "时长", v: durationMin(w), u: "分钟" },
          { l: "总重量", v: volume(w) || null, u: "kg" },
          { l: "消耗", v: w.watch?.calories, u: "千卡" },
          { l: "平均心率", v: w.watch?.avgHr, u: "bpm" },
        ].map((x) => (
          <div key={x.l} className="rounded-2xl bg-card py-2">
            <div className="text-lg font-bold tabular-nums">{x.v ?? "—"}</div>
            <div className="text-[11px] text-sub">
              {x.l}
              {x.v ? ` ${x.u}` : ""}
            </div>
          </div>
        ))}
      </div>

      <Link href={`/coach?q=${encodeURIComponent(reviewQ)}`} className={`${btnPrimary} w-full`}>
        💬 让教练点评这次训练
      </Link>

      {w.exercises.map((e, i) => {
        const prev = lastPerformance(workouts, e, w.startedAt);
        return (
          <Card key={i}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold">{e.name}</div>
                {e.nameEn && <div className="text-xs text-sub">{e.nameEn}</div>}
              </div>
              {prev && <Delta cur={e} prev={prev.exercise} />}
            </div>
            <div className="mt-2 text-sm">
              <span className="text-sub">这次:</span>
              <span className="font-semibold">{setsSummary(e)}</span>
            </div>
            <div className="mt-1 text-sm text-sub">
              {prev
                ? `上次(${fmtDate(prev.workout.startedAt)}):${setsSummary(prev.exercise)}`
                : "上次:第一次做这个动作"}
            </div>
          </Card>
        );
      })}

      {w.notes && (
        <Card>
          <div className="text-xs font-semibold text-sub">备注</div>
          <p className="mt-1 whitespace-pre-wrap text-sm">{w.notes}</p>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">
            ⌚ 手表数据
            {w.watch?.maxHr ? (
              <span className="ml-2 font-normal text-sub">最高心率 {w.watch.maxHr} bpm</span>
            ) : null}
          </div>
          <button className="text-sm text-primary" onClick={() => setEditWatch(!editWatch)}>
            {editWatch ? "完成" : w.watch ? "修改" : "补充"}
          </button>
        </div>
        {editWatch && (
          <div className="mt-3">
            <WatchForm value={w.watch ?? { source: "manual" }} onChange={setWatch} />
          </div>
        )}
      </Card>

      <div className="flex gap-2">
        <Link href="/" className={`${btnSoft} flex-1`}>
          回到首页
        </Link>
        <button
          className={`${btnGhost} flex-1 text-sub`}
          onClick={() => {
            if (confirm("删除这条训练记录?删除后不能恢复。")) {
              setState((s) => ({ ...s, workouts: s.workouts.filter((x) => x.id !== w.id) }));
              router.replace("/history");
            }
          }}
        >
          删除记录
        </button>
      </div>
    </div>
  );
}

export default function WorkoutDetail() {
  return (
    <Suspense>
      <Detail />
    </Suspense>
  );
}
