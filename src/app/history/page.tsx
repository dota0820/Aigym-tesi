"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { btnSoft, Card, H1 } from "@/components/ui";
import { startFree } from "@/lib/actions";
import {
  computeNutritionTargets,
  fmtDateKey,
  localDateKey,
  sumMealMacros,
} from "@/lib/nutrition";
import {
  durationMin,
  fmtDate,
  removeMealLog,
  useApp,
  useHydrated,
  volume,
} from "@/lib/store";
import { MEAL_TYPES, type MealLog } from "@/lib/types";

function HistoryContent() {
  const { workouts, active, meals, profile } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ready = useHydrated();

  if (!ready) return null;

  const tab = searchParams.get("tab") === "food" ? "food" : "workout";
  const setTab = (next: "workout" | "food") => {
    router.replace(next === "food" ? "/history?tab=food" : "/history", { scroll: false });
  };

  const sortedWorkouts = [...workouts].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const targets = computeNutritionTargets(profile);

  // Group meals by local calendar day, newest day first, newest meal first within each day
  const mealsByDay = new Map<string, MealLog[]>();
  const sortedMeals = [...meals].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  for (const m of sortedMeals) {
    const dk = localDateKey(m.loggedAt);
    const list = mealsByDay.get(dk);
    if (list) list.push(m);
    else mealsByDay.set(dk, [m]);
  }
  const dayEntries = [...mealsByDay.entries()].sort(([a], [b]) => b.localeCompare(a));

  return (
    <div className="space-y-4">

      <H1
        sub={`${workouts.length} 次训练 · ${meals.length} 条饮食`}
      >
        记录
      </H1>

      {/* Dual tab selector: Training vs Food */}
      <div
        role="tablist"
        aria-label="记录类型"
        className="grid grid-cols-2 gap-1.5 rounded-2xl bg-card p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "workout"}
          onClick={() => setTab("workout")}
          className={`rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === "workout" ? "bg-primary text-white shadow-sm" : "text-sub hover:bg-soft"
          }`}
        >
          训练记录 ({workouts.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "food"}
          onClick={() => setTab("food")}
          className={`rounded-xl py-2.5 text-sm font-semibold transition ${
            tab === "food" ? "bg-primary text-white shadow-sm" : "text-sub hover:bg-soft"
          }`}
        >
          饮食记录 ({meals.length})
        </button>
      </div>

      {tab === "workout" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              className={btnSoft}
              onClick={() => {
                if (active && !confirm("有一次训练还没结束,要放弃它重新开始记录吗?")) return;
                startFree();
                router.push("/workout");
              }}
            >
              自己添加记录
            </button>
            <Link
              href={`/coach?q=${encodeURIComponent("我想补记一次训练,你来问我做了什么,帮我记录下来")}`}
              className={btnSoft}
            >
              让教练帮我记
            </Link>
          </div>

          {sortedWorkouts.length === 0 ? (
            <Card>
              <p className="text-sm text-sub">
                还没有训练记录。去「今天」让教练按当前人物安排第一次训练吧，练完这里就会出现记录，下次还能看到和上次的对比。
              </p>
            </Card>
          ) : (
            <ul className="space-y-3">
              {sortedWorkouts.map((w) => (
                <li key={w.id}>
                  <Link href={`/history/${w.id}`} className="block">
                    <Card>
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="font-semibold">{w.title}</div>
                        <div className="shrink-0 text-xs text-sub">{fmtDate(w.startedAt)}</div>
                      </div>
                      <p className="mt-1 text-sm text-sub">
                        {w.exercises.map((e) => e.name).join(" · ") || "没有记录动作"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-sub">
                        {durationMin(w) && <span>⏱ {durationMin(w)} 分钟</span>}
                        {volume(w) > 0 && <span>总重量 {volume(w)} kg</span>}
                        {w.watch?.calories && <span>{w.watch.calories} 千卡</span>}
                        {w.watch?.avgHr && <span>{w.watch.avgHr} bpm</span>}
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Link href="/food" className={btnSoft}>
              拍照 / 记一餐
            </Link>
            <Link
              href={`/coach?q=${encodeURIComponent("帮我看看最近的饮食和热量、蛋白质达标情况，给我下一餐建议")}`}
              className={btnSoft}
            >
              问教练怎么吃
            </Link>
          </div>

          <Card className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-sub">
                {profile.name || "当前人物"}每日进食目标
                {targets.isCustom
                  ? "（自定义）"
                  : targets.missingBodyStats
                    ? "（默认参考）"
                    : `（按 ${profile.heightCm}cm / ${profile.weightKg}kg 计算）`}
              </span>
              <Link href="/me" className="font-semibold text-primary underline">
                改身体数据
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold tabular-nums">
              <span className="text-primary">{targets.calories} kcal</span>
              <span>蛋白 {targets.protein}g</span>
              <span>碳水 {targets.carbs}g</span>
              <span>脂肪 {targets.fat}g</span>
            </div>
          </Card>

          {dayEntries.length === 0 ? (
            <Card className="space-y-2">
              <p className="text-sm text-sub">
                当前人物还没有饮食记录。点上方「拍照 / 记一餐」，AI 营养师会结合你现在的身高体重自动估算热量与营养并记到这里。
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {dayEntries.map(([dateKey, dayMeals]) => {
                const dayTotals = sumMealMacros(dayMeals);
                const pct = Math.min(
                  100,
                  Math.round((dayTotals.calories / Math.max(1, targets.calories)) * 100),
                );
                const over = dayTotals.calories > targets.calories * 1.05;
                return (
                  <section key={dateKey} className="space-y-2">
                    <div className="rounded-2xl bg-card px-3.5 py-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold">{fmtDateKey(dateKey)}</span>
                          <span className="text-[11px] text-sub tabular-nums">{dateKey}</span>
                        </div>
                        <Link
                          href={`/food?date=${dateKey}`}
                          className="text-xs font-semibold text-primary underline"
                        >
                          + 补记这天
                        </Link>
                      </div>
                      <div className="mt-1.5 flex items-baseline justify-between text-xs tabular-nums">
                        <span className="font-semibold">
                          {dayTotals.calories} / {targets.calories} kcal
                        </span>
                        <span className="text-sub">
                          蛋 {dayTotals.protein}/{targets.protein}g · 碳 {dayTotals.carbs}/
                          {targets.carbs}g · 脂 {dayTotals.fat}/{targets.fat}g
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
                        <div
                          className={`h-full rounded-full ${over ? "bg-amber-500" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {dayMeals.map((m) => {
                      const mt = MEAL_TYPES.find((x) => x.id === m.mealType) ?? MEAL_TYPES[3];
                      const time = new Date(m.loggedAt).toTimeString().slice(0, 5);
                      return (
                        <Card key={m.id} className="space-y-2">
                          <div className="flex items-start gap-3">
                            {m.image && (
                              <img
                                src={m.image}
                                alt={m.summary}
                                className="h-14 w-14 shrink-0 rounded-xl object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                                  {mt.label} · {time}
                                </span>
                                <button
                                  type="button"
                                  className="text-xs text-sub underline"
                                  onClick={() => {
                                    if (confirm(`删除「${m.summary}」这条饮食记录？`)) {
                                      removeMealLog(m.id);
                                    }
                                  }}
                                >
                                  删除
                                </button>
                              </div>
                              <div className="mt-1 font-semibold">{m.summary}</div>
                              <div className="mt-1 flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs text-sub tabular-nums">
                                <span className="font-semibold text-ink">{m.calories} kcal</span>
                                <span>蛋白 {m.protein}g</span>
                                <span>碳水 {m.carbs}g</span>
                                <span>脂肪 {m.fat}g</span>
                              </div>
                            </div>
                          </div>

                          {m.advice && (
                            <p className="rounded-xl bg-mint-soft px-3 py-2 text-xs leading-relaxed text-mint">
                              {m.advice}
                            </p>
                          )}

                          {m.items.length > 1 && (
                            <details className="text-xs text-sub">
                              <summary className="cursor-pointer font-semibold">
                                查看单品明细 ({m.items.length})
                              </summary>
                              <ul className="mt-1.5 space-y-1 pl-2">
                                {m.items.map((it, idx) => (
                                  <li key={idx} className="flex justify-between gap-2">
                                    <span>
                                      • {it.name}
                                      {it.portion ? ` (${it.portion})` : ""}
                                    </span>
                                    <span className="shrink-0 tabular-nums">
                                      {it.calories} kcal · 蛋{it.protein} / 碳{it.carbs} / 脂
                                      {it.fat}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          )}
                        </Card>
                      );
                    })}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function History() {
  return (
    <Suspense fallback={null}>
      <HistoryContent />
    </Suspense>
  );
}
