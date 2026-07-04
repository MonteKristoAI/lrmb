import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useUnassignedTasks, useUpdateTask, useAddTaskUpdate } from "@/hooks/useTasks";
import { useProfiles } from "@/hooks/useProperties";
import { useAuth } from "@/lib/auth";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

// Q3 root-cause fix (2026-06-11): unassigned WO queue. Emma 2026-06-11:
// "I also made two work orders for today and they are not showing up."
// Root cause: TRACK auto-imports land assigned_to=NULL + vendor_id=NULL.
// Those WOs never appear on any staff home - admin must route them.
// Surfaced here so the triage step is unmistakable.

const UnassignedQueue = () => {
  const { t } = useI18n();
  const { data: unassigned = [], isLoading } = useUnassignedTasks();
  const { data: profiles = [] } = useProfiles();
  const { user } = useAuth();
  const updateTask = useUpdateTask();
  const addUpdate = useAddTaskUpdate();
  const { toast } = useToast();

  const [assignId, setAssignId] = useState<string | null>(null);
  const [newAssignee, setNewAssignee] = useState("");

  const handleAssign = async () => {
    if (!assignId || !newAssignee || !user) return;
    const task = unassigned.find((tsk) => tsk.id === assignId);
    if (task && ["cancelled", "completed", "verified", "processed"].includes(task.status)) {
      toast({ title: t("Task moved on"), description: t("This work order has been finalized and can't be reassigned."), variant: "destructive" });
      setAssignId(null);
      setNewAssignee("");
      return;
    }
    const newStatus = task && task.status === "new" ? "assigned" : undefined;
    try {
      await updateTask.mutateAsync({
        id: assignId,
        assigned_to: newAssignee,
        ...(newStatus ? { status: newStatus } : {}),
      });
      try {
        await addUpdate.mutateAsync({
          task_id: assignId,
          actor_id: user.id,
          update_type: "assignment_change" as never,
          old_status: task?.status ?? null,
          new_status: newStatus ?? task?.status ?? null,
          note: `Assigned from unassigned to ${newAssignee}`,
        });
      } catch (logErr) {
        console.warn("audit log for assignment failed", logErr);
      }
      toast({ title: t("Work order assigned") });
      setAssignId(null);
      setNewAssignee("");
    } catch {
      toast({ title: t("Failed to assign work order"), variant: "destructive" });
    }
  };

  return (
    <AppShell title={t("Unassigned Work Orders")}>
      <div className="p-4 space-y-3">
        {!isLoading && unassigned.length > 0 && (
          <p className="text-sm text-muted-foreground -mt-1 mb-2">
            {t("These work orders have no staff member and no vendor. They won't appear on any staff home until routed.")}
          </p>
        )}
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          unassigned.length ? unassigned.map((task) => (
            <div key={task.id} className="space-y-1">
              <TaskCard task={task} />
              <Button
                variant="outline"
                size="sm"
                className="w-full tap-target gap-2"
                onClick={() => setAssignId(task.id)}
              >
                <UserPlus className="h-4 w-4" />
                {t("Assign")}
              </Button>
            </div>
          )) : <p className="text-muted-foreground text-center py-8">{t("No unassigned work orders.")}</p>
        )}
      </div>

      <Dialog open={assignId !== null} onOpenChange={(open) => { if (!open) { setAssignId(null); setNewAssignee(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Assign Work Order")}</DialogTitle>
          </DialogHeader>
          <Select value={newAssignee} onValueChange={setNewAssignee}>
            <SelectTrigger>
              <SelectValue placeholder={t("Select staff member")} />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAssignId(null); setNewAssignee(""); }}>{t("Cancel")}</Button>
            <Button onClick={handleAssign} disabled={!newAssignee || updateTask.isPending}>{t("Assign")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default UnassignedQueue;
