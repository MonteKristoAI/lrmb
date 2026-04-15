import { Badge } from "@/components/ui/badge";
import { TASK_PRIORITY_LABELS, TASK_PRIORITY_LABELS_ES, type TaskPriority } from "@/types/task";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const priorityClasses: Record<TaskPriority, string> = {
  low: "bg-priority-low/20 text-priority-low border-priority-low/30",
  medium: "bg-priority-medium/20 text-priority-medium border-priority-medium/30",
  high: "bg-priority-high/20 text-priority-high border-priority-high/30",
  urgent: "bg-priority-urgent/20 text-priority-urgent border-priority-urgent/30 animate-pulse",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { locale } = useI18n();
  const labels = locale === "es" ? TASK_PRIORITY_LABELS_ES : TASK_PRIORITY_LABELS;

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", priorityClasses[priority])}>
      {labels[priority]}
    </Badge>
  );
}
