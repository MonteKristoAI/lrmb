import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type UserRoleRow = { user_id: string };
type TaskRow = { id: string; title: string };
type NotificationRow = { task_id: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // QA P1 Q-SEC-15: cron-only endpoint (was previously verify_jwt=false in config).
  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Find overdue tasks that are not completed/verified
    const now = new Date().toISOString();
    const { data: overdueTasks, error: tasksErr } = await supabase
      .from("tasks")
      .select("id, title, assigned_to, due_at")
      .not("status", "in", '("completed","verified")')
      .lt("due_at", now)
      .not("due_at", "is", null);

    if (tasksErr) throw tasksErr;

    // Get all supervisor/admin user IDs
    const { data: adminRoles, error: rolesErr } = await supabase
      .from("user_roles")
      .select("user_id")
      .in("role", ["admin", "supervisor", "manager"]);

    if (rolesErr) throw rolesErr;

    const adminIds = [...new Set((adminRoles ?? []).map((r: UserRoleRow) => r.user_id))];

    // Check which overdue tasks already have a recent escalation notification (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const overdueTaskIds = (overdueTasks ?? []).map((t: TaskRow) => t.id);

    // L10 audit 2026-06-09 P0-6: PostgREST URL cap (~8K) truncates .in()
    // beyond ~200 UUIDs. With 500+ overdue tasks on initial deploy, the
    // alreadyNotified set comes back partial → re-notifies all admins for
    // already-notified tasks → notification storm.
    // Fix: chunk the .in() lookup to 100 at a time.
    const CHUNK = 100;
    const alreadyNotified = new Set<string>();
    for (let i = 0; i < overdueTaskIds.length; i += CHUNK) {
      const slice = overdueTaskIds.slice(i, i + CHUNK);
      // L10 wave 16 (2026-06-10): capture error. Old version destructured
      // only `data` and silently dropped failures — alreadyNotified came
      // back incomplete, every admin got re-notified, the chunking guard
      // was useless.
      const { data: existingNotifs, error: lookupErr } = await supabase
        .from("notification_events")
        .select("task_id")
        .eq("event_type", "task_overdue")
        .in("task_id", slice)
        .gte("created_at", oneDayAgo);
      if (lookupErr) {
        console.error(`escalate-overdue alreadyNotified lookup failed at offset ${i}`, lookupErr);
        return new Response(
          JSON.stringify({ error: "lookup_failed", offset: i }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      for (const n of (existingNotifs ?? []) as NotificationRow[]) {
        alreadyNotified.add(n.task_id);
      }
    }

    // L10 audit 2026-06-09 P2-4: per-admin per-run cap so a 500-overdue
    // backlog doesn't spam every admin with 500 individual notifications.
    // Bundle excess into one summary row per admin.
    const PER_ADMIN_CAP = 20;
    const perAdminCount = new Map<string, number>();
    const perAdminExtra = new Map<string, number>();
    const notifications: Array<{ recipient_id: string; task_id: string; event_type: string; title: string; body: string }> = [];
    for (const task of (overdueTasks ?? []) as TaskRow[]) {
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
    // Add summary rows for over-cap admins. task_id reused: we point them
    // back to the most recent overdue task as a representative anchor.
    const lastOverdue = (overdueTasks?.[overdueTasks.length - 1] as TaskRow | undefined);
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

    // L10 wave 11 (2026-06-10) — P1-1 from verify agent: chunked insert.
    // Old single .insert(notifications) was all-or-nothing — if one row hit
    // a FK violation, the whole 152-row batch rolled back and EVERY admin
    // missed every alert. Chunks of 200 isolate failure to a single chunk.
    // failedChunks counted so audit shows partial-failure runs.
    const INSERT_CHUNK = 200;
    let failedChunks = 0;
    for (let i = 0; i < notifications.length; i += INSERT_CHUNK) {
      const slice = notifications.slice(i, i + INSERT_CHUNK);
      const { error: insertErr } = await supabase
        .from("notification_events")
        .insert(slice);
      if (insertErr) {
        failedChunks++;
        console.error(`escalate-overdue chunk ${i}..${i + slice.length} failed:`, insertErr);
      }
    }

    // L10 wave 16: 207 Multi-Status on partial failure so Healthchecks
    // surfaces the partial-failure instead of green-200ing every run.
    return new Response(
      JSON.stringify({ escalated: notifications.length, failed_chunks: failedChunks }),
      {
        status: failedChunks > 0 ? 207 : 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    // QA P2 Q-SEC-23: don't leak DB error text to caller; log server-side only.
    console.error("escalate-overdue-tasks failed", err);
    return new Response(
      JSON.stringify({ error: "escalation_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
