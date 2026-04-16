import { AppShell } from "@/components/layout/AppShell";
import { useAllTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

const BlockedQueue = () => {
  const { data: tasks = [], isLoading } = useAllTasks();
  const blocked = tasks.filter((t) => t.status === "blocked");

  return (
    <AppShell title="Blocked Tasks">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          blocked.length ? blocked.map((t) => <TaskCard key={t.id} task={t} />) : <p className="text-muted-foreground text-center py-8">No blocked tasks.</p>

        )}
      </div>
    </AppShell>
  );
};

export default BlockedQueue;
