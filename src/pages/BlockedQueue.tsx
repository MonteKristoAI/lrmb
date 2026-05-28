import { AppShell } from "@/components/layout/AppShell";
import { useTasksByStatus } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

const BlockedQueue = () => {
  // v32: real status=blocked query, not a filter on the 500-row slice.
  const { data: blocked = [], isLoading } = useTasksByStatus(["blocked"], {
    orderBy: "updated_at", ascending: false, limit: 500,
  });

  return (
    <AppShell title="Blocked Work Orders">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          blocked.length ? blocked.map((t) => <TaskCard key={t.id} task={t} />) : <p className="text-muted-foreground text-center py-8">No blocked work orders.</p>
        )}
      </div>
    </AppShell>
  );
};

export default BlockedQueue;
