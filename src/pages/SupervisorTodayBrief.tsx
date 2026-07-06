import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { KpiTile } from "@/components/dashboard/KpiTile";
import { TempoBadge } from "@/components/dashboard/TempoBadge";
import { VendorDelayList } from "@/components/dashboard/VendorDelayList";
import { Plane, PlaneLanding, PlaneTakeoff, Repeat, AlertOctagon, CheckCircle2, Star, Timer } from "lucide-react";
import { safeFormat } from "@/lib/utils";
import { AyaBrief } from "@/components/dashboard/AyaBrief";

// v3.0 Wave 1 (2026-07-01): Supervisor Today's Brief.
// Route /supervisor/today. Data via supervisor_brief_bundle() RPC (one round-trip).
// Refreshes every 60s.
interface ArrivalRow {
  external_id: string; unit_id: number; unit_code: string | null;
  unit_short_name: string | null; arrival_time: string | null;
  guest_name: string | null; is_vip: boolean; adr: number | null; nights: number | null;
}
interface DepartureRow {
  external_id: string; unit_id: number; unit_code: string | null;
  unit_short_name: string | null; departure_time: string | null;
  guest_name: string | null; is_vip: boolean;
}
interface UrgentWoRow {
  id: string; title: string; status: string; task_category: string;
  task_type: string | null; unit_id: string | null; property_id: string | null;
  due_at: string | null; created_at: string;
}
interface VerifyRow {
  id: string; title: string; task_category: string; task_type: string | null;
  unit_id: string | null; property_id: string | null;
  completed_at: string | null; assigned_to: string | null;
}
interface VendorDelayRow {
  vendor_id: string; vendor_name: string; pending_count: number; sla_missed_count: number;
}
interface SupervisorBrief {
  date: string;
  arrivals_today_count: number;
  arrivals_today: ArrivalRow[];
  departures_today_count: number;
  departures_today: DepartureRow[];
  turnovers_today_count: number;
  urgent_wo_count: number;
  urgent_wo: UrgentWoRow[];
  verification_queue_count: number;
  verification_queue_top5: VerifyRow[];
  vendor_delays: VendorDelayRow[];
  avg_completion_hours_today: number;
  avg_completion_hours_30d: number;
  computed_at: string;
}

const SupervisorTodayBrief = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const { data: brief, isLoading } = useQuery({
    queryKey: ["supervisor_brief_bundle"],
    queryFn: async (): Promise<SupervisorBrief> => {
      const { data, error } = await supabase.rpc("supervisor_brief_bundle");
      if (error) throw error;
      return (data ?? {}) as unknown as SupervisorBrief;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // L10 fix: derive date from state that refreshes every minute so the
  // "Today's Brief" header does not stay on yesterday past midnight.
  // Locale comes from i18n so Spanish users see the Spanish day name.
  const [nowTick, setNowTick] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  const dateLabel = new Date(nowTick).toLocaleDateString(
    locale === "es" ? "es-US" : "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );

  return (
    <AppShell title={t("Today's Brief")}>
      <div className="p-4 space-y-4">
        {/* Aya: the same operational-awareness narrative leadership sees, so a
            supervisor opens to "what needs attention today and why". */}
        <AyaBrief scope="platform" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{dateLabel}</h2>
            <p className="text-xs text-muted-foreground">{t("Live tempo, refreshed every minute")}</p>
          </div>
          {!isLoading && brief && (
            <TempoBadge arrivals={brief.arrivals_today_count} urgentWos={brief.urgent_wo_count} />
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <KpiTile
              label={t("Arrivals")}
              value={brief?.arrivals_today_count ?? 0}
              icon={PlaneLanding}
              color="text-primary"
              subtitle={
                brief && brief.arrivals_today.some((a) => a.is_vip)
                  ? `${brief.arrivals_today.filter((a) => a.is_vip).length} ${t("VIP")}`
                  : undefined
              }
            />
            <KpiTile
              label={t("Departures")}
              value={brief?.departures_today_count ?? 0}
              icon={PlaneTakeoff}
              color="text-status-in-progress"
            />
            <KpiTile
              label={t("Turnovers")}
              value={brief?.turnovers_today_count ?? 0}
              icon={Repeat}
              color="text-status-assigned"
            />
            <KpiTile
              label={t("Urgent Work Orders")}
              value={brief?.urgent_wo_count ?? 0}
              icon={AlertOctagon}
              color={(brief?.urgent_wo_count ?? 0) > 0 ? "text-destructive" : "text-primary"}
              onClick={() => navigate("/admin/tasks/open")}
            />
          </div>
        )}

        {/* VIP arrivals highlight if any */}
        {!isLoading && brief && brief.arrivals_today.some((a) => a.is_vip) && (
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{t("VIP Arrivals Today")}</h3>
              </div>
              <div className="space-y-1.5">
                {brief.arrivals_today.filter((a) => a.is_vip).map((a) => (
                  <div key={a.external_id} className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{a.guest_name || t("Guest")}</span>
                    <span className="text-xs text-muted-foreground">
                      {a.unit_short_name || a.unit_code || `Unit ${a.unit_id}`}
                    </span>
                    {a.arrival_time && (
                      <span className="text-xs text-muted-foreground ml-auto">{a.arrival_time}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification queue teaser */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {t("Verification Queue")} ({brief?.verification_queue_count ?? 0})
              </h3>
            </div>
            {brief && brief.verification_queue_count > 0 && (
              <Button variant="outline" size="sm" onClick={() => navigate("/supervisor/verify")}>
                {t("View all")}
              </Button>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-24" />
          ) : brief && brief.verification_queue_top5.length > 0 ? (
            <Card>
              <CardContent className="p-3 space-y-1.5">
                {brief.verification_queue_top5.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/tasks/${v.id}`)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{v.title}</p>
                      {v.completed_at && (
                        <p className="text-[10px] text-muted-foreground">
                          {t("Completed")} {safeFormat(v.completed_at, "MMM d, HH:mm")}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-3 text-center text-sm text-muted-foreground">
                {t("Nothing waiting to verify.")}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Vendor delays */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-primary" />
            {t("Vendor Delays")}
          </h3>
          {isLoading ? (
            <Skeleton className="h-20" />
          ) : (
            <VendorDelayList rows={brief?.vendor_delays ?? []} />
          )}
        </div>

        {/* Avg completion time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">{t("Average Completion Time")}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {brief?.avg_completion_hours_today ?? 0}h
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("Today")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-muted-foreground">
                  {brief?.avg_completion_hours_30d ?? 0}h
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("30-day average")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default SupervisorTodayBrief;
