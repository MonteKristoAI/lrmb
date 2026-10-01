// admin-users: an LRMB admin manages the people who can sign in.
//
// Nemr, 1 October 2026: "give access to jjingco@lrmb.com to the LRMB app and
// allow her to create other accounts as admin". The app had no way to do that:
// accounts were only ever created by the demo seed function or by hand in the
// database. This function lets a signed-in admin list users, invite a new one
// with their roles (Supabase sends the invitation email when the ADMIN invites,
// from inside the app), and deactivate or reactivate someone. Deactivating
// marks the profile inactive and bans the auth user, so a session that is
// still open stops working at its next token refresh.
//
// Every action is checked against user_roles on the server; the caller's JWT
// only says who they are.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://lrmb.vercel.app",
  "https://lrmb.lovable.app",
  "http://localhost:5173",
  "http://localhost:8080",
]);
function corsHeadersFor(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://lrmb.vercel.app";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}
function json(status: number, body: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(origin), "Content-Type": "application/json" },
  });
}

const ROLES = ["field_staff", "admin", "supervisor", "manager"] as const;
type Role = (typeof ROLES)[number];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Long enough to be permanent; lifted on reactivation.
const BAN = "876000h";

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeadersFor(origin) });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" }, origin);

  const sbUrl = Deno.env.get("SUPABASE_URL");
  const srKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !srKey) return json(500, { error: "server_misconfigured" }, origin);
  const sb = createClient(sbUrl, srKey, { auth: { persistSession: false } });

  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: me, error: meErr } = await sb.auth.getUser(token);
  if (meErr || !me?.user) return json(401, { error: "unauthorized" }, origin);
  const { data: myRoles } = await sb.from("user_roles").select("role").eq("user_id", me.user.id);
  const { data: myProfile } = await sb.from("profiles").select("active").eq("id", me.user.id).maybeSingle();
  if (!(myRoles ?? []).some((r) => r.role === "admin") || myProfile?.active === false) {
    return json(403, { error: "admins_only" }, origin);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { error: "invalid_json" }, origin);
  }
  const action = String(body.action ?? "");

  if (action === "list") {
    const users: Array<{ id: string; email: string | null; last_sign_in_at: string | null; banned_until: string | null; invited_at: string | null }> = [];
    for (let page = 1; page <= 10; page++) {
      const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return json(500, { error: "list_failed", detail: error.message }, origin);
      users.push(...data.users.map((u) => ({ id: u.id, email: u.email ?? null, last_sign_in_at: u.last_sign_in_at ?? null, banned_until: (u as unknown as { banned_until?: string | null }).banned_until ?? null, invited_at: u.invited_at ?? null })));
      if (data.users.length < 200) break;
    }
    const ids = users.map((u) => u.id);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      sb.from("profiles").select("id, full_name, active, department").in("id", ids),
      sb.from("user_roles").select("user_id, role").in("user_id", ids),
    ]);
    const pBy = new Map((profiles ?? []).map((p) => [p.id, p]));
    const rBy = new Map<string, string[]>();
    for (const r of roles ?? []) rBy.set(r.user_id, [...(rBy.get(r.user_id) ?? []), r.role]);
    return json(200, {
      users: users
        .map((u) => ({
          ...u,
          full_name: pBy.get(u.id)?.full_name ?? null,
          department: pBy.get(u.id)?.department ?? null,
          active: pBy.get(u.id)?.active !== false && !u.banned_until,
          roles: rBy.get(u.id) ?? [],
          is_test: /@lrmb\.test$/i.test(String(u.email ?? "")),
        }))
        .sort((a, b) => String(a.email ?? '').localeCompare(String(b.email ?? ''))),
    }, origin);
  }

  if (action === "invite") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const fullName = String(body.full_name ?? "").trim().slice(0, 120);
    const roles = Array.isArray(body.roles) ? body.roles.map(String).filter((r): r is Role => (ROLES as readonly string[]).includes(r)) : [];
    if (!EMAIL_RE.test(email)) return json(400, { error: "invalid_email" }, origin);
    if (roles.length === 0) return json(400, { error: "choose_a_role" }, origin);
    const redirectTo = typeof body.redirect_to === "string" && /^https:\/\/lrmb\.(vercel|lovable)\.app\//.test(body.redirect_to) ? body.redirect_to : undefined;
    const { data, error } = await sb.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName }, redirectTo });
    if (error) return json(409, { error: "invite_failed", detail: error.message }, origin);
    const uid = data.user.id;
    await sb.from("profiles").upsert({ id: uid, email, full_name: fullName, active: true }, { onConflict: "id" });
    await sb.from("user_roles").upsert(roles.map((role) => ({ user_id: uid, role })), { onConflict: "user_id,role" });
    await sb.from("audit_logs").insert({ actor_id: me.user.id, actor_name: me.user.email ?? null, action: "admin.user_invited", entity_type: "user", entity_id: uid, description: `Invited ${email} as ${roles.join(", ")}`, payload_json: { email, roles } }).then(() => undefined, () => undefined);
    return json(200, { ok: true, user_id: uid }, origin);
  }

  if (action === "set_active") {
    const userId = String(body.user_id ?? "");
    const active = body.active === true;
    if (!UUID_RE.test(userId)) return json(400, { error: "invalid_user" }, origin);
    if (userId === me.user.id) return json(400, { error: "not_yourself" }, origin);
    const { error } = await sb.auth.admin.updateUserById(userId, { ban_duration: active ? "none" : BAN });
    if (error) return json(500, { error: "update_failed", detail: error.message }, origin);
    await sb.from("profiles").update({ active }).eq("id", userId);
    await sb.from("audit_logs").insert({ actor_id: me.user.id, actor_name: me.user.email ?? null, action: active ? "admin.user_reactivated" : "admin.user_deactivated", entity_type: "user", entity_id: userId, description: active ? "User reactivated" : "User deactivated", payload_json: {} }).then(() => undefined, () => undefined);
    return json(200, { ok: true }, origin);
  }

  return json(400, { error: "unknown_action" }, origin);
});
