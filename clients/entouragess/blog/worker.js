/**
 * Cloudflare Worker — Reverse Proxy for the Entourage Gummies Blog.
 *
 * Routes getentouragegummies.com/blog/* to the blog Cloudflare Pages project.
 * All other routes fall through to the main Entourage site.
 *
 * SETUP:
 *   1. Deploy the Cloudflare Pages project (build: `node build.js`, output: `dist`)
 *   2. Deploy this worker: `npx wrangler deploy` from repo root
 *   3. In Cloudflare dashboard, set route: getentouragegummies.com/blog/*
 *   4. Update BLOG_ORIGIN below if the Pages project URL differs
 */

const BLOG_ORIGIN = 'https://entouragess-blog.pages.dev';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only handle /blog paths. Everything else passes through to the main site.
    if (!url.pathname.startsWith('/blog')) {
      return fetch(request);
    }

    // Strip the /blog prefix for the origin request (the blog is served from root on Pages).
    let blogPath = url.pathname.replace(/^\/blog/, '') || '/';

    // Canonicalize directory-style paths with a trailing slash for SEO.
    if (!blogPath.includes('.') && !blogPath.endsWith('/')) {
      blogPath += '/';
    }

    const blogUrl = new URL(blogPath, BLOG_ORIGIN);
    blogUrl.search = url.search;

    const response = await fetch(blogUrl.toString(), {
      method: request.method,
      headers: request.headers,
    });

    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Robots-Tag', 'index, follow');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      newHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    } else {
      newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
