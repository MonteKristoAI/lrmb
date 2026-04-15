/**
 * AiiAco Pre-render Worker (Cloudflare Browser Rendering)
 *
 * Detects crawler user-agents and serves server-rendered HTML by running
 * the page through Cloudflare's native Puppeteer (Browser Rendering API).
 * Human visitors hit the origin directly - zero impact.
 *
 * Caches rendered HTML in KV for 7 days to minimize browser usage.
 */

import puppeteer from '@cloudflare/puppeteer';

const BOT_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'slurp',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'applebot',
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'perplexitybot',
  'perplexity-user',
  'cohere-ai',
  'bytespider',
  'google-extended',
  'meta-externalagent',
  'semrushbot',
  'ahrefsbot',
  'dotbot',
  'rogerbot',
  'screaming frog',
  'mj12bot',
  'petalbot',
];

function isBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_AGENTS.some(bot => ua.includes(bot));
}

const STATIC_EXT = /\.(js|css|xml|less|png|jpg|jpeg|gif|pdf|doc|txt|ico|rss|zip|mp3|rar|exe|wmv|avi|ppt|mpg|mpeg|tif|wav|mov|psd|ai|xls|mp4|m4a|swf|dat|dmg|iso|flv|m4v|torrent|ttf|woff|woff2|svg|eot|webp|avif|json|map)$/i;

async function renderWithBrowser(env, targetUrl) {
  const browser = await puppeteer.launch(env.BROWSER);
  const page = await browser.newPage();

  // Tell the origin we are a real browser so Manus doesn't do anything weird
  await page.setUserAgent(
    'Mozilla/5.0 (compatible; AiiAcoPrerender/1.0; +https://aiiaco.com)'
  );

  await page.goto(targetUrl, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Give any post-load JS a moment to finish mounting
  await new Promise(r => setTimeout(r, 1500));

  // Strip Manus editor runtime so crawlers don't see dev artifacts
  await page.evaluate(() => {
    document.querySelectorAll('script[src*="manus"]').forEach(el => el.remove());
    document.querySelectorAll('[id*="manus-previewer"]').forEach(el => el.remove());
    document.querySelectorAll('[id*="manus-selector"]').forEach(el => el.remove());
  });

  const html = await page.content();
  await browser.close();
  return html;
}

export default {
  async fetch(request, env, ctx) {
    const userAgent = request.headers.get('user-agent') || '';
    const url = new URL(request.url);

    // Static assets: always pass through
    if (STATIC_EXT.test(url.pathname)) {
      return fetch(request);
    }

    // Humans: pass through untouched
    if (!isBot(userAgent)) {
      return fetch(request);
    }

    // Bot path: check cache first
    const cacheKey = `prerender:${url.pathname}${url.search}`;
    const cached = await env.PRERENDER_CACHE.get(cacheKey);

    if (cached) {
      return new Response(cached, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-prerendered': 'hit',
          'cache-control': 'public, max-age=86400',
        },
      });
    }

    // Cache miss: render with Puppeteer
    try {
      const html = await renderWithBrowser(env, url.toString());

      // Store in KV for 7 days (background, don't block response)
      ctx.waitUntil(
        env.PRERENDER_CACHE.put(cacheKey, html, { expirationTtl: 604800 })
      );

      return new Response(html, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'x-prerendered': 'miss',
          'cache-control': 'public, max-age=86400',
        },
      });
    } catch (err) {
      console.error('Prerender failed:', err.message);
      // Fallback: serve origin HTML rather than 500
      return fetch(request);
    }
  },
};
