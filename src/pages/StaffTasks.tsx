import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";

// QA Agent A P2 (2026-05-29): UUID guard. See PropertyTasks for context.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const StaffTasks = () => {
  const { id } = useParams<{ id: string }>();
  const validId = id && UUID_RE.test(id);
  const { data: tasks = [], isLoading } = useTasks(validId ? { assigned_to: id } : undefined);
  if (!validId) {
    return (
      <AppShell title="Staff Work Orders">
        <div className="p-4 text-center space-y-3">
          <p className="text-muted-foreground">Invalid staff URL.</p>
          <Link to="/admin" className="text-primary underline text-sm">Back to admin</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Staff Work Orders">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          tasks.length ? tasks.map((t) => <TaskCard key={t.id} task={t} />) : <p className="text-muted-foreground text-center py-8">No work orders for this staff member.</p>
        )}
      </div>
    </AppShell>
  );
};

export default StaffTasks;
