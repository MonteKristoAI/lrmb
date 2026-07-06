import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/tasks/TaskCard";
import { NextUpHero } from "@/components/tasks/NextUpHero";
import { MyAyaBrief } from "@/components/dashboard/MyAyaBrief";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Task } from "@/types/task";

type SmartTask = Task & {
  smart_queue_score?: number;
  smart_queue_reason?: string;
  properties?: { name: string } | null;
  units?: { unit_code: string; short_name?: string | null } | null;
};

// v3.0 Wave 3 (2026-07-01): MyTasks rewritten around Smart Queue ranking.
// Top item = <NextUpHero> full-width. Rest = compact <TaskCard> list.
const MyTasks = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["my_smart_queue"],
    queryFn: async (): Promise<SmartTask[]> => {
      const { data, error } = await supabase.rpc("my_smart_queue", { p_limit: 100 });
      if (error) throw error;
      return (data ?? []) as SmartTask[];
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await supabase.auth.refreshSession();
      await queryClient.invalidateQueries({ queryKey: ["my_smart_queue"] });
      await queryClient.invalidateQueries({ queryKey: ["aya_my_brief"] });
    } finally {
      setRefreshing(false);
    }
  };

  const nextUp = tasks[0];
  const rest = tasks.slice(1);

  return (
    <AppShell title={t("My Work Orders")}>
      <div className="p-4 space-y-4">
        <MyAyaBrief />
        {isLoading ? (
          <>
            <Skeleton className="h-40 rounded-lg" />
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </>
        ) : tasks.length > 0 ? (
          <>
            {nextUp && <NextUpHero task={nextUp} />}
            {rest.length > 0 && (
              <>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pt-2">
                  {t("Up next")}
                </h3>
                <div className="space-y-3">
                  {rest.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      scoreBadge={typeof task.smart_queue_score === "number"
                        ? { score: task.smart_queue_score, reason: task.smart_queue_reason || "" }
                        : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </>
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
