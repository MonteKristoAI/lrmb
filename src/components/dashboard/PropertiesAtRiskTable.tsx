import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { Star, AlertTriangle, ChevronRight } from "lucide-react";

interface PropertyAtRiskRow {
  property_id: string;
  property_name: string;
  health_score: number;
  health_band: string;
  risk_band: "critical" | "at_risk" | "watch" | "healthy" | string;
  arrivals_next_24h: number;
  vip_arrivals_next_48h: number;
  overdue_wo_count: number;
  blocked_wo_count?: number;
  top_arrivals?: Array<{ unit_code?: string; guest_name?: string; is_vip?: boolean; arrival_date?: string }>;
}

interface PropertiesAtRiskTableProps {
  rows: PropertyAtRiskRow[];
}

// v3.0 Wave 2 (2026-07-01): sortable risk-ranked table on the Command Center.
// Row click routes to /admin/properties/:id.
export function PropertiesAtRiskTable({ rows }: PropertiesAtRiskTableProps) {
  const { t } = useI18n();
  const navigate = useNavigate();

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          {t("No properties at risk right now.")}
        </CardContent>
      </Card>
    );
  }

  const bandColor = (b: string) =>
    b === "critical"
      ? "bg-red-500/20 text-red-500 border-red-500/40"
      : b === "at_risk"
        ? "bg-orange-500/15 text-orange-500 border-orange-500/30"
        : b === "watch"
          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
          : "bg-green-500/15 text-green-500 border-green-500/30";

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {rows.map((r) => (
            <button
              key={r.property_id}
              onClick={() => navigate(`/admin/properties/${r.property_id}`)}
              className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-foreground truncate min-w-0">{r.property_name}</p>
                  <Badge variant="outline" className={`text-[10px] uppercase tracking-wider shrink-0 ${bandColor(r.risk_band)}`}>
                    {r.risk_band === "critical" ? t("Critical") : r.risk_band === "at_risk" ? t("At Risk") : r.risk_band === "watch" ? t("Watch") : t("Healthy")}
                  </Badge>
                  {r.vip_arrivals_next_48h > 0 && (
                    <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 shrink-0">
                      <Star className="h-2.5 w-2.5 mr-1" />
                      {r.vip_arrivals_next_48h} {t("VIP")}
                    </Badge>
                  )}
                </div>
                {/* flex-wrap + gap-x-3 gap-y-0.5 keeps each metric as an
                    unbreakable pill on narrow viewports (whitespace-nowrap on
                    each span). At 320px the three metrics wrap to a second
                    line as complete units instead of mid-span line breaks like
                    "7 arriving / 24h" and "568 / overdue". */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                  <span className="whitespace-nowrap">
                    {t("Health")}: <span className="font-semibold text-foreground">{r.health_score}</span>
                  </span>
                  <span className="whitespace-nowrap">
                    {r.arrivals_next_24h} {t("arriving 24h")}
                  </span>
                  {r.overdue_wo_count > 0 && (
                    <span className="text-destructive flex items-center gap-1 whitespace-nowrap">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      {r.overdue_wo_count} {t("overdue")}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
