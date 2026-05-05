#!/usr/bin/env node
/**
 * TRACK Hospitality (TravelNet Solutions) API verification probe.
 *
 * Goal: confirm Emma-supplied credentials work, discover the working base URL
 * + auth scheme, and figure out whether outbound webhooks (reservation /
 * checkout events) are accessible to us.
 *
 * Usage:
 *   TRACK_API_KEY=... TRACK_API_SECRET=... TRACK_TENANT=lrmb \
 *     node ./scripts/test-track-api.mjs
 *
 * Notes:
 *   - HTTP Basic auth (key:secret base64-encoded) is the documented scheme.
 *   - The tenant subdomain (lrmb.trackhs.com) is what Auth0 returns when you
 *     hit the LRMB tenant URL — confirms the org slug.
 */

const KEY = process.env.TRACK_API_KEY;
const SECRET = process.env.TRACK_API_SECRET;
const TENANT = process.env.TRACK_TENANT ?? "lrmb";

if (!KEY || !SECRET) {
  console.error(
    "Missing TRACK_API_KEY or TRACK_API_SECRET. Run with:\n" +
      "  TRACK_API_KEY=... TRACK_API_SECRET=... node ./scripts/test-track-api.mjs",
  );
  process.exit(1);
}

const auth = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");

const candidates = [
  // Tenant-prefixed (most common TRACK PMS pattern)
  `https://${TENANT}.trackhs.com/api/pms/reservations?limit=1`,
  `https://${TENANT}.trackhs.com/api/v2/reservations?limit=1`,
  `https://${TENANT}.trackhs.com/api/v1/reservations?limit=1`,
  `https://${TENANT}.trackhs.com/api/pms/units?limit=1`,
  `https://${TENANT}.trackhs.com/api/pms/units/types?limit=1`,
  // Multi-tenant gateway pattern
  `https://api.trackhs.com/api/pms/reservations?limit=1`,
  `https://api.trackhs.com/v2/reservations?limit=1`,
  // Webhook discovery endpoints (where outbound webhook subscriptions live)
  `https://${TENANT}.trackhs.com/api/pms/webhooks`,
  `https://${TENANT}.trackhs.com/api/webhooks`,
  `https://${TENANT}.trackhs.com/api/pms/notifications/subscriptions`,
];

async function probe(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: auth,
        Accept: "application/json",
        "User-Agent": "MonteKristo-AI/LRMB-Probe/1.0",
      },
      redirect: "manual",
    });
    const elapsed = Date.now() - started;
    const ct = res.headers.get("content-type") ?? "";
    const wwwAuth = res.headers.get("www-authenticate");
    let bodyPreview = "";
    if (res.status < 400 && ct.includes("json")) {
      const data = await res.json();
      bodyPreview = JSON.stringify(data).slice(0, 400);
    } else {
      const text = await res.text();
      bodyPreview = text.slice(0, 400);
    }
    return {
      url,
      status: res.status,
      ok: res.ok,
      elapsedMs: elapsed,
      contentType: ct,
      wwwAuth,
      bodyPreview,
    };
  } catch (err) {
    return {
      url,
      error: err instanceof Error ? err.message : String(err),
      elapsedMs: Date.now() - started,
    };
  }
}

console.log(
  `Probing ${candidates.length} TRACK API URL candidates with HTTP Basic auth ` +
    `(tenant=${TENANT})…\n`,
);

const results = [];
for (const url of candidates) {
  const r = await probe(url);
  results.push(r);
  const tag = r.error
    ? `ERR  ${r.error}`
    : `${r.status}  ${r.contentType || "-"}  ${r.elapsedMs}ms`;
  console.log(`  ${tag}\n    ${url}`);
  if (r.bodyPreview) {
    console.log(`    body: ${r.bodyPreview.slice(0, 160)}${r.bodyPreview.length > 160 ? "…" : ""}`);
  }
  if (r.wwwAuth) console.log(`    www-authenticate: ${r.wwwAuth}`);
}

const successes = results.filter((r) => r.ok);
const auth401 = results.filter((r) => r.status === 401);
const notFound = results.filter((r) => r.status === 404);

console.log("\n=== SUMMARY ===");
console.log(`  ✓ ${successes.length} successful 2xx`);
console.log(`  🔒 ${auth401.length} returned 401 (auth scheme mismatch / wrong creds)`);
console.log(`  ✗ ${notFound.length} returned 404 (wrong path / not exposed)`);

if (successes.length === 0) {
  console.log("\nNo working endpoint found.");
  console.log("Next steps:");
  console.log("  1. Confirm with Emma whether the TRACK API key/secret she sent is for ");
  console.log("     a 'channel' she just created, vs a global/admin key.");
  console.log("  2. Some TRACK tenants require IP allowlisting before the API responds.");
  console.log("  3. Webhook configuration is often gated to TRACK Support tickets ");
  console.log("     rather than self-serve via the API.");
  process.exit(2);
}

console.log("\n=== WORKING ENDPOINTS ===");
for (const r of successes) {
  console.log(`  ${r.url}`);
  if (r.bodyPreview) console.log(`    sample: ${r.bodyPreview}`);
}
