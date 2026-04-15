import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

    const adminIds = [...new Set(adminRoles.map((r: any) => r.user_id))];

    // Check which overdue tasks already have a recent escalation notification (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const overdueTaskIds = (overdueTasks || []).map((t: any) => t.id);

    const { data: existingNotifs } = await supabase
      .from("notification_events")
      .select("task_id")
      .eq("event_type", "task_overdue")
      .in("task_id", overdueTaskIds)
      .gte("created_at", oneDayAgo);

    const alreadyNotified = new Set((existingNotifs || []).map((n: any) => n.task_id));

    const notifications: any[] = [];
    for (const task of overdueTasks || []) {
      if (alreadyNotified.has(task.id)) continue;
      for (const adminId of adminIds) {
        notifications.push({
          recipient_id: adminId,
          task_id: task.id,
          event_type: "task_overdue",
          title: "Overdue Task",
          body: `${task.title} is past due`,
        });
      }
    }

    if (notifications.length > 0) {
      const { error: insertErr } = await supabase
        .from("notification_events")
        .insert(notifications);
      if (insertErr) throw insertErr;
    }

    return new Response(
      JSON.stringify({ escalated: notifications.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
