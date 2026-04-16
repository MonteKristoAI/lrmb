import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, TrendingUp, Users, BarChart3, RotateCcw } from "lucide-react";
import { isPast, differenceInHours } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

function KPICard({ label, value, sub, icon: Icon }: { label: string; value: string | number; sub?: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className="h-8 w-8 text-primary shrink-0" />
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useAllTasks();

  const completed = tasks.filter((t) => ["completed", "verified", "processed"].includes(t.status));
  const pendingVerify = tasks.filter((t) => t.status === "completed");
  const overdue = tasks.filter((t) => t.due_at && isPast(new Date(t.due_at)) && !["completed", "verified", "processed"].includes(t.status));

  const avgCycleHrs = completed.length
    ? Math.max(0, Math.round(completed.reduce((sum, t) => sum + (t.completed_at && t.created_at ? Math.max(0, differenceInHours(new Date(t.completed_at), new Date(t.created_at))) : 0), 0) / completed.length))
    : 0;

  const photoRequiredTotal = tasks.filter((t) => t.requires_photo).length;
  const photoRequiredDone = completed.filter((t) => t.requires_photo).length;
  const photoCompliance = photoRequiredTotal === 0 ? 100 : Math.round((photoRequiredDone / photoRequiredTotal) * 100);

  const repeatRate = tasks.length
    ? Math.round((tasks.filter((t) => t.reopened_count > 0).length / tasks.length) * 100)
    : 0;

  const byCategory = ["maintenance", "housekeeping", "inspection", "general", "property_management", "concierge"].map((cat) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: tasks.filter((t) => t.task_category === cat).length,
  }));

  return (
    <AppShell title="Supervisor">
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <KPICard label="Pending Verification" value={pendingVerify.length} icon={CheckCircle2} />
              <KPICard label="Avg Cycle Time" value={`${avgCycleHrs}h`} icon={Clock} />
              <KPICard label="Overdue" value={overdue.length} icon={TrendingUp} />
              <KPICard label="Photo Tasks Done" value={`${photoCompliance}%`} sub={`${photoRequiredDone}/${photoRequiredTotal}`} icon={BarChart3} />
              <KPICard label="Repeat Rate" value={`${repeatRate}%`} sub="Target: < 20%" icon={RotateCcw} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => navigate("/supervisor/verify")} className="tap-target">Verify Queue</Button>
              <Button variant="outline" onClick={() => navigate("/supervisor/kpi")} className="tap-target">KPI Details</Button>
              <Button variant="outline" onClick={() => navigate("/supervisor/staff")} className="tap-target">Staff Workload</Button>
              <Button variant="outline" onClick={() => navigate("/supervisor/trends")} className="tap-target">Trends</Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Tasks by Category</p>
                {tasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No task data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={byCategory}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
};

export default SupervisorDashboard;
