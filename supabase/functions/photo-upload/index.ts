// v3 (2026-06-09): L10 audit P0-1 — JWT trust hole closed.
// Old `decodeJwtSub(token)` did `atob(parts[1])` and trusted whatever
// `sub` claim was in the payload, with NO signature verification.
// Any caller could forge `header.{"sub":"<arbitrary-uuid>"}.anything`
// and the function would write a task_photos row with arbitrary
// `uploaded_by`. Now uses `supabase.auth.getUser(token)` which verifies
// the JWT signature against the project's auth secret.
//
// QA Agent B P1-9 (2026-05-29): server-side photo validation.
// Closes the bypass where supabase.storage.upload(..., contentType:
// 'image/jpeg') with SVG/HTML bytes would be accepted because the
// client-side allowlist runs in the browser. This edge fn re-validates
// the first 12 bytes of the file against known image magic signatures
// AND mints the storage upload as service_role so the upload path is
// the only ingress the bucket trusts.
//
// Flow:
//   client (with user JWT) -> POST /functions/v1/photo-upload (multipart)
//   edge fn validates JWT  -> decodes user_id
//   edge fn validates file -> magic bytes match jpeg/png/webp/heic
//   edge fn writes to storage via service_role
//   edge fn inserts task_photos row owned by user
//   edge fn returns { ok, path, signed_url }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 10 * 1024 * 1024;

function detectImageKind(b: Uint8Array): { mime: string; ext: string } | null {
  if (b.length < 12) return null;
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg" };
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
    b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a
  ) {
    return { mime: "image/png", ext: "png" };
  }
  // WebP: RIFF????WEBP (offset 0=52 49 46 46, offset 8=57 45 42 50)
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  ) {
    return { mime: "image/webp", ext: "webp" };
  }
  // HEIC / HEIF: starts with ?? ?? ?? ?? 66 74 79 70 (ftyp) at offset 4
  // then "heic", "heix", "heis", "mif1", "msf1", "heim" at offset 8.
  if (
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70
  ) {
    const brand = new TextDecoder().decode(b.slice(8, 12)).toLowerCase();
    if (["heic","heix","heis","heim","mif1","msf1","hevc"].includes(brand)) {
      return { mime: "image/heic", ext: "heic" };
    }
  }
  return null;
}

// v3 (2026-06-09): replaced with supabase.auth.getUser(token) inside
// the request handler — see the call site for the verified-sub path.

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const sbUrl = Deno.env.get("SUPABASE_URL");
  const srKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !srKey) return json(500, { error: "server_misconfigured" });

  const authz = req.headers.get("Authorization") ?? "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  if (!token) return json(401, { error: "missing_bearer_token" });

  // v3: SIGNATURE-VERIFIED auth. supabase.auth.getUser(token) validates
  // the JWT against the project's auth secret and returns the real user
  // row. Forged JWTs (header.{"sub":"<arbitrary>"}.anything) get rejected
  // because the signature doesn't match.
  const authClient = createClient(sbUrl, srKey);
  const { data: authData, error: authErr } = await authClient.auth.getUser(token);
  if (authErr || !authData?.user?.id || !UUID_RE.test(authData.user.id)) {
    return json(401, { error: "unauthorized", detail: authErr?.message ?? "invalid_token" });
  }
  const userId = authData.user.id;

  let form: FormData;
  try {
    form = await req.formData();
  } catch (_) {
    return json(400, { error: "bad_multipart" });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return json(400, { error: "file_required" });
  // v3: 0-byte guard (L10 audit P1-6). Broken share intents on Android
  // sometimes send 0-byte attachments; old behavior bubbled through to a
  // generic "Upload rejected" because magic-byte detection failed silently.
  if (file.size === 0) return json(400, { error: "empty_file" });
  if (file.size > MAX_BYTES) return json(413, { error: "file_too_large" });

  const taskId = String(form.get("task_id") ?? "");
  const propertyId = String(form.get("property_id") ?? "");
  const photoType = String(form.get("photo_type") ?? "proof");
  if (!UUID_RE.test(taskId)) return json(400, { error: "invalid_task_id" });
  if (!UUID_RE.test(propertyId)) return json(400, { error: "invalid_property_id" });

  // Read entire file (already capped at 10 MB)
  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = bytes.slice(0, 12);
  const kind = detectImageKind(head);
  if (!kind) {
    return json(400, {
      error: "invalid_image_format",
      detail: "File does not match jpeg/png/webp/heic magic bytes.",
    });
  }

  const supabase = createClient(sbUrl, srKey);
  const path = `${propertyId}/${taskId}/${crypto.randomUUID()}.${kind.ext}`;

  const { error: upErr } = await supabase.storage
    .from("task-photos")
    .upload(path, bytes, {
      contentType: kind.mime,
      cacheControl: "3600",
      upsert: false,
    });
  if (upErr) {
    return json(500, { error: "upload_failed", detail: upErr.message });
  }

  const { error: dbErr } = await supabase.from("task_photos").insert({
    task_id: taskId,
    storage_path: path,
    photo_type: photoType,
    uploaded_by: userId,
  });
  if (dbErr) {
    try {
      await supabase.storage.from("task-photos").remove([path]);
    } catch (_) {
      // best-effort cleanup; the orphaned object will be GC'd by a
      // periodic janitor (out of band).
    }
    return json(500, { error: "db_insert_failed", detail: dbErr.message });
  }

  const { data: signed } = await supabase.storage
    .from("task-photos")
    .createSignedUrl(path, 86400);

  return json(200, {
    ok: true,
    path,
    signed_url: signed?.signedUrl ?? null,
    detected_mime: kind.mime,
  });
});
