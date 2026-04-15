import { useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

const StaffTasks = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tasks = [], isLoading } = useTasks({ assigned_to: id });

  return (
    <AppShell title="Staff Tasks">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          tasks.length ? tasks.map((t) => <TaskCard key={t.id} task={t} />) : <p className="text-muted-foreground text-center py-8">No tasks for this staff member.</p>
        )}
      </div>
    </AppShell>
  );
};

export default StaffTasks;
