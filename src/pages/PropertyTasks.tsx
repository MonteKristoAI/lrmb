import { useParams, Link } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useI18n } from "@/lib/i18n";
import { useTasks } from "@/hooks/useTasks";
import { EventGroupedList } from "@/components/tasks/EventGroupedList";
import { Skeleton } from "@/components/ui/skeleton";

// QA Agent A P2 (2026-05-29): UUID guard. Without it, a URL like
// /admin/tasks/property/javascript:alert(1) fires a PostgREST query
// that returns 400, surfaces error in console, and looks like a route
// contract violation.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PropertyTasks = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const validId = id && UUID_RE.test(id);
  const { data: tasks = [], isLoading } = useTasks(validId ? { property_id: id } : undefined);

  if (!validId) {
    return (
      <AppShell title={t("Property Work Orders")}>
        <div className="p-4 text-center space-y-3">
          <p className="text-muted-foreground">{t("Invalid property URL.")}</p>
          <Link to="/admin" className="text-primary underline text-sm">{t("Back to admin")}</Link>
        </div>
      </AppShell>
    );
  }

  const propertyName = tasks[0]?.properties?.name || t("Property");

  return (
    <AppShell title={`${propertyName} ${t("Work Orders")}`}>
      <div className="p-4 space-y-3">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />) : (
          tasks.length ? <EventGroupedList tasks={tasks} /> : <p className="text-muted-foreground text-center py-8">{t("No work orders for this property.")}</p>
        )}
      </div>
    </AppShell>
  );
};

export default PropertyTasks;
