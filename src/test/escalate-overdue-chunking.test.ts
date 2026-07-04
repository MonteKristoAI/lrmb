// L10 audit 2026-06-09: escalate-overdue-tasks v2 has two production
// hazards that need pinning:
//
//   P0-6: PostgREST URL cap (~8K) silently truncates .in('task_id', [...]).
//         With 500+ overdue tasks on initial deploy, the alreadyNotified
//         lookup returned partial → re-notified every admin for every
//         already-notified task → notification storm.
//         Fix: chunk into batches of 100.
//
//   P2-4: A 500-overdue backlog × N admins = N × 500 rows inserted in one
//         run. Cap per-admin at 20, fold the rest into ONE summary row.
//
// These tests pin both behaviors using an in-memory simulation that
// matches the loop structure in escalate-overdue-tasks/index.ts. Keep
// in sync with that file.

import { describe, expect, it } from "vitest";

const CHUNK = 100;
const PER_ADMIN_CAP = 20;

type Task = { id: string; title: string };
type Notif = { recipient_id: string; task_id: string; event_type: string; title: string; body: string };

// Simulates the .in() lookup with a fake database. Mirrors the loop's
// chunking behavior so we can verify ALL ids land in the result.
function simulateAlreadyNotifiedLookup(
  overdueTaskIds: string[],
  databaseHas: (id: string) => boolean,
): { lookups: number; alreadyNotified: Set<string> } {
  const alreadyNotified = new Set<string>();
  let lookups = 0;
  for (let i = 0; i < overdueTaskIds.length; i += CHUNK) {
    const slice = overdueTaskIds.slice(i, i + CHUNK);
    lookups++;
    for (const id of slice) {
      if (databaseHas(id)) alreadyNotified.add(id);
    }
  }
  return { lookups, alreadyNotified };
}

function simulateNotificationGeneration(
  overdueTasks: Task[],
  adminIds: string[],
  alreadyNotified: Set<string>,
): Notif[] {
  const perAdminCount = new Map<string, number>();
  const perAdminExtra = new Map<string, number>();
  const notifications: Notif[] = [];

  for (const task of overdueTasks) {
    if (alreadyNotified.has(task.id)) continue;
    for (const adminId of adminIds) {
      const count = perAdminCount.get(adminId) ?? 0;
      if (count >= PER_ADMIN_CAP) {
        perAdminExtra.set(adminId, (perAdminExtra.get(adminId) ?? 0) + 1);
        continue;
      }
      perAdminCount.set(adminId, count + 1);
      notifications.push({
        recipient_id: adminId,
        task_id: task.id,
        event_type: "task_overdue",
        title: "Overdue Task",
        body: `${task.title} is past due`,
      });
    }
  }

  const lastOverdue = overdueTasks[overdueTasks.length - 1];
  for (const [adminId, extra] of perAdminExtra.entries()) {
    if (extra <= 0 || !lastOverdue) continue;
    notifications.push({
      recipient_id: adminId,
      task_id: lastOverdue.id,
      event_type: "task_overdue_bulk",
      title: `+${extra} more overdue`,
      body: `${extra} additional work order${extra === 1 ? " is" : "s are"} past due. Open the Overdue queue to review.`,
    });
  }

  return notifications;
}

describe("escalate-overdue-tasks - chunked .in() lookup", () => {
  it("100 ids => exactly 1 lookup, all matches recovered", () => {
    const ids = Array.from({ length: 100 }, (_, i) => `task-${i}`);
    const { lookups, alreadyNotified } = simulateAlreadyNotifiedLookup(ids, () => true);
    expect(lookups).toBe(1);
    expect(alreadyNotified.size).toBe(100);
  });

  it("101 ids => 2 lookups (no off-by-one)", () => {
    const ids = Array.from({ length: 101 }, (_, i) => `task-${i}`);
    const { lookups, alreadyNotified } = simulateAlreadyNotifiedLookup(ids, () => true);
    expect(lookups).toBe(2);
    expect(alreadyNotified.size).toBe(101);
  });

  it("500 ids => 5 lookups, all 500 recovered (P0-6 storm fix)", () => {
    const ids = Array.from({ length: 500 }, (_, i) => `task-${i}`);
    const { lookups, alreadyNotified } = simulateAlreadyNotifiedLookup(ids, () => true);
    expect(lookups).toBe(5);
    expect(alreadyNotified.size).toBe(500);
  });

  it("501 ids => 6 lookups, all 501 recovered", () => {
    const ids = Array.from({ length: 501 }, (_, i) => `task-${i}`);
    const { lookups, alreadyNotified } = simulateAlreadyNotifiedLookup(ids, () => true);
    expect(lookups).toBe(6);
    expect(alreadyNotified.size).toBe(501);
  });

  it("partial matches across chunks all recovered (sparse DB)", () => {
    const ids = Array.from({ length: 250 }, (_, i) => `task-${i}`);
    const seenInDb = new Set(["task-0", "task-99", "task-100", "task-249"]);
    const { lookups, alreadyNotified } = simulateAlreadyNotifiedLookup(ids, (id) => seenInDb.has(id));
    expect(lookups).toBe(3);
    expect(alreadyNotified).toEqual(seenInDb);
  });

  it("empty input => 0 lookups, empty set", () => {
    const { lookups, alreadyNotified } = simulateAlreadyNotifiedLookup([], () => true);
    expect(lookups).toBe(0);
    expect(alreadyNotified.size).toBe(0);
  });
});

