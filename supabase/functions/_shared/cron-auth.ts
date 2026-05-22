// Shared cron-secret auth for service-role edge functions invoked exclusively
// by pg_cron jobs (track-poll, track-attachment-push, track-catchup-units,
// tony-weekly-report, ops-health-monitor, escalate-overdue-tasks).
//
// pg_cron calls these functions over net.http_post with a custom header
// `x-cron-secret: <value of CRON_SECRET env>`. Without this header the request
// is rejected. Service-role auth alone is not sufficient — any holder of the
// service-role JWT could otherwise replay-invoke these endpoints.
//
// Usage at the top of any cron-only edge fn:
//   const authErr = requireCronSecret(req);
//   if (authErr) return authErr;

const TEXT = new TextEncoder();

function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function requireCronSecret(req: Request): Response | null {
  const expected = Deno.env.get("CRON_SECRET");
  if (!expected) {
    // Graceful rollout: when CRON_SECRET env is not yet configured, log a
    // single warning per invocation and accept the call. This lets the new
    // code deploy ahead of secret provisioning without breaking the cron
    // pipeline. Once Milan sets CRON_SECRET in the Supabase function env,
    // enforcement automatically activates on the next cold start.
    console.warn("cron-auth: CRON_SECRET unset, accepting unauthenticated invocation");
    return null;
  }
  const received = req.headers.get("x-cron-secret")
    ?? req.headers.get("X-Cron-Secret")
    ?? "";
  if (!received || !timingSafeEqualBytes(TEXT.encode(received), TEXT.encode(expected))) {
    return new Response(
      JSON.stringify({ error: "cron_unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  return null;
}
