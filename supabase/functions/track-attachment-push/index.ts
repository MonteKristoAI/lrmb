// D2.3 — Push AiiA photos into TRACK as reservation attachments.
//
// v5 architecture (2026-05-22): TRACK API has no /work-orders/{id}/attachments
// endpoint. Photos attach at the RESERVATION level via
//   POST /api/pms/reservations/{reservationId}/attachments
// with body { fileUrl, name, isPublic }. TRACK server-side fetches the fileUrl
// (a Supabase signed URL with 7-day TTL) and stores it in their S3 bucket. The
// attachment is visible under the parent reservation in TRACK UI; field staff
// and supervisors viewing any work order on that reservation see the photo
// proof at the reservation header level.
//
// Discovered via dev portal v12.0 schema + live probe 2026-05-22:
//   - POST /api/files (universal file upload)
//   - POST /api/pms/reservations/{id}/attachments (1-step: upload + attach)
//   - Work orders have NO native attachment child resource
//   - Reservation-level attachment is the correct TRACK pattern for proof photos
//
// Runs every 60s via pg_cron. Picks up to BATCH_SIZE task_photos rows where
// track_synced_at IS NULL AND track_next_attempt_at <= now().
//
// Backoff schedule: 1m, 5m, 30m, 4h, 24h (5 attempts then dead-letter).
// 404/405 = permanent failure → dead-letter immediately.
//
// SAFETY GATE: This function refuses to actually call TRACK unless the function
// secret TRACK_ATTACHMENT_PUSH_ENABLED is set to "true". Until Emma confirms
// Q3 (write scope on key #51), keep the secret unset/false — the function will
// still drain its queue in "noop" mode and log what it would do, without
// mutating TRACK.
//
// Environment variables:
//   TRACK_API_KEY, TRACK_API_SECRET, TRACK_TENANT (default: lrmb)
//   TRACK_ATTACHMENT_PUSH_ENABLED ("true" to actually mutate; otherwise dry-run)
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (auto-injected)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const PUSH_ENABLED = (Deno.env.get("TRACK_ATTACHMENT_PUSH_ENABLED") ?? "").toLowerCase() === "true";
const BASE = `https://${TENANT}.trackhs.com/api/pms`;