describe("escalate-overdue-tasks - per-admin cap with summary fold", () => {
  it("under cap => no summary row", () => {
    const tasks: Task[] = Array.from({ length: 5 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const notifs = simulateNotificationGeneration(tasks, ["admin-1"], new Set());
    expect(notifs).toHaveLength(5);
    expect(notifs.every(n => n.event_type === "task_overdue")).toBe(true);
  });

  it("exactly at cap => no summary row", () => {
    const tasks: Task[] = Array.from({ length: 20 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const notifs = simulateNotificationGeneration(tasks, ["admin-1"], new Set());
    expect(notifs).toHaveLength(20);
    expect(notifs.every(n => n.event_type === "task_overdue")).toBe(true);
  });

  it("21 tasks => 20 individual + 1 summary with '+1 more'", () => {
    const tasks: Task[] = Array.from({ length: 21 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const notifs = simulateNotificationGeneration(tasks, ["admin-1"], new Set());
    expect(notifs).toHaveLength(21);
    const summary = notifs.find(n => n.event_type === "task_overdue_bulk");
    expect(summary).toBeDefined();
    expect(summary?.title).toBe("+1 more overdue");
    // Singular grammar in body
    expect(summary?.body).toContain("1 additional work order is past due");
  });

  it("500 tasks × 3 admins => 60 individual + 3 summary = 63 (NOT 1500)", () => {
    const tasks: Task[] = Array.from({ length: 500 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const notifs = simulateNotificationGeneration(tasks, ["a1", "a2", "a3"], new Set());
    const individual = notifs.filter(n => n.event_type === "task_overdue");
    const summaries = notifs.filter(n => n.event_type === "task_overdue_bulk");
    expect(individual).toHaveLength(60);
    expect(summaries).toHaveLength(3);
    // Each admin gets the +480 summary
    for (const s of summaries) {
      expect(s.title).toBe("+480 more overdue");
      expect(s.body).toContain("480 additional work orders are past due");
    }
  });

  it("alreadyNotified tasks excluded before cap counted (no phantom +X)", () => {
    const tasks: Task[] = Array.from({ length: 25 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const alreadyNotified = new Set(tasks.slice(0, 20).map(t => t.id));
    const notifs = simulateNotificationGeneration(tasks, ["admin-1"], alreadyNotified);
    // Only 5 new ones → all individual, no summary
    expect(notifs).toHaveLength(5);
    expect(notifs.every(n => n.event_type === "task_overdue")).toBe(true);
  });

  it("summary task_id points at the LAST overdue task as a representative anchor", () => {
    const tasks: Task[] = Array.from({ length: 25 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const notifs = simulateNotificationGeneration(tasks, ["admin-1"], new Set());
    const summary = notifs.find(n => n.event_type === "task_overdue_bulk");
    expect(summary?.task_id).toBe("t24");
  });

  it("zero admins => zero notifications (no NaN, no crash)", () => {
    const tasks: Task[] = Array.from({ length: 50 }, (_, i) => ({ id: `t${i}`, title: `T${i}` }));
    const notifs = simulateNotificationGeneration(tasks, [], new Set());
    expect(notifs).toHaveLength(0);
  });

  it("zero overdue tasks => zero notifications even with admins", () => {
    const notifs = simulateNotificationGeneration([], ["a1", "a2"], new Set());
    expect(notifs).toHaveLength(0);
  });
});
