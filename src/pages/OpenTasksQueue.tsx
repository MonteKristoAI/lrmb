import { useState } from "react";
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

const OpenTasksQueue = () => {
  // v32: real "open" query (any non-terminal status), not a filter on the 500-row slice.
  const { data: open = [], isLoading } = useTasksByStatus(
    ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts", "blocked"],
    { orderBy: "due_at", ascending: true, limit: 500 },
  );
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
    // (race window between list render and click — another admin may have
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
        // Don't fail the reassignment if the audit row fails — log it.
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
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          open.length ? open.map((task) => (
            <div key={task.id} className="space-y-1">
              <TaskCard task={task} />
              <div className="flex justify-end px-1">
                {/* QA Agent A P2 (2026-05-29): bump tap target to >=44px */}
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
          )) : <p className="text-muted-foreground text-center py-8">{t("No open work orders.")}</p>
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
