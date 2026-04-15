import { AppShell } from "@/components/layout/AppShell";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STAGES: { key: string; label: string; statuses: string[] }[] = [
  { key: "scheduled", label: "Scheduled", statuses: ["new", "assigned", "vendor_not_started"] },
  { key: "cleaning", label: "Cleaning", statuses: ["in_progress", "waiting_parts"] },
  { key: "blocked", label: "Blocked", statuses: ["blocked"] },
  { key: "done", label: "Done", statuses: ["completed", "verified", "processed"] },
];

const HousekeepingQueue = () => {
  const { data: tasks = [], isLoading } = useTasks({ category: "housekeeping" });

  return (
    <AppShell title="Housekeeping">
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {STAGES.map((s) => {
                const count = tasks.filter((t) => s.statuses.includes(t.status)).length;
                return <TabsTrigger key={s.key} value={s.key} className="text-xs">{s.label} ({count})</TabsTrigger>;
              })}
            </TabsList>
            {STAGES.map((s) => {
              const filtered = tasks.filter((t) => s.statuses.includes(t.status));
              return (
                <TabsContent key={s.key} value={s.key} className="space-y-3 mt-3">
                  {filtered.length ? filtered.map((t) => <TaskCard key={t.id} task={t} />) : (
                    <p className="text-muted-foreground text-center py-8">No {s.label.toLowerCase()} tasks.</p>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>
    </AppShell>
  );
};

export default HousekeepingQueue;
