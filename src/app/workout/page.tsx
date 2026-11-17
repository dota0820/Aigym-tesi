"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExerciseCover from "@/components/ExerciseCover";
import ExercisePicker from "@/components/ExercisePicker";
import Guide, { guideFor } from "@/components/Guide";
import NumInput from "@/components/NumInput";
import WatchForm from "@/components/WatchForm";
import { btnGhost, btnPrimary, btnSoft, Card, input } from "@/components/ui";
import { newExercise } from "@/lib/actions";
import { findExerciseById, isCustomExercise } from "@/lib/exercise-lookup";
import {
  fmtDate,
  lastPerformance,
  setState,
  setsSummary,
  useApp,
  useHydrated,
} from "@/lib/store";
import type { WatchData, Workout, WorkoutExercise } from "@/lib/types";

function update(fn: (w: Workout) => Workout) {
  setState((s) => (s.active ? { ...s, active: fn(s.active) } : s));
}
function updateEx(i: number, fn: (e: WorkoutExercise) => WorkoutExercise) {
  update((w) => ({ ...w, exercises: w.exercises.map((e, j) => (j === i ? fn(e) : e)) }));
}
const mmss = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

const FEELINGS = ["😵", "😮‍💨", "🙂", "😄", "🔥"];

export default function WorkoutPage() {
  const { active, workouts, customExercises } = useApp();
  const ready = useHydrated();
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const [hiddenImgs, setHiddenImgs] = useState<Record<number, boolean>>({});
  const [picker, setPicker] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [restEnd, setRestEnd] = useState<number | null>(null);
  const [feeling, setFeeling] = useState(3);
  const [notes, setNotes] = useState("");
  const [watch, setWatch] = useState<WatchData>({ source: "manual" });

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const restLeft = restEnd ? Math.ceil((restEnd - now) / 1000) : 0;
  useEffect(() => {
    if (!restEnd) return;
    const t = setTimeout(
      () => {
        setRestEnd(null);
        navigator.vibrate?.([200, 100, 200]);
      },
      Math.max(0, restEnd - Date.now()),
    );
    return () => clearTimeout(t);
  }, [restEnd]);

  if (!ready) return null;
  if (!active)
    return (
      <div className="pt-20 text-center">
        <p className="text-sub">现在没有进行中的训练。</p>
        <Link href="/" className={`${btnPrimary} mt-4`}>
          回到首页
        </Link>
      </div>
    );

  const elapsed = Math.max(0, (now - new Date(active.startedAt).getTime()) / 1000);
  const doneSets = active.exercises.reduce(
    (n, e) => n + e.sets.filter((s) => s.done).length,
    0,
  );
  const totalSets = active.exercises.reduce((n, e) => n + e.sets.length, 0);

  function toggleSet(i: number, k: number) {
    const ex = active!.exercises[i];
    const s = ex.sets[k];
    if (s.done) {
      updateEx(i, (e) => ({
        ...e,
        sets: e.sets.map((x, j) => (j === k ? { ...x, done: false } : x)),
      }));
      return;
    }
    if (s.reps == null) {
      alert("先填一下这组做了几次(或几秒)再打勾 🙂");
      return;
    }
    updateEx(i, (e) => ({
      ...e,
      sets: e.sets.map((x, j) =>
        j === k
          ? { ...x, done: true }
          : // carry the weight forward to later unfinished sets
            j > k && !x.done && x.weight == null
            ? { ...x, weight: s.weight }
            : x,
      ),
    }));
    if (ex.restSec) setRestEnd(Date.now() + ex.restSec * 1000);
  }

  function finish() {
    const w: Workout = {
      ...active!,
      endedAt: new Date().toISOString(),
      feeling,
      notes: notes.trim() || undefined,
      watch:
        watch.durationMin || watch.calories || watch.avgHr || watch.maxHr ? watch : undefined,
      exercises: active!.exercises
        .map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) }))
        .filter((e) => e.sets.length),
    };
    setState((s) => ({ ...s, active: null, workouts: [...s.workouts, w] }));
    router.replace(`/history/${w.id}`);
  }

  return (
    <div className="space-y-3 pb-28">
      <header className="sticky top-0 z-10 -mx-4 flex items-center justify-between bg-bg/95 px-4 py-2 backdrop-blur">
        <div>
          <div className="text-lg font-semibold leading-tight">{active.title}</div>
          <div className="text-xs text-sub">
            ⏱ {mmss(elapsed)} · 已完成 {doneSets}/{totalSets} 组
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/coach" className="rounded-xl border border-line bg-card px-3 py-2 text-sm">
            问教练
          </Link>
          <button
            className="rounded-xl bg-mint px-3 py-2 text-sm font-semibold text-white"
            onClick={() => setFinishing(true)}
          >
            结束
          </button>
        </div>
      </header>

      {active.exercises.length === 0 && (
        <p className="py-6 text-center text-sm text-sub">还没有动作,点下面的按钮添加第一个动作。</p>
      )}

      {active.exercises.map((ex, i) => {
        const guide = guideFor(ex, customExercises);
        const last = lastPerformance(workouts, ex);
        const libEx = findExerciseById(ex.exerciseId, customExercises);
        const hasBigVisual =
          !!libEx && (!isCustomExercise(libEx) || !!libEx.imageUrl || !!libEx.sourceUrl);
        const imgShown = hasBigVisual && !hiddenImgs[i];
        return (
          <Card key={i} className="p-0">
            <div className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[17px] font-semibold">{ex.name}</div>
                  <div className="text-xs text-sub">
                    {ex.nameEn}
                    {ex.target ? `${ex.nameEn ? " · " : ""}目标 ${ex.target}` : ""}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {hasBigVisual && (
                    <button
                      type="button"
                      className="rounded-full border border-line bg-bg px-2.5 py-1 text-xs font-semibold text-sub"
                      onClick={() => setHiddenImgs((m) => ({ ...m, [i]: !m[i] }))}
                    >
                      {imgShown ? "收起图" : "大图"}
                    </button>
                  )}
                  <button
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      openGuide === i ? "bg-primary text-white" : "bg-primary-soft text-primary"
                    }`}
                    onClick={() => setOpenGuide(openGuide === i ? null : i)}
                    aria-expanded={openGuide === i}
                  >
                    {openGuide === i ? "收起" : "怎么做?"}
                  </button>
                </div>
              </div>
              {imgShown && (
                <div className="mt-3">
                  <ExerciseCover exerciseId={ex.exerciseId} name={ex.name} compact />
                </div>
              )}
              <div className="mt-2 rounded-lg bg-bg px-3 py-1.5 text-xs text-sub">
                {last ? (
                  <>
                    上次({fmtDate(last.workout.startedAt)}):
                    <span className="font-semibold text-ink">{setsSummary(last.exercise)}</span>
                  </>
                ) : (
                  "第一次做这个动作,从轻的开始,先把动作做对 ✨"
                )}
              </div>
              {ex.note && (
                <p className="mt-2 rounded-lg bg-primary-soft px-3 py-1.5 text-xs text-primary">
                  {ex.note}
                </p>
              )}
              {openGuide === i && (
                <div className="mt-3 border-t border-line pt-3">
                  {guide ? (
                    <Guide guide={guide} name={ex.name} nameEn={ex.nameEn} showAnim={!imgShown} />
                  ) : (
                    <p className="text-sm text-sub">这个动作没有内置教程,点右上角“问教练”问问看。</p>
                  )}
                </div>
              )}
            </div>

            <div className="px-4">
              <div className="grid grid-cols-[28px_1fr_1fr_44px] items-center gap-2 py-1 text-center text-[11px] text-sub">
                <span>组</span>
                <span>重量 kg</span>
                <span>次数</span>
                <span>完成</span>
              </div>
              {ex.sets.map((s, k) => (
                <div
                  key={k}
                  className="grid grid-cols-[28px_1fr_1fr_44px] items-center gap-2 py-1"
                >
                  <span className="text-center text-sm font-semibold text-sub">{k + 1}</span>
                  <NumInput
                    decimal
                    className={`${input} text-center ${s.done ? "bg-mint-soft" : ""}`}
                    placeholder="自重"
                    aria-label={`${ex.name} 第 ${k + 1} 组重量`}
                    value={s.weight}
                    onChange={(v) =>
                      updateEx(i, (x) => ({
                        ...x,
                        sets: x.sets.map((y, j) => (j === k ? { ...y, weight: v } : y)),
                      }))
                    }
                  />
                  <NumInput
                    className={`${input} text-center ${s.done ? "bg-mint-soft" : ""}`}
                    placeholder="—"
                    aria-label={`${ex.name} 第 ${k + 1} 组次数`}
                    value={s.reps}
                    onChange={(v) =>
                      updateEx(i, (x) => ({
                        ...x,
                        sets: x.sets.map((y, j) => (j === k ? { ...y, reps: v } : y)),
                      }))
                    }
                  />
                  <button
                    aria-label={`${ex.name} 第 ${k + 1} 组${s.done ? "取消完成" : "完成"}`}
                    aria-pressed={s.done}
                    onClick={() => toggleSet(i, k)}
                    className={`h-11 rounded-xl text-lg font-semibold ${
                      s.done ? "bg-mint text-white" : "border border-line bg-white text-line"
                    }`}
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-sm">
              <div className="flex gap-4">
                <button
                  className="font-semibold text-primary"
                  onClick={() =>
                    updateEx(i, (x) => ({
                      ...x,
                      sets: [
                        ...x.sets,
                        { weight: x.sets.at(-1)?.weight ?? null, reps: null, done: false },
                      ],
                    }))
                  }
                >
                  + 加一组
                </button>
                {ex.sets.length > 1 && (
                  <button
                    className="text-sub"
                    onClick={() => updateEx(i, (x) => ({ ...x, sets: x.sets.slice(0, -1) }))}
                  >
                    − 减一组
                  </button>
                )}
              </div>
              <button
                className="text-sub"
                onClick={() => {
                  if (confirm(`从这次训练中移除「${ex.name}」?`)) {
                    setOpenGuide(null);
                    update((w) => ({
                      ...w,
                      exercises: w.exercises.filter((_, j) => j !== i),
                    }));
                  }
                }}
              >
                移除
              </button>
            </div>
          </Card>
        );
      })}

      <button className={`${btnGhost} w-full`} onClick={() => setPicker(true)}>
        + 添加动作
      </button>

      {restEnd && restLeft > 0 && (
        <div className="safe-b fixed inset-x-0 bottom-0 z-30 px-4 pb-4">
          <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl bg-ink px-5 py-3 text-white shadow-lg">
            <div>
              <div className="text-xs opacity-70">休息一下,喝口水</div>
              <div className="text-2xl font-semibold tabular-nums">{mmss(restLeft)}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-xl bg-white/15 px-3 py-2 text-sm"
                onClick={() => setRestEnd(restEnd + 30000)}
              >
                +30 秒
              </button>
              <button
                className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-ink"
                onClick={() => setRestEnd(null)}
              >
                跳过
              </button>
            </div>
          </div>
        </div>
      )}

      {picker && (
        <ExercisePicker
          onClose={() => setPicker(false)}
          onPick={(e) => {
            update((w) => ({ ...w, exercises: [...w.exercises, newExercise(e)] }));
            setPicker(false);
          }}
        />
      )}

      {finishing && (
        <div
          className="fixed inset-0 z-40 flex items-end bg-black/40"
          onClick={() => setFinishing(false)}
        >
          <div
            className="safe-b mx-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-bg p-5"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="结束训练"
          >
            <h2 className="text-xl font-semibold">练完啦!🎉</h2>
            <p className="mt-1 text-sm text-sub">
              完成 {doneSets} 组 · 用时 {Math.max(1, Math.round(elapsed / 60))} 分钟。没打勾的组不会被记录。
            </p>

            <div className="mt-4 text-sm font-semibold">今天感觉怎么样?</div>
            <div className="mt-2 flex justify-between">
              {FEELINGS.map((f, i) => (
                <button
                  key={i}
                  aria-label={`感受 ${i + 1} 分`}
                  aria-pressed={feeling === i + 1}
                  onClick={() => setFeeling(i + 1)}
                  className={`h-12 w-12 rounded-2xl text-2xl ${
                    feeling === i + 1 ? "bg-primary-soft ring-2 ring-primary" : "bg-card"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm font-semibold">手表数据(可选)</div>
            <div className="mt-2">
              <WatchForm value={watch} onChange={setWatch} />
            </div>

            <div className="mt-4 text-sm font-semibold">备注(可选)</div>
            <textarea
              className={`${input} mt-2`}
              rows={2}
              placeholder="例如:腿举最后一组膝盖有点不舒服"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button className={`${btnPrimary} mt-4 w-full`} onClick={finish}>
              保存这次训练
            </button>
            <div className="mt-2 flex gap-2">
              <button className={`${btnSoft} flex-1`} onClick={() => setFinishing(false)}>
                继续练
              </button>
              <button
                className={`${btnGhost} flex-1 text-sub`}
                onClick={() => {
                  if (confirm("放弃这次训练?已填的内容不会保存。")) {
                    setState((s) => ({ ...s, active: null }));
                    router.replace("/");
                  }
                }}
              >
                放弃不保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