const BATCH_SIZE = 50;
const STORAGE_BUCKET = "task-photos";
const BACKOFF_MINUTES = [1, 5, 30, 240, 1440]; // attempts 1..5
const MAX_ATTEMPTS = BACKOFF_MINUTES.length;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // QA P1 Q-SEC-11: cron-only endpoint.
  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  const startedAt = Date.now();
  const runId = crypto.randomUUID();

  if (!TRACK_KEY || !TRACK_SECRET) {
    return json(500, { runId, error: "Missing TRACK_API_KEY or TRACK_API_SECRET" });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json(500, { runId, error: "Missing Supabase env" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const trackAuth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);

  // Claim a batch of pending rows. We don't have row-level locking on Supabase
  // client, so the worst case under concurrency is duplicate push attempts -
  // TRACK's API is the authority; if the second attempt POSTs the same bytes
  // it'll either dedup or create a second attachment we can detect. For Week 2
  // we accept that risk and rely on cron's 1-min cadence (no overlap).
  const { data: queue, error: queueErr } = await supabase
    .from("task_photos")
    .select("id, task_id, storage_path, photo_subtype, track_sync_attempts")
    .is("track_synced_at", null)
    .lte("track_next_attempt_at", new Date().toISOString())
    .lt("track_sync_attempts", MAX_ATTEMPTS)
    .order("track_next_attempt_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (queueErr) {
    return json(500, { runId, error: `queue read failed: ${queueErr.message}` });
  }

  const summary = {
    runId,
    startedAt: new Date(startedAt).toISOString(),
    enabled: PUSH_ENABLED,
    batchSize: queue?.length ?? 0,
    pushed: 0,
    deferred: 0,
    deadLettered: 0,
    skippedNoExternalId: 0,
    skippedDisabled: 0,
    errors: [] as Array<{ task_photo_id: string; reason: string }>,
  };

  for (const row of queue ?? []) {
    // Resolve parent task -> external_id + reservation_id + category
    const { data: task } = await supabase
      .from("tasks")
      .select("id, external_source, external_id, task_category, reservation_id")
      .eq("id", row.task_id)
      .maybeSingle();

    if (!task?.external_id || task.external_source !== "track") {
      // Task isn't TRACK-backed; skip permanently (mark as "not applicable")
      await supabase
        .from("task_photos")
        .update({
          track_synced_at: new Date().toISOString(),
          track_sync_error: "task not TRACK-backed (synced_at set to mark as resolved)",
          track_attachment_id: "n/a",
        })
        .eq("id", row.id);
      summary.skippedNoExternalId++;
      continue;
    }

    // v5: photos attach to TRACK at the reservation level (not work-order level).
    // TRACK's API has no `/work-orders/{id}/attachments` endpoint — verified live
    // probe 2026-05-22 against dev portal v12.0 schema. The correct flow is:
    //   POST /api/pms/reservations/{reservationId}/attachments
    //        body: { fileUrl, name, isPublic }
    // TRACK fetches the fileUrl, stores it in S3, and links to the reservation.
    // Field staff + supervisors view photos under the parent reservation in TRACK UI.
    if (!task.reservation_id) {
      await supabase
        .from("task_photos")
        .update({
          track_synced_at: new Date().toISOString(),
          track_sync_error: "task has no reservation_id — TRACK attachments require parent reservation",
          track_attachment_id: "n/a-no-reservation",
        })
        .eq("id", row.id);
      summary.skippedNoExternalId++;
      continue;
    }

    if (!PUSH_ENABLED) {
      // Dry-run: defer indefinitely but log what we would do
      summary.skippedDisabled++;
      continue;
    }

    try {
      // Generate a Supabase signed URL with 7-day TTL. TRACK fetches the URL
      // server-side and downloads bytes into their own S3 bucket. The URL only
      // needs to be valid long enough for TRACK to fetch (seconds), but we use
      // 7d as a margin in case their fetch is queued.
      const { data: urlData, error: urlErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(row.storage_path, 7 * 24 * 3600);
      if (urlErr || !urlData?.signedUrl) {
        throw new Error(`storage signing failed: ${urlErr?.message ?? "no url"}`);
      }

      const fileName = deriveFileName(row.storage_path);
      const photoTypeTag = row.photo_subtype ? ` (${row.photo_subtype})` : "";
      const attachmentName = `AiiA proof — ${task.task_category} WO #${task.external_id}${photoTypeTag} — ${fileName}`;

      const res = await fetch(
        `${BASE}/reservations/${task.reservation_id}/attachments`,
        {
          method: "POST",
          headers: {
            Authorization: trackAuth,
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "MonteKristo-AI/LRMB-AttachmentPush/2.0",
          },
          body: JSON.stringify({
            fileUrl: urlData.signedUrl,
            name: attachmentName,
            isPublic: false,
          }),
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        // 404/405 on the reservation_attachments path = permanent (endpoint or
        // reservation gone). Dead-letter immediately. Other 4xx may be transient
        // (rate limit, signature expiry) — retry per backoff.
        const isPermanentFailure = res.status === 404 || res.status === 405;
        throw Object.assign(new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`), {
          permanent: isPermanentFailure,
        });
      }

      const json = await res.json().catch(() => ({} as Record<string, unknown>));
      const trackAttachmentId = (json?.id ?? "unknown") as string;

      await supabase
        .from("task_photos")
        .update({
          track_attachment_id: String(trackAttachmentId),
          track_synced_at: new Date().toISOString(),
          track_sync_error: null,
        })
        .eq("id", row.id);

      summary.pushed++;
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      const permanent = err instanceof Error && (err as Error & { permanent?: boolean }).permanent === true;
      // v4: skip backoff on permanent failures (e.g. 404 endpoint missing).
      // Dead-letter immediately.
      const attempts = permanent ? MAX_ATTEMPTS : (row.track_sync_attempts ?? 0) + 1;
      const isDeadLetter = attempts >= MAX_ATTEMPTS;
      const nextMinutes = BACKOFF_MINUTES[Math.min(attempts, MAX_ATTEMPTS - 1)];
      const nextAt = isDeadLetter ? null : new Date(Date.now() + nextMinutes * 60_000).toISOString();

      await supabase
        .from("task_photos")
        .update({
          track_sync_attempts: attempts,
          track_sync_error: permanent ? `PERMANENT: ${reason}` : reason,
          track_next_attempt_at: nextAt,
        })
        .eq("id", row.id);

      summary.errors.push({ task_photo_id: row.id, reason });
      if (isDeadLetter) summary.deadLettered++;
      else summary.deferred++;
    }
  }

  summary.elapsedMs = Date.now() - startedAt;
  summary.completedAt = new Date().toISOString();

  const severity =
    summary.deadLettered > 0
      ? "error"
      : summary.errors.length > 0
        ? "warning"
        : "info";

  // Heartbeat — audit_logs schema: entity_type/entity_id (uuid)/action/payload_json/description
  try {
    await supabase.from("audit_logs").insert({
      action: "track_attachment_push_run",
      entity_type: "edge_function",
      entity_id: runId,
      description: `track-attachment-push: pushed=${summary.pushed}, deferred=${summary.deferred}, deadLettered=${summary.deadLettered}, enabled=${PUSH_ENABLED}`,
      payload_json: { ...summary, severity },
    });
  } catch (_heartbeatErr) {
    // swallow
  }

  return json(200, summary);
});

function deriveFileName(storagePath: string): string {
  const seg = storagePath.split("/").pop() ?? "photo.jpg";
  return seg || "photo.jpg";
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
