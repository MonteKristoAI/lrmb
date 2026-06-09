import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useTasks, useTasksByStatus } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskStatus } from "@/types/task";

// 2026-06-09: include 'cancelled' so cancelled-in-TRACK WOs remain findable
// in the Completed view. Otherwise they vanish from every UI surface and
// staff has no way to audit "what got cancelled this week".
const DONE_STATUSES: TaskStatus[] = ["completed", "verified", "processed", "cancelled"];

const CompletedTasks = () => {
  const { user, hasAdminAccess } = useAuth();
  const isAdmin = hasAdminAccess();
  // v35: admin path now reads a real status=done query ordered by completed_at,
  // not a filter on the 500-newest-by-created_at slice that lost older work.
  const adminCompleted = useTasksByStatus(
    isAdmin ? DONE_STATUSES : [],
    isAdmin ? { orderBy: "completed_at", ascending: false, limit: 500 } : undefined,
  );
  const myCompleted = useTasks(!isAdmin && user ? { assigned_to: user.id, status: DONE_STATUSES } : undefined);
  const { data: rawTasks, isLoading } = isAdmin
    ? { data: adminCompleted.data, isLoading: adminCompleted.isLoading }
    : { data: myCompleted.data, isLoading: myCompleted.isLoading };
  const tasks = rawTasks?.slice(0, 200);

  return (
    <AppShell title="Completed">
      <div className="p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : tasks?.length ? (
          tasks.map((t) => <TaskCard key={t.id} task={t} />)
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground">No completed work orders yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CompletedTasks;
