// LRMB Field Ops - Service Worker
// Handles: offline caching + push notifications
const CACHE_NAME = "lrmb-ops-v2";

// Precache app shell
const PRECACHE_URLS = ["/", "/manifest.webmanifest", "/apple-touch-icon.png", "/favicon.ico"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch handler - offline caching
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.pathname.includes("/auth/")) return;

  // API: network first
  if (url.hostname.includes("supabase.co") && url.pathname.includes("/rest/")) {
    event.respondWith(
      fetch(request)
        .then((r) => { const c = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, c)); return r; })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Storage: cache first
  if (url.hostname.includes("supabase.co") && url.pathname.includes("/storage/")) {
    event.respondWith(
      caches.match(request).then((c) => c || fetch(request).then((r) => { const cl = r.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(request, cl)); return r; }))
    );
    return;
  }

  // Navigation: network first, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/")));
    return;
  }

  // Assets: cache first
  event.respondWith(caches.match(request).then((c) => c || fetch(request)));
});

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "LRMB Ops", body: event.data.text() };
  }

  const options = {
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

  const url = event.notification.data?.url || "/tasks";

  if (event.action === "dismiss") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Open new window
      return self.clients.openWindow(url);
    })
  );
});
