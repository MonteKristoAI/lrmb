/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

// Workbox precaching (injected by VitePWA at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Auto-claim clients
self.skipWaiting();
clientsClaim();

// Supabase API: network first with 3s timeout
registerRoute(
  ({ url }) => url.hostname.includes("supabase.co") && url.pathname.includes("/rest/"),
  new NetworkFirst({
    cacheName: "supabase-api-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 300 })],
    networkTimeoutSeconds: 3,
  })
);

// Supabase storage (photos): cache first
registerRoute(
  ({ url }) => url.hostname.includes("supabase.co") && url.pathname.includes("/storage/"),
  new CacheFirst({
    cacheName: "supabase-storage-cache",
    plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 3600 })],
  })
);

// Supabase auth: network only (never cache auth)
registerRoute(
  ({ url }) => url.hostname.includes("supabase.co") && url.pathname.includes("/auth/"),
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

  const url = (event.notification.data as { url?: string })?.url || "/tasks";

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
