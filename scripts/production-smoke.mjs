import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// npm run does NOT load .env into process.env (that is Vite's job at build
// time), so when this script runs inside `verify:prod` the Supabase vars are
// undefined and every security check below silently SKIPs. That made the whole
// production security gate toothless. Load .env ourselves as a fallback so the
// checks actually run. process.env still wins when set (CI can inject vars).
function loadDotEnv() {
  try {
    const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env");
    const raw = readFileSync(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      if (process.env[key]) continue; // real env wins
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch {
    // no .env file (e.g. clean CI with injected env) - fine, fall through
  }
}
loadDotEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isValidSupabaseUrl = typeof SUPABASE_URL === "string" && /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL);
const hasAnonKey = typeof SUPABASE_ANON_KEY === "string" && SUPABASE_ANON_KEY.length > 20;

if (!isValidSupabaseUrl || !hasAnonKey) {
  console.log(
    "SKIP - production smoke checks: missing or invalid Supabase env values. " +
      "Set VITE_SUPABASE_URL to https://<project-ref>.supabase.co and provide a valid VITE_SUPABASE_PUBLISHABLE_KEY.",
  );
  process.exit(0);
}

const checks = [];

async function runCheck(name, fn) {
  try {
    await fn();
    checks.push({ name, ok: true });
  } catch (error) {
    checks.push({ name, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}

await runCheck("Public signup disabled", async () => {
  const email = `qa-smoke-${Date.now()}@lrmb.test`;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: "Test1234!" }),
  });

  if (response.status !== 422) {
    throw new Error(`Expected 422, got ${response.status}`);
  }

  const data = await response.json();
  if (data.error_code !== "signup_disabled") {
    throw new Error(`Expected error_code=signup_disabled, got ${data.error_code ?? "undefined"}`);
  }
});

await runCheck("TravelNet unauthorized without secret", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/travelnet-webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event_type: "checkout" }),
  });

  if (response.status !== 401) {
    throw new Error(`Expected 401, got ${response.status}`);
  }
});

await runCheck("TravelNet CORS locked down", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/travelnet-webhook`, {
    method: "OPTIONS",
    headers: {
      Origin: "https://evil.example",
      "Access-Control-Request-Method": "POST",
    },
  });

  const origin = response.headers.get("access-control-allow-origin");
  if (origin !== "null") {
    throw new Error(`Expected access-control-allow-origin=null, got ${origin ?? "missing"}`);
  }
});

// Dashboard share-link auth. track-overview-data runs with verify_jwt=true
// (defense in depth: platform JWT gate PLUS in-function HMAC share-token check),
// so the request must carry the anon bearer or the platform gateway rejects it
// with UNAUTHORIZED_NO_AUTH_HEADER before the in-function guard ever runs. The
// browser's supabase-js client attaches this bearer automatically; the smoke
// test has to send it too, otherwise it probes the gateway instead of the
// function's share-token logic. The token itself is read from the ?t= query
// param (NOT the body).
const anonAuth = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

await runCheck("track-overview-data rejects missing token", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/track-overview-data`, { headers: anonAuth });
  if (response.status !== 401) {
    throw new Error(`Expected 401, got ${response.status}`);
  }
  const data = await response.json();
  if (data.error !== "missing_token") {
    throw new Error(`Expected error=missing_token, got ${data.error ?? "undefined"}`);
  }
});

await runCheck("track-overview-data rejects bad signature", async () => {
  // Valid-format token (two base64url-encoded parts), invalid sig, passed via ?t=
  const fakeToken = "eyJpYXQiOjE3NzAwMDAwMDAsImV4cCI6OTk5OTk5OTk5OSwidiI6MX0.aW52YWxpZHNpZ25hdHVyZQ";
  const response = await fetch(`${SUPABASE_URL}/functions/v1/track-overview-data?t=${fakeToken}`, { headers: anonAuth });
  if (response.status !== 401) {
    throw new Error(`Expected 401, got ${response.status}`);
  }
  const data = await response.json();
  if (data.error !== "bad_signature") {
    throw new Error(`Expected error=bad_signature, got ${data.error ?? "undefined"}`);
  }
});

await runCheck("track-detail rejects missing token", async () => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/track-detail?id=00000000-0000-0000-0000-000000000000`);
  if (response.status !== 401) {
    throw new Error(`Expected 401, got ${response.status}`);
  }
  const data = await response.json();
  if (data.error !== "missing_token") {
    throw new Error(`Expected error=missing_token, got ${data.error ?? "undefined"}`);
  }
});

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} - ${check.name}${check.ok ? "" : `: ${check.error}`}`);
}

if (failed.length > 0) {
  process.exit(1);
}
