import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useOverdueTasks } from "@/hooks/useTasks";
import { EventGroupedList } from "@/components/tasks/EventGroupedList";
import { Skeleton } from "@/components/ui/skeleton";
import { AyaBrief } from "@/components/dashboard/AyaBrief";

const OverdueQueue = () => {
  const { t } = useI18n();
  const { data: overdue = [], isLoading } = useOverdueTasks();

  return (
    <AppShell title={t("Overdue Work Orders")}>
      <div className="p-4 space-y-3">
        {/* Aya for the maintenance lead: overdue work ranked by what to act on first. */}
        <AyaBrief scope="maintenance" />

        {isLoading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          overdue.length ? <EventGroupedList tasks={overdue} /> : <p className="text-muted-foreground text-center py-8">{t("No overdue work orders.")}</p>
        )}
      </div>
    </AppShell>
  );
};

export default OverdueQueue;
