"use client";
import { useState } from "react";
import { getProfileGyms } from "@/lib/equipment";
import { setLang, useApp, useHydrated } from "@/lib/store";
import ProfileSheet from "./ProfileSheet";

export default function ProfileChip() {
  const { profile, lang } = useApp();
  const ready = useHydrated();
  const [open, setOpen] = useState(false);

  if (!ready) return null;

  const { activeGym } = getProfileGyms(profile);

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-w-0 max-w-full items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink active:bg-bg"
      >
        <span>{profile.avatar || "🙂"}</span>
        <span className="truncate">{profile.name || (lang === "en" ? "Default" : "默认人物")}</span>
        <span className="text-sub">·</span>
        <span className="truncate text-sub">{activeGym.name}</span>
        <span className="text-sub">▾</span>
      </button>

      <button
        type="button"
        onClick={() => setLang(lang === "zh" ? "en" : "zh")}
        aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
        className="shrink-0 rounded-full border border-line bg-card px-2.5 py-1.5 text-[11px] font-bold text-ink active:bg-bg"
      >
        {lang === "zh" ? "🌐 EN" : "🌐 中文"}
      </button>

      {open && <ProfileSheet onClose={() => setOpen(false)} />}
    </div>
  );
}
