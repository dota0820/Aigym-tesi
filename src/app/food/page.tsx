"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { fileToJpegDataUrl } from "@/lib/actions";
import {
  computeNutritionTargets,
  defaultMealTypeForHour,
  fmtDateKey,
  localDateKey,
  mealsForDate,
  nutritionContextForCoach,
  shiftDateKey,
  sumMealMacros,
} from "@/lib/nutrition";
import {
  addMealLog,
  aiHeaders,
  removeMealLog,
  setState,
  uid,
  useApp,
  useHydrated,
} from "@/lib/store";
import { MEAL_TYPES, type MealItem, type MealLog, type MealType } from "@/lib/types";
import { useDictation } from "@/lib/voice";
import { btnGhost, btnPrimary, btnSoft, Card, H1, input } from "@/components/ui";

interface MealDraft {
  mealType: MealType;
  summary: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: MealItem[];
  advice?: string;
  image?: string;
}

function MacroBar({
  label,
  val,
  target,
  unit,
  barColor,
}: {
  label: string;
  val: number;
  target: number;
  unit: string;
  barColor: string;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((val / target) * 100)) : 0;
  const diff = Math.round(target - val);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold">{label}</span>
        <span className="tabular-nums text-sub">
          <strong className="text-ink">{Math.round(val)}</strong> / {target} {unit}
          {diff > 0 ? ` · 还差 ${diff}` : diff < 0 ? ` · 超 ${Math.abs(diff)}` : " · 达标"}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-bg">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function FoodContent() {
  const { meals, profile, workouts } = useApp();
  const searchParams = useSearchParams();
  const ready = useHydrated();

  const today = localDateKey();
  const rawDate = searchParams.get("date");
  const validParamDate = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : null;
  const [dateKey, setDateKey] = useState(validParamDate ?? today);
  const lastParamDate = useRef(validParamDate);
  useEffect(() => {
    if (validParamDate && validParamDate !== lastParamDate.current) {
      setDateKey(validParamDate);
    }
    lastParamDate.current = validParamDate;
  }, [validParamDate]);
  const [mealType, setMealType] = useState<MealType>(() => defaultMealTypeForHour());
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<{ full: string; thumb: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<MealDraft | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [editTargets, setEditTargets] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const dictation = useDictation((t) => setText(t));

  if (!ready) return null;

  const targets = computeNutritionTargets(profile);
  const dayMeals = mealsForDate(meals, dateKey);
  const totals = sumMealMacros(dayMeals);
  const dayWorkouts = workouts.filter((w) => localDateKey(w.startedAt) === dateKey);
  const workoutCals = dayWorkouts.reduce((n, w) => n + (w.watch?.calories ?? 0), 0);

  async function onPickPhoto(file: File) {
    setError("");
    try {
      const [full, thumb] = await Promise.all([
        fileToJpegDataUrl(file, 1440),
        fileToJpegDataUrl(file, 360),
      ]);
      setPhoto({ full, thumb });
    } catch {
      setError("这张照片打不开，换一张试试。");
    }
  }

  async function analyzeMeal() {
    if ((!text.trim() && !photo) || busy) return;
    setBusy(true);
    setError("");
    try {
      const genderLabel =
        profile.gender === "male" ? "男" : profile.gender === "female" ? "女" : "未知";
      const ctxLines = [
        `当前人物档案: ${profile.name || "默认人物"} (性别: ${genderLabel}, 年龄: ${profile.age || "?"}岁, 身高: ${profile.heightCm || "?"} cm, 体重: ${profile.weightKg || "?"} kg, 目标: ${profile.goal || "保持健康"}, 每周训练: ${profile.daysPerWeek || "?"} 次)`,
        dayWorkouts.length
          ? `当天训练: ${dayWorkouts.map((w) => w.title).join("、")}${workoutCals ? ` (手表消耗 ${workoutCals} kcal)` : ""}`
          : "当天暂未记录训练",
        nutritionContextForCoach(
          meals.filter((m) => localDateKey(m.loggedAt) === dateKey),
          profile,
        ),
      ].join("\n");

      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: aiHeaders(),
        body: JSON.stringify({
          text: text.trim() || undefined,
          image: photo?.full,
          mealType,
          context: ctxLines,
        }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error ?? "分析失败，请再试一次。");
        return;
      }
      if (!j.is_food) {
        setError("这看起来不太像食物或饮品哦，请拍餐食照片或文字描述吃了什么。");
        return;
      }
      setDraft({
        mealType,
        summary: j.summary || text.trim() || "一餐饮食",
        calories: Math.round(j.total?.calories ?? 0),
        protein: Math.round((j.total?.protein ?? 0) * 10) / 10,
        carbs: Math.round((j.total?.carbs ?? 0) * 10) / 10,
        fat: Math.round((j.total?.fat ?? 0) * 10) / 10,
        items: Array.isArray(j.items) ? j.items : [],
        advice: j.advice,
        image: photo?.thumb,
      });
    } catch {
      setError("网络出错了，请稍后再试。");
    } finally {
      setBusy(false);
    }
  }

  function openManualDraft() {
    setError("");
    setManualMode(true);
    setDraft({
      mealType,
      summary: text.trim() || "手动记录一餐",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      items: [],
      image: photo?.thumb,
    });
  }

  function saveDraft() {
    if (!draft) return;
    const isToday = dateKey === today;
    const loggedAt = isToday ? new Date().toISOString() : new Date(`${dateKey}T12:00:00`).toISOString();
    const meal: MealLog = {
      id: uid(),
      loggedAt,
      mealType: draft.mealType,
      summary: draft.summary.trim() || "一餐饮食",
      calories: Math.max(0, Math.round(draft.calories)),
      protein: Math.max(0, Math.round(draft.protein * 10) / 10),
      carbs: Math.max(0, Math.round(draft.carbs * 10) / 10),
      fat: Math.max(0, Math.round(draft.fat * 10) / 10),
      items:
        draft.items.length > 0
          ? draft.items
          : [
              {
                name: draft.summary.trim() || "一餐饮食",
                calories: Math.max(0, Math.round(draft.calories)),
                protein: Math.max(0, Math.round(draft.protein * 10) / 10),
                carbs: Math.max(0, Math.round(draft.carbs * 10) / 10),
                fat: Math.max(0, Math.round(draft.fat * 10) / 10),
              },
            ],
      advice: draft.advice,
      image: draft.image,
      note: text.trim() || undefined,
    };
    addMealLog(meal);
    setDraft(null);
    setManualMode(false);
    setText("");
    setPhoto(null);
  }

  function updateItemMacro(idx: number, key: "calories" | "protein" | "carbs" | "fat", val: number) {
    if (!draft) return;
    const items = draft.items.map((it, i) => (i === idx ? { ...it, [key]: val } : it));
    const calories = items.reduce((s, x) => s + (x.calories || 0), 0);
    const protein = Math.round(items.reduce((s, x) => s + (x.protein || 0), 0) * 10) / 10;
    const carbs = Math.round(items.reduce((s, x) => s + (x.carbs || 0), 0) * 10) / 10;
    const fat = Math.round(items.reduce((s, x) => s + (x.fat || 0), 0) * 10) / 10;
    setDraft({ ...draft, items, calories: Math.round(calories), protein, carbs, fat });
  }

  function updateTarget(key: "calories" | "protein" | "carbs" | "fat", raw: string) {
    const num = raw.trim() === "" ? null : Math.max(0, Number(raw));
    if (num !== null && isNaN(num)) return;
    setState((s) => ({
      ...s,
      profile: {
        ...s.profile,
        nutritionTarget: {
          ...s.profile.nutritionTarget,
          [key]: num,
        },
      },
    }));
  }

  const askCoachPrompt = `我现在已摄入 ${totals.calories} 千卡（蛋白质 ${totals.protein}g、碳水 ${totals.carbs}g、脂肪 ${totals.fat}g），目标是 ${targets.calories} 千卡、蛋白质 ${targets.protein}g。请根据我今天的状态建议下一餐吃什么好？`;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <H1>饮食</H1>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-card p-1 text-xs font-semibold">
          <button
            type="button"
            className="px-2 py-1 text-sub"
            aria-label="前一天"
            onClick={() => setDateKey(shiftDateKey(dateKey, -1))}
          >
            ‹
          </button>
          <span className="px-1">{fmtDateKey(dateKey)}</span>
          <button
            type="button"
            className="px-2 py-1 text-sub disabled:opacity-30"
            aria-label="后一天"
            disabled={dateKey >= today}
            onClick={() => setDateKey(shiftDateKey(dateKey, 1))}
          >
            ›
          </button>
        </div>
      </div>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-sub">
              热量
            </div>
            <div className="mt-0.5 text-2xl font-semibold tabular-nums">
              {totals.calories}
              <span className="text-sm font-normal text-sub"> / {targets.calories} kcal</span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full bg-bg px-3 py-1 text-xs font-semibold text-sub"
            onClick={() => setEditTargets(!editTargets)}
          >
            {editTargets ? "收起目标" : "调目标"}
          </button>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-bg">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${Math.min(100, Math.round((totals.calories / Math.max(1, targets.calories)) * 100))}%`,
            }}
          />
        </div>

        <div className="space-y-2.5 pt-1">
          <MacroBar label="蛋白质" val={totals.protein} target={targets.protein} unit="g" barColor="bg-mint" />
          <MacroBar label="碳水" val={totals.carbs} target={targets.carbs} unit="g" barColor="bg-amber-500" />
          <MacroBar label="脂肪" val={totals.fat} target={targets.fat} unit="g" barColor="bg-primary/80" />
        </div>

        {editTargets && (
          <div className="space-y-2 border-t border-line pt-3">
            <div className="flex items-center justify-between text-xs text-sub">
              <span>自定义每日目标（留空则按体重自动算）</span>
              {targets.isCustom && (
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      profile: { ...s.profile, nutritionTarget: undefined },
                    }))
                  }
                >
                  恢复自动计算
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ["calories", "热量 kcal"],
                  ["protein", "蛋白 g"],
                  ["carbs", "碳水 g"],
                  ["fat", "脂肪 g"],
                ] as const
              ).map(([k, lbl]) => (
                <label key={k} className="block">
                  <span className="text-[11px] text-sub">{lbl}</span>
                  <input
                    className={`${input} mt-1 px-2 py-1.5 text-center text-sm`}
                    inputMode="numeric"
                    placeholder={String(targets[k])}
                    value={profile.nutritionTarget?.[k] ?? ""}
                    onChange={(e) => updateTarget(k, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {dayWorkouts.length > 0 && (
          <div className="rounded-xl bg-mint-soft px-3 py-2 text-xs text-mint">
            {fmtDateKey(dateKey)}练了：{dayWorkouts.map((w) => w.title).join("、")}
            {workoutCals > 0 ? ` · 手表消耗 ${workoutCals} kcal` : ""}
          </div>
        )}

        <Link href={`/coach?q=${encodeURIComponent(askCoachPrompt)}`} className={`${btnSoft} w-full text-sm`}>
          问营养师 / 教练：下一餐怎么吃更好？
        </Link>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">记一餐</div>
          {!draft && (
            <button
              type="button"
              className="text-xs font-semibold text-sub underline"
              onClick={openManualDraft}
            >
              自己填数字
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {MEAL_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setMealType(t.id);
                if (draft) setDraft({ ...draft, mealType: t.id });
              }}
              className={`rounded-xl py-2 text-xs font-semibold ${
                (draft ? draft.mealType : mealType) === t.id
                  ? "bg-primary text-white"
                  : "border border-line bg-bg text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!draft ? (
          <>
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

            {photo && (
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-bg p-2">
                <img src={photo.thumb} alt="食物照片" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 text-xs text-sub">
                  已选食物照片，可以再补一句说明（比如“米饭只吃了一半”）
                </div>
                <button
                  type="button"
                  className="px-2 text-xs text-sub underline"
                  onClick={() => setPhoto(null)}
                >
                  移除
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                className={`${input} min-h-[72px] flex-1`}
                rows={2}
                placeholder="拍食物照片，或直接写吃了什么（例如：鸡腿去皮饭+青菜+一杯冰美式）"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className={`${btnGhost} flex-1 text-sm`}
                disabled={busy}
                onClick={() => fileRef.current?.click()}
              >
                {photo ? "换一张图" : "拍食物 / 传图"}
              </button>
              {dictation.supported && (
                <button
                  type="button"
                  className={`${btnGhost} px-4 text-sm ${dictation.listening ? "border-primary text-primary" : ""}`}
                  disabled={busy}
                  onClick={() => (dictation.listening ? dictation.stop() : dictation.start())}
                >
                  {dictation.listening ? "■ 停止" : "语音"}
                </button>
              )}
            </div>

            {dictation.error && <p className="text-xs text-primary">{dictation.error}</p>}
            {error && (
              <div className="rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary">{error}</div>
            )}

            <button
              type="button"
              className={`${btnPrimary} w-full`}
              disabled={busy || (!text.trim() && !photo)}
              onClick={() => void analyzeMeal()}
            >
              {busy ? "AI 营养师正在识别食物并计算…" : "AI 分析蛋白质 / 碳水 / 热量"}
            </button>
          </>
        ) : (
          <div className="space-y-3 border-t border-line pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">
                {manualMode ? "手动填写（直接修改数字）" : "AI 分析结果（可核对微调后保存）"}
              </span>
              <button
                type="button"
                className="text-xs text-sub underline"
                onClick={() => {
                  setDraft(null);
                  setManualMode(false);
                }}
              >
                取消
              </button>
            </div>

            {draft.advice && (
              <div className="rounded-xl bg-mint-soft px-3 py-2 text-xs leading-relaxed text-mint">
                {draft.advice}
              </div>
            )}

            <label className="block">
              <span className="text-xs text-sub">这餐名称</span>
              <input
                className={`${input} mt-1`}
                value={draft.summary}
                onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
              />
            </label>

            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ["calories", "热量 kcal"],
                  ["protein", "蛋白 g"],
                  ["carbs", "碳水 g"],
                  ["fat", "脂肪 g"],
                ] as const
              ).map(([k, lbl]) => (
                <label key={k} className="block">
                  <span className="text-[11px] text-sub">{lbl}</span>
                  <input
                    className={`${input} mt-1 px-2 py-1.5 text-center text-sm font-semibold`}
                    inputMode="decimal"
                    value={draft[k]}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (e.target.value !== "" && isNaN(v)) return;
                      setDraft({ ...draft, [k]: e.target.value === "" ? 0 : v });
                    }}
                  />
                </label>
              ))}
            </div>

            {draft.items.length > 0 && (
              <details className="rounded-xl border border-line bg-bg px-3 py-2" open>
                <summary className="cursor-pointer text-xs font-semibold text-sub">
                  食物拆解明细（{draft.items.length} 项，改数字会自动重算总计）
                </summary>
                <div className="mt-2 space-y-2">
                  {draft.items.map((it, idx) => (
                    <div key={idx} className="rounded-xl bg-card p-2 text-xs">
                      <div className="font-semibold">
                        {it.name}
                        {it.portion ? <span className="ml-1 font-normal text-sub">({it.portion})</span> : null}
                      </div>
                      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                        {(
                          [
                            ["calories", "kcal"],
                            ["protein", "蛋白g"],
                            ["carbs", "碳水g"],
                            ["fat", "脂肪g"],
                          ] as const
                        ).map(([k, u]) => (
                          <label key={k} className="block">
                            <span className="text-[10px] text-sub">{u}</span>
                            <input
                              className="w-full rounded-lg border border-line bg-bg px-1.5 py-1 text-center text-xs"
                              inputMode="decimal"
                              value={it[k]}
                              onChange={(e) => {
                                const v = Number(e.target.value);
                                if (e.target.value !== "" && isNaN(v)) return;
                                updateItemMacro(idx, k, e.target.value === "" ? 0 : v);
                              }}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <button type="button" className={`${btnPrimary} w-full`} onClick={saveDraft}>
              保存到{fmtDateKey(dateKey)}饮食记录
            </button>
          </div>
        )}
      </Card>

      <section className="space-y-2.5">
        <div className="text-sm font-semibold text-sub">
          {fmtDateKey(dateKey)}吃过的（{dayMeals.length} 餐）
        </div>

        {dayMeals.length === 0 ? (
          <Card>
            <p className="text-sm text-sub">
              {dateKey === today
                ? "今天还没有记录饮食。吃之前拍张照，看看蛋白质够不够吧！"
                : "这一天没有饮食记录。"}
            </p>
          </Card>
        ) : (
          dayMeals.map((m) => {
            const mt = MEAL_TYPES.find((x) => x.id === m.mealType) ?? MEAL_TYPES[3];
            const time = new Date(m.loggedAt).toTimeString().slice(0, 5);
            return (
              <Card key={m.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  {m.image && (
                    <img
                      src={m.image}
                      alt={m.summary}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
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
                            {it.calories} kcal · 蛋{it.protein} / 碳{it.carbs} / 脂{it.fat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </Card>
            );
          })
        )}
      </section>
    </div>
  );
}

export default function FoodPage() {
  return (
    <Suspense fallback={null}>
      <FoodContent />
    </Suspense>
  );
}
