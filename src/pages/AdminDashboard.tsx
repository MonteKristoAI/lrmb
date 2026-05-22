import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks, useDashboardKpis, useTaskCount, useActiveStaffCount, useTasksByStatus } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useNavigate } from "react-router-dom";
import { ClipboardList, AlertTriangle, Ban, Clock, Plus, Timer, Users, MousePointerClick, Truck, Home, Download } from "lucide-react";
import { exportToCSV, tasksToCSV } from "@/lib/csv-export";
import { Button } from "@/components/ui/button";
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

  // v32: Real KPIs from materialized view + dedicated counts, not from a 500-row slice.
  const { data: kpis, isLoading: kpisLoading } = useDashboardKpis();
  const { data: openCount = 0 } = useTaskCount({ statuses: ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts", "blocked"] });
  const { data: overdueCount = 0 } = useTaskCount({ overdue: true });
  const { data: blockedCount = 0 } = useTaskCount({ statuses: ["blocked"] });
  const { data: dueTodayCount = 0 } = useTaskCount({ dueToday: true });
  const { data: activeStaffCount = 0 } = useActiveStaffCount();
  // Recent open list (top 10 by due_at, real query — not a slice of 500-by-created_at)
  const { data: recentOpen = [], isLoading: recentLoading } = useTasksByStatus(
    ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts", "blocked"],
    { orderBy: "due_at", ascending: true, limit: 10 },
  );

  const { data: adminTouches } = useQuery({
    queryKey: ["admin_touches_avg"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("avg_admin_touches_per_task");
      if (error) throw error;
      return Number(data) || 0;
    },
  });

  // Avg cycle time — pulls completed-this-week count from MV, plus a small
  // sample query for the actual cycle-time average. The earlier inline
  // arithmetic over 500 random rows was unreliable; we keep it simple here
  // and let the per-task display show real times.
  const { data: avgCycleHrs = 0 } = useQuery({
    queryKey: ["avg_cycle_hrs"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("avg_cycle_time_hours");
      if (error) return 0; // RPC may not exist yet; degrade gracefully
      return Math.max(0, Math.round(Number(data) || 0));
    },
  });

  const isLoading = kpisLoading || recentLoading;

  return (
    <AppShell title="Admin Dashboard">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Overview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1 tap-target" onClick={async () => {
              // v32: export pulls fresh from DB, not the 500-row slice.
              const { data, error } = await supabase
                .from("tasks")
                .select("id, title, status, priority, task_category, due_at, scheduled_for, started_at, completed_at, created_at, updated_at, external_id, assigned_to, properties(name), units(unit_code, short_name)")
                .in("status", ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts", "blocked"])
                .order("due_at", { ascending: true, nullsFirst: false })
                .limit(20000);
              if (error) { console.error(error); return; }
              exportToCSV(tasksToCSV(data as never), "lrmb_open_tasks");
            }}>
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
            <StatCard label="Open Tasks" value={openCount} icon={ClipboardList} color="text-status-assigned" onClick={() => navigate("/admin/tasks/open")} />
            <StatCard label="Overdue" value={overdueCount} icon={AlertTriangle} color="text-destructive" onClick={() => navigate("/admin/tasks/overdue")} />
            <StatCard label="Blocked" value={blockedCount} icon={Ban} color="text-status-blocked" onClick={() => navigate("/admin/tasks/blocked")} />
            <StatCard label="Due Today" value={dueTodayCount} icon={Clock} color="text-status-in-progress" />
            <StatCard label="Avg Cycle Time" value={`${avgCycleHrs}h`} icon={Timer} color="text-primary" />
            <StatCard label="Admin Touches" value={adminTouches ?? "—"} icon={MousePointerClick} color="text-primary" subtitle="Avg per task" />
            <StatCard label="Active Staff" value={activeStaffCount} icon={Users} color="text-primary" />
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
          {recentOpen.map((t) => <TaskCard key={t.id} task={t} />)}
          {recentOpen.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No open tasks.</p>}
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;
