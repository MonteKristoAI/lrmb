import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAnalyticsSummary, useAnalyticsTrends } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MousePointerClick } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--status-completed))", "hsl(var(--status-in-progress))", "hsl(var(--status-blocked))"];

const STATUS_ORDER = ["new", "assigned", "vendor_not_started", "in_progress", "waiting_parts", "blocked", "cancelled", "completed", "verified", "processed"];
const PRIORITY_ORDER = ["low", "medium", "high", "urgent"];

const KPIOverview = () => {
  const { t } = useI18n();
  // QA P1 Q-PERF-7..10: read tiny RPC payloads instead of 50K rows.
  const { data: summary, isLoading: loadingSummary } = useAnalyticsSummary();
  const { data: trends = [] } = useAnalyticsTrends(14);

  const { data: adminTouches } = useQuery({
    queryKey: ["admin_touches_avg"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("avg_admin_touches_per_task");
      if (error) throw error;
      return Number(data) || 0;
    },
  });

  const byStatus = STATUS_ORDER.map((s) => ({
    name: t(`status:${s}`),
    count: summary?.byStatus?.[s] ?? 0,
  }));

  const byPriority = PRIORITY_ORDER.map((p) => ({
    name: t(`priority:${p}`),
    count: summary?.byPriority?.[p] ?? 0,
  }));

  const totalRows = summary?.total ?? 0;

  // Cycle-time trend approximated via daily completed counts from the trend RPC.
  // Individual completion-time scatter removed (would require per-row pull).
  const cycleTimeTrend = trends.map((row) => ({ day: row.day, completed: row.completed }));

  return (
    <AppShell title={t("KPI Overview")}>
      <div className="p-4 space-y-4">
        {loadingSummary || !summary ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />) : (
          <>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MousePointerClick className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{adminTouches ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{t("Avg Admin Touches / Work Order")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("Target: reduce by 40-60%")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{t("Work Orders by Status")}</p>
                {totalRows === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{t("No work order data yet.")}</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={byStatus}>
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" height={50} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{t("Priority Distribution")}</p>
                {totalRows === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">{t("No work order data yet.")}</p>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={byPriority} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, count }) => `${name}: ${count}`}>
                        {byPriority.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {cycleTimeTrend.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">{t("Completed Per Day (last 14d)")}</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={cycleTimeTrend}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                      <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name={t("Completed")} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default KPIOverview;
