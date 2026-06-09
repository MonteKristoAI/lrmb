import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { PRIORITY_ORDER } from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { TaskStatus } from "@/types/task";

const ACTIVE_STATUSES: TaskStatus[] = ["new", "assigned", "vendor_not_started", "in_progress", "waiting_parts", "blocked"];

const MyTasks = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const vendorId = profile?.vendor_id ?? null;
  const { data: tasks, isLoading } = useTasks(
    user
      ? {
          vendor_id_or_assigned_to: { user_id: user.id, vendor_id: vendorId },
          status: ACTIVE_STATUSES,
        }
      : undefined,
  );

  // 2026-05-29: Emma feedback safety net. If the list comes back empty
  // but she just got a push notif, the cause is almost always a stale
  // JWT (session minted before profiles.vendor_id was set) or a stale
  // PWA bundle. One-tap "Refresh" forces both: refresh the auth session
  // so the next PostgREST call carries a fresh JWT, then invalidate the
  // tasks query so React Query re-fetches.
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await supabase.auth.refreshSession();
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } finally {
      setRefreshing(false);
    }
  };

  const sorted = tasks?.slice().sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 2;
    const pb = PRIORITY_ORDER[b.priority] ?? 2;
    if (pa !== pb) return pa - pb;
    if (a.due_at && b.due_at) return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    if (a.due_at) return -1;
    if (b.due_at) return 1;
    return 0;
  });

  return (
    <AppShell title={t("My Work Orders")}>
      <div className="p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : sorted?.length ? (
          sorted.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center space-y-3">
            <p className="text-muted-foreground">{t("No active work orders assigned yet.")}</p>
            <p className="text-xs text-muted-foreground">
              {t("If you just got a new assignment notification, tap below to refresh.")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              className="mx-auto"
            >
              <RefreshCw className={refreshing ? "h-4 w-4 mr-2 animate-spin" : "h-4 w-4 mr-2"} />
              {refreshing ? t("Refreshing…") : t("Refresh")}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default MyTasks;
