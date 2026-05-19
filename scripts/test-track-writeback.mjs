#!/usr/bin/env node
/**
 * TRACK Hospitality write-scope probe.
 *
 * Goal: confirm whether key #51 has WRITE permissions on Reservations + Work
 * Orders without actually mutating production data. Done by:
 *   1. OPTIONS request on each endpoint -> read `Allow` header
 *   2. PATCH/POST with intentionally malformed payload -> interpret response
 *
 * Response interpretation:
 *   - 400 / 422 = endpoint exists AND scope passed (just bad data) -> write OK
 *   - 401      = auth failed (creds wrong)
 *   - 403      = endpoint exists but scope blocked -> write DENIED
 *   - 404      = endpoint doesn't exist
 *   - 405      = wrong method for this path
 *   - 200/201  = WE ACCIDENTALLY MUTATED SOMETHING -> bail loud
 *
 * Usage (dry run, default):
 *   TRACK_API_KEY=... TRACK_API_SECRET=... TRACK_TENANT=lrmb \
 *     node ./scripts/test-track-writeback.mjs
 *
 * Usage (live - only use after Emma confirms Q3):
 *   ... node ./scripts/test-track-writeback.mjs --live
 */

const KEY = process.env.TRACK_API_KEY;
const SECRET = process.env.TRACK_API_SECRET;
const TENANT = process.env.TRACK_TENANT ?? "lrmb";
const LIVE = process.argv.includes("--live");

