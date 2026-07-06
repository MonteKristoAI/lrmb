import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { safeDistance } from "@/lib/utils";

// Presentational Aya card, shared by the admin/team brief (AyaBrief, fed by the
// aya_latest_insight RPC) and the per-user staff brief (MyAyaBrief, fed by the
// aya-my-brief edge fn). Same look, same clickable-bullet behavior; only the data
// source differs. Renders nothing until there is a brief.
export interface AyaBriefData {
  headline: string;
  narrative: string;
  bullets: Array<{ severity?: string; text: string; impact?: string; action?: string; entity_link?: string }>;
  generated_at?: string;
}

// Same guard the ExceptionFeed uses: never navigate off-origin. Rejects `//host`
// and the backslash tricks (`/\evil`, `/\\`) some routers normalize to `//`.
function isSafeInternalPath(link: string | undefined): link is string {
  return !!link && link.startsWith("/") && !link.startsWith("//") && !link.includes("\\");
}

function severityDot(sev?: string) {
  if (sev === "P1") return "bg-red-400";
  if (sev === "P2") return "bg-amber-400";
  if (sev === "P3") return "bg-sky-400";
  return "bg-muted-foreground";
}
function severityLabel(sev?: string) {
  if (sev === "P1") return "Priority 1";
  if (sev === "P2") return "Priority 2";
  if (sev === "P3") return "Priority 3";
  return "";
}

export function AyaBriefCard({ brief, compact = false }: { brief: AyaBriefData; compact?: boolean }) {
  const { t } = useI18n();
  const navigate = useNavigate();

  // Contract guard in one place: never render a headless card, whichever feed
  // regresses. The hooks also guard, but the card is the shared surface.
  if (!brief?.headline?.trim()) return null;
  const bullets = brief.bullets ?? [];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: "#c9a84c" }}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#c9a84c" }}>
            {t("Aya")}
          </span>
          {brief.generated_at && (
            <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
              {t("updated")} {safeDistance(brief.generated_at)}
            </span>
          )}
        </div>

        <p className={`font-semibold text-foreground ${compact ? "text-sm" : "text-base"} leading-snug`}>
          {brief.headline}
        </p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{brief.narrative}</p>

        {bullets.length > 0 && (
          <ul className="mt-3 space-y-2">
            {bullets.map((b, i) => {
              const clickable = isSafeInternalPath(b.entity_link);
              const sevLabel = severityLabel(b.severity);
              const inner = (
                <span className="flex items-start gap-2">
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${severityDot(b.severity)}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    {/* Severity by shape/color AND text, not color alone (WCAG 1.4.1). */}
                    {sevLabel && <span className="sr-only">{sevLabel}. </span>}
                    <span className="block text-sm font-medium text-foreground">{b.text}</span>
                    {b.impact && <span className="block text-xs text-muted-foreground mt-0.5">{b.impact}</span>}
                    {b.action && (
                      <span className="flex items-start gap-1 text-xs mt-1 font-medium" style={{ color: "#c9a84c" }}>
                        <ArrowRight className="h-3 w-3 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{b.action}</span>
                      </span>
                    )}
                  </span>
                </span>
              );
              // Accessible name carries the full visible content (impact included),
              // so a screen-reader user hears why it is urgent, not just the label.
              const label = [sevLabel, b.text, b.impact, b.action].filter(Boolean).join(". ");
              const key = b.entity_link ?? `${b.text}-${i}`;
              return clickable ? (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => navigate(b.entity_link!)}
                    className="w-full text-left rounded-md px-1.5 py-1.5 -mx-1.5 hover:bg-secondary/50 transition-colors"
                    aria-label={label}
                  >
                    {inner}
                  </button>
                </li>
              ) : (
                <li key={key} className="px-1.5 py-1.5">{inner}</li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
