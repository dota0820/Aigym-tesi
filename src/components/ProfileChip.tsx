"use client";
import { useState } from "react";
import { useApp, useHydrated } from "@/lib/store";
import ProfileSheet from "./ProfileSheet";

/** Round avatar button (top-right), opens the profile switcher. */
export default function ProfileChip() {
  const { profile, lang } = useApp();
  const ready = useHydrated();
  const [open, setOpen] = useState(false);

  if (!ready) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={lang === "en" ? "Switch profile" : "切换人物"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-xl active:opacity-70"
      >
        {profile.avatar || "🙂"}
      </button>
      {open && <ProfileSheet onClose={() => setOpen(false)} />}
    </>
  );
}