if (!KEY || !SECRET) {
  console.error(
    "Missing TRACK_API_KEY or TRACK_API_SECRET. Run with:\n" +
      "  TRACK_API_KEY=... TRACK_API_SECRET=... node ./scripts/test-track-writeback.mjs",
  );
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");
const baseHeaders = {
  Authorization: auth,
  Accept: "application/json",
  "User-Agent": "MonteKristo-AI/LRMB-WriteProbe/1.0",
};

const base = `https://${TENANT}.trackhs.com/api/pms`;

const probes = [
  {
    label: "PATCH reservation (update existing)",
    method: "PATCH",
    url: `${base}/reservations/1`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "POST reservation note",
    method: "POST",
    url: `${base}/reservations/1/notes`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "GET work-orders index (verify endpoint exists)",
    method: "GET",
    url: `${base}/work-orders?limit=1`,
  },
  {
    label: "GET work-orders alt path",
    method: "GET",
    url: `${base}/workorders?limit=1`,
  },
  {
    label: "GET maintenance work-orders",
    method: "GET",
    url: `${base}/maintenance/work-orders?limit=1`,
  },
  {
    label: "GET housekeeping work-orders",
    method: "GET",
    url: `${base}/housekeeping/work-orders?limit=1`,
  },
  {
    label: "POST maintenance work-order (create)",
    method: "POST",
    url: `${base}/maintenance/work-orders`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "POST housekeeping work-order (create)",
    method: "POST",
    url: `${base}/housekeeping/work-orders`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "PATCH maintenance work-order (update existing)",
    method: "PATCH",
    url: `${base}/maintenance/work-orders/1`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "PATCH housekeeping work-order (update existing)",
    method: "PATCH",
    url: `${base}/housekeeping/work-orders/1`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "POST maintenance work-order note",
    method: "POST",
    url: `${base}/maintenance/work-orders/1/notes`,
    body: { __probe: "intentionally-malformed" },
  },
  {
    label: "POST maintenance work-order attachment",
    method: "POST",
    url: `${base}/maintenance/work-orders/1/attachments`,
    body: { __probe: "intentionally-malformed" },
  },
];

function interpret(status, method) {
  const isMutatingVerb = method === "POST" || method === "PATCH" || method === "PUT" || method === "DELETE";
  if (status >= 200 && status < 300) {
    if (isMutatingVerb) {
      return { verdict: "MUTATED", note: "Got 2xx on a mutating verb - we may have created/updated data. BAIL." };
    }
    return { verdict: "READ_OK", note: "Endpoint exists and returns data" };
  }
  if (status === 400 || status === 422) {
    return { verdict: "WRITE_OK", note: "Endpoint exists + scope passed (rejected on bad data, which is what we want)" };
  }
  if (status === 401) return { verdict: "AUTH_FAIL", note: "Credentials wrong" };
  if (status === 403) return { verdict: "WRITE_DENIED", note: "Endpoint exists but key #51 lacks write scope" };
  if (status === 404) return { verdict: "NO_PATH", note: "Endpoint does not exist at this URL" };
  if (status === 405) return { verdict: "WRONG_METHOD", note: "Path exists but doesn't accept this HTTP verb" };
  if (status === 429) return { verdict: "RATE_LIMITED", note: "Throttled" };
  if (status >= 500) return { verdict: "SERVER_ERR", note: "TRACK-side 5xx" };
  return { verdict: "UNKNOWN", note: `Unexpected status ${status}` };
}

async function probe(p) {
  const started = Date.now();
  const init = {
    method: p.method,
    headers: { ...baseHeaders },
    redirect: "manual",
  };
  if (p.body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(p.body);
  }

  if (!LIVE && (p.method === "POST" || p.method === "PATCH" || p.method === "PUT" || p.method === "DELETE")) {
    return {
      ...p,
      skipped: true,
      dryRun: true,
      payload: init.body,
    };
  }

  try {
    const res = await fetch(p.url, init);
    const elapsed = Date.now() - started;
    const ct = res.headers.get("content-type") ?? "";
    const wwwAuth = res.headers.get("www-authenticate");
    const allow = res.headers.get("allow");
    let body = "";
    try {
      const text = await res.text();
      body = text.slice(0, 240);
    } catch {
      // ignore
    }
    return {
      ...p,
      status: res.status,
      elapsedMs: elapsed,
      contentType: ct,
      allow,
      wwwAuth,
      body,
      verdict: interpret(res.status, p.method),
    };
  } catch (err) {
    return {
      ...p,
      error: err instanceof Error ? err.message : String(err),
      elapsedMs: Date.now() - started,
    };
  }
}

console.log(
  `TRACK write-scope probe (tenant=${TENANT}, mode=${LIVE ? "LIVE" : "dry-run"})\n` +
    (LIVE
      ? `WARNING: Live mode. Mutating verbs will execute against production.\n`
      : `Dry-run: GET requests will execute, but POST/PATCH/PUT/DELETE will be logged only.\n`),
);

const results = [];
for (const p of probes) {
  const r = await probe(p);
  results.push(r);

  if (r.skipped) {
    console.log(`  [SKIP-${r.method}]  ${r.label}`);
    console.log(`    ${r.url}`);
    if (r.payload) console.log(`    payload: ${r.payload}`);
    continue;
  }

  if (r.error) {
    console.log(`  ERR  ${r.label}`);
    console.log(`    ${r.url}`);
    console.log(`    error: ${r.error}`);
    continue;
  }

  const tag = `${r.status}  [${r.verdict.verdict}]  ${r.elapsedMs}ms`;
  console.log(`  ${tag}  ${r.method} ${r.label}`);
  console.log(`    ${r.url}`);
  console.log(`    -> ${r.verdict.note}`);
  if (r.allow) console.log(`    allow: ${r.allow}`);
  if (r.wwwAuth) console.log(`    www-authenticate: ${r.wwwAuth}`);
  if (r.body) console.log(`    body: ${r.body.slice(0, 160)}${r.body.length > 160 ? "..." : ""}`);
}

console.log("\n=== SUMMARY ===");
const live = results.filter((r) => !r.skipped && !r.error);
const verdictCounts = {};
for (const r of live) {
  const v = r.verdict?.verdict ?? "UNKNOWN";
  verdictCounts[v] = (verdictCounts[v] ?? 0) + 1;
}
for (const [v, count] of Object.entries(verdictCounts)) {
  console.log(`  ${v}: ${count}`);
}

if (!LIVE) {
  console.log(
    "\nDry-run complete. To actually exercise write endpoints (only after\n" +
      "Emma confirms Q3 write scope), re-run with --live.",
  );
}

const mutations = results.filter((r) => r.verdict?.verdict === "MUTATED");
if (mutations.length > 0) {
  console.log(
    `\n!! ${mutations.length} mutation(s) returned 2xx. Check TRACK for unintended changes.`,
  );
  process.exit(2);
}

const writeOk = results.filter((r) => r.verdict?.verdict === "WRITE_OK").length;
const writeDenied = results.filter((r) => r.verdict?.verdict === "WRITE_DENIED").length;

if (LIVE) {
  if (writeOk > 0 && writeDenied === 0) {
    console.log("\nVERDICT: Key #51 appears to have write scope on tested endpoints.");
  } else if (writeDenied > 0 && writeOk === 0) {
    console.log("\nVERDICT: Key #51 is read-only. Need broader scope from Emma.");
  } else if (writeOk > 0 && writeDenied > 0) {
    console.log("\nVERDICT: Mixed - some endpoints allow writes, others denied. See details above.");
  }
}
