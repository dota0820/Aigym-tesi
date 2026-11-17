"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import ImportExerciseModal from "@/components/ImportExerciseModal";
import { btnSoft, H1 } from "@/components/ui";
import {
  anySubLabel,
  exerciseThumbnail,
  isCustomExercise,
  listAllExercises,
  type ExtendedLibGroup,
} from "@/lib/exercise-lookup";
import { subsFor } from "@/lib/exercises";
import { useApp } from "@/lib/store";
import { GROUPS, MUSCLE_LABEL } from "@/lib/types";

const TABS: { id: ExtendedLibGroup; label: string; emoji: string }[] = [
  { id: "custom", label: "我的导入", emoji: "⭐" },
  { id: "shape", label: "女生塑形", emoji: "✨" },
  ...GROUPS,
];

function Library() {
  const params = useSearchParams();
  const router = useRouter();
  const { customExercises } = useApp();
  const [showImport, setShowImport] = useState(false);

  const g: ExtendedLibGroup = TABS.find((x) => x.id === params.get("g"))?.id ?? "back";
  const subs = g === "custom" ? [] : subsFor(g);
  const sub = subs.find((x) => x.id === params.get("s"))?.id ?? "";
  const go = (ng: ExtendedLibGroup, ns = "") =>
    router.replace(`/library?g=${ng}${ns ? `&s=${ns}` : ""}`, { scroll: false });
  const list = listAllExercises(g, sub, customExercises);

  return (
    <div>
      <H1>动作库</H1>

      <button
        type="button"
        onClick={() => setShowImport(true)}
        className={`${btnSoft} mb-3 w-full`}
      >
        从视频链接导入
      </button>

      <div className="-mx-4 mb-2 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.map((x) => (
          <button
            key={x.id}
            onClick={() => go(x.id)}
            aria-pressed={g === x.id}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
              g === x.id ? "bg-primary text-white" : "border border-line bg-card"
            }`}
          >
            {x.label}
            {x.id === "custom" && customExercises.length > 0 ? `(${customExercises.length})` : ""}
          </button>
        ))}
      </div>

      {subs.length > 0 && (
        <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
          {[{ id: "", label: "全部" }, ...subs].map((x) => (
            <button
              key={x.id}
              onClick={() => go(g, x.id)}
              aria-pressed={sub === x.id}
              className={`shrink-0 rounded-full px-3 py-1 text-[13px] font-semibold ${
                sub === x.id ? "bg-ink text-white" : "bg-primary-soft text-primary"
              }`}
            >
              {x.label}
            </button>
          ))}
        </div>
      )}

      {g === "shape" && (
        <p className="mb-3 rounded-2xl bg-card p-3 text-sm leading-relaxed text-sub">
          给想塑造身形的新手挑的入门动作:重点练臀腿、把背和肩练挺、收紧腰腹。重量从轻的开始,不会练成“大块头”。
        </p>
      )}

      {g === "custom" && list.length === 0 && (
        <div className="rounded-2xl bg-card p-5 text-center">
          <div className="text-2xl">🎬</div>
          <p className="mt-2 text-sm font-semibold">还没有导入过外部视频动作</p>
          <p className="mt-1 text-xs leading-relaxed text-sub">
            在小红书、Facebook 或 YouTube 看到喜欢的练臀/练背教学，点上方按钮把链接或分享文案贴进来，AI 会自动帮你整理成标准动作卡。
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {list.map((e) => {
          const thumb = exerciseThumbnail(e);
          const sLabel = anySubLabel(e, g);
          const custom = isCustomExercise(e);
          return (
            <li key={e.id}>
              <Link
                href={`/library/${e.id}`}
                className="flex items-center gap-3 rounded-2xl bg-card p-2 pr-3 active:scale-[0.99]"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-[68px] w-[102px] shrink-0 rounded-xl bg-[#141418] object-cover"
                  />
                ) : (
                  <div className="flex h-[68px] w-[102px] shrink-0 items-center justify-center rounded-xl bg-primary-soft text-2xl">
                    🎬
                  </div>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{e.name}</span>
                  <span className="block truncate text-xs text-sub">
                    {e.nameEn || e.equipment}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {custom && (
                      <span className="rounded-full bg-mint-soft px-2 py-0.5 text-[11px] font-semibold text-mint">
                        {e.sourcePlatform ? e.sourcePlatform : "自定义"}
                      </span>
                    )}
                    {sLabel && (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {sLabel}
                      </span>
                    )}
                    {e.primary[0] && (
                      <span className="rounded-full bg-bg px-2 py-0.5 text-[11px] text-sub">
                        {MUSCLE_LABEL[e.primary[0]].split("(")[0]}
                      </span>
                    )}
                  </span>
                </span>
                <span className="text-sub">›</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-center text-[11px] text-sub">
        内置示范照片来自公共领域的 free-exercise-db 开源动作库
      </p>

      {showImport && (
        <ImportExerciseModal
          onClose={() => setShowImport(false)}
          onSaved={(ex) => {
            setShowImport(false);
            router.push(`/library/${ex.id}`);
          }}
        />
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense>
      <Library />
    </Suspense>
  );
}
