"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import { Icon, type IconName } from "./ui";

const TABS: { href: string; zh: string; en: string; icon: IconName; also?: string[] }[] = [
  { href: "/", zh: "今天", en: "Today", icon: "home", also: ["/library", "/detective"] },
  { href: "/coach", zh: "教练", en: "Coach", icon: "chat" },
  { href: "/food", zh: "饮食", en: "Food", icon: "food" },
  { href: "/history", zh: "记录", en: "Log", icon: "log" },
  { href: "/me", zh: "我的", en: "Me", icon: "person" },
];

export default function TabBar() {
  const path = usePathname();
  const { lang } = useApp();
  if (path.startsWith("/workout")) return null;
  return (
    <nav className="safe-b fixed inset-x-0 bottom-0 z-20 border-t border-line/80 bg-white/85 backdrop-blur-xl">
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on =
            t.href === "/"
              ? path === "/" || !!t.also?.some((p) => path.startsWith(p))
              : path.startsWith(t.href);
          return (
            <li key={t.href} className="min-w-0 flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[10px] font-medium ${
                  on ? "text-primary" : "text-[#999]"
                }`}
              >
                <Icon name={t.icon} size={24} strokeWidth={on ? 2.1 : 1.7} />
                <span className="truncate">{lang === "en" ? t.en : t.zh}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
