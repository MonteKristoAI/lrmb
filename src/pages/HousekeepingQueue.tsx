import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STAGE_DEFS: { key: string; labelKey: string; statuses: string[] }[] = [
  { key: "scheduled", labelKey: "Scheduled", statuses: ["new", "assigned", "vendor_not_started"] },
  { key: "cleaning", labelKey: "Cleaning", statuses: ["in_progress", "waiting_parts"] },
  { key: "blocked", labelKey: "Blocked", statuses: ["blocked"] },
  { key: "done", labelKey: "Done", statuses: ["completed", "verified", "processed"] },
];

const HousekeepingQueue = () => {
  const { t } = useI18n();
  const { data: tasks = [], isLoading } = useTasks({ category: "housekeeping" });

  return (
    <AppShell title={t("Housekeeping")}>
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {STAGE_DEFS.map((s) => {
                const count = tasks.filter((task) => s.statuses.includes(task.status)).length;
                return <TabsTrigger key={s.key} value={s.key} className="text-xs">{t(s.labelKey)} ({count})</TabsTrigger>;
              })}
            </TabsList>
            {STAGE_DEFS.map((s) => {
              const filtered = tasks.filter((task) => s.statuses.includes(task.status));
              return (
                <TabsContent key={s.key} value={s.key} className="space-y-3 mt-3">
                  {filtered.length ? filtered.map((task) => <TaskCard key={task.id} task={task} />) : (
                    <p className="text-muted-foreground text-center py-8">{t("No work orders in this stage.")}</p>
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
