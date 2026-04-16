import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { differenceInHours } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MousePointerClick } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "hsl(var(--status-completed))", "hsl(var(--status-in-progress))", "hsl(var(--status-blocked))"];

const KPIOverview = () => {
  const { data: tasks = [], isLoading } = useAllTasks();

  const { data: adminTouches } = useQuery({
    queryKey: ["admin_touches_avg"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("avg_admin_touches_per_task");
      if (error) throw error;
      return Number(data) || 0;
    },
  });

  const completed = tasks.filter((t) => ["completed", "verified", "processed"].includes(t.status));
  const byStatus = ["new", "assigned", "vendor_not_started", "in_progress", "waiting_parts", "blocked", "completed", "verified", "processed"].map((s) => ({
    name: s.replace(/_/g, " "),
    count: tasks.filter((t) => t.status === s).length,
  }));

  const byPriority = ["low", "medium", "high", "urgent"].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: tasks.filter((t) => t.priority === p).length,
  }));

  // Completion time distribution (last 30 completed)
  const recentCompleted = completed
    .filter((t) => t.completed_at)
    .slice(0, 30)
    .map((t) => ({
      hours: Math.max(0, differenceInHours(new Date(t.completed_at!), new Date(t.created_at))),
    }));

  // Cycle time trend: avg completion hours per day over last 14 days
  const cycleTimeTrend = (() => {
    const days: Record<string, { total: number; count: number }> = {};
    completed.filter((t) => t.completed_at).forEach((t) => {
      const day = new Date(t.completed_at!).toISOString().slice(0, 10); // YYYY-MM-DD
      const hrs = Math.max(0, differenceInHours(new Date(t.completed_at!), new Date(t.created_at)));
      if (!days[day]) days[day] = { total: 0, count: 0 };
      days[day].total += hrs;
      days[day].count += 1;
    });
    return Object.entries(days)
      .map(([day, v]) => ({ day, avgHrs: Math.round(v.total / v.count) }))
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-14);
  })();

  return (
    <AppShell title="KPI Overview">
      <div className="p-4 space-y-4">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48" />) : (
          <>
            {/* Admin Touches KPI Card */}
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <MousePointerClick className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{adminTouches ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">Avg Admin Touches / Task</p>
                  <p className="text-[10px] text-muted-foreground">Target: reduce by 40-60%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Tasks by Status</p>
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No task data yet.</p>
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
                <p className="text-sm font-semibold text-foreground mb-3">Priority Distribution</p>
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No task data yet.</p>
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
                  <p className="text-sm font-semibold text-foreground mb-3">Avg Cycle Time Trend (hours/day)</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={cycleTimeTrend}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                      <Line type="monotone" dataKey="avgHrs" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Avg Hours" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {recentCompleted.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Individual Completion Times (hours)</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={recentCompleted}>
                      <XAxis tick={false} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                      <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
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
