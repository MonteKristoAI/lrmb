import { useI18n } from "@/lib/i18n";

// v3.0 Wave 1 (2026-07-01): small pill showing today's operational tempo.
// Rule of thumb: arrivals + urgent_wo count -> tempo band.
//   <= 5  -> good  (green)
//   6-15  -> warn  (amber)
//   > 15  -> hot   (red)

interface TempoBadgeProps {
  arrivals: number;
  urgentWos: number;
}

export function TempoBadge({ arrivals, urgentWos }: TempoBadgeProps) {
  const { t } = useI18n();
  const load = arrivals + urgentWos;
  let label: string;
  let cls: string;
  if (load <= 5) {
    label = t("Good");
    cls = "bg-green-500/15 text-green-500 border-green-500/30";
  } else if (load <= 15) {
    label = t("Busy");
    cls = "bg-amber-500/15 text-amber-500 border-amber-500/30";
  } else {
    label = t("Hot");
    cls = "bg-red-500/15 text-red-500 border-red-500/30";
  }
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold ${cls}`}>
      {label}
    </span>
  );
}
