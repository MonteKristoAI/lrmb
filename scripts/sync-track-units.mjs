#!/usr/bin/env node
/**
 * One-shot TRACK <-> AiiA unit reconciliation.
 *
 * The polling worker (track-poll) looks up AiiA `units` by (external_source='track',
 * external_id=<TRACK unit id>). Until those values are populated, the worker can't
 * resolve TRACK work orders to AiiA units and every WO upsert is skipped with
 * "Unit not yet mapped from TRACK".
 *
 * This script reconciles the two sides:
 *   1. Pull all TRACK units (paginated)
 *   2. Pull all AiiA units (with property name + address)
 *   3. Match by unit_code -> name+address -> address only (decreasing confidence)
 *   4. In dry-run: print the diff. With --apply: UPDATE AiiA units.external_*.
 *
 * Usage:
 *   TRACK_API_KEY=... TRACK_API_SECRET=... TRACK_TENANT=lrmb \
 *   SUPABASE_URL=https://<ref>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *     node ./scripts/sync-track-units.mjs            # dry run
 *     node ./scripts/sync-track-units.mjs --apply    # write the diff
 *
 * Output: documents/unit-sync-report-{YYYY-MM-DD}.md
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.TRACK_API_KEY;
const SECRET = process.env.TRACK_API_SECRET;
const TENANT = process.env.TRACK_TENANT ?? "lrmb";
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APPLY = process.argv.includes("--apply");

if (!KEY || !SECRET) die("Missing TRACK_API_KEY or TRACK_API_SECRET");
if (!SB_URL || !SB_KEY) die("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
const base = `https://${TENANT}.trackhs.com/api/pms`;
const supabase = createClient(SB_URL, SB_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const docsDir = join(__dirname, "..", "..", "documents");
mkdirSync(docsDir, { recursive: true });

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchAllTrackUnits() {
  const all = [];
  let page = 1;
  while (page <= 50) {
    const url = new URL(`${base}/units`);
    url.searchParams.set("limit", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("sortColumn", "id");
    url.searchParams.set("sortDirection", "asc");
    const res = await fetch(url, {
      headers: { Authorization: auth, Accept: "application/json", "User-Agent": "MK-LRMB-UnitSync/1.0" },
    });
    if (!res.ok) die(`TRACK /units page ${page} failed: HTTP ${res.status}`);
    const json = await res.json();
    const arr = json?._embedded?.units ?? [];
    if (arr.length === 0) break;
    all.push(...arr);
    if (!json?._links?.next?.href) break;
    page++;
  }
  return all;
}

async function fetchAllAiiaUnits() {
  const { data, error } = await supabase
    .from("units")
    .select("id, property_id, external_source, external_id, unit_code, active, properties(name, address)")
    .limit(2000);
  if (error) die(`AiiA units query failed: ${error.message}`);
  return data ?? [];
}

console.log(`TRACK <-> AiiA unit sync (${APPLY ? "APPLY MODE" : "dry run"})`);
console.log("Pulling TRACK units...");
const trackUnits = await fetchAllTrackUnits();
console.log(`  ${trackUnits.length} units`);

console.log("Pulling AiiA units...");
const aiiaUnits = await fetchAllAiiaUnits();
console.log(`  ${aiiaUnits.length} units`);

const aiiaByCode = new Map();
const aiiaByAddress = new Map();
const aiiaByName = new Map();

for (const u of aiiaUnits) {
  if (u.unit_code) aiiaByCode.set(normalize(u.unit_code), u);
  const propAddr = u.properties?.address;
  if (propAddr) aiiaByAddress.set(normalize(propAddr), u);
  const propName = u.properties?.name;
  if (propName) aiiaByName.set(normalize(propName), u);
}

const matches = []; // { trackUnit, aiiaUnit, confidence }
const unmatched = []; // { trackUnit }
const aiiaIdsMatched = new Set();

for (const tu of trackUnits) {
  const codeKey = normalize(tu.unitCode);
  const addrKey = normalize(tu.streetAddress);
  const nameKey = normalize(tu.name);

  // Highest confidence: unit_code exact match
  let hit = codeKey ? aiiaByCode.get(codeKey) : null;
  let conf = hit ? "code" : null;
  // Fallback 1: address match
  if (!hit && addrKey) {
    hit = aiiaByAddress.get(addrKey);
    if (hit) conf = "address";
  }
  // Fallback 2: name match
  if (!hit && nameKey) {
    hit = aiiaByName.get(nameKey);
    if (hit) conf = "name";
  }

  if (hit && !aiiaIdsMatched.has(hit.id)) {
    matches.push({ trackUnit: tu, aiiaUnit: hit, confidence: conf });
    aiiaIdsMatched.add(hit.id);
  } else {
    unmatched.push({ trackUnit: tu });
  }
}

const orphanAiia = aiiaUnits.filter((u) => !aiiaIdsMatched.has(u.id));

// Already-mapped: AiiA units that already have external_source='track' set
const alreadyMapped = aiiaUnits.filter(
  (u) => u.external_source === "track" && u.external_id != null,
);
// Mismatches: AiiA already has external_id set, but the matched TRACK id differs
const mismatches = matches.filter(
  ({ trackUnit, aiiaUnit }) =>
    aiiaUnit.external_source === "track" &&
    aiiaUnit.external_id != null &&
    String(aiiaUnit.external_id) !== String(trackUnit.id),
);
// Actions to take: matches where AiiA doesn't yet have external_id, or has the wrong one
const toUpdate = matches.filter(
  ({ trackUnit, aiiaUnit }) =>
    aiiaUnit.external_source !== "track" || String(aiiaUnit.external_id) !== String(trackUnit.id),
);

console.log("\n=== SUMMARY ===");
console.log(`  TRACK units fetched:       ${trackUnits.length}`);
console.log(`  AiiA units fetched:        ${aiiaUnits.length}`);
console.log(`  Matches found:             ${matches.length}`);
console.log(`    confidence=code:         ${matches.filter((m) => m.confidence === "code").length}`);
console.log(`    confidence=address:      ${matches.filter((m) => m.confidence === "address").length}`);
console.log(`    confidence=name:         ${matches.filter((m) => m.confidence === "name").length}`);
console.log(`  Already mapped (no-op):    ${matches.length - toUpdate.length}`);
console.log(`  Mismatches (TRACK id differs from AiiA stored): ${mismatches.length}`);
console.log(`  Will UPDATE:               ${toUpdate.length}${APPLY ? "" : " (dry-run: not applied)"}`);
console.log(`  Unmatched TRACK units:     ${unmatched.length}`);
console.log(`  Orphan AiiA units (no TRACK counterpart): ${orphanAiia.length}`);

if (APPLY && toUpdate.length > 0) {
  console.log("\n=== APPLYING UPDATES ===");
  let applied = 0;
  let errors = 0;
  for (const { trackUnit, aiiaUnit, confidence } of toUpdate) {
    const trackIdInt = typeof trackUnit.id === "number" ? trackUnit.id : Number(trackUnit.id);
    const { error } = await supabase
      .from("units")
      .update({
        external_source: "track",
        external_id: String(trackUnit.id),
        // Also populate the dedicated track_id integer column (from the
        // 2026-04-21 lrmb_reconciliation_and_travelnet migration). Polling
        // worker prefers this column for lookup.
        track_id: Number.isFinite(trackIdInt) ? trackIdInt : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", aiiaUnit.id);
    if (error) {
      console.log(`  ! ${aiiaUnit.unit_code} (${aiiaUnit.id}): ${error.message}`);
      errors++;
    } else {
      applied++;
    }
  }
  console.log(`  applied: ${applied}, errors: ${errors}`);

  // Audit — audit_logs schema: entity_type/entity_id (uuid)/action/payload_json/description
  await supabase.from("audit_logs").insert({
    action: "track_unit_sync_applied",
    entity_type: "system",
    entity_id: crypto.randomUUID(),
    description: `track-unit-sync: applied=${applied}, errors=${errors}, candidates=${toUpdate.length}`,
    payload_json: {
      applied,
      errors,
      total_candidates: toUpdate.length,
      severity: errors > 0 ? "warning" : "info",
    },
  });
}

// Markdown report
const today = new Date().toISOString().slice(0, 10);
let md = `# TRACK <-> AiiA Unit Sync Report

**Date:** ${today}
**Mode:** ${APPLY ? "APPLY (writes committed)" : "DRY RUN (no writes)"}
**Tenant:** ${TENANT}

## Counts

| Metric | Value |
|---|---|
| TRACK units fetched | ${trackUnits.length} |
| AiiA units fetched | ${aiiaUnits.length} |
| Matches found (any confidence) | ${matches.length} |
| - by unit_code | ${matches.filter((m) => m.confidence === "code").length} |
| - by address | ${matches.filter((m) => m.confidence === "address").length} |
| - by name | ${matches.filter((m) => m.confidence === "name").length} |
| Already mapped (no-op) | ${matches.length - toUpdate.length} |
| Mismatches (need human review) | ${mismatches.length} |
| Will UPDATE (or were updated) | ${toUpdate.length} |
| Unmatched TRACK units | ${unmatched.length} |
| Orphan AiiA units | ${orphanAiia.length} |

## Updates ${APPLY ? "applied" : "that WOULD be applied"}

| TRACK id | TRACK unit_code | TRACK address | AiiA unit_code | Confidence |
|---|---|---|---|---|
${toUpdate
  .slice(0, 100)
  .map(
    ({ trackUnit, aiiaUnit, confidence }) =>
      `| ${trackUnit.id} | ${trackUnit.unitCode ?? "-"} | ${trackUnit.streetAddress ?? "-"} | ${aiiaUnit.unit_code ?? "-"} | ${confidence} |`,
  )
  .join("\n")}
${toUpdate.length > 100 ? `\n... + ${toUpdate.length - 100} more in JSON output` : ""}

## Unmatched TRACK units (need human review)

${unmatched.length === 0 ? "_None_" : ""}
${unmatched
  .slice(0, 50)
  .map(({ trackUnit }) => `- TRACK #${trackUnit.id} \`${trackUnit.unitCode ?? "-"}\` — ${trackUnit.name ?? "?"} — ${trackUnit.streetAddress ?? "?"}`)
  .join("\n")}
${unmatched.length > 50 ? `\n... + ${unmatched.length - 50} more in JSON output` : ""}

## Mismatches (TRACK id differs from AiiA stored id)

${mismatches.length === 0 ? "_None_" : ""}
${mismatches
  .map(
    ({ trackUnit, aiiaUnit }) =>
      `- AiiA unit ${aiiaUnit.id} (\`${aiiaUnit.unit_code}\`) currently external_id=${aiiaUnit.external_id}, would change to ${trackUnit.id}`,
  )
  .join("\n")}

## Orphan AiiA units (no TRACK counterpart)

${orphanAiia.length === 0 ? "_None_" : "These AiiA units have no matching TRACK unit. They may be legacy demo data or pre-TRACK manual entries."}
${orphanAiia
  .slice(0, 50)
  .map(
    (u) =>
      `- AiiA \`${u.unit_code}\` (${u.id}) — property: ${u.properties?.name ?? "?"} — ${u.properties?.address ?? "?"}`,
  )
  .join("\n")}
${orphanAiia.length > 50 ? `\n... + ${orphanAiia.length - 50} more` : ""}

## Next steps

${APPLY
  ? `1. **Re-run the polling worker** — TRACK WOs that previously logged "Unit not yet mapped" should now resolve cleanly. Check \`audit_logs WHERE action='track_poll_error'\` for residual errors.\n2. Review unmatched TRACK units above. If LRMB has properties in TRACK that don't exist in AiiA, either INSERT them into AiiA (likely via the admin UI / properties + units pages), or accept that work orders for those properties will be skipped.\n3. Review orphan AiiA units. They may be legacy and safe to leave; if they represent real properties that should be in TRACK, raise with Emma.`
  : `1. Review this report and confirm the matches look right.\n2. Re-run with **\`--apply\`** to commit the UPDATE statements.\n3. Then re-run the polling worker — TRACK WOs should now resolve cleanly.`}
`;

const reportPath = join(docsDir, `unit-sync-report-${today}.md`);
writeFileSync(reportPath, md);
console.log(`\nReport saved: ${reportPath}`);

// Raw JSON for downstream tooling
const jsonPath = join(docsDir, `unit-sync-data-${today}.json`);
writeFileSync(jsonPath, JSON.stringify({ matches, unmatched, orphanAiia, mismatches, alreadyMapped, generatedAt: new Date().toISOString() }, null, 2));
console.log(`Raw JSON saved: ${jsonPath}`);
