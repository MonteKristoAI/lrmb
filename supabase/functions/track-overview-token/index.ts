// Generates an HMAC-signed share-link token for the read-only Operations Overview.
//
// Auth: requires a valid Supabase JWT whose user has admin/supervisor/manager role.
// (We re-use the existing has_admin_access(user_id) SQL function via an RPC.)
//
// POST body:
//   { viewer?: string, expiresInDays?: number }
//
// Returns:
//   { token: string, expiresAt: string, url: string }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { signShareToken } from "../_shared/share-link.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Cache-Control": "no-store",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "POST only" });

  const secret = Deno.env.get("OPS_VIEW_HMAC_SECRET");
  if (!secret) return json(500, { error: "Server missing OPS_VIEW_HMAC_SECRET" });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Authenticate the caller via the supplied JWT
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!jwt) return json(401, { error: "Missing bearer token" });

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json(401, { error: "Invalid JWT" });

  // Authorization: must have admin / supervisor / manager role
  const serviceClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: hasAccess, error: rpcErr } = await serviceClient.rpc("has_admin_access", {
    _user_id: userData.user.id,
  });
  if (rpcErr) return json(500, { error: "RBAC check failed", detail: rpcErr.message });
  if (!hasAccess) return json(403, { error: "Insufficient role" });

  let body: { viewer?: string; expiresInDays?: number } = {};
  try {
    body = await req.json();
  } catch {
    // empty body is OK
  }

  const expiresInDays = Math.min(Math.max(1, Number(body.expiresInDays ?? 30)), 90);
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + expiresInDays * 86400,
    v: 1 as const,
    viewer: body.viewer ?? undefined,
  };

  const token = await signShareToken(payload, secret);

  // Build a clean share URL. The app domain is whatever the caller's referer was,
  // falling back to the request origin.
  const referer = req.headers.get("referer");
  let origin: string | null = null;
  if (referer) {
    try { origin = new URL(referer).origin; } catch { origin = null; }
  }
  if (!origin) origin = new URL(req.url).origin.replace(".functions.", ".");
  const shareUrl = `${origin.replace(/\/$/, "")}/operations?t=${encodeURIComponent(token)}`;

  // Best-effort audit — audit_logs schema: entity_type/entity_id (uuid)/action/payload_json/description/actor_id
  await serviceClient.from("audit_logs").insert({
    action: "ops_overview_token_issued",
    entity_type: "auth.users",
    entity_id: userData.user.id,
    actor_id: userData.user.id,
    description: `ops overview share-link issued for viewer=${payload.viewer ?? "(unnamed)"}, expires=${expiresInDays}d`,
    payload_json: {
      viewer: payload.viewer ?? null,
      expiresInDays,
      tokenSha256: await sha256Hex(token),
      severity: "info",
    },
  });

  return json(200, {
    token,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
    url: shareUrl,
  });
});

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
