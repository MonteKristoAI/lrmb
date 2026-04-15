/**
 * Cloudflare Worker -- Reverse Proxy for GummyGurl Blog
 *
 * Routes gummygurl.lovable.app/blog/* to the blog Cloudflare Pages project.
 * All other routes pass through to WordPress/WooCommerce on SiteGround.
 *
 * SETUP:
 * 1. Deploy this worker to Cloudflare (Workers dashboard or wrangler)
 * 2. Set route: gummygurl.lovable.app/blog/*
 * 3. Update BLOG_ORIGIN to your blog Pages project URL
 */

const BLOG_ORIGIN = 'https://gummygurl-blog.pages.dev';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only handle /blog paths
    if (!url.pathname.startsWith('/blog')) {
      return fetch(request);
    }

    // Strip /blog prefix for the blog origin
    let blogPath = url.pathname.replace(/^\/blog/, '') || '/';

    // Ensure trailing slash for directory-style paths (SEO canonical)
    if (!blogPath.includes('.') && !blogPath.endsWith('/')) {
      blogPath += '/';
    }

    const blogUrl = new URL(blogPath, BLOG_ORIGIN);
    blogUrl.search = url.search;

    const response = await fetch(blogUrl.toString(), {
      method: request.method,
      headers: request.headers,
    });

    // Clone response and add SEO-friendly headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Robots-Tag', 'index, follow');
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Cache static assets aggressively, HTML less so
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
