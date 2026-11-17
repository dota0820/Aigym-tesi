import { ATTACHMENTS, type AttachmentType } from "@/lib/exercise-extras";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Simple line drawings so the attachment can be recognised on the rack. */
function Icon({ type }: { type: AttachmentType }) {
  const hook = <path d="M40 4v6m-3 0h6" {...stroke} strokeWidth={2.5} />;
  return (
    <svg viewBox="0 0 80 48" className="h-12 w-20 shrink-0 text-ink" aria-hidden>
      {type === "lat-bar" && (
        <>
          {hook}
          <path d="M6 30l8-12h52l8 12" {...stroke} />
          <path d="M40 10v8" {...stroke} strokeWidth={2.5} />
          <path d="M6 30l3-4.5M74 30l-3-4.5" {...stroke} strokeWidth={6} />
        </>
      )}
      {type === "straight-bar" && (
        <>
          {hook}
          <path d="M40 10v12" {...stroke} strokeWidth={2.5} />
          <path d="M16 22h48" {...stroke} />
          <path d="M16 22h10M54 22h10" {...stroke} strokeWidth={6} />
        </>
      )}
      {type === "v-bar" && (
        <>
          {hook}
          <path d="M40 10L22 30M40 10l18 20" {...stroke} />
          <path d="M16 30v12M28 30v12M16 30h12M16 42h12" {...stroke} strokeWidth={2.5} />
          <path d="M52 30v12M64 30v12M52 30h12M52 42h12" {...stroke} strokeWidth={2.5} />
        </>
      )}
      {type === "rope" && (
        <>
          {hook}
          <path d="M40 10c-2 10-12 14-16 26M40 10c2 10 12 14 16 26" {...stroke} strokeWidth={4} />
          <circle cx="23" cy="40" r="5" fill="currentColor" />
          <circle cx="57" cy="40" r="5" fill="currentColor" />
        </>
      )}
      {type === "d-handle" && (
        <>
          {hook}
          <path d="M40 10L26 34M40 10l14 24" {...stroke} />
          <path d="M24 36h32" {...stroke} strokeWidth={7} />
        </>
      )}
      {type === "ankle-strap" && (
        <>
          <rect x="10" y="18" width="52" height="16" rx="5" {...stroke} />
          <path d="M22 18v16M30 18v16" {...stroke} strokeWidth={2} />
          <circle cx="70" cy="26" r="6" {...stroke} strokeWidth={2.5} />
        </>
      )}
    </svg>
  );
}

/** "Which handle do I clip on?" box for cable exercises. */
export default function AttachmentTip({
  attachment,
}: {
  attachment: { type: AttachmentType; grip: string };
}) {
  const a = ATTACHMENTS[attachment.type];
  return (
    <div className="rounded-2xl border border-line bg-bg p-3">
      <div className="text-xs font-semibold text-sub">用哪个手握(把手)</div>
      <div className="mt-2 flex items-center gap-3">
        <Icon type={attachment.type} />
        <div className="min-w-0">
          <div className="text-[17px] font-semibold leading-tight">{a.name}</div>
          <div className="text-xs text-sub">{a.nameEn}</div>
        </div>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed">
        <span className="font-semibold">长这样:</span>
        {a.looks}。
      </p>
      <p className="text-[15px] leading-relaxed">
        <span className="font-semibold">怎么握:</span>
        {attachment.grip}。
      </p>
      <p className="mt-1 text-xs text-sub">
        把手一般挂在器械旁边的架子上,用拉索末端的挂钩扣上去。找不到就问前台或教练。
      </p>
    </div>
  );
}
