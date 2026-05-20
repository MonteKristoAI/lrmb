#!/usr/bin/env node
/**
 * One-shot TRACK historical backfill. Walks ALL records by id-range pagination
 * (not updatedAt) so we get every historical record regardless of TRACK's
 * `updatedSince` filter quirks.
 *
 * Runs the same row-handler logic as the track-poll edge function but bypasses
 * the per-invocation 100-record cap. For 3 collections × ~1000 records each =
 * ~3000 records, this takes ~5-10 min total.
 *
 * Usage:
 *   SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 *   TRACK_API_KEY=...
 *   TRACK_API_SECRET=...
 *   TRACK_TENANT=lrmb
 *     node ./scripts/sync-track-history.mjs              # all 3 collections
 *     node ./scripts/sync-track-history.mjs maintenance  # one collection
 *
 * Updates the same tables as track-poll, with the same constraints +
 * idempotency. Re-runnable.
 */

import { createClient } from "@supabase/supabase-js";

const KEY = process.env.TRACK_API_KEY;
const SECRET = process.env.TRACK_API_SECRET;
const TENANT = process.env.TRACK_TENANT ?? "lrmb";
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FILTER = process.argv[2] ?? null;

if (!KEY || !SECRET || !SB_URL || !SB_KEY) {
  console.error("Missing env vars: TRACK_API_KEY, TRACK_API_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
const base = `https://${TENANT}.trackhs.com/api/pms`;
const supabase = createClient(SB_URL, SB_KEY);

const COLLECTIONS = [
  { name: "reservations", path: "/reservations", embeddedKey: "reservations", handler: handleReservation },
  { name: "maintenance", path: "/maintenance/work-orders", embeddedKey: "workOrders", handler: (r) => upsertWO(r, "maintenance") },
  { name: "housekeeping", path: "/housekeeping/work-orders", embeddedKey: "workOrders", handler: (r) => upsertWO(r, "housekeeping") },
];

// TRACK silently caps response size to 25 regardless of `limit` param,
// so we set PAGE_SIZE=25 to match reality (no wasted bytes asking for more).
// MAX_PAGES set high enough to reach 32k+ records (TRACK's largest collection
// is housekeeping at ~32,134 records → 1,286 pages).
const PAGE_SIZE = 25;
const MAX_PAGES = 1500;

async function fetchPage(path, page) {
  const url = new URL(`${base}${path}`);
  url.searchParams.set("sortColumn", "id");
  url.searchParams.set("sortDirection", "asc");
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  const res = await fetch(url, {
    headers: { Authorization: auth, Accept: "application/json", "User-Agent": "MonteKristo-AI/LRMB-history-backfill/1.0" },
  });
  if (!res.ok) throw new Error(`${path} page ${page} returned HTTP ${res.status}`);
  const json = await res.json();
  return json;
}

async function handleReservation(row) {
  await supabase.from("reservation_events").upsert({
    external_source: "track",
    external_id: String(row.id),
    event_type: "sync",
    event_at: row.updatedAt ?? new Date().toISOString(),
    payload_json: row,
  }, { onConflict: "external_source,external_id,event_type,event_at", ignoreDuplicates: true });
}

async function upsertWO(row, category) {
  const trackUnitIdNum = typeof row.unitId === "number" ? row.unitId : Number(row.unitId ?? NaN);
  if (!Number.isFinite(trackUnitIdNum)) return { skipped: "no-unit-id" };

  let localUnitId = null, propertyId = null;
  const { data: u } = await supabase.from("units").select("id, property_id").eq("track_id", trackUnitIdNum).maybeSingle();
  if (u) { localUnitId = u.id; propertyId = u.property_id; }
  if (!localUnitId) {
    const { data: u2 } = await supabase.from("units").select("id, property_id").eq("external_source", "track").eq("external_id", String(trackUnitIdNum)).maybeSingle();
    if (u2) { localUnitId = u2.id; propertyId = u2.property_id; }
  }
  if (!localUnitId || !propertyId) return { skipped: "unit-not-mapped", trackUnitId: trackUnitIdNum };

  const aiiaStatus = mapStatus(String(row.status ?? "").toLowerCase());
  const reservationId = row.reservationId ?? row.nextReservationId ?? null;

  const task = {
    external_source: "track",
    external_id: String(row.id),
    source_type: "travelnet",
    reservation_id: reservationId ? String(reservationId) : null,
    task_category: category,
    task_type: category === "housekeeping" ? "checkout_turnover" : "maintenance",
    housekeeping_type: category === "housekeeping" ? deriveHKType(row) : null,
    title: derivedTitle(row, category),
    description: row.description ?? row.comments ?? null,
    priority: derivePriority(row),
    unit_id: localUnitId,
    property_id: propertyId,
    requires_photo: true,
    requires_note: true,
    requires_timestamp: true,
    status: aiiaStatus,
    started_at: row.dateStarted ?? row.scheduledAt ?? null,
    completed_at: row.dateCompleted ?? row.completedAt ?? null,
    processed_at: row.dateProcessed ?? row.processedAt ?? null,
    scheduled_for: row.scheduledAt ?? row.dateScheduled ?? null,
    updated_at: row.updatedAt ?? new Date().toISOString(),
  };

  const { error } = await supabase.from("tasks").upsert(task, { onConflict: "external_source,external_id", ignoreDuplicates: false });
  if (error) return { error: error.message };
  return { ok: true };
}

function mapStatus(s) {
  if (!s) return "new";
  if (s.includes("processed")) return "processed";
  if (s.includes("verify") || s.includes("verified")) return "verified";
  if (s.includes("complete")) return "completed";
  if (s.includes("inprogress") || s.includes("in_progress") || s.includes("started")) return "in_progress";
  if (s.includes("assign")) return "assigned";
  if (s.includes("hold") || s.includes("block")) return "blocked";
  if (s.includes("wait")) return "waiting_parts";
  return "new";
}
function deriveHKType(row) {
  const raw = String(row.cleanType ?? "").toLowerCase();
  if (row.isInspection) return "checkout_clean";
  if (raw.includes("deep")) return "deep_clean";
  if (raw.includes("linen")) return "linen_change";
  if (raw.includes("mid")) return "mid_stay_clean";
  if (raw.includes("owner")) return "owner_specific_clean";
  if (raw.includes("intermittent")) return "intermittent_clean";
  return "checkout_clean";
}
function derivePriority(row) {
  const raw = String(row.priority ?? "").toLowerCase();
  if (raw.includes("urgent") || raw.includes("high")) return "high";
  if (raw.includes("low")) return "low";
  return "medium";
}
function derivedTitle(row, category) {
  if (category === "maintenance") return row.summary ?? row.description ?? `TRACK maintenance WO #${row.id}`;
  const cleanType = row.cleanType ? String(row.cleanType) : "Clean";
  return `${cleanType} – TRACK WO #${row.id}`;
}

async function runCollection(c) {
  const start = Date.now();
  let page = 1;
  let fetched = 0, processed = 0, skipped = 0, errors = 0;
  const unmappedUnits = new Set();

  console.log(`\n=== ${c.name} ===`);
  while (page <= MAX_PAGES) {
    let json;
    try { json = await fetchPage(c.path, page); }
    catch (err) { console.error(`  page ${page} failed: ${err.message}`); errors++; break; }

    const embedded = json?._embedded ?? {};
    const rows = embedded[c.embeddedKey] ?? embedded[Object.keys(embedded)[0] ?? ""] ?? [];
    if (rows.length === 0) break;

    fetched += rows.length;
    for (const row of rows) {
      try {
        const res = await c.handler(row);
        if (res?.error) { errors++; }
        else if (res?.skipped === "unit-not-mapped") { skipped++; unmappedUnits.add(res.trackUnitId); }
        else if (res?.skipped) { skipped++; }
        else { processed++; }
      } catch (err) { errors++; console.error(`  row id=${row.id}: ${err.message}`); }
    }

    process.stdout.write(`  page ${page} (${rows.length}): processed=${processed} skipped=${skipped} errors=${errors}\r`);
    if (!json?._links?.next?.href) break;
    page++;
  }

  const elapsed = Math.round((Date.now() - start) / 1000);
  console.log(`\n  Done in ${elapsed}s: fetched=${fetched} processed=${processed} skipped=${skipped} errors=${errors} unique_unmapped_units=${unmappedUnits.size}`);
  return { fetched, processed, skipped, errors, unmapped: unmappedUnits.size, elapsedSec: elapsed };
}

const targets = FILTER ? COLLECTIONS.filter(c => c.name.includes(FILTER)) : COLLECTIONS;
console.log(`TRACK historical backfill (tenant=${TENANT}, collections=${targets.map(c => c.name).join(", ")})`);
const results = {};
for (const c of targets) {
  results[c.name] = await runCollection(c);
}

console.log("\n=== FINAL ===");
let totalProcessed = 0;
for (const [name, r] of Object.entries(results)) {
  console.log(`  ${name}: ${r.processed} processed (${r.skipped} skipped, ${r.errors} errors) in ${r.elapsedSec}s`);
  totalProcessed += r.processed;
}
console.log(`\nTotal processed: ${totalProcessed}`);

// Audit log entry
await supabase.from("audit_logs").insert({
  action: "track_history_backfill",
  entity_type: "system",
  entity_id: crypto.randomUUID(),
  description: `History backfill: ${totalProcessed} records across ${Object.keys(results).length} collections`,
  payload_json: { results, severity: "info" },
});
