/**
 * Cloudflare Worker — Combined Reverse Proxy for LuxeShutters
 * Routes blog and location pages to their respective CF Pages projects.
 * All other routes pass through to the main React SPA.
 *
 * Routes:
 *   /blog/*                → luxeshutters-blog.pages.dev
 *   /temora/*              → luxeshutters-locations.pages.dev/temora/
 *   /wagga-wagga/*         → luxeshutters-locations.pages.dev/wagga-wagga/
 *   /young/*               → luxeshutters-locations.pages.dev/young/
 *   /west-wyalong/*        → luxeshutters-locations.pages.dev/west-wyalong/
 *   /cootamundra/*         → luxeshutters-locations.pages.dev/cootamundra/
 *   /junee/*               → luxeshutters-locations.pages.dev/junee/
 *   /griffith/*            → luxeshutters-locations.pages.dev/griffith/
 *   /cowra/*               → luxeshutters-locations.pages.dev/cowra/
 *   everything else        → pass through (main React SPA on CF Pages)
 */

const BLOG_ORIGIN = 'https://luxeshutters-blog.pages.dev';
const LOCATIONS_ORIGIN = 'https://luxeshutters-locations.pages.dev';
const LOCATION_SLUGS = new Set([
  'temora', 'wagga-wagga', 'young', 'west-wyalong',
  'cootamundra', 'junee', 'griffith', 'cowra'
]);

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const firstSegment = url.pathname.split('/')[1];

    // Blog proxy
    if (url.pathname.startsWith('/blog')) {
      let blogPath = url.pathname.replace(/^\/blog/, '') || '/';
      if (!blogPath.includes('.') && !blogPath.endsWith('/')) {
        blogPath += '/';
      }
      const blogUrl = new URL(blogPath, BLOG_ORIGIN);
      blogUrl.search = url.search;

      const response = await fetch(blogUrl.toString(), {
        method: request.method,
        headers: request.headers,
      });

      return addHeaders(response, 'text/html');
    }

    // Location pages proxy
    if (LOCATION_SLUGS.has(firstSegment)) {
      let locPath = url.pathname;
      if (!locPath.includes('.') && !locPath.endsWith('/')) {
        locPath += '/';
      }
      const locUrl = new URL(locPath, LOCATIONS_ORIGIN);
      locUrl.search = url.search;

      const response = await fetch(locUrl.toString(), {
        method: request.method,
        headers: request.headers,
      });

      return addHeaders(response, response.headers.get('content-type'));
    }

    // Everything else passes through to main CF Pages (React SPA)
    return fetch(request);
  },
};

function addHeaders(response, contentType) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-Robots-Tag', 'index, follow');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

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
