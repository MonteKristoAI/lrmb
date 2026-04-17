/**
 * Cloudflare Worker — Combined Reverse Proxy for LuxeShutters
 *
 * Routing:
 *   /blog/*           → luxeshutters-blog.pages.dev   (blog subtree stays with trailing slash)
 *   /{location}       → luxeshutters-locations.pages.dev/{location}   (no trailing slash)
 *   /{location}/      → 301 redirect to /{location}
 *   everything else   → pass through to main React SPA on CF Pages
 *
 * URL standard: NO trailing slash on main site + location pages.
 * Blog subtree retains trailing slashes (WP convention).
 */

const BLOG_ORIGIN = 'https://luxeshutters-blog.pages.dev';
const LOCATIONS_ORIGIN = 'https://luxeshutters-locations.pages.dev';
const LOCATION_SLUGS = new Set([
  'temora', 'wagga-wagga', 'young', 'west-wyalong',
  'cootamundra', 'junee', 'griffith', 'cowra',
]);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    // Blog proxy — exact `/blog`, `/blog/`, or `/blog/anything`. Avoid matching /blogger, /blog.xml, /blog-old.
    if (url.pathname === '/blog' || url.pathname === '/blog/' || url.pathname.startsWith('/blog/')) {
      let blogPath = url.pathname.replace(/^\/blog/, '') || '/';
      if (!blogPath.includes('.') && !blogPath.endsWith('/')) blogPath += '/';
      const blogUrl = new URL(blogPath, BLOG_ORIGIN);
      blogUrl.search = url.search;
      const response = await fetch(blogUrl.toString(), { method: request.method, headers: request.headers });
      return addHeaders(response, 'text/html');
    }

    // Location pages proxy — NO trailing slash canonical
    if (LOCATION_SLUGS.has(firstSegment)) {
      // Redirect trailing-slash variant to canonical no-slash URL
      if (url.pathname.endsWith('/') && url.pathname !== `/${firstSegment}`) {
        const normalized = url.pathname.replace(/\/+$/, '') || '/';
        return Response.redirect(`${url.origin}${normalized}${url.search}`, 301);
      }
      // Internal proxy path still uses trailing slash because origin serves dist/{slug}/index.html
      let locPath = url.pathname;
      if (!locPath.includes('.') && !locPath.endsWith('/')) locPath += '/';
      const locUrl = new URL(locPath, LOCATIONS_ORIGIN);
      locUrl.search = url.search;
      const response = await fetch(locUrl.toString(), { method: request.method, headers: request.headers });
      return addHeaders(response, response.headers.get('content-type'));
    }

    // Strip trailing slash from non-homepage non-blog paths (normalize to canonical)
    if (url.pathname !== '/' && url.pathname.endsWith('/') && !url.pathname.startsWith('/blog')) {
      const normalized = url.pathname.replace(/\/+$/, '') || '/';
      return Response.redirect(`${url.origin}${normalized}${url.search}`, 301);
    }

    // Pass through to main CF Pages (React SPA)
    return fetch(request);
  },
};

function addHeaders(response, contentType) {
  const newHeaders = new Headers(response.headers);

  // Indexability
  newHeaders.set('X-Robots-Tag', 'index, follow, max-image-preview:large');

  // Security
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=(), payment=()');

  // Cache
  const ct = contentType || '';
  if (ct.includes('text/html')) {
    newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  } else {
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders,
  });
}
