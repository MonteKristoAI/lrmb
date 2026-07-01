import { useI18n } from "@/lib/i18n";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyTaskListProps {
  propertyId: string;
  limit?: number;
}

// v3.0 Wave 2 (2026-07-01): reusable per-property task list body extracted so
// both /admin/tasks/property/:id and /admin/properties/:id render the same
// list.
export function PropertyTaskList({ propertyId }: PropertyTaskListProps) {
  const { t } = useI18n();
  const { data: tasks = [], isLoading } = useTasks({ property_id: propertyId });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }
  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-8">{t("No work orders for this property.")}</p>;
  }
  return (
    <div className="space-y-3">
      {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
    </div>
  );
}
