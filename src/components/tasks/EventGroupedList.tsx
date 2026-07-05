import { useI18n } from "@/lib/i18n";
import { TaskCard } from "@/components/tasks/TaskCard";
import { groupTasksByEvent, type EventGroupable, type EventGroup } from "@/lib/group-by-event";
import { safeFormat } from "@/lib/utils";
import { Calendar, RefreshCw, LogIn, LogOut, Sparkles, Wrench, ClipboardCheck, CircleDot } from "lucide-react";
import type { Task } from "@/types/task";

type GroupTask = Task & EventGroupable & {
  properties?: { name: string; region?: string | null; zone?: string | null } | null;
  units?: { unit_code: string; short_name?: string | null; bedrooms?: number | null } | null;
};

// Renders work orders grouped by operational event (unit + scheduled day) with a
// context header per group, instead of one long flat list. Same TaskCard body.
export function EventGroupedList({ tasks }: { tasks: GroupTask[] }) {
  const { t } = useI18n();
  const groups = groupTasksByEvent(tasks);

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.key} className="space-y-2">
          <div className="flex items-center gap-2 px-0.5">
            <EventIcon eventKey={g.eventKey} />
            <span className="text-sm font-semibold text-foreground">{g.unitLabel}</span>
            <span className="text-xs text-muted-foreground">{eventLabel(g, t)}</span>
            {g.dateKey && (
              <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {safeFormat(g.dateKey, "EEE, MMM d")}
              </span>
            )}
          </div>
          <div className="space-y-2 pl-1 border-l-2 border-border">
            <div className="space-y-2 pl-2">
              {g.tasks.map((task) => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function eventLabel(g: EventGroup<unknown>, t: (k: string) => string): string {
  switch (g.eventKey) {
    case "turnover": return t("Turnover");
    case "arrival": return t("Arrival");
    case "departure": return t("Departure");
    case "maintenance": return t("Maintenance");
    case "inspection": return t("Inspection");
    case "housekeeping": return t("Housekeeping");
    default: return t("Other work");
  }
}

function EventIcon({ eventKey }: { eventKey: EventGroup<unknown>["eventKey"] }) {
  const cls = "h-4 w-4 shrink-0 text-muted-foreground";
  switch (eventKey) {
    case "turnover": return <RefreshCw className={cls} aria-hidden="true" />;
    case "arrival": return <LogIn className={cls} aria-hidden="true" />;
    case "departure": return <LogOut className={cls} aria-hidden="true" />;
    case "housekeeping": return <Sparkles className={cls} aria-hidden="true" />;
    case "maintenance": return <Wrench className={cls} aria-hidden="true" />;
    case "inspection": return <ClipboardCheck className={cls} aria-hidden="true" />;
    default: return <CircleDot className={cls} aria-hidden="true" />;
  }
}
