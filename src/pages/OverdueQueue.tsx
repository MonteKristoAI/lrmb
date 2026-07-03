import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useOverdueTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

const OverdueQueue = () => {
  const { t } = useI18n();
  const { data: overdue = [], isLoading } = useOverdueTasks();

  return (
    <AppShell title={t("Overdue Work Orders")}>
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          overdue.length ? overdue.map((task) => <TaskCard key={task.id} task={task} />) : <p className="text-muted-foreground text-center py-8">{t("No overdue work orders.")}</p>
        )}
      </div>
    </AppShell>
  );
};

export default OverdueQueue;
