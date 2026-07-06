import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { safeDistance } from "@/lib/utils";
import { useAyaInsight, type AyaInsight } from "@/hooks/useAyaInsight";

// Aya brief: the operational-awareness narrative at the top of the leadership
// views. "What needs attention today and why", so an operator decides in
// seconds instead of reading tiles. Renders nothing until Aya has produced its
// first insight (so the page is unchanged until the layer is live).

// Same guard the ExceptionFeed uses: never navigate to an off-origin URL.
function isSafeInternalPath(link: string | undefined): link is string {
  return !!link && link.startsWith("/") && !link.startsWith("//");
}

function severityDot(sev?: string) {
  if (sev === "P1") return "bg-red-400";
  if (sev === "P2") return "bg-amber-400";
  return "bg-muted-foreground";
}

export function AyaBrief({
  scope,
  propertyId,
  compact = false,
}: {
  scope: "platform" | "property" | "housekeeping" | "maintenance";
  propertyId?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: insight, isLoading } = useAyaInsight(scope, propertyId) as { data: AyaInsight | null | undefined; isLoading: boolean };

  // Invisible until Aya is live. No skeleton clutter on first paint.
  if (isLoading || !insight) return null;

  return (
    <Card className="border-l-4" style={{ borderLeftColor: "#c9a84c" }}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: "#c9a84c" }} aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#c9a84c" }}>
            {t("Aya")}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
            {t("updated")} {safeDistance(insight.generated_at)}
          </span>
        </div>

        <p className={`font-semibold text-foreground ${compact ? "text-sm" : "text-base"} leading-snug`}>
          {insight.headline}
        </p>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{insight.narrative}</p>

        {insight.bullets.length > 0 && (
          <ul className="mt-3 space-y-2">
            {insight.bullets.map((b, i) => {
              const clickable = isSafeInternalPath(b.entity_link);
              const inner = (
                <span className="flex items-start gap-2">
                  <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${severityDot(b.severity)}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
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
              return clickable ? (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => navigate(b.entity_link!)}
                    className="w-full text-left rounded-md px-1.5 py-1.5 -mx-1.5 hover:bg-secondary/50 transition-colors"
                    aria-label={`${b.text}. ${b.action ?? ""}`}
                  >
                    {inner}
                  </button>
                </li>
              ) : (
                <li key={i} className="px-1.5 py-1.5">{inner}</li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
