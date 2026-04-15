import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { useProfiles } from "@/hooks/useProperties";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const StaffWorkload = () => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading: loadingTasks } = useAllTasks();
  const { data: profiles = [], isLoading: loadingProfiles } = useProfiles();
  const isLoading = loadingTasks || loadingProfiles;

  const staffData = profiles.map((p) => {
    const assigned = tasks.filter((t) => t.assigned_to === p.id);
    const active = assigned.filter((t) => !["completed", "verified", "processed"].includes(t.status));
    const done = assigned.filter((t) => ["completed", "verified", "processed"].includes(t.status));
    return { id: p.id, name: p.full_name || p.email || "Unknown", active: active.length, done: done.length, total: assigned.length };
  }).filter((s) => s.total > 0).sort((a, b) => b.active - a.active);

  return (
    <AppShell title="Staff Workload">
      <div className="p-4 space-y-4">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />) : (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-foreground mb-3">Active Tasks by Staff</p>
                <ResponsiveContainer width="100%" height={Math.max(160, staffData.length * 40)}>
                  <BarChart data={staffData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={100} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="active" fill="hsl(var(--status-in-progress))" name="Active" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="done" fill="hsl(var(--status-completed))" name="Completed" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {staffData.map((s) => (
              <Card key={s.id} className="cursor-pointer hover:bg-secondary/50 tap-target" onClick={() => navigate(`/admin/tasks/staff/${s.id}`)}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.active} active · {s.done} completed</p>
                  </div>
                  <p className="text-lg font-bold text-primary">{s.total}</p>
                </CardContent>
              </Card>
            ))}
            {staffData.length === 0 && <p className="text-muted-foreground text-center py-8">No staff workload data.</p>}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default StaffWorkload;
