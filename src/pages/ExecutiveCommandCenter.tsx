import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { HealthScoreHero } from "@/components/dashboard/HealthScoreHero";
import { PropertiesAtRiskTable } from "@/components/dashboard/PropertiesAtRiskTable";
import { ExceptionFeed } from "@/components/dashboard/ExceptionFeed";
import {
  DollarSign, Building, Star, Repeat, Sparkles, Wrench, TrendingUp, TrendingDown,
} from "lucide-react";

// v3.0 Wave 2 (2026-07-01): Executive Command Center at /command-center.
// One round-trip via exec_command_center_bundle. Refresh 30s.
interface CommandCenterBundle {
  health: {
    score: number;
    band: string;
    components: Record<string, number>;
    computed_at: string;
  };
  revenue_today: number;
  properties_at_risk_count: number;
  properties_at_risk_top10: Array<{
    property_id: string; property_name: string; health_score: number; health_band: string;
    risk_band: string; arrivals_next_24h: number; vip_arrivals_next_48h: number; overdue_wo_count: number;
    blocked_wo_count?: number; top_arrivals?: Array<{ unit_code?: string; guest_name?: string; is_vip?: boolean }>;
  }>;
  vip_arrivals_today_count: number;
  vip_arrivals_today: Array<{ unit_id?: number; unit_code?: string; guest_name?: string; arrival_time?: string; is_vip?: boolean }>;
  vip_arrivals_tomorrow: Array<{ unit_id?: number; unit_code?: string; guest_name?: string; arrival_time?: string; is_vip?: boolean }>;
  turnovers_remaining: number;
  housekeeping_completion_pct: number;
  housekeeping_completion_n?: number;
  maintenance_sla_pct: number;
  maintenance_sla_n?: number;
  vendor_top3: Array<{ vendor_id: string; vendor_name: string; score: number; on_time_pct: number; task_count: number }>;
  vendor_bottom3: Array<{ vendor_id: string; vendor_name: string; score: number; no_show_pct?: number; task_count: number }>;
  computed_at: string;
}

interface HealthHistoryPoint {
  captured_at: string;
  score: number;
  band: string;
}

