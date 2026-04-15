import { Badge } from "@/components/ui/badge";
import { TASK_STATUS_LABELS, TASK_STATUS_LABELS_ES, type TaskStatus } from "@/types/task";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const statusClasses: Record<TaskStatus, string> = {
  new: "bg-status-new/20 text-status-new border-status-new/30",
  assigned: "bg-status-assigned/20 text-status-assigned border-status-assigned/30",
  vendor_not_started: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  in_progress: "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
  waiting_parts: "bg-status-waiting/20 text-status-waiting border-status-waiting/30",
  blocked: "bg-status-blocked/20 text-status-blocked border-status-blocked/30",
  completed: "bg-status-completed/20 text-status-completed border-status-completed/30",
  verified: "bg-status-verified/20 text-status-verified border-status-verified/30",
  processed: "bg-emerald-600/20 text-emerald-700 border-emerald-600/30",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const { locale } = useI18n();
  const labels = locale === "es" ? TASK_STATUS_LABELS_ES : TASK_STATUS_LABELS;

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", statusClasses[status])}>
      {labels[status]}
    </Badge>
  );
}
