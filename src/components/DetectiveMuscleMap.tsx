"use client";
import Model, { type IExerciseData, type IMuscleStats } from "react-body-highlighter";
import { muscleLabel } from "@/lib/i18n";
import type { Lang, Muscle } from "@/lib/types";

const SECONDARY_COLOR = "#a7e6d7";
const PRIMARY_COLOR = "#2fa98c";
const COMPENSATED_COLOR = "#e8615a";

/**
 * Interactive body diagram comparing expected primary/secondary target muscles
 * against reported or compensating muscle areas.
 */
export default function DetectiveMuscleMap({
  primary = [],
  secondary = [],
  compensated = [],
  lang = "zh",
  onSelectMuscle,
}: {
  primary?: Muscle[];
  secondary?: Muscle[];
  compensated?: Muscle[];
  lang?: Lang;
  onSelectMuscle?: (muscle: Muscle) => void;
}) {
  const compSet = new Set(compensated);
  const primSet = new Set(primary);

  const compOnly = Array.from(compSet);
  const primOnly = primary.filter((m) => !compSet.has(m));
  const secOnly = secondary.filter((m) => !compSet.has(m) && !primSet.has(m));

  const data: IExerciseData[] = [
    ...(secOnly.length ? [{ name: "secondary", muscles: secOnly, frequency: 1 }] : []),
    ...(primOnly.length ? [{ name: "primary", muscles: primOnly, frequency: 2 }] : []),
    ...(compOnly.length ? [{ name: "compensated", muscles: compOnly, frequency: 3 }] : []),
  ];

  const handleClick = (stats: IMuscleStats) => {
    if (onSelectMuscle && stats?.muscle) {
      onSelectMuscle(stats.muscle as Muscle);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {(["anterior", "posterior"] as const).map((type) => (
          <div key={type} className="text-center">
            <Model
              type={type}
              data={data}
              bodyColor="#e6dfd8"
              highlightedColors={[SECONDARY_COLOR, PRIMARY_COLOR, COMPENSATED_COLOR]}
              style={{ width: "100%", maxWidth: 144, margin: "0 auto", padding: 0 }}
              svgStyle={onSelectMuscle ? undefined : { pointerEvents: "none" }}
              onClick={onSelectMuscle ? handleClick : undefined}
            />
            <div className="mt-1 text-[11px] text-sub">
              {type === "anterior"
                ? lang === "en"
                  ? "Front"
                  : "正面"
                : lang === "en"
                  ? "Back"
                  : "背面"}
            </div>
          </div>
        ))}
      </div>

      <dl className="mt-3 space-y-1.5 text-xs">
        {primary.length > 0 && (
          <div className="flex gap-2">
            <dt className="flex shrink-0 items-center gap-1.5 font-semibold text-mint">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: PRIMARY_COLOR }} />
              {lang === "en" ? "Primary target" : "主要目标"}
            </dt>
            <dd className="text-ink">{primary.map((m) => muscleLabel(m, lang)).join(" · ")}</dd>
          </div>
        )}
        {secondary.length > 0 && (
          <div className="flex gap-2">
            <dt className="flex shrink-0 items-center gap-1.5 font-semibold text-ink/70">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: SECONDARY_COLOR }} />
              {lang === "en" ? "Assisting" : "正常辅助"}
            </dt>
            <dd className="text-sub">{secondary.map((m) => muscleLabel(m, lang)).join(" · ")}</dd>
          </div>
        )}
        {compensated.length > 0 && (
          <div className="flex gap-2">
            <dt className="flex shrink-0 items-center gap-1.5 font-semibold text-primary">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COMPENSATED_COLOR }} />
              {lang === "en" ? "Felt / Compensating" : "发酸 / 疑似代偿"}
            </dt>
            <dd className="font-medium text-primary">
              {compensated.map((m) => muscleLabel(m, lang)).join(" · ")}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
