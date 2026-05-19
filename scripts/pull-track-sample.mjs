#!/usr/bin/env node
/**
 * Pull a representative sample of TRACK PMS data for schema discovery.
 *
 * Pulls latest 5 records from each of:
 *   - /api/pms/reservations
 *   - /api/pms/maintenance/work-orders
 *   - /api/pms/housekeeping/work-orders
 *   - /api/pms/units
 *   - /api/pms/units/types
 *
 * Saves raw HAL+JSON to clients/lrmb/documents/track-sample-{collection}.json
 * so we can see the exact field structure when designing the polling worker,
 * baseline KPI pull, and Operations Overview page.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.TRACK_API_KEY;
const SECRET = process.env.TRACK_API_SECRET;
const TENANT = process.env.TRACK_TENANT ?? "lrmb";

if (!KEY || !SECRET) {
  console.error("Missing TRACK_API_KEY or TRACK_API_SECRET.");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
const base = `https://${TENANT}.trackhs.com/api/pms`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outDir = join(__dirname, "..", "..", "documents", "track-samples");
mkdirSync(outDir, { recursive: true });

const collections = [
  { name: "reservations", path: "/reservations", params: "limit=5&sortColumn=id&sortDirection=desc" },
  { name: "maintenance-work-orders", path: "/maintenance/work-orders", params: "limit=5&sortColumn=id&sortDirection=desc" },
  { name: "housekeeping-work-orders", path: "/housekeeping/work-orders", params: "limit=5&sortColumn=id&sortDirection=desc" },
  { name: "units", path: "/units", params: "limit=5&sortColumn=id&sortDirection=desc" },
  { name: "unit-types", path: "/units/types", params: "limit=5" },
];

async function fetchCollection(c) {
  const url = `${base}${c.path}?${c.params}`;
  const started = Date.now();
  const res = await fetch(url, {
    headers: {
      Authorization: auth,
      Accept: "application/json",
      "User-Agent": "MonteKristo-AI/LRMB-SamplePull/1.0",
    },
  });
  const elapsed = Date.now() - started;
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { __parseError: true, raw: text.slice(0, 500) };
  }
  return { name: c.name, url, status: res.status, elapsedMs: elapsed, body: json };
}

const summary = [];
for (const c of collections) {
  console.log(`Fetching ${c.name}...`);
  const r = await fetchCollection(c);
  const outPath = join(outDir, `${c.name}.json`);
  writeFileSync(outPath, JSON.stringify(r.body, null, 2));

  const collectionKey = c.name.replace(/-/g, "");
  const altKey =
    c.name === "maintenance-work-orders"
      ? "workOrders"
      : c.name === "housekeeping-work-orders"
        ? "workOrders"
        : c.name === "unit-types"
          ? "unitTypes"
          : c.name;
  const embedded = r.body?._embedded ?? {};
  const arr =
    embedded[c.name] ??
    embedded[collectionKey] ??
    embedded[altKey] ??
    embedded[Object.keys(embedded)[0] ?? ""] ??
    [];
  const count = Array.isArray(arr) ? arr.length : 0;
  const fields = count > 0 ? Object.keys(arr[0] ?? {}) : [];
  console.log(`  ${r.status} ${r.elapsedMs}ms -> ${count} records, ${fields.length} top-level fields`);
  console.log(`  saved: ${outPath}`);
  summary.push({ name: c.name, status: r.status, count, fields });
}

console.log("\n=== SCHEMA SUMMARY ===");
for (const s of summary) {
  console.log(`\n${s.name} (${s.count} records, status ${s.status}):`);
  if (s.fields.length > 0) {
    console.log(`  fields: ${s.fields.join(", ")}`);
  } else {
    console.log(`  (no records or unexpected shape)`);
  }
}

console.log(`\nAll samples saved to ${outDir}`);
