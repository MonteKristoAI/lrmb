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
// dropped (better than firing a stale write — the WO may have moved on).
// Max retries handled by the browser's BackgroundSync registration.
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

// Supabase API: network first with 3s timeout (READS only — mutations
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
self.addEventListener("message", (event) => {
  const data = event.data as { type?: string } | undefined;
  if (data?.type === "lrmb_wipe_supabase_cache") {
    event.waitUntil(
      Promise.all([
        caches.delete("supabase-api-cache"),
        caches.delete("supabase-storage-cache"),
      ]),
    );
  }
});
