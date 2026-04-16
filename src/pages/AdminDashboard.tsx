import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useNavigate } from "react-router-dom";
import { ClipboardList, AlertTriangle, Ban, Clock, Plus, Timer, Users, MousePointerClick, Truck, Home, Download } from "lucide-react";
import { exportToCSV, tasksToCSV } from "@/lib/csv-export";
import { Button } from "@/components/ui/button";
import { isPast, differenceInHours } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function StatCard({ label, value, icon: Icon, color, onClick, subtitle }: { label: string; value: number | string; icon: React.ElementType; color: string; onClick?: () => void; subtitle?: string }) {
  return (
    <Card className={`${onClick ? "cursor-pointer hover:bg-secondary/50" : ""} transition-colors ${color}`} onClick={onClick}>
      <CardContent className="p-4 flex items-center gap-3">
        <Icon className="h-8 w-8 shrink-0" />
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useAllTasks();

  const { data: adminTouches } = useQuery({
    queryKey: ["admin_touches_avg"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("avg_admin_touches_per_task");
      if (error) throw error;
      return Number(data) || 0;
    },
  });

  const open = tasks.filter((t) => !["completed", "verified", "processed"].includes(t.status));
  const overdue = tasks.filter((t) => t.due_at && isPast(new Date(t.due_at)) && !["completed", "verified", "processed"].includes(t.status));
  const blocked = tasks.filter((t) => t.status === "blocked");
  const completed = tasks.filter((t) => ["completed", "verified", "processed"].includes(t.status));
  const avgCycleHrs = completed.length
    ? Math.max(0, Math.round(completed.reduce((sum, t) => sum + (t.completed_at ? Math.max(0, differenceInHours(new Date(t.completed_at), new Date(t.created_at))) : 0), 0) / completed.length))
    : 0;
  const staffIds = new Set(tasks.map((t) => t.assigned_to).filter(Boolean));
  const recent = open.slice(0, 10);

  return (
    <AppShell title="Admin Dashboard">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Overview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1 tap-target" onClick={() => exportToCSV(tasksToCSV(open), "lrmb_open_tasks")}>
              <Download className="h-4 w-4" /> Export Open
            </Button>
            <Button onClick={() => navigate("/admin/tasks/create")} size="sm" className="gap-1 tap-target">
              <Plus className="h-4 w-4" /> New Task
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Open Tasks" value={open.length} icon={ClipboardList} color="text-status-assigned" onClick={() => navigate("/admin/tasks/open")} />
            <StatCard label="Overdue" value={overdue.length} icon={AlertTriangle} color="text-destructive" onClick={() => navigate("/admin/tasks/overdue")} />
            <StatCard label="Blocked" value={blocked.length} icon={Ban} color="text-status-blocked" onClick={() => navigate("/admin/tasks/blocked")} />
            <StatCard label="Due Today" value={tasks.filter((t) => { if (!t.due_at || ["completed", "verified", "processed"].includes(t.status)) return false; const d = new Date(t.due_at); const today = new Date(); return d.toDateString() === today.toDateString(); }).length} icon={Clock} color="text-status-in-progress" />
            <StatCard label="Avg Cycle Time" value={`${avgCycleHrs}h`} icon={Timer} color="text-primary" />
            <StatCard label="Admin Touches" value={adminTouches ?? "—"} icon={MousePointerClick} color="text-primary" subtitle="Avg per task" />
            <StatCard label="Active Staff" value={staffIds.size} icon={Users} color="text-primary" />
          </div>
        )}

        {/* Quick Navigation */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate("/admin/housekeeping")} className="tap-target gap-1 h-auto py-3 flex-col">
            <Home className="h-5 w-5" />
            <span className="text-xs">Housekeeping</span>
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/inspections")} className="tap-target gap-1 h-auto py-3 flex-col">
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs">Inspections</span>
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/vendors")} className="tap-target gap-1 h-auto py-3 flex-col">
            <Truck className="h-5 w-5" />
            <span className="text-xs">Vendors</span>
          </Button>
        </div>

        <h3 className="text-sm font-semibold text-foreground pt-2">Recent Open Tasks</h3>
        <div className="space-y-2">
          {recent.map((t) => <TaskCard key={t.id} task={t} />)}
          {recent.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No open tasks.</p>}
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;
