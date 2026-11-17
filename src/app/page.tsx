"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PlanCard from "@/components/PlanCard";
import ProfileChip from "@/components/ProfileChip";
import { btnPrimary, Card, H1, Icon, List, Row, SectionTitle } from "@/components/ui";
import { startFree } from "@/lib/actions";
import { GROUP_LABEL_EN } from "@/lib/i18n";
import { computeNutritionTargets, localDateKey, mealsForDate, sumMealMacros } from "@/lib/nutrition";
import { fmtDate, useApp, useHydrated } from "@/lib/store";
import { GROUPS } from "@/lib/types";

const coachLink = (q: string) => `/coach?q=${encodeURIComponent(q)}`;

export default function Home() {
  const { profile, plan, active, workouts, meals, lang } = useApp();
  const isEn = lang === "en";
  const ready = useHydrated();
  const router = useRouter();
  const [now] = useState(() => new Date());

  if (!ready) return null;

  const last = [...workouts].sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
  const weekAgo = new Date(now.getTime() - 7 * 864e5).toISOString();
  const thisWeek = workouts.filter((w) => w.startedAt >= weekAgo).length;
  const hour = now.getHours();
  const hello = isEn
    ? hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    : hour < 11 ? "早上好" : hour < 18 ? "下午好" : "晚上好";

  const todayMacros = sumMealMacros(mealsForDate(meals, localDateKey(now)));
  const targets = computeNutritionTargets(profile);
  const kcalPct = Math.min(100, Math.round((todayMacros.calories / (targets.calories || 1)) * 100));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <H1 sub={isEn ? `${thisWeek} workouts this week` : `本周已练 ${thisWeek} 次`}>
          {hello}
          {profile.name ? `，${profile.name}` : ""}
        </H1>
        <div className="pt-3">
          <ProfileChip />
        </div>
      </div>

      {/* ---- The one main action ---- */}
      {active ? (
        <Card className="space-y-3 p-5">
          <div>
            <div className="text-[13px] font-medium text-mint">{isEn ? "In progress" : "训练进行中"}</div>
            <div className="mt-0.5 text-[20px] font-semibold">{active.title}</div>
          </div>
          <Link href="/workout" className={`${btnPrimary} w-full`}>
            {isEn ? "Continue" : "继续训练"}
          </Link>
        </Card>
      ) : plan ? (
        <section>
          <SectionTitle>
            {isEn ? "Today's plan" : "今天的计划"} · {fmtDate(plan.createdAt)}
          </SectionTitle>
          <PlanCard plan={plan} />
        </section>
      ) : (
        <Card className="p-5">
          <div className="text-[20px] font-semibold">{isEn ? "Ready to train?" : "准备好训练了吗？"}</div>
          <p className="mt-1 text-[15px] text-sub">
            {isEn ? "Your coach will plan today's workout." : "教练会根据你的记录安排今天的训练。"}
          </p>
          <Link
            href={coachLink(
              isEn
                ? "I don't know what to train today, please decide based on my history."
                : "我不知道今天该练什么,你根据我的记录帮我决定吧",
            )}
            className={`${btnPrimary} mt-4 w-full py-3.5 text-[17px]`}
          >
            {isEn ? "Start today's workout" : "开始今天的训练"}
          </Link>
        </Card>
      )}

      {!active && (
        <section>
          <SectionTitle>{isEn ? "Or pick a body part" : "或者选一个部位"}</SectionTitle>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {GROUPS.map((g) => (
              <Link
                key={g.id}
                href={coachLink(
                  isEn
                    ? `I want to train ${GROUP_LABEL_EN[g.id]} today, please build my plan.`
                    : `今天想练${g.label},帮我安排一下`,
                )}
                className="shrink-0 rounded-full bg-card px-4 py-2 text-[15px] active:opacity-70"
              >
                {isEn ? GROUP_LABEL_EN[g.id] : g.label}
              </Link>
            ))}
          </div>
          <button
            className="mt-3 w-full text-center text-[15px] text-primary active:opacity-60"
            onClick={() => {
              startFree();
              router.push("/workout");
            }}
          >
            {isEn ? "Log a workout without a plan" : "不用计划，自己记录"}
          </button>
        </section>
      )}

      {!profile.goal && (
        <List>
          <Row
            href="/me/profile"
            icon={<Icon name="person" />}
            title={isEn ? "Tell your coach about you" : "让教练认识你"}
            sub={isEn ? "Goal & gym equipment · 1 min" : "填写目标和器械，只需 1 分钟"}
          />
        </List>
      )}

      {/* ---- Today at a glance ---- */}
      <section>
        <SectionTitle>{isEn ? "Today" : "今日"}</SectionTitle>
        <List>
          <Link href="/food" className="block px-4 py-3 active:bg-bg">
            <div className="flex items-baseline justify-between">
              <span className="text-[16px]">{isEn ? "Nutrition" : "饮食"}</span>
              <span className="text-[15px] text-sub tabular-nums">
                {todayMacros.calories} / {targets.calories} kcal
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
              <div className="h-full rounded-full bg-mint" style={{ width: `${kcalPct}%` }} />
            </div>
          </Link>
          {last && (
            <Row
              href={`/history/${last.id}`}
              title={isEn ? "Last workout" : "上次训练"}
              value={`${last.title} · ${fmtDate(last.startedAt)}`}
            />
          )}
        </List>
      </section>

      {/* ---- Tools ---- */}
      <section>
        <SectionTitle>{isEn ? "Tools" : "工具"}</SectionTitle>
        <List>
          <Row
            href="/detective"
            icon={<Icon name="search" />}
            title={isEn ? "Movement Detective" : "动作侦探"}
            sub={isEn ? "Feeling the wrong muscle?" : "练错地方、找不到发力？"}
          />
          <Row
            href="/library"
            icon={<Icon name="book" />}
            title={isEn ? "Exercise Library" : "动作库"}
          />
        </List>
      </section>
    </div>
  );
}
