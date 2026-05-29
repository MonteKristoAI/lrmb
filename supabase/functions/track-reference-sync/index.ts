// Daily refresh of TRACK lookup tables we mirror locally.
// 2026-05-29: added because Emma's "all WOs say 'Clean'" bug revealed
// a class where TRACK's reference data drifts (new clean type added /
// renamed / deactivated) and our local mirror goes stale. Without a
// daily refresh, the only way new clean types reach AiiA is via a
// manual seed migration, which means rows get silently mapped to the
// closest existing entry until somebody notices.
//
// Currently syncs: /api/pms/housekeeping/clean-types (77 rows).
// Extensible: drop in additional reference lookups (priorities,
// statuses, owner-bucket categories) as they're identified.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireCronSecret } from "../_shared/cron-auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TENANT = Deno.env.get("TRACK_TENANT") ?? "lrmb";
const TRACK_KEY = Deno.env.get("TRACK_API_KEY");
const TRACK_SECRET = Deno.env.get("TRACK_API_SECRET");
const BASE = `https://${TENANT}.trackhs.com/api/pms`;
const MAX_PAGES = 20; // 77 rows fit in <= 4 pages today; allow headroom

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const cronErr = requireCronSecret(req);
  if (cronErr) return cronErr;

  const runId = crypto.randomUUID();
  const startedAt = Date.now();
  if (!TRACK_KEY || !TRACK_SECRET) {
    return json(500, { runId, error: "Missing TRACK_API_KEY/SECRET" });
  }
  const sbUrl = Deno.env.get("SUPABASE_URL");
  const srKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !srKey) return json(500, { runId, error: "Missing Supabase env" });

  const supabase = createClient(sbUrl, srKey);
  const auth = "Basic " + btoa(`${TRACK_KEY}:${TRACK_SECRET}`);

  const summary: Record<string, unknown> = {
    runId,
    startedAt: new Date(startedAt).toISOString(),
    sources: {} as Record<string, unknown>,
  };

  try {
    summary.sources = { cleanTypes: await syncCleanTypes(supabase, auth) };
  } catch (err) {
    summary.fatal = err instanceof Error ? err.message : String(err);
  }

  summary.elapsedMs = Date.now() - startedAt;
  summary.completedAt = new Date().toISOString();

  try {
    await supabase.from("audit_logs").insert({
      action: "track_reference_sync",
      entity_type: "edge_function",
      entity_id: runId,
      description: summary.fatal
        ? `track-reference-sync fatal: ${summary.fatal}`
        : `track-reference-sync ok in ${summary.elapsedMs as number}ms`,
      payload_json: { ...summary, severity: summary.fatal ? "error" : "info" },
    });
  } catch (_) { /* swallow */ }

  return json(200, summary);
});

async function syncCleanTypes(
  supabase: ReturnType<typeof createClient>,
  auth: string,
): Promise<{ fetched: number; upserted: number; deactivated: number; pages: number }> {
  const all: Array<Record<string, unknown>> = [];
  let pages = 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${BASE}/housekeeping/clean-types?limit=50&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: auth, Accept: "application/json", "User-Agent": "MK/LRMB-track-reference-sync/1.0" },
    });
    if (!res.ok) {
      throw new Error(`clean-types HTTP ${res.status} on page ${page}`);
    }
    const body = await res.json();
    pages++;
    const items = (body?._embedded?.cleanTypes as Array<Record<string, unknown>> | undefined) ?? [];
    if (items.length === 0) break;
    all.push(...items);
    const pageCount = Number(body?.page_count) || 1;
    if (page >= pageCount) break;
  }

  // Bulk upsert. Track sends `id, type, code, name, isActive`.
  // We tolerate the long-tail by truncating code at 80 chars + name at 200.
  const rows = all
    .map((r) => {
      const id = Number(r.id);
      if (!Number.isFinite(id)) return null;
      return {
        track_id: id,
        type: String(r.type ?? "").slice(0, 80),
        code: r.code === null || r.code === undefined ? null : String(r.code).slice(0, 80),
        name: String(r.name ?? "").slice(0, 200),
        active: r.isActive !== false,
        synced_at: new Date().toISOString(),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  let upserted = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const { error } = await supabase
      .from("track_clean_types")
      .upsert(chunk, { onConflict: "track_id" });
    if (error) throw new Error(`upsert clean-types failed: ${error.message}`);
    upserted += chunk.length;
  }

  // Deactivate rows present locally but missing from TRACK. Use
  // synced_at < cutoff as the "not seen this run" signal — the upsert
  // bumped synced_at for everything we did see.
  const seenIds = rows.map((r) => r.track_id);
  let deactivated = 0;
  if (seenIds.length > 0) {
    const { data: stale } = await supabase
      .from("track_clean_types")
      .update({ active: false })
      .not("track_id", "in", `(${seenIds.join(",")})`)
      .eq("active", true)
      .select("track_id");
    deactivated = (stale ?? []).length;
  }

  return { fetched: all.length, upserted, deactivated, pages };
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
