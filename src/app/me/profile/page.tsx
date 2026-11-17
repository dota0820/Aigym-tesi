"use client";
import { useRouter } from "next/navigation";
import { Card, input, SubPage } from "@/components/ui";
import { computeNutritionTargets } from "@/lib/nutrition";
import { deleteProfile, setState, useApp, useHydrated } from "@/lib/store";
import type { Gender, Profile } from "@/lib/types";

const GOALS = ["减脂", "增肌塑形", "练翘臀", "改善体态", "保持健康"];
const AVATARS = ["🙂", "👩", "👨", "💪", "🏃‍♀️", "🏋️"];
const GENDERS: { id: Gender; label: string }[] = [
  { id: "female", label: "女" },
  { id: "male", label: "男" },
  { id: "", label: "暂不填" },
];

export default function MeProfilePage() {
  const { profile, profiles, activeProfileId, workouts, meals } = useApp();
  const ready = useHydrated();
  const router = useRouter();

  if (!ready) return null;

  const set = (patch: Partial<Profile>) =>
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  const target = computeNutritionTargets(profile);

  const field = (key: keyof Profile, label: string, placeholder = "", mode?: "numeric") => (
    <label className="block">
      <span className="text-xs font-semibold text-sub">{label}</span>
      <input
        className={`${input} mt-1`}
        placeholder={placeholder}
        inputMode={mode}
        value={(profile[key] as string) ?? ""}
        onChange={(e) => set({ [key]: e.target.value })}
      />
    </label>
  );

  function handleDelete() {
    if (profiles.length <= 1) return;
    const label = profile.name || "当前人物";
    if (
      !confirm(
        `确定要删除「${label}」档案吗？该人物下的 ${workouts.length} 次训练、${meals.length} 条饮食、计划和 AI 教练记录都会一起删除。`,
      )
    ) {
      return;
    }
    deleteProfile(activeProfileId);
    router.replace("/me");
  }

  return (
    <SubPage title="身体与目标">
      <Card className="space-y-3">
        <div>
          <span className="text-xs font-semibold text-sub">头像</span>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {AVATARS.map((av) => (
              <button
                key={av}
                type="button"
                onClick={() => set({ avatar: av })}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${
                  (profile.avatar || "🙂") === av
                    ? "bg-primary/15 ring-2 ring-primary"
                    : "border border-line bg-white"
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {field("name", "怎么称呼", "例如: 小美 / 阿杰")}

        <div>
          <span className="text-xs font-semibold text-sub">性别（用于 BMR 计算）</span>
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            {GENDERS.map((g) => (
              <button
                key={g.label}
                type="button"
                onClick={() => set({ gender: g.id })}
                className={`rounded-xl py-2.5 text-xs font-semibold ${
                  (profile.gender ?? "") === g.id
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-sub"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {field("age", "年龄", "26", "numeric")}
          {field("heightCm", "身高 cm", "165", "numeric")}
          {field("weightKg", "体重 kg", "55", "numeric")}
          {field("daysPerWeek", "每周几次", "3", "numeric")}
        </div>

        <div>
          <span className="text-xs font-semibold text-sub">健身目标</span>
          <div className="mt-1 flex flex-wrap gap-2">
            {GOALS.map((g) => {
              const on = profile.goal.split("、").includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    const cur = profile.goal.split("、").filter(Boolean);
                    set({
                      goal: (on ? cur.filter((x) => x !== g) : [...cur, g]).join("、"),
                    });
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                    on ? "bg-primary text-white" : "border border-line bg-white"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-sub">健身经验</span>
          <select
            className={`${input} mt-1`}
            value={profile.level}
            onChange={(e) => set({ level: e.target.value })}
          >
            <option>新手(刚开始健身)</option>
            <option>练过几个月</option>
            <option>规律训练一年以上</option>
          </select>
        </label>

        {field("injuries", "伤病或要注意的地方", "例如: 右膝旧伤、腰不太好；没有就留空")}
      </Card>

      <Card className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">每日营养目标</div>
          <span className="text-xs text-sub">
            {target.missingBodyStats ? "通用参考值" : `BMR ${target.bmr} · TDEE ${target.tdee}`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="rounded-xl bg-bg p-2.5">
            <div className="text-base font-semibold text-primary">{target.calories}</div>
            <div className="text-[11px] text-sub">热量 kcal</div>
          </div>
          <div className="rounded-xl bg-bg p-2.5">
            <div className="text-base font-semibold">{target.protein}g</div>
            <div className="text-[11px] text-sub">蛋白质</div>
          </div>
          <div className="rounded-xl bg-bg p-2.5">
            <div className="text-base font-semibold">{target.carbs}g</div>
            <div className="text-[11px] text-sub">碳水</div>
          </div>
          <div className="rounded-xl bg-bg p-2.5">
            <div className="text-base font-semibold">{target.fat}g</div>
            <div className="text-[11px] text-sub">脂肪</div>
          </div>
        </div>
      </Card>

      <div id="memory">
        <Card>
          <div className="text-sm font-semibold">教练记住的事</div>
          {profile.memory.length === 0 ? (
            <p className="mt-1 text-sm text-sub">
              聊天时提到的长期信息（比如“我不喜欢跑步”），教练会记在这里。
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {profile.memory.map((m, i) => (
                <li key={i} className="flex items-start justify-between gap-2 text-sm">
                  <span>• {m}</span>
                  <button
                    type="button"
                    className="shrink-0 text-xs text-sub underline"
                    onClick={() => set({ memory: profile.memory.filter((_, j) => j !== i) })}
                  >
                    忘掉
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {profiles.length > 1 && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-semibold text-sub underline"
          >
            删除此人物（{profile.name || "默认人物"}）
          </button>
        </div>
      )}
    </SubPage>
  );
}
