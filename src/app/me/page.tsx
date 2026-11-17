"use client";
import { useState } from "react";
import ProfileSheet from "@/components/ProfileSheet";
import { Chevron, H1, Icon, List, Row } from "@/components/ui";
import { getProfileGyms, parseEquipmentList } from "@/lib/equipment";
import { AI_MODELS } from "@/lib/models";
import { computeNutritionTargets } from "@/lib/nutrition";
import { setLang, useApp, useHydrated } from "@/lib/store";

export default function Me() {
  const { profile, aiModel, lang } = useApp();
  const isEn = lang === "en";
  const ready = useHydrated();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!ready) return null;

  const { activeGym } = getProfileGyms(profile);
  const gymCount = parseEquipmentList(activeGym.equipment).length;
  const targets = computeNutritionTargets(profile);
  const modelLabel =
    AI_MODELS.find((m) => m.id === aiModel)?.label ?? (aiModel || (isEn ? "Default" : "服务器默认"));

  const meta = [
    profile.heightCm ? `${profile.heightCm}cm` : "",
    profile.weightKg ? `${profile.weightKg}kg` : "",
    profile.goal || "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <H1>{isEn ? "Me" : "我的"}</H1>

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left active:bg-bg"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bg text-3xl">
          {profile.avatar || "🙂"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[20px] font-semibold">
            {profile.name || (isEn ? "Default" : "默认人物")}
          </div>
          <div className="truncate text-[13px] text-sub">
            {meta || (isEn ? "Tap to switch profile" : "点击切换人物")}
          </div>
        </div>
        <Chevron />
      </button>

      <List>
        <Row
          href="/me/profile"
          icon={<Icon name="person" />}
          title={isEn ? "Body & goal" : "身体与目标"}
          value={`${targets.calories} kcal`}
        />
        <Row
          href="/me/gym"
          icon={<Icon name="dumbbell" />}
          title={isEn ? "My gym" : "我的健身房"}
          value={`${activeGym.name} · ${gymCount}`}
        />
        <Row
          href="/me/profile#memory"
          icon={<Icon name="pencil" />}
          title={isEn ? "Coach memory" : "教练记住的事"}
          value={`${profile.memory.length}`}
        />
      </List>

      <List>
        <button
          type="button"
          onClick={() => setLang(isEn ? "zh" : "en")}
          className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-bg"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
            <Icon name="globe" />
          </span>
          <span className="flex-1 text-[16px]">{isEn ? "Language" : "语言"}</span>
          <span className="text-[15px] text-sub">{isEn ? "English" : "中文"}</span>
          <Chevron />
        </button>
        <Row href="/me/ai" icon={<Icon name="chat" />} title={isEn ? "AI model" : "AI 模型"} value={modelLabel} />
        <Row href="/me/data" icon={<Icon name="gear" />} title={isEn ? "Passcode & backup" : "口令与备份"} />
      </List>

      {sheetOpen && <ProfileSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}
