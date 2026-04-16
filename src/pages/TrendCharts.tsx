import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts";
import { subDays, format } from "date-fns";

const TrendCharts = () => {
  const { data: tasks = [], isLoading } = useAllTasks();

  // Tasks created per day (last 14 days)
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i);
    const label = format(d, "MMM d");
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart.getTime() + 86400000);
    const created = tasks.filter((t) => {
      const c = new Date(t.created_at);
      return c >= dayStart && c < dayEnd;
    }).length;
    const completed = tasks.filter((t) => {
      if (!t.completed_at) return false;
      const c = new Date(t.completed_at);
      return c >= dayStart && c < dayEnd;
    }).length;
    return { day: label, created, completed };
  });

  // Overdue trend — snapshot: how many tasks were overdue on each day
  const overdueTrend = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i);
    const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const overdue = tasks.filter((t) => {
      if (!t.due_at) return false;
      const due = new Date(t.due_at);
      if (due >= dayEnd) return false; // not yet due on this day
      const created = new Date(t.created_at);
      if (created >= dayEnd) return false; // didn't exist yet on this day
      // If completed before this day, not overdue on this day
      if (t.completed_at && new Date(t.completed_at) < dayEnd) return false;
      return true;
    }).length;
    return { day: format(d, "MMM d"), overdue };
  });

  return (
    <AppShell title="Trends">
      <div className="p-4 space-y-4">
        {isLoading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-48" />) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No task data yet.</p>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Created vs Completed (14 days)</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={days}>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="created" stroke="hsl(var(--primary))" strokeWidth={2} name="Created" />
                    <Line type="monotone" dataKey="completed" stroke="hsl(var(--status-completed))" strokeWidth={2} name="Completed" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Overdue Tasks Trend</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={overdueTrend}>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} angle={-30} textAnchor="end" height={40} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="overdue" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Overdue" />
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
