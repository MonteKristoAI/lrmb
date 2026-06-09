import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useTasksByStatus, useGuardedTaskTransition, useAddTaskUpdate } from "@/hooks/useTasks";
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
  const { t } = useI18n();
  const { toast } = useToast();
  // v32: real status=completed query for verification queue, not a filter on 500-row slice.
  const { data: pending = [], isLoading } = useTasksByStatus(["completed"], {
    orderBy: "completed_at", ascending: false, limit: 500,
  });
  const guardedTransition = useGuardedTaskTransition();
  const addUpdate = useAddTaskUpdate();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (taskId: string) => {
    if (!user || verifyingId) return;
    setVerifyingId(taskId);
    try {
      // v33: guarded transition — only verifies if the task is still "completed".
      // If someone else verified or reopened it in the meantime, this throws.
      await guardedTransition.mutateAsync({
        id: taskId,
        expectedStatus: "completed",
        status: "verified",
        verified_at: new Date().toISOString(),
      });
      await addUpdate.mutateAsync({ task_id: taskId, actor_id: user.id, update_type: "status_change", old_status: "completed", new_status: "verified" });
      toast({ title: t("Work order verified") });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("Failed to verify work order");
      toast({ title: msg, variant: "destructive" });
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <AppShell title={t("Verification Queue")}>
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          pending.length ? pending.map((task) => (
            <Card key={task.id} className="cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => navigate(`/tasks/${task.id}`)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-medium text-sm text-foreground truncate">{task.title}</p>
                  <div className="flex gap-2"><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
                  <p className="text-xs text-muted-foreground">{task.properties?.name}</p>
                </div>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); handleVerify(task.id); }} disabled={verifyingId === task.id} className="tap-target gap-1 bg-status-verified hover:bg-status-verified/90 text-primary-foreground shrink-0">
                  <CheckCircle2 className="h-4 w-4" /> {verifyingId === task.id ? t("Verifying...") : t("Verify")}
                </Button>
              </CardContent>
            </Card>
          )) : <p className="text-muted-foreground text-center py-8">{t("No work orders pending verification.")}</p>
        )}
      </div>
    </AppShell>
  );
};

export default VerificationQueue;
