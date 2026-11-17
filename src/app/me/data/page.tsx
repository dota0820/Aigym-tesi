"use client";
import { useRef } from "react";
import { btnGhost, Card, input, SubPage } from "@/components/ui";
import {
  exportRootBackup,
  importRootBackup,
  setState,
  useApp,
  useHydrated,
} from "@/lib/store";

export default function MeDataPage() {
  const { profile, profiles, workouts, meals, customExercises } = useApp();
  const ready = useHydrated();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!ready) return null;

  function exportData() {
    const blob = new Blob([JSON.stringify(exportRootBackup(), null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `健身记录-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importData(file: File) {
    try {
      const data = JSON.parse(await file.text());
      const previewProfiles = Array.isArray(data?.profiles)
        ? data.profiles.length
        : data?.profile
          ? 1
          : 0;
      const previewWorkouts = Array.isArray(data?.profiles)
        ? data.profiles.reduce(
            (n: number, ws: { workouts?: unknown[] }) =>
              n + (Array.isArray(ws?.workouts) ? ws.workouts.length : 0),
            0,
          )
        : Array.isArray(data?.workouts)
          ? data.workouts.length
          : -1;
      if (previewProfiles === 0 || previewWorkouts < 0) throw new Error("bad");
      if (
        !confirm(
          `导入会覆盖现在的数据（备份里有 ${previewProfiles} 个人物档案、共 ${previewWorkouts} 次训练）。继续吗？`,
        )
      ) {
        return;
      }
      const res = importRootBackup(data);
      if (!res) throw new Error("bad");
      alert(`导入成功（已恢复 ${res.profilesCount} 个人物档案）`);
    } catch {
      alert("这个文件不是有效的备份文件。");
    }
  }

  return (
    <SubPage title="口令与备份">
      <Card className="space-y-3">
        <div className="text-sm font-semibold">访问口令</div>
        <p className="text-sm text-sub">
          如果部署时设置了口令，在这里填一次，AI 教练和营养师才能用。
        </p>
        <input
          className={input}
          type="password"
          placeholder="没有设置就留空"
          value={profile.passcode}
          onChange={(e) =>
            setState((s) => ({ ...s, profile: { ...s.profile, passcode: e.target.value } }))
          }
        />
        {profile.passcode.trim().startsWith("sk-or-") && (
          <p className="rounded-xl bg-mint-soft px-3 py-2 text-xs text-mint">
            检测到你填入的是 OpenRouter API Key，已自动为你启用 AI 功能！（也可在「我的 → AI 模型」查看）
          </p>
        )}
      </Card>

      <Card className="space-y-2.5">
        <div className="text-sm font-semibold">数据备份</div>
        <p className="text-sm text-sub">
          当前共有 {profiles.length} 个人物档案（当前人物：{workouts.length} 次训练 · {meals.length} 条饮食 · 共享 {customExercises.length} 个自导入动作），数据只保存在这台设备的浏览器里。换手机或清理浏览器数据前，记得先导出备份。
        </p>
        <div className="flex gap-2">
          <button type="button" className={`${btnGhost} flex-1`} onClick={exportData}>
            导出备份
          </button>
          <button
            type="button"
            className={`${btnGhost} flex-1`}
            onClick={() => fileRef.current?.click()}
          >
            导入备份
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importData(f);
            e.target.value = "";
          }}
        />
      </Card>
    </SubPage>
  );
}
