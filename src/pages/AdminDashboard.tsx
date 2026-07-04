import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useTasksByStatus } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useNavigate } from "react-router-dom";
import { ClipboardList, AlertTriangle, Ban, Clock, Plus, Timer, Users, MousePointerClick, Truck, Home, Download, UserX } from "lucide-react";
import { exportToCSV, tasksToCSV } from "@/lib/csv-export";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// QA Agent C P1-04 (2026-05-29): the dashboard used to fire 9 parallel
// queries on mount (5 useTaskCount + useActiveStaffCount + useDashboardKpis +
// 2 RPCs). Consolidate via the admin_dashboard_bundle RPC into one
// round-trip. Keeps the same StatCard projections so visual is unchanged.
interface AdminBundle {
  open_count: number;
  overdue_count: number;
  blocked_count: number;
  unassigned_count: number;
  due_today_count: number;
  active_staff_count: number;
  avg_cycle_hours: number;
  admin_touches_avg: number;
  computed_at: string;
}

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
  const { t } = useI18n();

  // Single round-trip - replaces 9 separate REST calls.
  const { data: bundle, isLoading: bundleLoading } = useQuery({
    queryKey: ["admin_dashboard_bundle"],
    queryFn: async (): Promise<AdminBundle> => {
      const { data, error } = await supabase.rpc("admin_dashboard_bundle");
      if (error) throw error;
      return (data ?? {}) as unknown as AdminBundle;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // Recent open list - kept separate because it's a list of rows, not a count.
  const { data: recentOpen = [], isLoading: recentLoading } = useTasksByStatus(
    ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts", "blocked"],
    { orderBy: "due_at", ascending: true, limit: 10 },
  );

  const openCount = bundle?.open_count ?? 0;
  const overdueCount = bundle?.overdue_count ?? 0;
  const blockedCount = bundle?.blocked_count ?? 0;
  const unassignedCount = bundle?.unassigned_count ?? 0;
  const dueTodayCount = bundle?.due_today_count ?? 0;
  const activeStaffCount = bundle?.active_staff_count ?? 0;
  const avgCycleHrs = Math.max(0, Math.round(Number(bundle?.avg_cycle_hours ?? 0)));
  const adminTouches = bundle?.admin_touches_avg ?? 0;

  const isLoading = bundleLoading || recentLoading;

  return (
    <AppShell title={t("Admin Dashboard")}>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{t("Overview")}</h2>
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
              <Download className="h-4 w-4" /> {t("Export Open")}
            </Button>
            <Button onClick={() => navigate("/admin/tasks/create")} size="sm" className="gap-1 tap-target">
              <Plus className="h-4 w-4" /> {t("New Work Order")}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={t("Open Work Orders")} value={openCount} icon={ClipboardList} color="text-status-assigned" onClick={() => navigate("/admin/tasks/open")} />
            <StatCard label={t("Overdue")} value={overdueCount} icon={AlertTriangle} color="text-destructive" onClick={() => navigate("/admin/tasks/overdue")} />
            <StatCard label={t("Blocked")} value={blockedCount} icon={Ban} color="text-status-blocked" onClick={() => navigate("/admin/tasks/blocked")} />
            <StatCard label={t("Unassigned")} value={unassignedCount} icon={UserX} color={unassignedCount > 0 ? "text-destructive" : "text-primary"} onClick={() => navigate("/admin/tasks/unassigned")} subtitle={unassignedCount > 0 ? t("Needs routing") : undefined} />
            <StatCard label={t("Due Today")} value={dueTodayCount} icon={Clock} color="text-status-in-progress" />
            <StatCard label={t("Avg Cycle Time")} value={`${avgCycleHrs}h`} icon={Timer} color="text-primary" />
            <StatCard label={t("Admin Touches")} value={adminTouches ?? "-"} icon={MousePointerClick} color="text-primary" subtitle={t("Avg per work order")} />
            <StatCard label={t("Active Staff")} value={activeStaffCount} icon={Users} color="text-primary" />
          </div>
        )}

        {/* Quick Navigation */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button variant="outline" onClick={() => navigate("/admin/housekeeping")} className="tap-target gap-1 h-auto py-3 flex-col">
            <Home className="h-5 w-5" />
            <span className="text-xs">{t("Housekeeping")}</span>
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/inspections")} className="tap-target gap-1 h-auto py-3 flex-col">
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs">{t("Inspections")}</span>
          </Button>
          <Button variant="outline" onClick={() => navigate("/admin/vendors")} className="tap-target gap-1 h-auto py-3 flex-col">
            <Truck className="h-5 w-5" />
            <span className="text-xs">{t("Vendors")}</span>
          </Button>
        </div>

        <h3 className="text-sm font-semibold text-foreground pt-2">{t("Recent Open Work Orders")}</h3>
        <div className="space-y-2">
          {recentOpen.map((task) => <TaskCard key={task.id} task={task} />)}
          {recentOpen.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t("No open work orders.")}</p>}
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboard;
