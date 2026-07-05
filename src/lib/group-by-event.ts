// Group work orders by operational event, not a flat list (Nemr 2026-07-05:
// "group work by property and by operational event instead of long task lists").
//
// MVP grouping key = unit + scheduled day. All work for a unit on a given day is
// that day's operational event for that unit (a turnover, an arrival prep, etc.).
// Pure + presentation-agnostic: returns the group structure with raw values; the
// component formats the labels (date, i18n) so this stays testable.

export interface EventGroupable {
  id: string;
  unit_id?: string | number | null;
  scheduled_for?: string | null;
  housekeeping_type?: string | null;
  task_category?: string | null;
  units?: { unit_code?: string | null; short_name?: string | null } | null;
}

export interface EventGroup<T> {
  key: string;
  unitLabel: string;
  // ISO date (YYYY-MM-DD) of the scheduled day, or null when unscheduled.
  dateKey: string | null;
  // Coarse operational event type derived from the work in the group.
  eventKey: "turnover" | "arrival" | "departure" | "housekeeping" | "maintenance" | "inspection" | "other";
  tasks: T[];
}

function unitLabelOf(t: EventGroupable): string {
  return t.units?.short_name || t.units?.unit_code || (t.unit_id != null ? `Unit ${t.unit_id}` : "Unassigned unit");
}

function dateKeyOf(t: EventGroupable): string | null {
  if (!t.scheduled_for) return null;
  const d = new Date(t.scheduled_for);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

// The dominant event type for a set of tasks in one unit-day group.
function eventKeyOf(tasks: EventGroupable[]): EventGroup<unknown>["eventKey"] {
  const hk = tasks.map((t) => t.housekeeping_type).filter(Boolean) as string[];
  if (hk.some((h) => h === "checkout_clean" || h === "turnover_clean")) return "turnover";
  if (hk.some((h) => h === "arrival_clean" || h === "pre_arrival")) return "arrival";
  if (hk.length > 0) return "housekeeping";
  const cats = tasks.map((t) => t.task_category).filter(Boolean) as string[];
  if (cats.includes("inspection")) return "inspection";
  if (cats.includes("maintenance")) return "maintenance";
  return "other";
}

export function groupTasksByEvent<T extends EventGroupable>(tasks: T[]): EventGroup<T>[] {
  const map = new Map<string, T[]>();
  for (const task of tasks) {
    const key = `${unitLabelOf(task)}::${dateKeyOf(task) ?? "unscheduled"}`;
    const arr = map.get(key);
    if (arr) arr.push(task);
    else map.set(key, [task]);
  }

  const groups: EventGroup<T>[] = [];
  for (const [key, groupTasks] of map) {
    groups.push({
      key,
      unitLabel: unitLabelOf(groupTasks[0]),
      dateKey: dateKeyOf(groupTasks[0]),
      eventKey: eventKeyOf(groupTasks),
      tasks: groupTasks,
    });
  }

  // Scheduled groups first, soonest date first; unscheduled last; then by unit.
  groups.sort((a, b) => {
    if (a.dateKey && b.dateKey) return a.dateKey < b.dateKey ? -1 : a.dateKey > b.dateKey ? 1 : a.unitLabel.localeCompare(b.unitLabel);
    if (a.dateKey) return -1;
    if (b.dateKey) return 1;
    return a.unitLabel.localeCompare(b.unitLabel);
  });

  return groups;
}
