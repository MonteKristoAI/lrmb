#!/usr/bin/env node
/**
 * AiiA-side KPI pull. Counterpart to baseline-kpi-pull.mjs (which pulls TRACK).
 *
 * Once AiiA is live, we run BOTH scripts and compare:
 *   - TRACK-side processing lag (the gap AiiA collapses)
 *   - AiiA-side verification lag (what AiiA actually delivers)
 *
 * The delta is the pilot's value-prop number.
 *
 * Pulls last 30 days of AiiA `tasks` + `task_updates` + `task_photos` data and
 * computes:
 *   - Completion lag (completed_at - started_at)
 *   - Verification lag (verified_at - completed_at)
 *   - Photo-proof rate (% completed tasks with >=1 photo)
 *   - Notes-on-completion rate
 *   - Throughput (tasks completed per day, mean + max)
 *   - Reopen rate (% tasks with reopened_count > 0)
 *   - Task-type mix (maintenance / housekeeping / inspection / general)
 *
 * Usage:
 *   SUPABASE_URL=https://<ref>.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *     node ./scripts/aiia-kpi-pull.mjs
 *
 *   # Override the lookback window (default 30 days)
 *   LOOKBACK_DAYS=60 node ./scripts/aiia-kpi-pull.mjs
 *
 * Output:
 *   documents/aiia-kpi-data-{YYYY-MM-DD}.json
 *   documents/AIIA-KPI-REPORT-{YYYY-MM-DD}.md
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LOOKBACK_DAYS = Number(process.env.LOOKBACK_DAYS ?? "30");

if (!SB_URL || !SB_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SB_URL, SB_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const docsDir = join(__dirname, "..", "..", "documents");
mkdirSync(docsDir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const cutoffIso = new Date(Date.now() - LOOKBACK_DAYS * 86400 * 1000).toISOString();

console.log(`AiiA KPI pull (${LOOKBACK_DAYS}d lookback, cutoff=${cutoffIso.slice(0, 10)})`);

function diffHours(a, b) {
  if (!a || !b) return null;
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Number.isFinite(ms) ? ms / 3_600_000 : null;
}

function stats(values) {
  const nums = values.filter((v) => v !== null && v !== undefined && Number.isFinite(v));
  if (nums.length === 0) return { n: 0 };
  nums.sort((a, b) => a - b);
  const sum = nums.reduce((s, v) => s + v, 0);
  const p = (q) => nums[Math.min(nums.length - 1, Math.floor(q * nums.length))];
  return {
    n: nums.length,
    min: nums[0],
    p50: p(0.5),
    p90: p(0.9),
    p99: p(0.99),
    mean: sum / nums.length,
    max: nums[nums.length - 1],
  };
}

function rate(num, denom) {
  if (denom === 0) return 0;
  return num / denom;
}

function fmtPct(n, total) {
  return total === 0 ? "0%" : `${((n / total) * 100).toFixed(1)}%`;
}

function fmtStats(s) {
  if (s.n === 0) return "_(no data)_";
  return `n=${s.n} · p50=${s.p50.toFixed(2)}h · p90=${s.p90.toFixed(2)}h · mean=${s.mean.toFixed(2)}h · max=${s.max.toFixed(2)}h`;
}

// Pull tasks
console.log("Pulling tasks...");
const { data: tasks, error: tasksErr } = await supabase
  .from("tasks")
  .select(
    "id, task_category, task_type, status, requires_photo, requires_note, started_at, completed_at, verified_at, reopened_count, created_at, updated_at, due_at",
  )
  .gte("created_at", cutoffIso)
  .limit(50000);
if (tasksErr) {
  console.error(`tasks query failed: ${tasksErr.message}`);
  process.exit(1);
}
console.log(`  ${tasks.length} tasks`);

// Pull photos for these tasks
console.log("Pulling task photos...");
const taskIds = tasks.map((t) => t.id);
let photosByTask = new Map();
const PAGE = 1000;
for (let i = 0; i < taskIds.length; i += PAGE) {
  const slice = taskIds.slice(i, i + PAGE);
  const { data: photos, error: photosErr } = await supabase
    .from("task_photos")
    .select("task_id")
    .in("task_id", slice);
  if (photosErr) {
    console.error(`task_photos query failed: ${photosErr.message}`);
    process.exit(1);
  }
  for (const p of photos ?? []) {
    photosByTask.set(p.task_id, (photosByTask.get(p.task_id) ?? 0) + 1);
  }
}
console.log(`  ${[...photosByTask.values()].reduce((s, n) => s + n, 0)} photos across ${photosByTask.size} tasks`);

// Pull task_updates for note-presence calc
console.log("Pulling task updates...");
const updatesByTask = new Map();
for (let i = 0; i < taskIds.length; i += PAGE) {
  const slice = taskIds.slice(i, i + PAGE);
  const { data: updates, error: updErr } = await supabase
    .from("task_updates")
    .select("task_id, note, created_at")
    .in("task_id", slice);
  if (updErr) {
    console.error(`task_updates query failed: ${updErr.message}`);
    process.exit(1);
  }
  for (const u of updates ?? []) {
    if (!updatesByTask.has(u.task_id)) updatesByTask.set(u.task_id, []);
    updatesByTask.get(u.task_id).push(u);
  }
}
console.log(`  updates loaded for ${updatesByTask.size} tasks`);

// Compute per-task metrics
const perTask = tasks.map((t) => {
  const photoCount = photosByTask.get(t.id) ?? 0;
  const updates = updatesByTask.get(t.id) ?? [];
  const lastUpdateWithNote = updates.find((u) => u.note != null && String(u.note).trim().length > 0);
  return {
    id: t.id,
    category: t.task_category,
    type: t.task_type,
    status: t.status,
    completionLagHours: diffHours(t.started_at, t.completed_at),
    verificationLagHours: diffHours(t.completed_at, t.verified_at),
    creationToVerifyHours: diffHours(t.created_at, t.verified_at),
    photoCount,
    hasPhoto: photoCount > 0,
    hasCompletionNote: !!lastUpdateWithNote,
    requiresPhoto: t.requires_photo,
    requiresNote: t.requires_note,
    reopened: t.reopened_count > 0,
    reopenedCount: t.reopened_count,
  };
});

// Aggregates
const completed = perTask.filter((t) => ["completed", "verified"].includes(t.status));
const verified = perTask.filter((t) => t.status === "verified");
const completedWithPhotoRequired = completed.filter((t) => t.requiresPhoto);
const completedWithNoteRequired = completed.filter((t) => t.requiresNote);

// Throughput (tasks completed per day)
const completedByDay = new Map();
for (const t of tasks) {
  if (!t.completed_at) continue;
  const day = t.completed_at.slice(0, 10);
  completedByDay.set(day, (completedByDay.get(day) ?? 0) + 1);
}

const throughputArray = [...completedByDay.values()];
const throughputStats =
  throughputArray.length === 0
    ? { n: 0 }
    : {
        n: throughputArray.length,
        min: Math.min(...throughputArray),
        max: Math.max(...throughputArray),
        mean: throughputArray.reduce((s, v) => s + v, 0) / throughputArray.length,
        median: [...throughputArray].sort((a, b) => a - b)[Math.floor(throughputArray.length / 2)],
      };

const byCategory = {};
for (const t of tasks) {
  byCategory[t.task_category] = (byCategory[t.task_category] ?? 0) + 1;
}

const summary = {
  generatedAt: new Date().toISOString(),
  lookbackDays: LOOKBACK_DAYS,
  cutoff: cutoffIso,
  counts: {
    totalTasks: tasks.length,
    completed: completed.length,
    verified: verified.length,
    byCategory,
  },
  completionLag: stats(perTask.map((t) => t.completionLagHours)),
  verificationLag: stats(perTask.map((t) => t.verificationLagHours)),
  creationToVerify: stats(perTask.map((t) => t.creationToVerifyHours)),
  photoCompliance: {
    completedWithPhotoRequired: completedWithPhotoRequired.length,
    photoActuallyPresent: completedWithPhotoRequired.filter((t) => t.hasPhoto).length,
    rate: rate(completedWithPhotoRequired.filter((t) => t.hasPhoto).length, completedWithPhotoRequired.length),
  },
  noteCompliance: {
    completedWithNoteRequired: completedWithNoteRequired.length,
    noteActuallyPresent: completedWithNoteRequired.filter((t) => t.hasCompletionNote).length,
    rate: rate(completedWithNoteRequired.filter((t) => t.hasCompletionNote).length, completedWithNoteRequired.length),
  },
  reopenRate: {
    total: tasks.length,
    reopened: perTask.filter((t) => t.reopened).length,
    rate: rate(perTask.filter((t) => t.reopened).length, tasks.length),
  },
  throughput: throughputStats,
};

writeFileSync(join(docsDir, `aiia-kpi-data-${today}.json`), JSON.stringify({ summary, perTask }, null, 2));

const md = `# AiiA-Side KPI Report — ${today}

**Lookback window:** ${LOOKBACK_DAYS} days
**Cutoff date:** ${cutoffIso.slice(0, 10)}
**Generated by:** \`scripts/aiia-kpi-pull.mjs\`
**Raw data:** [aiia-kpi-data-${today}.json](aiia-kpi-data-${today}.json)

This is the AiiA-side counterpart to the TRACK baseline KPI report. To measure pilot success, run BOTH this script and \`baseline-kpi-pull.mjs\` at the end of each pilot week and compare the deltas — that's the AiiA value-prop number.

---

## Volume

| Metric | Value |
|---|---|
| Total tasks (last ${LOOKBACK_DAYS}d) | ${tasks.length} |
| Completed | ${completed.length} (${fmtPct(completed.length, tasks.length)}) |
| Verified | ${verified.length} (${fmtPct(verified.length, tasks.length)}) |
| Maintenance | ${byCategory.maintenance ?? 0} |
| Housekeeping | ${byCategory.housekeeping ?? 0} |
| Inspection | ${byCategory.inspection ?? 0} |
| General | ${byCategory.general ?? 0} |
| Other | ${Object.entries(byCategory).filter(([k]) => !["maintenance","housekeeping","inspection","general"].includes(k)).reduce((s, [,v]) => s + v, 0)} |

---

## Lifecycle timing (the value-prop numbers)

| Metric | Distribution | What it measures |
|---|---|---|
| Completion lag | ${fmtStats(summary.completionLag)} | completed_at − started_at: how long the actual work took |
| **Verification lag** | ${fmtStats(summary.verificationLag)} | **verified_at − completed_at: supervisor verify window. THIS IS THE TRACK PROCESSING-LAG REPLACEMENT.** |
| Full lifecycle | ${fmtStats(summary.creationToVerify)} | verified_at − created_at: end-to-end task time |

**Compare:** TRACK baseline (per \`BASELINE-KPI-REPORT-*\`) housekeeping processing lag p50 ≈ 114.6h. AiiA's verification-lag p50 above is the direct collapse target.

---

## Photo + note enforcement (AiiA's compliance advantage)

| Metric | Value |
|---|---|
| Completed tasks where photo is required | ${summary.photoCompliance.completedWithPhotoRequired} |
| Of those, with at least 1 photo | ${summary.photoCompliance.photoActuallyPresent} |
| **Photo compliance rate** | **${(summary.photoCompliance.rate * 100).toFixed(1)}%** (target 90%+) |
| Completed tasks where note is required | ${summary.noteCompliance.completedWithNoteRequired} |
| Of those, with at least 1 update-with-note | ${summary.noteCompliance.noteActuallyPresent} |
| **Note compliance rate** | **${(summary.noteCompliance.rate * 100).toFixed(1)}%** (target 90%+) |

Compare to TRACK where photo proof is optional → near-0% compliance in practice.

---

## Reopen rate (quality signal)

| Metric | Value |
|---|---|
| Tasks with reopened_count > 0 | ${summary.reopenRate.reopened} |
| **Reopen rate** | **${(summary.reopenRate.rate * 100).toFixed(1)}%** (target < 5%) |

A high reopen rate means supervisor was kicking back completed tasks — points to either training gap or photo-quality enforcement gap.

---

## Throughput (capacity proxy)

| Metric | Value |
|---|---|
| Days with at least 1 task completed | ${throughputStats.n} |
| Mean tasks completed per active day | ${throughputStats.n > 0 ? throughputStats.mean.toFixed(1) : "—"} |
| Median tasks completed per active day | ${throughputStats.n > 0 ? throughputStats.median : "—"} |
| Max tasks completed in a single day | ${throughputStats.n > 0 ? throughputStats.max : "—"} |

---

## Caveats

- This script counts AiiA-native data only. Tasks mirrored from TRACK via the polling worker have their lifecycle stamped by TRACK's timestamps (\`dateScheduled\`, \`dateCompleted\`, \`dateProcessed\`). AiiA's \`task_updates\` rows are only stamped for AiiA-side user actions.
- Photo / note compliance is computed against \`requires_photo\` / \`requires_note\` flags. If those flags aren't set correctly on creation, this number under-reports compliance.
- Verification lag only fires for tasks in the \`verified\` state. Tasks stuck at \`completed\` show up in the count but not the lag stat (until a supervisor verifies them).
- Reopen rate uses the \`reopened_count\` integer on tasks. Reopened tasks remain in their original category — not double-counted.

---

## How to re-run

\`\`\`bash
cd clients/lrmb/app
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node ./scripts/aiia-kpi-pull.mjs
\`\`\`

For pilot week-by-week comparison:
\`\`\`bash
LOOKBACK_DAYS=7 node ./scripts/aiia-kpi-pull.mjs
\`\`\`
`;

writeFileSync(join(docsDir, `AIIA-KPI-REPORT-${today}.md`), md);

console.log("\n=== SUMMARY ===");
console.log(`  Total tasks (${LOOKBACK_DAYS}d): ${tasks.length}`);
console.log(`  Verification lag p50: ${summary.verificationLag.n > 0 ? summary.verificationLag.p50.toFixed(2) + "h" : "no data yet"}`);
console.log(`  Photo compliance: ${(summary.photoCompliance.rate * 100).toFixed(1)}%`);
console.log(`  Note compliance: ${(summary.noteCompliance.rate * 100).toFixed(1)}%`);
console.log(`  Reopen rate: ${(summary.reopenRate.rate * 100).toFixed(1)}%`);
console.log(`\nReport: ${join(docsDir, `AIIA-KPI-REPORT-${today}.md`)}`);
console.log(`Raw:    ${join(docsDir, `aiia-kpi-data-${today}.json`)}`);
