"use client";
import Link from "next/link";
import { useState } from "react";
import { EX_BY_ID } from "@/lib/exercises";
import {
  KNOWLEDGE_ARTICLES,
  KNOWLEDGE_CATEGORIES,
  type KnowledgeCategory,
} from "@/lib/knowledge";

export default function KnowledgeView() {
  const [cat, setCat] = useState<KnowledgeCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(KNOWLEDGE_ARTICLES[0]?.id ?? null);

  const list =
    cat === "all"
      ? KNOWLEDGE_ARTICLES
      : KNOWLEDGE_ARTICLES.filter((a) => a.category === cat);

  return (
    <div className="space-y-3">
      {/* Category filter pills */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {KNOWLEDGE_CATEGORIES.map((c) => {
          const count =
            c.id === "all"
              ? KNOWLEDGE_ARTICLES.length
              : KNOWLEDGE_ARTICLES.filter((a) => a.category === c.id).length;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCat(c.id)}
              aria-pressed={active}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                active ? "bg-ink text-white" : "border border-line bg-card text-ink"
              }`}
            >
              {c.emoji} {c.label} ({count})
            </button>
          );
        })}
      </div>

      <p className="rounded-2xl bg-card px-3.5 py-2.5 text-xs leading-relaxed text-sub">
        练背手臂酸、练胸肩膀累、练臀大腿粗？点开卡片看「一句话真相 + 30 秒立即可试的改法」，组间休息就能对照调整。
      </p>

      {/* Accordion article cards */}
      <ul className="space-y-2.5">
        {list.map((article) => {
          const isOpen = openId === article.id;
          const related = (article.relatedExerciseIds ?? [])
            .map((id) => EX_BY_ID[id])
            .filter((e): e is NonNullable<typeof e> => Boolean(e));

          return (
            <li
              key={article.id}
              className="overflow-hidden rounded-2xl border border-line bg-card transition"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : article.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-3 p-3.5 text-left active:bg-bg/60"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-xl">
                  {article.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary">
                      {article.tag}
                    </span>
                  </div>
                  <h2 className="text-[15px] font-bold leading-snug text-ink">
                    {article.title}
                  </h2>
                  {!isOpen && (
                    <p className="mt-1 line-clamp-1 text-xs text-sub">
                      💡 {article.tldr}
                    </p>
                  )}
                </div>
                <span
                  className={`mt-1 shrink-0 text-sm text-sub transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t border-line/70 px-3.5 pb-4 pt-3">
                  {/* TL;DR */}
                  <div className="rounded-xl bg-primary-soft px-3 py-2.5 text-[14px] font-semibold leading-relaxed text-ink">
                    <span className="mr-1 text-primary">💡 一句话真相：</span>
                    {article.tldr}
                  </div>

                  {/* Reasons */}
                  <div>
                    <div className="mb-1.5 text-xs font-bold tracking-wide text-sub">
                      为什么会这样？
                    </div>
                    <ul className="space-y-1.5">
                      {article.reasons.map((r, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-[14px] leading-relaxed text-ink"
                        >
                          <span className="mt-0.5 shrink-0 font-bold text-primary">
                            {idx + 1}.
                          </span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actionable fixes */}
                  <div className="rounded-xl bg-mint-soft/75 p-3">
                    <div className="mb-1.5 text-xs font-bold tracking-wide text-mint">
                      ✅ 下次去健身房马上试这几招
                    </div>
                    <ul className="space-y-1.5">
                      {article.fixes.map((f, idx) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-[14px] leading-relaxed text-ink"
                        >
                          <span className="mt-0.5 shrink-0 font-bold text-mint">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related exercises */}
                  {related.length > 0 && (
                    <div>
                      <div className="mb-1.5 text-xs font-bold text-sub">
                        相关动作示范（点开看细节）
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {related.map((ex) => (
                          <Link
                            key={ex.id}
                            href={`/library/${ex.id}`}
                            className="rounded-full border border-line bg-bg px-3 py-1 text-xs font-semibold text-ink active:scale-[0.98]"
                          >
                            {ex.name} ›
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA to Detective or Coach */}
                  {article.actionHref && article.actionLabel && (
                    <Link
                      href={article.actionHref}
                      className="block rounded-xl border border-primary/25 bg-primary-soft/60 px-3 py-2 text-center text-xs font-bold text-primary active:scale-[0.99]"
                    >
                      {article.actionLabel}
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
