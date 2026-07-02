import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const VAPID_PUBLIC_KEY = "BKFURKhMwV7O842ubdRLz4Nck8FwBvS3WAfbi2qeBWbX8qsVeq-8PTGvLGngVCTf7MH2_08a9eT-7oQ6zRNcFfY";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = "mailto:contact@montekristobelgrade.com";

function base64UrlDecode(str: string): Uint8Array {
  const padding = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const { user_id, title, body, url, tag, task_id } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: subs } = await sb.from("push_subscriptions")
      .select("endpoint, p256dh, auth_key").eq("user_id", user_id);
    if (!subs?.length) {
      return new Response(JSON.stringify({ sent: 0, reason: "no subscriptions" }),
        { headers: { "Content-Type": "application/json" } });
    }
    const payload = JSON.stringify({
      title: title || "LRMB Ops",
      body: body || "",
      url: url || (task_id ? `/tasks/${task_id}` : "/tasks"),
      tag: tag || "lrmb-" + (task_id || "general"),
      taskId: task_id,
    });
    let sent = 0;
    const failures: string[] = [];
    for (const sub of subs) {
      try {
        const response = await fetch(sub.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream", "TTL": "86400" },
          body: new TextEncoder().encode(payload),
        });
        if (response.ok || response.status === 201) sent++;
        else if (response.status === 410) {
          await sb.from("push_subscriptions").delete().eq("user_id", user_id).eq("endpoint", sub.endpoint);
          failures.push("expired-removed");
        } else failures.push(`${response.status}`);
      } catch (err) {
        failures.push(err instanceof Error ? err.message : "unknown");
      }
    }
    return new Response(JSON.stringify({ sent, total: subs.length, failures }),
      { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
