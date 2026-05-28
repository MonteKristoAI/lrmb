import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
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
  const updateTask = useUpdateTask();
  const addUpdate = useAddTaskUpdate();
  const { toast } = useToast();

  const [reassignId, setReassignId] = useState<string | null>(null);
  const [newAssignee, setNewAssignee] = useState("");

  const handleReassign = async () => {
    if (!reassignId || !newAssignee || !user) return;
    const task = open.find((t) => t.id === reassignId);
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
      toast({ title: "Work order reassigned" });
      setReassignId(null);
      setNewAssignee("");
    } catch {
      toast({ title: "Failed to reassign work order", variant: "destructive" });
    }
  };

  return (
    <AppShell title="Open Work Orders">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          open.length ? open.map((t) => (
            <div key={t.id} className="space-y-1">
              <TaskCard task={t} />
              <div className="flex justify-end px-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground h-7"
                  onClick={() => setReassignId(t.id)}
                >
                  Reassign
                </Button>
              </div>
            </div>
          )) : <p className="text-muted-foreground text-center py-8">No open work orders yet.</p>
        )}
      </div>

      <Dialog open={!!reassignId} onOpenChange={(open) => { if (!open) setReassignId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reassign Work Order</DialogTitle></DialogHeader>
          <Select value={newAssignee} onValueChange={setNewAssignee}>
            <SelectTrigger className="tap-target"><SelectValue placeholder="Select staff" /></SelectTrigger>
            <SelectContent>{profiles.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}</SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={handleReassign} disabled={!newAssignee} className="tap-target">Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
};

export default OpenTasksQueue;
