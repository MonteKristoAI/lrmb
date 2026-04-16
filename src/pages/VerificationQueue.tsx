import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks, useUpdateTask, useAddTaskUpdate } from "@/hooks/useTasks";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { CheckCircle2 } from "lucide-react";

const VerificationQueue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: tasks = [], isLoading } = useAllTasks();
  const updateTask = useUpdateTask();
  const addUpdate = useAddTaskUpdate();
  const pending = tasks.filter((t) => t.status === "completed");

  const handleVerify = async (taskId: string) => {
    if (!user) return;
    try {
      await updateTask.mutateAsync({ id: taskId, status: "verified", verified_at: new Date().toISOString() });
      await addUpdate.mutateAsync({ task_id: taskId, actor_id: user.id, update_type: "status_change", old_status: "completed", new_status: "verified" });
      toast({ title: "Task verified" });
    } catch {
      toast({ title: "Failed to verify task", variant: "destructive" });
    }
  };

  return (
    <AppShell title="Verification Queue">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          pending.length ? pending.map((t) => (
            <Card key={t.id} className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => navigate(`/tasks/${t.id}`)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium text-sm text-foreground truncate">{t.title}</p>
                  <div className="flex gap-2"><StatusBadge status={t.status} /><PriorityBadge priority={t.priority} /></div>
                  <p className="text-xs text-muted-foreground">{t.properties?.name}</p>
                </div>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleVerify(t.id); }} disabled={updateTask.isPending} className="tap-target gap-1 bg-status-verified hover:bg-status-verified/90 text-primary-foreground shrink-0">
                  <CheckCircle2 className="h-4 w-4" /> {updateTask.isPending ? "Verifying..." : "Verify"}
                </Button>
              </CardContent>
            </Card>
          )) : <p className="text-muted-foreground text-center py-8">No tasks pending verification.</p>
        )}
      </div>
    </AppShell>
  );
};

export default VerificationQueue;
