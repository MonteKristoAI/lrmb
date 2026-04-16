import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks, useUpdateTask } from "@/hooks/useTasks";
import { useProfiles } from "@/hooks/useProperties";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const OpenTasksQueue = () => {
  const { data: tasks = [], isLoading } = useAllTasks();
  const { data: profiles = [] } = useProfiles();
  const updateTask = useUpdateTask();
  const { toast } = useToast();
  const open = tasks.filter((t) => !["completed", "verified", "processed"].includes(t.status));

  const [reassignId, setReassignId] = useState<string | null>(null);
  const [newAssignee, setNewAssignee] = useState("");

  const handleReassign = async () => {
    if (!reassignId || !newAssignee) return;
    try {
      await updateTask.mutateAsync({ id: reassignId, assigned_to: newAssignee, status: "assigned" });
      toast({ title: "Task reassigned" });
      setReassignId(null);
      setNewAssignee("");
    } catch {
      toast({ title: "Failed to reassign task", variant: "destructive" });
    }
  };

  return (
    <AppShell title="Open Tasks">
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
          )) : <p className="text-muted-foreground text-center py-8">No open tasks.</p>
        )}
      </div>

      <Dialog open={!!reassignId} onOpenChange={(open) => { if (!open) setReassignId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reassign Task</DialogTitle></DialogHeader>
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
