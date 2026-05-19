#!/usr/bin/env node
/**
 * Baseline KPI pull from TRACK PMS for AiiA pilot comparison.
 *
 * Captures last 30 days of historical performance so the pilot can measure
 * "before vs after" once AiiA goes live. Pure read-only, never writes.
 *
 * Computes per-WO metrics:
 *   - visibilityDelay  = dateScheduled - dateReceived  (how fast did LRMB know about the work)
 *   - completionLag    = dateCompleted - dateScheduled (vendor execution time)
 *   - processingLag    = dateProcessed - dateCompleted (the gap AiiA collapses)
 *   - fullLifecycle    = dateProcessed - dateReceived  (total time)
 *   - duplicateRate    = pairs of WOs on same unit within 4h
 *   - manualFollowups  = WOs with "follow up" / "follow-up" / "FU" patterns in notes
 *
 * Outputs:
 *   - documents/baseline-kpi-data.json (raw + per-WO computed metrics)
 *   - documents/BASELINE-KPI-REPORT-{YYYY-MM-DD}.md (human-readable summary)
 *
 * Usage:
 *   TRACK_API_KEY=... TRACK_API_SECRET=... TRACK_TENANT=lrmb \
 *     node ./scripts/baseline-kpi-pull.mjs
 *
 *   # Override the lookback window (default 30 days)
 *   LOOKBACK_DAYS=60 node ./scripts/baseline-kpi-pull.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = process.env.TRACK_API_KEY;
const SECRET = process.env.TRACK_API_SECRET;
const TENANT = process.env.TRACK_TENANT ?? "lrmb";
const LOOKBACK_DAYS = Number(process.env.LOOKBACK_DAYS ?? "30");

if (!KEY || !SECRET) {
  console.error("Missing TRACK_API_KEY or TRACK_API_SECRET.");
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
const base = `https://${TENANT}.trackhs.com/api/pms`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const docsDir = join(__dirname, "..", "..", "documents");
mkdirSync(docsDir, { recursive: true });

const todayIso = new Date().toISOString().slice(0, 10);
const cutoff = new Date(Date.now() - LOOKBACK_DAYS * 86400 * 1000);

console.log(`Baseline KPI pull (${LOOKBACK_DAYS}d lookback, cutoff=${cutoff.toISOString().slice(0, 10)})`);

async function fetchAllPages(path, maxPages = 100) {
  const all = [];
  let page = 1;
  while (page <= maxPages) {
    const url = new URL(`${base}${path}`);
    url.searchParams.set("limit", "100");
    url.searchParams.set("page", String(page));
    url.searchParams.set("sortColumn", "id");
    url.searchParams.set("sortDirection", "desc");

    const res = await fetch(url, {
      headers: {
        Authorization: auth,
        Accept: "application/json",
        "User-Agent": "MonteKristo-AI/LRMB-baseline/1.0",
      },
    });
    if (!res.ok) {
      throw new Error(`Failed ${path} page ${page}: HTTP ${res.status}`);
    }
    const json = await res.json();
    const embedded = json?._embedded ?? {};
    const arr =
      embedded.workOrders ??
      embedded.reservations ??
      embedded[Object.keys(embedded)[0] ?? ""] ??
      [];

    if (!Array.isArray(arr) || arr.length === 0) break;

    // Stop walking once records are older than the cutoff (using createdAt as a proxy
    // since sorting by id-desc generally puts newer records first).
    const oldestInPage = arr.reduce((min, r) => {
      const ts = r.createdAt ?? r.dateReceived ?? r.bookedAt ?? r.updatedAt;
      return ts && (!min || ts < min) ? ts : min;
    }, null);

    all.push(...arr);

    if (oldestInPage && new Date(oldestInPage) < cutoff) break;
    if (!json?._links?.next?.href) break;
    page++;
  }
  return all;
}

// Pull data
const t0 = Date.now();
console.log("Pulling reservations...");
const reservations = await fetchAllPages("/reservations");
console.log(`  -> ${reservations.length} reservations`);

console.log("Pulling maintenance work-orders...");
const maintenance = await fetchAllPages("/maintenance/work-orders");
console.log(`  -> ${maintenance.length} maintenance WOs`);

console.log("Pulling housekeeping work-orders...");
const housekeeping = await fetchAllPages("/housekeeping/work-orders");
console.log(`  -> ${housekeeping.length} housekeeping WOs`);

const elapsed = Math.round((Date.now() - t0) / 1000);
console.log(`Total pull: ${elapsed}s`);

// Filter to lookback window
const within = (ts) => ts && new Date(ts) >= cutoff;
const inWindow = (r, primaryField) => within(r[primaryField] ?? r.createdAt ?? r.updatedAt);

const recentReservations = reservations.filter((r) => inWindow(r, "bookedAt"));
const recentMaint = maintenance.filter((r) => inWindow(r, "dateReceived"));
const recentHK = housekeeping.filter((r) => inWindow(r, "createdAt"));

console.log(
  `\nIn ${LOOKBACK_DAYS}d window: ${recentReservations.length} reservations, ` +
    `${recentMaint.length} maintenance WOs, ${recentHK.length} housekeeping WOs`,
);

// Metric helpers
function diffHours(a, b) {
  if (!a || !b) return null;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  if (Number.isNaN(ms)) return null;
  return ms / 3_600_000;
}

function stats(values) {
  const nums = values.filter((v) => v !== null && v !== undefined && Number.isFinite(v));
  if (nums.length === 0) return { n: 0 };
  nums.sort((a, b) => a - b);
  const sum = nums.reduce((s, v) => s + v, 0);
  const mean = sum / nums.length;
  const p = (q) => nums[Math.min(nums.length - 1, Math.floor(q * nums.length))];
  return {
    n: nums.length,
    min: nums[0],
    p50: p(0.5),
    p90: p(0.9),
    p99: p(0.99),
    mean,
    max: nums[nums.length - 1],
  };
}

// Compute maintenance metrics
const maintMetrics = recentMaint.map((w) => ({
  id: w.id,
  unitId: w.unitId,
  reservationId: w.reservationId,
  status: w.status,
  dateReceived: w.dateReceived,
  dateScheduled: w.dateScheduled,
  dateCompleted: w.dateCompleted,
  dateProcessed: w.dateProcessed,
  visibilityDelayHours: diffHours(w.dateReceived, w.dateScheduled),
  completionLagHours: diffHours(w.dateScheduled, w.dateCompleted),
  processingLagHours: diffHours(w.dateCompleted, w.dateProcessed),
  fullLifecycleHours: diffHours(w.dateReceived, w.dateProcessed),
  hasFollowup: /follow[\s-]?up|\bFU\b/i.test(
    [w.description, w.summary, w.workPerformed].filter(Boolean).join(" "),
  ),
}));

// Compute housekeeping metrics
const hkMetrics = recentHK.map((w) => ({
  id: w.id,
  unitId: w.unitId,
  reservationId: w.reservationId,
  nextReservationId: w.nextReservationId,
  status: w.status,
  cleanType: w.cleanType,
  isInspection: w.isInspection,
  scheduledAt: w.scheduledAt,
  originalScheduledAt: w.originalScheduledAt,
  completedAt: w.completedAt,
  processedAt: w.processedAt,
  rescheduledHours: diffHours(w.originalScheduledAt, w.scheduledAt),
  completionLagHours: diffHours(w.scheduledAt, w.completedAt),
  processingLagHours: diffHours(w.completedAt, w.processedAt),
  fullLifecycleHours: diffHours(w.scheduledAt, w.processedAt),
  hasFollowup: /follow[\s-]?up|\bFU\b/i.test(String(w.comments ?? "")),
}));

// Duplicate detection: same unitId, scheduled within 4h.
// For housekeeping, exclude the (turn × inspection) pair — that's the expected
// TRACK auto-spawn pattern, not a coordination breakdown.
function findDuplicates(arr, scheduledField, opts = {}) {
  const { excludeMixedTurnInspection = false } = opts;
  const dupes = [];
  const byUnit = new Map();
  for (const r of arr) {
    if (!r.unitId || !r[scheduledField]) continue;
    const key = String(r.unitId);
    if (!byUnit.has(key)) byUnit.set(key, []);
    byUnit.get(key).push(r);
  }
  for (const [_, items] of byUnit) {
    items.sort((a, b) => new Date(a[scheduledField]).getTime() - new Date(b[scheduledField]).getTime());
    for (let i = 0; i < items.length - 1; i++) {
      const a = items[i];
      const b = items[i + 1];
      const hrs = diffHours(a[scheduledField], b[scheduledField]);
      if (hrs === null || hrs < 0 || hrs > 4) continue;

      if (excludeMixedTurnInspection) {
        // legitimate pair: one isInspection and the other isn't
        if ((a.isInspection && !b.isInspection) || (!a.isInspection && b.isInspection)) continue;
      }

      const dupe = { a: a.id, b: b.id, unitId: a.unitId, gapHours: hrs };
      if (a.isInspection !== undefined) {
        dupe.aIsInspection = a.isInspection;
        dupe.bIsInspection = b.isInspection;
      }
      dupes.push(dupe);
    }
  }
  return dupes;
}

const maintDupes = findDuplicates(recentMaint, "dateScheduled");
const hkDupesAll = findDuplicates(recentHK, "scheduledAt");
const hkDupesReal = findDuplicates(recentHK, "scheduledAt", { excludeMixedTurnInspection: true });
const hkDupes = hkDupesReal; // use the cleaned number in headline metrics

// Aggregate stats
const summary = {
  generatedAt: new Date().toISOString(),
  lookbackDays: LOOKBACK_DAYS,
  cutoff: cutoff.toISOString(),
  counts: {
    reservations: recentReservations.length,
    maintenanceWorkOrders: recentMaint.length,
    housekeepingWorkOrders: recentHK.length,
  },
  maintenance: {
    visibilityDelayHours: stats(maintMetrics.map((m) => m.visibilityDelayHours)),
    completionLagHours: stats(maintMetrics.map((m) => m.completionLagHours)),
    processingLagHours: stats(maintMetrics.map((m) => m.processingLagHours)),
    fullLifecycleHours: stats(maintMetrics.map((m) => m.fullLifecycleHours)),
    followupCount: maintMetrics.filter((m) => m.hasFollowup).length,
    followupRate: recentMaint.length === 0 ? 0 : maintMetrics.filter((m) => m.hasFollowup).length / recentMaint.length,
    duplicates: maintDupes,
    duplicateRate: recentMaint.length === 0 ? 0 : maintDupes.length / recentMaint.length,
  },
  housekeeping: {
    rescheduledHours: stats(hkMetrics.map((m) => m.rescheduledHours)),
    completionLagHours: stats(hkMetrics.map((m) => m.completionLagHours)),
    processingLagHours: stats(hkMetrics.map((m) => m.processingLagHours)),
    fullLifecycleHours: stats(hkMetrics.map((m) => m.fullLifecycleHours)),
    inspectionCount: hkMetrics.filter((m) => m.isInspection).length,
    turnCount: hkMetrics.filter((m) => !m.isInspection).length,
    followupCount: hkMetrics.filter((m) => m.hasFollowup).length,
    followupRate: recentHK.length === 0 ? 0 : hkMetrics.filter((m) => m.hasFollowup).length / recentHK.length,
    duplicatesIncludingExpectedPairs: hkDupesAll,
    duplicatesRealOnly: hkDupesReal,
    duplicateRateRaw: recentHK.length === 0 ? 0 : hkDupesAll.length / recentHK.length,
    duplicateRateReal: recentHK.length === 0 ? 0 : hkDupesReal.length / recentHK.length,
  },
};

writeFileSync(join(docsDir, "baseline-kpi-data.json"), JSON.stringify({ summary, maintMetrics, hkMetrics }, null, 2));
console.log(`\nRaw data saved: ${join(docsDir, "baseline-kpi-data.json")}`);

// Render markdown report
function fmtStats(s, unit = "h") {
  if (s.n === 0) return "_(no data)_";
  return `n=${s.n} · p50=${s.p50.toFixed(1)}${unit} · p90=${s.p90.toFixed(1)}${unit} · mean=${s.mean.toFixed(1)}${unit} · max=${s.max.toFixed(1)}${unit}`;
}

function fmtRate(n, total) {
  if (total === 0) return "0%";
  return `${((n / total) * 100).toFixed(1)}%`;
}

const md = `# LRMB Baseline KPI Report — ${todayIso}

**Lookback window:** ${LOOKBACK_DAYS} days ending ${todayIso}
**Cutoff date:** ${cutoff.toISOString().slice(0, 10)}
**Generated by:** \`scripts/baseline-kpi-pull.mjs\`
**Raw data:** [baseline-kpi-data.json](clients/lrmb/app/documents/baseline-kpi-data.json)

This report captures LRMB's current TRACK PMS operational performance BEFORE AiiA Field Ops is fully wired in. Pilot success = these numbers move in the right direction post-deployment.

---

## Volume in window

| Collection | Records (last ${LOOKBACK_DAYS}d) |
|---|---|
| Reservations | ${recentReservations.length} |
| Maintenance WOs | ${recentMaint.length} |
| Housekeeping WOs | ${recentHK.length} |

---

## Maintenance work orders — lifecycle timing

| Metric | Distribution | What it measures |
|---|---|---|
| Visibility delay | ${fmtStats(summary.maintenance.visibilityDelayHours)} | dateScheduled − dateReceived: how fast LRMB queued the work after it was reported |
| Completion lag | ${fmtStats(summary.maintenance.completionLagHours)} | dateCompleted − dateScheduled: how long vendor took once dispatched |
| **Processing lag** | ${fmtStats(summary.maintenance.processingLagHours)} | **dateProcessed − dateCompleted: the gap AiiA collapses (instant verification on phone vs office return)** |
| Full lifecycle | ${fmtStats(summary.maintenance.fullLifecycleHours)} | dateProcessed − dateReceived: end-to-end ticket time |

**Follow-ups:** ${summary.maintenance.followupCount} of ${recentMaint.length} WOs (${fmtRate(summary.maintenance.followupCount, recentMaint.length)}) contain "follow up" / "FU" patterns — these are tasks that needed a second touch.

**Same-unit duplicates within 4h:** ${maintDupes.length} pairs (${fmtRate(maintDupes.length, recentMaint.length)} of WOs). Often a signal of poor coordination between admin and field.

---

## Housekeeping work orders — lifecycle timing

| Metric | Distribution | What it measures |
|---|---|---|
| Reschedule swing | ${fmtStats(summary.housekeeping.rescheduledHours)} | scheduledAt − originalScheduledAt (positive = pushed later, negative = pulled earlier) |
| Completion lag | ${fmtStats(summary.housekeeping.completionLagHours)} | completedAt − scheduledAt: cleaning time from scheduled start |
| **Processing lag** | ${fmtStats(summary.housekeeping.processingLagHours)} | **processedAt − completedAt: the AiiA-collapse window** |
| Full lifecycle | ${fmtStats(summary.housekeeping.fullLifecycleHours)} | processedAt − scheduledAt |

**Inspection split:** ${summary.housekeeping.inspectionCount} inspections vs ${summary.housekeeping.turnCount} turns (in the ${recentHK.length}-WO window).
**Follow-ups:** ${summary.housekeeping.followupCount} of ${recentHK.length} (${fmtRate(summary.housekeeping.followupCount, recentHK.length)}) with follow-up patterns in comments.

**Same-unit duplicates within 4h:**
- Including expected (turn + inspection) pairs: ${hkDupesAll.length} pairs (${fmtRate(hkDupesAll.length, recentHK.length)} of WOs) — most of these are TRACK auto-spawning a Final Clean + Inspection together, NOT a coordination problem.
- Excluding that expected pair: **${hkDupesReal.length} pairs (${fmtRate(hkDupesReal.length, recentHK.length)} of WOs)** — these are genuine duplicates (turn×turn or inspection×inspection within 4h on the same unit) and worth investigating.

---

## Key baseline numbers (the ones to watch in pilot Week 4)

| KPI | Current baseline | Target post-AiiA | Improvement % |
|---|---|---|---|
| Maintenance processing lag (median) | ${summary.maintenance.processingLagHours.n > 0 ? summary.maintenance.processingLagHours.p50.toFixed(1) + 'h' : 'n/a'} | < 15 min | TBD |
| Housekeeping processing lag (median) | ${summary.housekeeping.processingLagHours.n > 0 ? summary.housekeeping.processingLagHours.p50.toFixed(1) + 'h' : 'n/a'} | < 15 min | TBD |
| Follow-up rate (maintenance) | ${fmtRate(summary.maintenance.followupCount, recentMaint.length)} | < 5% | TBD |
| Duplicate rate (housekeeping, real) | ${fmtRate(hkDupesReal.length, recentHK.length)} | < 1% | TBD |

The processing-lag medians are the single most important number — that's the gap between "vendor is done" and "ops has logged it complete." AiiA collapses this to seconds.

---

## Caveats & data notes

- This pull uses TRACK's id-desc ordering for pagination (no \`updatedSince\` filter), so the lookback window is approximate at the edges.
- "Follow-up" detection is regex-based and will miss tasks where ops staff used a different code/abbreviation.
- "Duplicates" measures temporal proximity only; some are legitimate (e.g. a turn followed by a same-day repair on the same unit). Worth a human eye-pass on the JSON before treating it as a hard number.
- TRACK \`dateProcessed\` may be NULL for in-flight work orders. Those rows drop out of the p50/p90 stats automatically (the \`stats\` function filters non-finite values).
- This is a **TRACK-only** view. Once AiiA is live, comparable metrics will live in our \`tasks\` + \`task_updates\` tables — re-run this script side by side for the pilot comparison.

---

## How to re-run

\`\`\`bash
cd clients/lrmb/app
TRACK_API_KEY=… TRACK_API_SECRET=… node ./scripts/baseline-kpi-pull.mjs
\`\`\`

Override the window:
\`\`\`bash
LOOKBACK_DAYS=60 node ./scripts/baseline-kpi-pull.mjs
\`\`\`
`;

const mdPath = join(docsDir, `BASELINE-KPI-REPORT-${todayIso}.md`);
writeFileSync(mdPath, md);
console.log(`Report saved: ${mdPath}`);

console.log("\n=== SUMMARY ===");
console.log(`  Maintenance processing lag p50: ${summary.maintenance.processingLagHours.n > 0 ? summary.maintenance.processingLagHours.p50.toFixed(1) + 'h' : 'no data'}`);
console.log(`  Housekeeping processing lag p50: ${summary.housekeeping.processingLagHours.n > 0 ? summary.housekeeping.processingLagHours.p50.toFixed(1) + 'h' : 'no data'}`);
console.log(`  Maintenance follow-up rate: ${fmtRate(summary.maintenance.followupCount, recentMaint.length)}`);
console.log(`  Housekeeping duplicate rate (real, excluding turn+inspection): ${fmtRate(hkDupesReal.length, recentHK.length)}`);
console.log(`  Housekeeping duplicate rate (including TRACK pairs): ${fmtRate(hkDupesAll.length, recentHK.length)}`);
