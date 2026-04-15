import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { isPast } from "date-fns";

const OverdueQueue = () => {
  const { data: tasks = [], isLoading } = useAllTasks();
  const overdue = tasks.filter((t) => t.due_at && isPast(new Date(t.due_at)) && !["completed", "verified", "processed"].includes(t.status));

  return (
    <AppShell title="Overdue Tasks">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          overdue.length ? overdue.map((t) => <TaskCard key={t.id} task={t} />) : <p className="text-muted-foreground text-center py-8">No overdue tasks.</p>
        )}
      </div>
    </AppShell>
  );
};

export default OverdueQueue;
