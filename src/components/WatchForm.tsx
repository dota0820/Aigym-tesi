"use client";
import { useRef, useState } from "react";
import { fileToJpegDataUrl } from "@/lib/actions";
import { aiHeaders } from "@/lib/store";
import type { WatchData } from "@/lib/types";
import { btnSoft, input } from "./ui";

const FIELDS: { key: keyof Omit<WatchData, "source">; label: string; unit: string }[] = [
  { key: "durationMin", label: "时长", unit: "分钟" },
  { key: "calories", label: "消耗", unit: "千卡" },
  { key: "avgHr", label: "平均心率", unit: "bpm" },
  { key: "maxHr", label: "最高心率", unit: "bpm" },
];

export default function WatchForm({
  value,
  onChange,
}: {
  value: WatchData;
  onChange: (w: WatchData) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onFile(file: File) {
    setBusy(true);
    setMsg("");
    try {
      const image = await fileToJpegDataUrl(file);
      const res = await fetch("/api/watch", {
        method: "POST",
        headers: aiHeaders(),
        body: JSON.stringify({ image }),
      });
      const j = await res.json();
      if (!res.ok) {
        setMsg(j.error ?? "识别失败,请手动填写。");
        return;
      }
      if (!j.is_workout_summary) {
        setMsg("这张图看起来不是运动记录截图,请换一张或手动填写。");
        return;
      }
      onChange({
        durationMin: j.duration_min ?? value.durationMin,
        calories: j.calories ?? value.calories,
        avgHr: j.avg_hr ?? value.avgHr,
        maxHr: j.max_hr ?? value.maxHr,
        source: "screenshot",
      });
      setMsg("已从截图读取,请核对一下数字。");
    } catch {
      setMsg("识别失败,请手动填写。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-xs text-sub">
              {f.label}({f.unit})
            </span>
            <input
              className={input}
              inputMode="numeric"
              value={value[f.key] ?? ""}
              onChange={(e) => {
                const n = e.target.value === "" ? null : Number(e.target.value);
                if (n !== null && isNaN(n)) return;
                onChange({ ...value, [f.key]: n });
              }}
            />
          </label>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onFile(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        className={`${btnSoft} mt-2 w-full`}
        disabled={busy}
        onClick={() => fileRef.current?.click()}
      >
        {busy ? "正在识别截图…" : "⌚ 上传手表 / 运动健康截图,自动填写"}
      </button>
      {msg && <p className="mt-1 text-xs text-sub">{msg}</p>}
    </div>
  );
}
