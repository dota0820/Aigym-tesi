"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";

const TABS = [
  { href: "/", zh: "今天", en: "Today", icon: "🏠" },
  { href: "/detective", zh: "侦探", en: "Detective", icon: "🕵️" },
  { href: "/coach", zh: "教练", en: "Coach", icon: "💬" },
  { href: "/food", zh: "饮食", en: "Food", icon: "🥗" },
  { href: "/history", zh: "记录", en: "Log", icon: "📒" },
  { href: "/library", zh: "动作", en: "Library", icon: "📖" },
  { href: "/me", zh: "我的", en: "Me", icon: "🙂" },
];

export default function TabBar() {
  const path = usePathname();
  const { lang } = useApp();
  if (path.startsWith("/workout")) return null;
  return (
    <nav className="safe-b fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href} className="min-w-0 flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-0.5 py-2 text-[10px] leading-tight ${
                  on ? "font-semibold text-primary" : "text-sub"
                }`}
              >
                <span className={`text-[17px] ${on ? "" : "opacity-60 grayscale"}`}>
                  {t.icon}
                </span>
                <span className="truncate">{lang === "en" ? t.en : t.zh}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
