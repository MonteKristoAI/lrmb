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

const failed = checks.filter((check) => !check.ok);
for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} - ${check.name}${check.ok ? "" : `: ${check.error}`}`);
}

if (failed.length > 0) {
  process.exit(1);
}
