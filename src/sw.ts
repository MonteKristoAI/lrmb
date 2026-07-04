/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

declare let self: ServiceWorkerGlobalScope;

// Workbox precaching (injected by VitePWA at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Auto-claim clients
self.skipWaiting();
clientsClaim();

// L10 wave 10 (2026-06-10): offline mutation queue. When Maria taps
// "Complete" / "Start" / "Block" / "Add Note" on 3G/EDGE and the request
// fails (timeout, no signal), the BackgroundSyncPlugin captures the
// request body and replays it when the browser regains connectivity.
//
// Window: 24h. If she's offline longer than that the queued mutation is
// dropped (better than firing a stale write - the WO may have moved on).
// Max retries handled by the browser's BackgroundSync registration.
//
// ─── L10 wave 17 (2026-06-10) - known limitations ───────────────
//
// 1. JWT EXPIRY: a mutation queued >1h before reconnect will replay with
//    an expired Bearer header → 401. The browser will surface that as a
//    failed sync (Workbox drops it from the queue) and the SPA will not
//    notify the user retroactively. Acceptable trade-off: the queue's
//    job is to ride out short network blips, not multi-hour outages.
//
// 2. STALE WRITES: if a WO is reassigned away from Maria, or moved to a
//    terminal state by another admin while her mutation sits in the
//    queue, the replay will still execute the original update. The
//    server-side guarded-transition guard (.eq(status, expected)) on
//    TaskDetail.transition() catches MOST of these - the replay
//    returns 0 rows + the SPA is no longer mounted so the user toast
//    is missed, but no bad write lands.
//
// 3. NON-IDEMPOTENT WRITES: photo uploads and audit-log adds are
//    intentionally NOT queued - they're FormData/multipart through the
//    photo-upload edge fn, which sits OUTSIDE /rest/ and is not matched
//    by the BackgroundSync route. Status transitions ARE queued
//    (PATCH on /rest/v1/tasks). Re-running a status PATCH is safe
//    because of the guarded-transition .eq guard.
//
// Future hardening (deferred): pass If-Unmodified-Since or a precondition
// header so the server can 412 stale replays explicitly. Requires
// schema + edge-fn coordination, beyond this wave's scope.
const supabaseMutationQueue = new BackgroundSyncPlugin("lrmb-supabase-mutations", {
  maxRetentionTime: 24 * 60,
});

// Mutating REST calls (POST/PATCH/PUT/DELETE) → queue on failure.
// MUST be registered BEFORE the NetworkFirst GET route so the matcher
// hits this route first for non-GET methods.
const isSupabaseRestMutation = ({ url, request }: { url: URL; request: Request }) =>
  url.hostname.endsWith(".supabase.co") &&
  url.pathname.includes("/rest/") &&
  ["POST", "PATCH", "PUT", "DELETE"].includes(request.method);

registerRoute(
  isSupabaseRestMutation,
  new NetworkOnly({ plugins: [supabaseMutationQueue] }),
  "POST",
);
registerRoute(
  isSupabaseRestMutation,
  new NetworkOnly({ plugins: [supabaseMutationQueue] }),
  "PATCH",
);
registerRoute(
  isSupabaseRestMutation,
  new NetworkOnly({ plugins: [supabaseMutationQueue] }),
  "PUT",
);
registerRoute(
  isSupabaseRestMutation,
  new NetworkOnly({ plugins: [supabaseMutationQueue] }),
  "DELETE",
);

// Supabase API: network first with 3s timeout (READS only - mutations
// handled above).
registerRoute(
  ({ url, request }) =>
    request.method === "GET" &&
    url.hostname.endsWith(".supabase.co") &&
    url.pathname.includes("/rest/"),
  new NetworkFirst({
    cacheName: "supabase-api-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 300 })],
    networkTimeoutSeconds: 3,
  })
);

// Supabase storage (photos): cache first.
// L10 wave 16 (2026-06-10): TTL 1h → 5m to match photo-upload v5's
// signed URL drop (1h server-side). Stale cached URLs after revoke
// would otherwise serve for nearly an hour past revocation.
registerRoute(
  ({ url }) => url.hostname.endsWith(".supabase.co") && url.pathname.includes("/storage/"),
  new CacheFirst({
    cacheName: "supabase-storage-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 300 })],
  })
);

// Supabase auth: network only (never cache auth)
registerRoute(
  ({ url }) => url.hostname.endsWith(".supabase.co") && url.pathname.includes("/auth/"),
  new NetworkOnly()
);

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data: { title?: string; body?: string; tag?: string; url?: string; taskId?: string; actions?: { action: string; title: string }[] };
  try {
    data = event.data.json();
  } catch {
    data = { title: "LRMB Ops", body: event.data.text() };
  }

  const options: NotificationOptions = {
    body: data.body || "",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    vibrate: [200, 100, 200],
    tag: data.tag || "lrmb-notification",
    renotify: true,
    data: {
      url: data.url || "/tasks",
      taskId: data.taskId || null,
    },
    actions: data.actions || [
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "LRMB Ops", options)
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // L10 wave 16 (2026-06-10): validate URL is a same-origin path. A leaked
  // VAPID key (or a compromised admin able to push to send-push) could
  // otherwise redirect users off-app to a phishing target.
  const rawUrl = (event.notification.data as { url?: string })?.url ?? "/tasks";
  const url = (typeof rawUrl === "string" && rawUrl.startsWith("/") && !rawUrl.startsWith("//"))
    ? rawUrl
    : "/tasks";

  if (event.action === "dismiss") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// L10 wave 16: cache wipe on auth state change. Triggered by a postMessage
// from src/lib/auth.tsx whenever signOut() or signIn happens. Without
// this, user A's NetworkFirst-cached RLS-filtered REST responses can
// briefly appear on user B's first paint after sign-in.
// COMP-02 (2026-07-02): also wipe the Workbox bgSync mutation queue on
// sign-out so User A's queued PATCH with A's bearer token cannot replay
// under User B on a shared field iPad. IndexedDB store name is
// `workbox-background-sync` and record queue name is
// `bgSyncQueue-lrmb-supabase-mutations`.
async function wipeBgSyncQueue(): Promise<void> {
  try {
    // Open the workbox-background-sync IDB db and clear the "requests" store
    // filtered to our queue name. Cheapest reliable approach: delete the whole
    // requests store; other queues in the app will re-enqueue on their next
    // failed attempt if any exist. We only ship one queue right now
    // ("lrmb-supabase-mutations") so this is safe.
    await new Promise<void>((resolve) => {
      const req = indexedDB.open("workbox-background-sync");
      req.onerror = () => resolve();
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("requests")) { db.close(); resolve(); return; }
        const tx = db.transaction("requests", "readwrite");
        const store = tx.objectStore("requests");
        const clearReq = store.clear();
        clearReq.onsuccess = () => { db.close(); resolve(); };
        clearReq.onerror = () => { db.close(); resolve(); };
      };
    });
  } catch (e) {
    // best-effort; queue wipe should never block cache wipe
    console.warn("bgSync queue wipe failed", e);
  }
}

self.addEventListener("message", (event) => {
  const data = event.data as { type?: string } | undefined;
  if (data?.type === "lrmb_wipe_supabase_cache") {
    event.waitUntil(
      Promise.all([
        caches.delete("supabase-api-cache"),
        caches.delete("supabase-storage-cache"),
        wipeBgSyncQueue(),
      ]),
    );
  }
});
