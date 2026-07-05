import { describe, it, expect } from "vitest";
import { groupTasksByEvent, type EventGroupable } from "@/lib/group-by-event";

const mk = (over: Partial<EventGroupable> & { id: string }): EventGroupable => ({
  unit_id: "u1",
  scheduled_for: "2026-07-05T15:00:00Z",
  housekeeping_type: null,
  task_category: "maintenance",
  units: { unit_code: "2401", short_name: "Setai 2401" },
  ...over,
});

describe("groupTasksByEvent", () => {
  it("groups tasks of the same unit + scheduled day together", () => {
    const groups = groupTasksByEvent([
      mk({ id: "a" }),
      mk({ id: "b" }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].tasks.map((t) => t.id).sort()).toEqual(["a", "b"]);
    expect(groups[0].unitLabel).toBe("Setai 2401");
    expect(groups[0].dateKey).toBe("2026-07-05");
  });

  it("splits different units and different days", () => {
    const groups = groupTasksByEvent([
      mk({ id: "a", units: { unit_code: "2401", short_name: "Setai 2401" } }),
      mk({ id: "b", units: { unit_code: "2102", short_name: "Setai 2102" } }),
      mk({ id: "c", scheduled_for: "2026-07-06T15:00:00Z" }),
    ]);
    expect(groups.length).toBe(3);
  });

  it("derives turnover from checkout_clean housekeeping type", () => {
    const [g] = groupTasksByEvent([mk({ id: "a", housekeeping_type: "checkout_clean", task_category: "housekeeping" })]);
    expect(g.eventKey).toBe("turnover");
  });

  it("labels maintenance-only groups as maintenance", () => {
    const [g] = groupTasksByEvent([mk({ id: "a", housekeeping_type: null, task_category: "maintenance" })]);
    expect(g.eventKey).toBe("maintenance");
  });

  it("sorts scheduled groups before unscheduled, soonest first", () => {
    const groups = groupTasksByEvent([
      mk({ id: "late", scheduled_for: "2026-07-09T10:00:00Z", units: { unit_code: "9", short_name: "Late" } }),
      mk({ id: "none", scheduled_for: null, units: { unit_code: "0", short_name: "None" } }),
      mk({ id: "soon", scheduled_for: "2026-07-05T10:00:00Z", units: { unit_code: "1", short_name: "Soon" } }),
    ]);
    expect(groups.map((g) => g.tasks[0].id)).toEqual(["soon", "late", "none"]);
    expect(groups[2].dateKey).toBeNull();
  });

  it("does not lose any task across grouping", () => {
    const input = Array.from({ length: 20 }, (_, i) => mk({ id: `t${i}`, unit_id: `u${i % 4}`, units: { unit_code: `${i % 4}`, short_name: `Unit ${i % 4}` } }));
    const groups = groupTasksByEvent(input);
    const total = groups.reduce((n, g) => n + g.tasks.length, 0);
    expect(total).toBe(20);
  });
});
