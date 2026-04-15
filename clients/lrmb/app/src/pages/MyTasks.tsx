import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/tasks/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { PRIORITY_ORDER } from "@/types/task";
import { Skeleton } from "@/components/ui/skeleton";
import type { TaskStatus } from "@/types/task";

const ACTIVE_STATUSES: TaskStatus[] = ["new", "assigned", "vendor_not_started", "in_progress", "waiting_parts", "blocked"];

const MyTasks = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading } = useTasks(user ? { assigned_to: user.id, status: ACTIVE_STATUSES } : undefined);

  const sorted = tasks?.slice().sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 2;
    const pb = PRIORITY_ORDER[b.priority] ?? 2;
    if (pa !== pb) return pa - pb;
    if (a.due_at && b.due_at) return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
    if (a.due_at) return -1;
    if (b.due_at) return 1;
    return 0;
  });

  return (
    <AppShell title="My Tasks">
      <div className="p-4 space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
        ) : sorted?.length ? (
          sorted.map((t) => <TaskCard key={t.id} task={t} />)
        ) : (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground">No active tasks assigned.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default MyTasks;