const ExecutiveCommandCenter = () => {
  const { t } = useI18n();

  const { data: bundle, isLoading } = useQuery({
    queryKey: ["exec_command_center_bundle"],
    queryFn: async (): Promise<CommandCenterBundle> => {
      const { data, error } = await supabase.rpc("exec_command_center_bundle");
      if (error) throw error;
      return (data ?? {}) as unknown as CommandCenterBundle;
    },
    refetchInterval: 30_000,
    staleTime: 20_000,
    refetchOnWindowFocus: true,
  });

  const { data: history = [] } = useQuery({
    queryKey: ["health_score_history_24h"],
    queryFn: async (): Promise<HealthHistoryPoint[]> => {
      const { data, error } = await supabase.rpc("health_score_history", { p_hours: 24 });
      if (error) throw error;
      return (data ?? []) as HealthHistoryPoint[];
    },
    refetchInterval: 5 * 60_000,
    staleTime: 4 * 60_000,
  });

  // v3.0 Wave 3: live exception feed. Polls every 15s.
  const { data: exceptions = [], isLoading: exceptionsLoading } = useQuery({
    queryKey: ["exception_feed"],
    queryFn: async (): Promise<Array<{ severity: string; title: string; subtitle?: string; entity_type: string; entity_id: string; entity_link?: string; dedupe_key: string; created_at: string }>> => {
      const { data, error } = await supabase.rpc("exception_feed", { p_limit: 50 });
      if (error) throw error;
      return (data ?? []) as Array<{ severity: string; title: string; subtitle?: string; entity_type: string; entity_id: string; entity_link?: string; dedupe_key: string; created_at: string }>;
    },
    refetchInterval: 15_000,
    staleTime: 10_000,
  });

  const fmtUsd = (n: number) => `$${(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <AppShell title={t("Command Center")}>
      <div className="p-4 space-y-4">
        {/* Row 1: Health hero */}
        {isLoading || !bundle ? (
          <Skeleton className="h-40" />
        ) : (
          <HealthScoreHero
            score={bundle.health.score}
            band={bundle.health.band}
            components={bundle.health.components}
            history={history}
          />
        )}

        {/* Row 2: KPI grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            <KpiTile
              label={t("Revenue Today")}
              value={fmtUsd(bundle?.revenue_today ?? 0)}
              icon={DollarSign}
              color="text-primary"
              subtitle={t("Nightly ADR under roof")}
            />
            <KpiTile
              label={t("Properties at Risk")}
              value={bundle?.properties_at_risk_count ?? 0}
              icon={Building}
              color={(bundle?.properties_at_risk_count ?? 0) > 0 ? "text-destructive" : "text-primary"}
              onClick={() => {
                document.getElementById("properties-at-risk-table")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
            <KpiTile
              label={t("VIP Arrivals")}
              value={bundle?.vip_arrivals_today_count ?? 0}
              icon={Star}
              color={(bundle?.vip_arrivals_today_count ?? 0) > 0 ? "text-primary" : "text-muted-foreground"}
              subtitle={
                bundle && bundle.vip_arrivals_today.length > 0
                  ? bundle.vip_arrivals_today.slice(0, 3).map((v) => v.unit_code).filter(Boolean).join(" · ")
                  : t("None today")
              }
            />
            <KpiTile
              label={t("Turnovers Remaining")}
              value={bundle?.turnovers_remaining ?? 0}
              icon={Repeat}
              color="text-status-in-progress"
            />
            <KpiTile
              label={t("HK Completion")}
              value={`${Math.round((bundle?.housekeeping_completion_pct ?? 0) * 100)}%`}
              icon={Sparkles}
              color="text-primary"
              subtitle={`${t("Today's HK done")} (n=${bundle?.housekeeping_completion_n ?? 0})`}
            />
            <KpiTile
              label={t("Maintenance SLA")}
              value={`${Math.round((bundle?.maintenance_sla_pct ?? 0) * 100)}%`}
              icon={Wrench}
              color={(bundle?.maintenance_sla_pct ?? 0) < 0.8 ? "text-destructive" : "text-primary"}
              subtitle={`${t("90-day on-time")} (n=${bundle?.maintenance_sla_n ?? 0})`}
            />
            <KpiTile
              label={t("Vendor Top")}
              value={bundle?.vendor_top3?.[0]?.score ?? "-"}
              icon={TrendingUp}
              color="text-primary"
              subtitle={
                bundle?.vendor_top3?.length
                  ? bundle.vendor_top3.map((v) => `${v.vendor_name} (${v.score})`).join(", ")
                  : t("No data")
              }
            />
            <KpiTile
              label={t("Vendor Bottom")}
              value={bundle?.vendor_bottom3?.[0]?.score ?? "-"}
              icon={TrendingDown}
              color={(bundle?.vendor_bottom3?.[0]?.score ?? 100) < 60 ? "text-destructive" : "text-muted-foreground"}
              subtitle={
                bundle?.vendor_bottom3?.length
                  ? bundle.vendor_bottom3.map((v) => `${v.vendor_name} (${v.score})`).join(", ")
                  : t("No data")
              }
            />
          </div>
        )}

        {/* Row 3: Properties at Risk (2 cols) + Exception Feed (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2" id="properties-at-risk-table">
            <h3 className="text-sm font-semibold text-foreground mb-2">{t("Properties at Risk")}</h3>
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <PropertiesAtRiskTable rows={bundle?.properties_at_risk_top10 ?? []} />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{t("Live Exceptions")}</h3>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {exceptions.length} {t("open")}
              </span>
            </div>
            <ExceptionFeed rows={exceptions} loading={exceptionsLoading} />
          </div>
        </div>

        {/* Row 4: VIP watch card */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">{t("VIP Watch")}</h3>
            <Card>
              <CardContent className="p-3 space-y-2">
                {isLoading ? (
                  <Skeleton className="h-32" />
                ) : bundle && bundle.vip_arrivals_today.length + bundle.vip_arrivals_tomorrow.length > 0 ? (
                  <>
                    {bundle.vip_arrivals_today.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("Today")}</p>
                        {bundle.vip_arrivals_today.map((v) => (
                          <div key={v.external_id} className="flex items-center gap-2 text-sm py-1">
                            <Star className="h-3 w-3 text-primary shrink-0" />
                            <span className="font-medium text-foreground truncate">{v.guest_name || t("Guest")}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{v.unit_code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {bundle.vip_arrivals_tomorrow.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("Tomorrow")}</p>
                        {bundle.vip_arrivals_tomorrow.map((v) => (
                          <div key={v.external_id} className="flex items-center gap-2 text-sm py-1">
                            <Star className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-foreground truncate">{v.guest_name || t("Guest")}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{v.unit_code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">{t("No VIP arrivals today or tomorrow.")}</p>
                )}
              </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default ExecutiveCommandCenter;
