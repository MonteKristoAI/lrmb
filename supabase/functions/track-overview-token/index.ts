// Generates an HMAC-signed share-link token for the read-only Operations Overview.
//
// Auth: requires a valid Supabase JWT whose user has admin/supervisor/manager role.
// (We re-use the existing has_admin_access(user_id) SQL function via an RPC.)
//
// POST body:
//   { viewer?: string, expiresInDays?: number, audience?: "ops_overview"|"ops_detail"|"ops_full" }
//
// Returns:
//   { token: string, expiresAt: string, url: string, jti: string }
//
// QA P1 Q-SEC-17 hardening:
//   - CORS allowlist via OPS_VIEW_ALLOWED_ORIGINS env (comma-separated)
//   - Per-user rate limit: max 5 tokens issued per hour, min 5s between mints
//   - Always issues v2 tokens with jti for revocation

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { signShareToken, type ShareAudience } from "../_shared/share-link.ts";

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const allowedRaw = Deno.env.get("OPS_VIEW_ALLOWED_ORIGINS") ?? "";
  const allowed = allowedRaw.split(",").map((s) => s.trim()).filter(Boolean);
  // If no allowlist is configured, fall back to wildcard to avoid breaking
  // setup before secrets are populated. After OPS_VIEW_ALLOWED_ORIGINS is set
  // in prod, only listed origins get CORS.
  const accessControlAllowOrigin = allowed.length === 0
    ? "*"
    : (origin && allowed.includes(origin) ? origin : "null");
  return {
    "Access-Control-Allow-Origin": accessControlAllowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
    "Cache-Control": "no-store",
  };
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "POST only" }, corsHeaders);

  const secret = Deno.env.get("OPS_VIEW_HMAC_SECRET");
  if (!secret) return json(500, { error: "Server missing OPS_VIEW_HMAC_SECRET" }, corsHeaders);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!jwt) return json(401, { error: "Missing bearer token" }, corsHeaders);

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json(401, { error: "Invalid JWT" }, corsHeaders);

  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: hasAccess, error: rpcErr } = await serviceClient.rpc("has_admin_access", {
    _user_id: userData.user.id,
  });
  if (rpcErr) {
    console.error("RBAC RPC failed", rpcErr);
    return json(500, { error: "rbac_check_failed" }, corsHeaders);
  }
  if (!hasAccess) return json(403, { error: "Insufficient role" }, corsHeaders);

  // Q-SEC-17 rate limit: count prior issuances by this user in the last hour.
  const { count: hourCount } = await serviceClient
    .from("audit_logs")
    .select("id", { count: "exact", head: true })
    .eq("action", "ops_overview_token_issued")
    .eq("actor_id", userData.user.id)
    .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if ((hourCount ?? 0) >= 5) {
    return json(429, { error: "rate_limited", message: "Max 5 share tokens per hour" }, corsHeaders);
  }
  const { data: lastIssue } = await serviceClient
    .from("audit_logs")
    .select("created_at")
    .eq("action", "ops_overview_token_issued")
    .eq("actor_id", userData.user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (lastIssue?.created_at) {
    const ageMs = Date.now() - new Date(lastIssue.created_at).getTime();
    if (ageMs < 5000) {
      return json(429, { error: "rate_limited", message: "Minimum 5s between mints" }, corsHeaders);
    }
  }

  let body: { viewer?: string; expiresInDays?: number; audience?: ShareAudience } = {};
  try {
    body = await req.json();
  } catch {
    // empty body OK
  }

  const expiresInDays = Math.min(Math.max(1, Number(body.expiresInDays ?? 30)), 90);
  const audience: ShareAudience = body.audience === "ops_detail" || body.audience === "ops_full"
    ? body.audience
    : "ops_overview";
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();
  const payload = {
    iat: now,
    exp: now + expiresInDays * 86400,
    v: 2 as const,
    viewer: body.viewer ?? undefined,
    aud: audience,
    jti,
  };

  const token = await signShareToken(payload, secret);

  const referer = req.headers.get("referer");
  let origin: string | null = null;
  if (referer) {
    try { origin = new URL(referer).origin; } catch { origin = null; }
  }
  if (!origin) origin = new URL(req.url).origin.replace(".functions.", ".");
  const shareUrl = `${origin.replace(/\/$/, "")}/operations?t=${encodeURIComponent(token)}`;

  await serviceClient.from("audit_logs").insert({
    action: "ops_overview_token_issued",
    entity_type: "auth.users",
    entity_id: userData.user.id,
    actor_id: userData.user.id,
    description: `ops overview share-link issued for viewer=${payload.viewer ?? "(unnamed)"}, aud=${audience}, expires=${expiresInDays}d`,
    payload_json: {
      viewer: payload.viewer ?? null,
      audience,
      expiresInDays,
      jti,
      tokenSha256: await sha256Hex(token),
      severity: "info",
    },
  });

  return json(200, {
    token,
    jti,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    url: shareUrl,
  }, corsHeaders);
});

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(status: number, body: unknown, corsHeaders: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
