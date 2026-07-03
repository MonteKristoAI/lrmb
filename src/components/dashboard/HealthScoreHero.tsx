import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface HealthComponents {
  overdue_ratio?: number;
  blocked_ratio?: number;
  on_time_rate?: number;
  verify_health?: number;
  photo_rate?: number;
  vendor_avg?: number;
  open_count?: number;
  overdue_count?: number;
}

interface HistoryPoint {
  captured_at: string;
  score: number;
  band: string;
}

interface HealthScoreHeroProps {
  score: number;
  band: "healthy" | "watch" | "at_risk" | string;
  components?: HealthComponents;
  history?: HistoryPoint[];
}

// v3.0 Wave 2 (2026-07-01): SVG gauge (custom, no library) + sparkline.
// Band colors: green (healthy >=85), amber (watch 70-84), red (at_risk <70).
export function HealthScoreHero({ score, band, components, history = [] }: HealthScoreHeroProps) {
  const { t } = useI18n();

  // Cold-start guard: on fresh boot before the first snapshot lands the RPC
  // returns null/NaN score with no band and no components. Rendering the
  // red "At Risk" gauge in that state would be a false alarm, so show a
  // neutral gray "computing" card instead. Matches the sparkline's existing
  // "Building history…" fallback.
  const isBooting =
    (!Number.isFinite(score) || score === null) &&
    !components &&
    history.length === 0;
  if (isBooting) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="h-[120px] flex items-center justify-center text-xs text-muted-foreground">
            {t("No data yet. Health score computing.")}
          </div>
        </CardContent>
      </Card>
    );
  }

  const color =
    band === "healthy" ? "#10b981" : band === "watch" ? "#f59e0b" : "#ef4444";
  const bandLabel =
    band === "healthy" ? t("Healthy") : band === "watch" ? t("Watch") : t("At Risk");

  // Arc geometry
  const radius = 90;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const halfArc = circumference / 2;
  // L10 fix: guard NaN if partial RPC bundle returns null score. NaN in
  // strokeDasharray would render nothing and log an SVG attribute error.
  const safeScore = Number.isFinite(score) ? (score as number) : 0;
  const progress = Math.max(0, Math.min(100, safeScore));
  const dashArray = `${(progress / 100) * halfArc} ${circumference}`;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Gauge */}
          <div className="flex items-center gap-5">
            <svg width="200" height="120" viewBox="0 0 200 120" className="shrink-0">
              <path
                d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
                fill="none"
                stroke="#2a2f38"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              <path
                d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={dashArray}
                strokeDashoffset={0}
                style={{ transition: "stroke-dasharray 0.6s ease" }}
              />
              <text
                x="100" y="90" textAnchor="middle"
                fill="#c4bab1" fontSize="42" fontWeight="700"
              >
                {Number.isFinite(score) ? score : "-"}
              </text>
              <text
                x="100" y="112" textAnchor="middle"
                fill="#7a7570" fontSize="10" letterSpacing="2"
                fontWeight="600"
              >
                {t("HEALTH")}
              </text>
            </svg>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("Operational Health")}</p>
              <p className="text-2xl font-bold" style={{ color }}>{bandLabel}</p>
              {components && (
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p>{components.overdue_count ?? 0} {t("overdue")} · {components.open_count ?? 0} {t("open")}</p>
                  <p>{Math.round((components.on_time_rate ?? 0) * 100)}% {t("on-time (30d)")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sparkline */}
          <div className="h-[120px] w-full min-w-0">
            {history.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="captured_at" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip
                    contentStyle={{ background: "#0b1220", border: "1px solid #1e2a3a", fontSize: "11px" }}
                    labelFormatter={(v) => new Date(v as string).toLocaleTimeString()}
                    formatter={(v: number) => [`${v}`, t("Score")]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                {t("Building history…")}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground text-right mt-1">
              {history.length > 0
                ? `${history.length} ${t("snapshots (last 24h)")}`
                : ""}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
