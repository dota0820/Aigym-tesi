import Link from "next/link";
import type { ReactNode } from "react";

/* ---------- Surfaces ---------- */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`rounded-2xl bg-card p-4 ${className}`}>{children}</div>;
}

export function H1({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <header className="mb-2 pt-2">
      <h1 className="text-[32px] leading-tight font-bold tracking-tight">{children}</h1>
      {sub && <p className="mt-1 text-[15px] text-sub">{sub}</p>}
    </header>
  );
}

/** Small grey caption above a grouped list, like iOS Settings. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-1.5 px-4 text-[13px] text-sub">{children}</h2>;
}

/* ---------- Buttons & inputs ---------- */

export const btn =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-3 text-[16px] font-semibold transition active:opacity-70 disabled:opacity-40";
export const btnPrimary = `${btn} bg-primary text-white`;
export const btnSoft = `${btn} bg-primary-soft text-primary`;
export const btnGhost = `${btn} bg-card text-primary`;
export const input =
  "w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-primary";

/* ---------- Grouped list ---------- */

export function List({ children }: { children: ReactNode }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl bg-card">{children}</div>
  );
}

export function Row({
  href,
  icon,
  title,
  value,
  sub,
}: {
  href: string;
  icon?: ReactNode;
  title: ReactNode;
  value?: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 active:bg-bg">
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
          {typeof icon === "string" ? <span className="text-lg">{icon}</span> : icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px]">{title}</span>
        {sub && <span className="block truncate text-[13px] text-sub">{sub}</span>}
      </span>
      {value && <span className="max-w-[45%] truncate text-[15px] text-sub">{value}</span>}
      <Chevron />
    </Link>
  );
}

export function Chevron() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" className="shrink-0 text-[#c7c7cc]" aria-hidden>
      <path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SubPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <header className="flex items-center gap-1">
        <Link
          href="/me"
          className="-ml-1 flex items-center gap-1 py-1 pr-2 text-[17px] text-primary"
          aria-label="返回我的"
        >
          <svg width="11" height="18" viewBox="0 0 11 18" aria-hidden>
            <path d="M9.5 1.5L2 9l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-[22px] font-bold tracking-tight">{title}</h1>
      </header>
      {children}
    </div>
  );
}

/* ---------- Line icons (SF Symbols-like) ---------- */

const ICONS = {
  home: "M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  chat: "M4 5h16v11H9l-5 4z",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm5 12l4.5 4.5",
  food: "M7 3v8m-3-8v5a3 3 0 0 0 6 0V3M7 11v10m10-18c-2 0-3 3-3 7h3v11",
  log: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0v16",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
  globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm-9 9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
  pencil: "M4 20h4L19 9l-4-4L4 16zm10-14l4 4",
  dumbbell: "M6 8v8m-3-6v4m15-6v8m3-6v4M6 12h12",
  gear: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm8 3l2-1-1-3-2 .2-1.3-1.5.4-2-2.8-1.4L14 4.5h-4L8.7 3.3 5.9 4.7l.4 2L5 8.2 3 8 2 11l2 1-2 1 1 3 2-.2 1.3 1.5-.4 2 2.8 1.4 1.3-1.2h4l1.3 1.2 2.8-1.4-.4-2 1.3-1.5 2 .2 1-3z",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 22,
  strokeWidth = 1.8,
  className = "",
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
