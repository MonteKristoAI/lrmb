// On-demand sync of per-WO TRACK sub-tasks (the inspection / clean
// checklist Emma wants surfaced). Called from the field-staff PWA
// when the user opens a WO detail. Fetches /api/pms/housekeeping/
// work-orders/{external_id}/tasks and upserts public.track_wo_subtasks.
//
// Why on-demand instead of in track-poll: 25 sub-tasks × thousands of
// HK WOs × 5-min cron = unsustainable. Most WOs are never opened by a
// human, so we sync lazily on first detail view and re-sync if the row
// is older than 5 minutes.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;
const STALE_AFTER_MS = 5 * 60 * 1000;

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const sbUrl = Deno.env.get("SUPABASE_URL");
  const srKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !srKey || !TRACK_KEY || !TRACK_SECRET) {
    return json(500, { error: "server_misconfigured" });
  }

  let body: { external_id?: string; force?: boolean };
  try {
    body = await req.json();
  } catch (_) {
    return json(400, { error: "bad_json" });
  }
  const externalId = String(body.external_id ?? "").trim();
  if (!/^[0-9]+$/.test(externalId)) {
    return json(400, { error: "invalid_external_id" });
  }

  const supabase = createClient(sbUrl, srKey);

  // Look up local task by external_id
  const { data: parent, error: parentErr } = await supabase
    .from("tasks")
    .select("id, task_category, external_source")
    .eq("external_source", "track")
    .eq("external_id", externalId)
    .maybeSingle();
  if (parentErr || !parent) {
    return json(404, { error: "task_not_found" });
  }

  // Emma round 4 (2026-05-29): hard gate by category. TRACK upstream
  // returns HK-style checklist items even for maintenance WO IDs (the
  // /housekeeping/work-orders/{id}/tasks endpoint does not enforce
  // category matching). Caused Emma's TEST WO #30726 (maintenance) to
  // surface 23 HK subtasks ("Remove trash", "Strip linen on the bed",
  // etc.). Skip the upstream fetch entirely if parent isn't HK; return
  // an empty payload so the frontend can render its non-checklist
  // surface. Defense-in-depth — a DB trigger rejects insertion at the
  // row level too.
  if (parent.task_category !== "housekeeping") {
    return json(200, {
      from_cache: false,
      items: [],
      skipped_reason: "non_housekeeping_no_checklist",
    });
  }

  // Stale-check: skip TRACK fetch if we synced in the last 5 min and not forced.
  if (!body.force) {
    const { data: latest } = await supabase
      .from("track_wo_subtasks")
      .select("synced_at")
      .eq("task_id", parent.id)
      .order("synced_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest?.synced_at && Date.now() - new Date(latest.synced_at as string).getTime() < STALE_AFTER_MS) {
      const { data } = await supabase
        .from("track_wo_subtasks")
        .select("*")
        .eq("task_id", parent.id)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("track_id", { ascending: true });
      return json(200, { from_cache: true, items: data ?? [] });
    }
  }

  // Fetch from TRACK. Only HK WOs have a /tasks endpoint.
  const trackUrl = `${BASE}/housekeeping/work-orders/${externalId}/tasks?limit=200`;
  const trackRes = await fetch(trackUrl, {
    headers: {
      Authorization: "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`),
      Accept: "application/json",
      "User-Agent": "MK/LRMB-track-wo-subtasks/1.0",
    },
  });
  if (!trackRes.ok) {
    return json(502, { error: "track_fetch_failed", status: trackRes.status });
  }
  const payload = await trackRes.json();
  const embedded = (payload?._embedded ?? {}) as Record<string, unknown>;
  const items = (embedded.tasks ?? embedded.items ?? Object.values(embedded)[0] ?? []) as Array<Record<string, unknown>>;
  const now = new Date().toISOString();

  const rows = items
    .map((it) => {
      const tid = typeof it.id === "number" ? it.id : Number(it.id ?? NaN);
      if (!Number.isFinite(tid)) return null;
      return {
        track_id: tid,
        task_id: parent.id as string,
        name: String(it.name ?? "").slice(0, 1000),
        sort_order: typeof it.sortOrder === "number" ? it.sortOrder : (typeof it.sort_order === "number" ? it.sort_order : null),
        is_completed: Boolean(it.isCompleted ?? it.is_completed ?? false),
        completed_at: (it.completedAt as string | undefined) ?? null,
        completed_by: it.completedBy ? String(it.completedBy).slice(0, 80) : null,
        synced_at: now,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length > 0) {
    const { error: upErr } = await supabase
      .from("track_wo_subtasks")
      .upsert(rows, { onConflict: "track_id" });
    if (upErr) return json(500, { error: "upsert_failed", detail: upErr.message });
  }

  // Re-read after upsert so RLS-projected result matches caller's view.
  const { data: finalRows } = await supabase
    .from("track_wo_subtasks")
    .select("*")
    .eq("task_id", parent.id)
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("track_id", { ascending: true });

  return json(200, { from_cache: false, fetched: rows.length, items: finalRows ?? [] });
});
