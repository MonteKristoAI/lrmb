import { AppShell } from "@/components/layout/AppShell";
import { useAnalyticsSummary } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, AlertTriangle, BarChart3, RotateCcw } from "lucide-react";
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

const CATEGORY_ORDER = ["maintenance", "housekeeping", "inspection", "general", "property_management", "concierge"];

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { data: summary, isLoading } = useAnalyticsSummary();

  const avgCycleHrs = summary?.avgCycleHours != null ? Math.round(summary.avgCycleHours) : 0;
  const photoCompliance = summary && summary.photoComplianceTotal > 0
    ? Math.round((summary.photoComplianceDone / summary.photoComplianceTotal) * 100)
    : 100;
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: summary?.byCategory?.[cat] ?? 0,
  }));
  const totalRows = summary?.total ?? 0;

  return (
    <AppShell title="Supervisor">
      <div className="p-4 space-y-4">
        {isLoading || !summary ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <KPICard label="Pending Verification" value={summary.pendingVerify} icon={CheckCircle2} />
              <KPICard label="Avg Cycle Time" value={`${avgCycleHrs}h`} icon={Clock} />
              <KPICard label="Overdue" value={summary.overdue} icon={AlertTriangle} />
              <KPICard label="Photo Compliance" value={`${photoCompliance}%`} sub={`${summary.photoComplianceDone} completed / ${summary.photoComplianceTotal} requiring photos`} icon={BarChart3} />
              <KPICard label="Total Tasks" value={summary.total} sub="all-time" icon={RotateCcw} />
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
                {totalRows === 0 ? (
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
