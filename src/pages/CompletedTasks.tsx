import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useTasks, useAllTasks } from "@/hooks/useTasks";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskStatus } from "@/types/task";

const DONE_STATUSES: TaskStatus[] = ["completed", "verified", "processed"];

const CompletedTasks = () => {
  const { user, hasAdminAccess } = useAuth();
  const isAdmin = hasAdminAccess();
  // Staff: fetch only their completed tasks; Admin: reuse the allTasks cache
  const myCompleted = useTasks(!isAdmin && user ? { assigned_to: user.id, status: DONE_STATUSES } : { status: DONE_STATUSES });
  const allTasks = useAllTasks();
  const { data: rawTasks, isLoading } = isAdmin
    ? { data: (allTasks.data ?? []).filter((t) => DONE_STATUSES.includes(t.status)), isLoading: allTasks.isLoading }
    : myCompleted;
  // Limit to most recent 100 completed tasks for performance
  const tasks = rawTasks?.slice(0, 100);

  return (
    <AppShell title="Completed">
      <div className="p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : tasks?.length ? (
          tasks.map((t) => <TaskCard key={t.id} task={t} />)
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground">No completed tasks yet.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CompletedTasks;
