"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlanCard from "@/components/PlanCard";
import ProfileChip from "@/components/ProfileChip";
import { btnGhost, btnPrimary, Card, H1 } from "@/components/ui";
import { startFree } from "@/lib/actions";
import { GROUP_LABEL_EN } from "@/lib/i18n";
import { computeNutritionTargets, localDateKey, mealsForDate, sumMealMacros } from "@/lib/nutrition";
import { durationMin, fmtDate, useApp, useHydrated } from "@/lib/store";
import { GROUPS } from "@/lib/types";

export default function Home() {
  const { profile, plan, active, workouts, meals, lang } = useApp();
  const isEn = lang === "en";
  const ready = useHydrated();
  const router = useRouter();
  const sorted = [...workouts].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  const last = sorted[0];
  const [now] = useState(() => new Date());
  const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString();
  const thisWeek = workouts.filter((w) => w.startedAt >= weekAgo).length;
  const hour = now.getHours();
  const hello = isEn
    ? hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening"
    : hour < 11
      ? "早上好"
      : hour < 18
        ? "下午好"
        : "晚上好";

  const todayMeals = mealsForDate(meals, localDateKey(now));
  const todayMacros = sumMealMacros(todayMeals);
  const targets = computeNutritionTargets(profile);

  if (!ready) return null;

  return (
    <div className="space-y-4">
      <ProfileChip />
      <H1
        sub={
          isEn
            ? `${thisWeek} workouts in the last 7 days · ${workouts.length} total`
            : `最近 7 天练了 ${thisWeek} 次 · 一共 ${workouts.length} 次`
        }
      >
        {hello}
        {profile.name ? `, ${profile.name}` : ""} 👋
      </H1>

      <Link href="/detective" className="block">
        <Card className="border-primary/35 bg-gradient-to-br from-primary-soft via-card to-mint-soft/40">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-primary">
                🕵️ {isEn ? "NEW · AI MOVEMENT DETECTIVE" : "新模块 · AI 动作侦探"}
              </div>
              <div className="mt-0.5 text-base font-bold text-ink">
                {isEn
                  ? "Feeling the wrong muscle? Let's investigate"
                  : "练错了地方？脖子腰酸、找不到发力？"}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-sub">
                {isEn
                  ? "1-question-at-a-time biomechanics check, compensation fixes & video form review."
                  : "单步问诊查代偿 · 日常部位翻译 · 32动作库 · 上传视频/照片分析"}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white">
              {isEn ? "Diagnose ›" : "去排查 ›"}
            </span>
          </div>
        </Card>
      </Link>

      {!profile.goal && (
        <Link href="/me" className="block">
          <Card className="border-primary/30 bg-primary-soft">
            <div className="font-semibold text-primary">先让教练认识你 →</div>
            <p className="mt-1 text-sm text-ink/70">
              花 1 分钟填一下目标和健身房器械,教练的安排会更适合你。
            </p>
          </Card>
        </Link>
      )}

      {active && (
        <Card className="border-mint/40 bg-mint-soft">
          <div className="text-sm font-semibold text-mint">训练进行中</div>
          <div className="mt-0.5 text-lg font-bold">{active.title}</div>
          <Link href="/workout" className={`${btnPrimary} mt-3 w-full`}>
            继续训练
          </Link>
        </Card>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold text-sub">
          {isEn ? "What do you want to train today?" : "今天想练什么?让教练安排"}
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {GROUPS.map((g) => (
            <Link
              key={g.id}
              href={`/coach?q=${encodeURIComponent(
                isEn
                  ? `I want to train ${GROUP_LABEL_EN[g.id]} today, please build my plan.`
                  : `今天想练${g.label},帮我安排一下`,
              )}`}
              className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-card py-3 text-sm font-semibold active:scale-95"
            >
              <span className="text-2xl">{g.emoji}</span>
              {isEn ? GROUP_LABEL_EN[g.id] : g.label}
            </Link>
          ))}
        </div>
        <Link
          href={`/coach?q=${encodeURIComponent(
            isEn
              ? "I don't know what to train today, please decide based on my history."
              : "我不知道今天该练什么,你根据我的记录帮我决定吧",
          )}`}
          className={`${btnGhost} mt-2 w-full`}
        >
          🤔 {isEn ? "Not sure what to train — let coach decide" : "不知道练什么,教练帮我决定"}
        </Link>
      </section>

      {plan && !active && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-sub">
            教练安排的计划 · {fmtDate(plan.createdAt)}
          </h2>
          <PlanCard plan={plan} />
        </section>
      )}

      {!active && (
        <button
          className={`${btnGhost} w-full`}
          onClick={() => {
            startFree();
            router.push("/workout");
          }}
        >
          ✍️ 不用计划,自己记录一次训练
        </button>
      )}

      <Link href="/food" className="block">
        <Card className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-mint">🥗 今日饮食营养</div>
            <div className="mt-0.5 text-sm font-bold tabular-nums">
              {todayMacros.calories} / {targets.calories} kcal · 蛋白 {Math.round(todayMacros.protein)}/{targets.protein}g
            </div>
            <div className="text-xs text-sub">
              {todayMeals.length > 0
                ? `已记 ${todayMeals.length} 餐 · 碳水 ${Math.round(todayMacros.carbs)}g`
                : "拍食物照片，AI 帮你算蛋白质、碳水和热量"}
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-mint-soft px-3 py-1.5 text-xs font-semibold text-mint">
            记一餐 ›
          </span>
        </Card>
      </Link>

      {last && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-sub">上一次训练</h2>
          <Link href={`/history/${last.id}`} className="block">
            <Card>
              <div className="flex items-baseline justify-between">
                <div className="font-bold">{last.title}</div>
                <div className="text-xs text-sub">{fmtDate(last.startedAt)}</div>
              </div>
              <p className="mt-1 text-sm text-sub">
                {last.exercises.map((e) => e.name).join(" · ") || "没有记录动作"}
              </p>
              <p className="mt-1 text-xs text-sub">
                {durationMin(last) ? `${durationMin(last)} 分钟` : ""}
                {last.watch?.calories ? ` · ${last.watch.calories} 千卡` : ""}
                {last.watch?.avgHr ? ` · 平均心率 ${last.watch.avgHr}` : ""}
              </p>
            </Card>
          </Link>
        </section>
      )}
    </div>
  );
}
