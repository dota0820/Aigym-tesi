"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import {
  anySubLabel,
  exerciseThumbnail,
  isCustomExercise,
  listAllExercises,
  type ExtendedLibGroup,
} from "@/lib/exercise-lookup";
import { useApp } from "@/lib/store";
import { GROUPS } from "@/lib/types";
import ImportExerciseModal from "./ImportExerciseModal";
import { btnSoft, input } from "./ui";

export default function ExercisePicker({
  onPick,
  onClose,
}: {
  onPick: (e: { exerciseId?: string; name: string; nameEn?: string }) => void;
  onClose: () => void;
}) {
  const { customExercises } = useApp();
  const [g, setG] = useState<ExtendedLibGroup>(customExercises.length > 0 ? "custom" : "back");
  const [custom, setCustom] = useState("");
  const [showImport, setShowImport] = useState(false);

  const tabs: { id: ExtendedLibGroup; label: string }[] = [
    ...(customExercises.length > 0 ? [{ id: "custom" as const, label: `我的(${customExercises.length})` }] : []),
    { id: "shape", label: "女生塑形" },
    ...GROUPS,
  ];
  const list = listAllExercises(g, "", customExercises);

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-end bg-black/40" onClick={onClose}>
        <div
          className="safe-b mx-auto max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-bg p-4"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="选择动作"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">添加动作</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
                onClick={() => setShowImport(true)}
              >
                从视频链接导入
              </button>
              <button className="text-sm text-sub" onClick={onClose}>
                关闭
              </button>
            </div>
          </div>

          <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
            {tabs.map((x) => (
              <button
                key={x.id}
                onClick={() => setG(x.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  g === x.id ? "bg-primary text-white" : "border border-line bg-card"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {list.map((e) => {
              const thumb = exerciseThumbnail(e);
              const sub = anySubLabel(e, g);
              return (
                <li key={e.id}>
                  <button
                    className="flex w-full items-center gap-3 rounded-xl border border-line bg-card p-2 pr-3 text-left active:scale-[0.99]"
                    onClick={() => onPick({ exerciseId: e.id, name: e.name, nameEn: e.nameEn })}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-[72px] w-[108px] shrink-0 rounded-lg bg-[#141418] object-cover"
                      />
                    ) : (
                      <div className="flex h-[72px] w-[108px] shrink-0 items-center justify-center rounded-lg bg-primary-soft text-2xl">
                        🎬
                      </div>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-semibold">{e.name}</span>
                      <span className="block truncate text-xs text-sub">
                        {e.nameEn}
                        {sub ? `${e.nameEn ? " · " : ""}${sub}` : ""}
                      </span>
                      {isCustomExercise(e) && (
                        <span className="mt-1 inline-block rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {e.sourcePlatform ? `来自 ${e.sourcePlatform}` : "自定义"}
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-semibold text-primary">+</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              className={input}
              placeholder="找不到?自己输入动作名"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <button
              className={btnSoft}
              disabled={!custom.trim()}
              onClick={() => onPick({ name: custom.trim() })}
            >
              添加
            </button>
          </div>
        </div>
      </div>

      {showImport && (
        <ImportExerciseModal
          onClose={() => setShowImport(false)}
          onSaved={(ex) => {
            setShowImport(false);
            onPick({ exerciseId: ex.id, name: ex.name, nameEn: ex.nameEn });
          }}
        />
      )}
    </>
  );
}
