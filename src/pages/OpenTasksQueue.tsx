import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useTasksByStatus, useUpdateTask, useAddTaskUpdate } from "@/hooks/useTasks";
import { useProfiles } from "@/hooks/useProperties";
import { useAuth } from "@/lib/auth";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SortMode = "smart" | "due_at" | "priority" | "created_at";

const OpenTasksQueue = () => {
  const [sort, setSort] = useState<SortMode>("smart");

  // v3.0 Wave 3: fork query by sort. Smart mode hits smart_queue_open RPC
  // which returns tasks with attached score/reason. Other modes use existing hook.
  const { data: smartOpen = [], isLoading: smartLoading } = useQuery({
    enabled: sort === "smart",
    queryKey: ["smart_queue_open"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("smart_queue_open", { p_limit: 500 });
      if (error) throw error;
      return data as Array<{ smart_queue_score?: number; smart_queue_reason?: string } & Record<string, unknown>>;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // L10 fix: "priority" sort now orders by priority enum (urgent > high > medium > low).
  const orderByForHook =
    sort === "priority" ? "priority" : sort === "due_at" ? "due_at" : "created_at";
  const { data: standardOpen = [], isLoading: standardLoading } = useTasksByStatus(
    ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts", "blocked"],
    {
      orderBy: orderByForHook,
      // priority DESC (urgent first), due_at ASC (soonest first), created_at ASC (oldest first)
      ascending: sort === "due_at" || sort === "created_at",
      limit: 500,
    },
  );

  const open = useMemo(() => sort === "smart" ? smartOpen : standardOpen, [sort, smartOpen, standardOpen]);
  const isLoading = sort === "smart" ? smartLoading : standardLoading;
  const { data: profiles = [] } = useProfiles();
  const { user } = useAuth();
  const { t } = useI18n();
  const updateTask = useUpdateTask();
  const addUpdate = useAddTaskUpdate();
  const { toast } = useToast();

  const [reassignId, setReassignId] = useState<string | null>(null);
  const [newAssignee, setNewAssignee] = useState("");

  const handleReassign = async () => {
    if (!reassignId || !newAssignee || !user) return;
    const task = open.find((t) => t.id === reassignId);
    // L10 audit 2026-06-09 P1-4: guard against reassigning a terminal task
    // (race window between list render and click - another admin may have
    // verified/completed it). Reassigning a completed task leaves a confusing
    // audit row ("Reassigned X to Y on a completed task").
    if (task && ["cancelled", "completed", "verified", "processed"].includes(task.status)) {
      toast({ title: t("Task moved on"), description: t("This work order has been finalized and can't be reassigned."), variant: "destructive" });
      setReassignId(null);
      setNewAssignee("");
      return;
    }
    const newStatus = task && task.status === "new" ? "assigned" : undefined;
    const previousAssignee = task?.assigned_to ?? null;
    try {
      await updateTask.mutateAsync({
        id: reassignId,
        assigned_to: newAssignee,
        ...(newStatus ? { status: newStatus } : {}),
        ...(task?.status === "blocked" ? { blocked_reason: null } : {}),
      });
      // v33: audit trail for reassignment so reviewers can trace who moved a task to whom.
      try {
        await addUpdate.mutateAsync({
          task_id: reassignId,
          actor_id: user.id,
          update_type: "assignment_change" as never,
          old_status: task?.status ?? null,
          new_status: newStatus ?? task?.status ?? null,
          note: `Reassigned from ${previousAssignee ?? "unassigned"} to ${newAssignee}`,
        });
      } catch (logErr) {
        // Don't fail the reassignment if the audit row fails - log it.
        console.warn("audit log for reassignment failed", logErr);
      }
      toast({ title: t("Work order reassigned") });
      setReassignId(null);
      setNewAssignee("");
    } catch {
      toast({ title: t("Failed to reassign work order"), variant: "destructive" });
    }
  };

  return (
    <AppShell title={t("Open Work Orders")}>
      <div className="p-4 space-y-3">
        {/* v3.0 Wave 3: sort control. Smart is default, ranks by smart_queue_score. */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {open.length} {t("open")}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t("Sort")}:</span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
              <SelectTrigger className="h-8 w-40 text-xs" aria-label={t("Sort")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart">{t("Smart Queue")}</SelectItem>
                <SelectItem value="due_at">{t("Due date")}</SelectItem>
                <SelectItem value="priority">{t("Priority")}</SelectItem>
                <SelectItem value="created_at">{t("Newest")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          open.length ? open.map((task) => {
            const t2 = task as typeof task & { smart_queue_score?: number; smart_queue_reason?: string };
            return (
              <div key={task.id} className="space-y-1">
                <TaskCard
                  task={task}
                  scoreBadge={sort === "smart" && typeof t2.smart_queue_score === "number"
                    ? { score: t2.smart_queue_score, reason: t2.smart_queue_reason || "" }
                    : undefined}
                />
                <div className="flex justify-end px-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-muted-foreground min-h-11 min-w-11 px-3"
                    onClick={() => setReassignId(task.id)}
                  >
                    {t("Reassign")}
                  </Button>
                </div>
              </div>
            );
          }) : <p className="text-muted-foreground text-center py-8">{t("No open work orders.")}</p>
        )}
      </div>

      <Dialog open={!!reassignId} onOpenChange={(open) => { if (!open) setReassignId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{t("Reassign Work Order")}</DialogTitle></DialogHeader>
          <Select value={newAssignee} onValueChange={setNewAssignee}>
            <SelectTrigger className="tap-target"><SelectValue placeholder={t("Select staff")} /></SelectTrigger>
            <SelectContent>{profiles.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}</SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleReassign} disabled={!newAssignee} className="tap-target">{t("Reassign")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default OpenTasksQueue;
