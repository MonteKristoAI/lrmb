// v5 (2026-06-09): L10 wave 5 hardening sweep.
//   - Add AVIF / AVIS magic bytes (modern Safari + iOS 17+ photos).
//   - Drop bogus 'hevc' brand (not a valid ISO BMFF brand per spec).
//   - Signed URL TTL 24h → 1h (shorter exposure window if URL leaks via
//     screenshot/share intent). Re-sign on demand from the SPA.
//   - Lock CORS Allow-Origin to LRMB origins (was '*').
// v4 (2026-06-09): can_write_task_photo write-gate via user-scoped RPC.
// v3 (2026-06-09): supabase.auth.getUser() sig-verified JWT + 0-byte guard.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://lrmb.vercel.app",
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 10 * 1024 * 1024;
const SIGNED_URL_TTL_SECONDS = 3600; // v5: 1h (was 86400 / 24h)

function detectImageKind(b: Uint8Array): { mime: string; ext: string } | null {
  if (b.length < 12) return null;
  // JPEG
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return { mime: "image/png", ext: "png" };
  // WebP: RIFF????WEBP
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return { mime: "image/webp", ext: "webp" };
  // HEIC / HEIF / AVIF: 4-byte size + 'ftyp' (66 74 79 70) at offset 4, brand at offset 8
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) {
    const brand = new TextDecoder().decode(b.slice(8, 12)).toLowerCase();
    // v5: dropped bogus 'hevc' (not a valid ISO BMFF brand). Added avif/avis
    // for iOS 17+ photos / modern Safari uploads.
    if (["heic", "heix", "heis", "heim", "mif1", "msf1"].includes(brand)) {
      return { mime: "image/heic", ext: "heic" };
    }
    if (["avif", "avis"].includes(brand)) {
      return { mime: "image/avif", ext: "avif" };
    }
  }
  return null;
}

function json(status: number, body: unknown, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeadersFor(origin), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeadersFor(origin) });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" }, origin);

  const sbUrl = Deno.env.get("SUPABASE_URL");
  const srKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !srKey) return json(500, { error: "server_misconfigured" }, origin);

  const authz = req.headers.get("Authorization") ?? "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  if (!token) return json(401, { error: "missing_bearer_token" }, origin);

  const authClient = createClient(sbUrl, srKey);
  const { data: authData, error: authErr } = await authClient.auth.getUser(token);
  if (authErr || !authData?.user?.id || !UUID_RE.test(authData.user.id)) {
    // v6 (2026-06-10) L10 wave 16: generic error messages. Old `detail`
    // leaked RLS policy names, column hints, Supabase internal paths.
    if (authErr) console.error("photo-upload auth failed", authErr);
    return json(401, { error: "unauthorized" }, origin);
  }
  const userId = authData.user.id;

  let form: FormData;
  try { form = await req.formData(); } catch (_) { return json(400, { error: "bad_multipart" }, origin); }

  const file = form.get("file");
  if (!(file instanceof File)) return json(400, { error: "file_required" }, origin);
  if (file.size === 0) return json(400, { error: "empty_file" }, origin);
  if (file.size > MAX_BYTES) return json(413, { error: "file_too_large" }, origin);

  const taskId = String(form.get("task_id") ?? "");
  const propertyId = String(form.get("property_id") ?? "");
  // v6 L10 wave 16: photo_type allowlist (was free text — client could
  // write any string into task_photos.photo_type and break the analytics
  // pivot that filters by photo_type).
  const PHOTO_TYPE_ALLOWLIST = new Set(["proof", "arrival", "damage", "before", "after", "receipt", "other"]);
  const rawPhotoType = String(form.get("photo_type") ?? "proof");
  const photoType = PHOTO_TYPE_ALLOWLIST.has(rawPhotoType) ? rawPhotoType : "other";
  if (!UUID_RE.test(taskId)) return json(400, { error: "invalid_task_id" }, origin);
  if (!UUID_RE.test(propertyId)) return json(400, { error: "invalid_property_id" }, origin);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const head = bytes.slice(0, 12);
  const kind = detectImageKind(head);
  if (!kind) return json(400, { error: "invalid_image_format", detail: "File does not match jpeg/png/webp/heic/avif magic bytes." }, origin);

  const supabase = createClient(sbUrl, srKey);
  const path = `${propertyId}/${taskId}/${crypto.randomUUID()}.${kind.ext}`;

  // v4: write-gate via user-scoped RPC.
  const userClient = createClient(sbUrl, srKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: canWrite, error: gateErr } = await userClient.rpc("can_write_task_photo", { p_path: path });
  if (gateErr) {
    console.error("photo-upload gate failed", gateErr);
    return json(500, { error: "authorization_check_failed" }, origin);
  }
  if (!canWrite) return json(403, { error: "forbidden" }, origin);

  const { error: upErr } = await supabase.storage.from("task-photos").upload(path, bytes, {
    contentType: kind.mime, cacheControl: "3600", upsert: false,
  });
  if (upErr) {
    console.error("photo-upload storage upload failed", upErr);
    return json(500, { error: "upload_failed" }, origin);
  }

  const { error: dbErr } = await supabase.from("task_photos").insert({
    task_id: taskId, storage_path: path, photo_type: photoType, uploaded_by: userId,
  });
  if (dbErr) {
    console.error("photo-upload db insert failed", dbErr);
    try { await supabase.storage.from("task-photos").remove([path]); } catch (_) { /* best-effort */ }
    return json(500, { error: "db_insert_failed" }, origin);
  }

  // v5: 1h TTL (was 24h). Reduces blast radius of leaked signed URLs.
  const { data: signed } = await supabase.storage.from("task-photos").createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  return json(200, { ok: true, path, signed_url: signed?.signedUrl ?? null, detected_mime: kind.mime }, origin);
});
