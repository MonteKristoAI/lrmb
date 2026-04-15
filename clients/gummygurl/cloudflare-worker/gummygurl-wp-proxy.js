/**
 * GummyGurl WordPress Reverse Proxy Worker
 *
 * Routes WordPress paths (blog, admin, API, content) to SiteGround origin.
 * Everything else falls through to CF Pages (React SPA).
 *
 * Deploy: Cloudflare Dashboard → Workers → Create → paste this code
 * Route: gummygurl.com/blog/*, gummygurl.com/wp-admin/*, gummygurl.com/wp-json/*
 */

const WP_ORIGIN = "https://wp.gummygurl.com";

const WP_PATHS = [
  "/blog",
  "/wp-admin",
  "/wp-login.php",
  "/wp-json",
  "/wp-content",
  "/wp-includes",
  "/xmlrpc.php",
  "/feed",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Check if this path should go to WordPress
    const isWpPath = WP_PATHS.some((prefix) => path === prefix || path.startsWith(prefix + "/"));

    if (isWpPath) {
      // Proxy to WordPress origin
      const wpUrl = new URL(request.url);
      wpUrl.hostname = new URL(WP_ORIGIN).hostname;

      const headers = new Headers(request.headers);
      headers.set("Host", "gummygurl.com");
      headers.set("X-Forwarded-Host", "gummygurl.com");
      headers.set("X-Forwarded-Proto", "https");

      const response = await fetch(wpUrl.toString(), {
        method: request.method,
        headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
        redirect: "manual",
      });

      // Rewrite Location headers for redirects
      const newHeaders = new Headers(response.headers);
      const location = newHeaders.get("Location");
      if (location) {
        newHeaders.set(
          "Location",
          location
            .replace("https://wp.gummygurl.com", "https://gummygurl.com")
            .replace("http://wp.gummygurl.com", "https://gummygurl.com")
        );
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    // Everything else → CF Pages (React SPA)
    return env.ASSETS.fetch(request);
  },
};
