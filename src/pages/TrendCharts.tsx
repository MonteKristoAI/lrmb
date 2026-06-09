import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useAnalyticsTrends } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";
import { safeFormat } from "@/lib/utils";

const TrendCharts = () => {
  const { t } = useI18n();
  // QA P1 Q-PERF-7..10: server-side daily aggregation instead of 50K-row scan.
  const { data: rows = [], isLoading } = useAnalyticsTrends(14);

  const days = rows.map((r) => ({
    day: safeFormat(r.day, "MMM d"),
    created: r.created,
    completed: r.completed,
    overdue: r.overdue,
  }));

  return (
    <AppShell title={t("Trends")}>
      <div className="p-4 space-y-4">
        {isLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48" />) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">{t("No work order data yet.")}</p>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{t("Created vs Completed (14 days)")}</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={days}>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="created" stroke="hsl(var(--primary))" strokeWidth={2} name={t("Created")} />
                    <Line type="monotone" dataKey="completed" stroke="hsl(var(--status-completed))" strokeWidth={2} name={t("Completed")} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{t("Overdue Work Orders Trend")}</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={days}>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="overdue" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name={t("Overdue")} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
};

export default TrendCharts;
