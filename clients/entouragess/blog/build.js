#!/usr/bin/env node
/**
 * Entourage Gummies Blog Build Script
 *
 * Reads HTML post files from /posts/, wraps them in the site template,
 * and generates: index page, sitemap.xml, rss.xml, robots.txt, _redirects,
 * and individual post pages.
 *
 * Post files must contain a metadata comment block at the top:
 * <!-- META
 * title: What is the Entourage Effect?
 * slug: what-is-the-entourage-effect
 * description: Meta description 150-160 chars
 * date: 2026-04-15
 * updated: 2026-04-15
 * category: Entourage Effect Science
 * image: /blog/images/hero.webp
 * image_alt: Descriptive alt text
 * read_time: 9
 * -->
 *
 * Build-time validations (FAIL fast if violated):
 *   1. Zero em dashes or en dashes anywhere in post content
 *   2. TiME INFUSION stylized exactly (no "Time Infusion", "TIME INFUSION", "time infusion")
 *   3. Azuca is never mentioned
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://getentouragegummies.com';
const BLOG_PATH = '/blog';
const SITE_NAME = 'Entourage Gummies';
const DIST = path.join(__dirname, 'dist');
const POSTS_DIR = path.join(__dirname, 'posts');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const CSS_DIR = path.join(__dirname, 'css');
const IMAGES_DIR = path.join(__dirname, 'images');

// ============================================================
// Helpers
// ============================================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseMeta(html) {
  const match = html.match(/<!--\s*META\s*([\s\S]*?)-->/);
  if (!match) return null;
  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key && val) meta[key] = val;
  });
  return meta;
}

function stripMeta(html) {
  return html.replace(/<!--\s*META\s*[\s\S]*?-->\s*/, '');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function isoDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toISOString();
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function truncate(str, len) {
  if (str.length <= len) return str;
  return str.slice(0, len - 3) + '...';
}

function extractExcerpt(html) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return truncate(text, 200);
}

function addLazyLoading(html) {
  return html.replace(/<img(?![^>]*loading=)([^>]*?)>/gi, '<img loading="lazy"$1>');
}

// ============================================================
// Entourage brand validations — fail fast on any violation
// ============================================================

function validatePost(file, content) {
  const errors = [];

  // 1. Em dash / en dash check. Sandy calls these "AI dashes" and wants every one gone.
  const emMatch = content.match(/—/g);
  const enMatch = content.match(/–/g);
  if (emMatch) errors.push(`${emMatch.length} em dash(es) — replace with commas, periods, or rewrite`);
  if (enMatch) errors.push(`${enMatch.length} en dash(es) — replace with hyphens or rewrite`);

  // 2. TiME INFUSION case sanity. The exact form is TiME INFUSION (lowercase i, all caps INFUSION).
  //    Count all case-insensitive hits. Count exact-correct hits. Anything else is wrong.
  const allHits = (content.match(/\btime\s*-?\s*infusion\b/gi) || []);
  const exactHits = (content.match(/\bTiME INFUSION\b/g) || []);
  if (allHits.length > exactHits.length) {
    const wrongVariants = allHits.filter(h => h !== 'TiME INFUSION');
    const unique = [...new Set(wrongVariants)].slice(0, 3).join(', ');
    errors.push(`${allHits.length - exactHits.length} incorrectly-cased "TiME INFUSION" variant(s) (${unique}). Must be: TiME INFUSION (lowercase i, INFUSION all caps, proper noun never verb).`);
  }

  // 3. Azuca must never appear. The preclinical chart is remade from scratch and the footnote
  //    is rewritten without the "funded by Azuca" phrase.
  if (/\bazuca\b/i.test(content)) {
    errors.push(`"Azuca" mentioned — must be removed entirely. The preclinical chart is remade from scratch without any Azuca attribution.`);
  }

  // 4. No medical claims / "cures" language. This is a payment-processor compliance gate.
  const medicalClaims = /\b(cure[sd]?|treat(s|ed|ing)?|heal[sd]?|remed[yi]|medicine|pharmaceutical)\b/gi;
  const medicalHits = content.match(medicalClaims);
  if (medicalHits && medicalHits.length > 0) {
    errors.push(`Medical-claim language detected (${medicalHits.slice(0, 3).join(', ')}). Hemp edible brands cannot make medical claims.`);
  }

  if (errors.length > 0) {
    console.error(`\n  BUILD FAILED — brand validation errors in ${file}:`);
    errors.forEach(e => console.error(`    - ${e}`));
    console.error('');
    process.exit(1);
  }
}

// ============================================================
// Load posts
// ============================================================

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const meta = parseMeta(raw);
    if (!meta || !meta.title || !meta.slug || !meta.date) {
      console.warn(`  SKIP: ${file} (missing required META fields: title, slug, date)`);
      continue;
    }
    const content = stripMeta(raw);
    validatePost(file, content);
    posts.push({
      file,
      meta,
      content,
      excerpt: meta.description || extractExcerpt(content),
    });
  }

  posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
  return posts;
}

// ============================================================
// Schema
// ============================================================

function extractFaqFromHtml(html) {
  const faqSection = html.match(/<section[^>]*class="faq-section"[^>]*>([\s\S]*?)<\/section>/i);
  if (!faqSection) return [];
  const faqHtml = faqSection[1];
  const pairs = [];
  const questionRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = questionRegex.exec(faqHtml)) !== null) {
    let question = match[1].replace(/<[^>]+>/g, '').replace(/^Q:\s*/i, '').trim();
    let answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer) pairs.push({ question, answer });
  }
  return pairs;
}

function buildPostSchema(post) {
  const faqPairs = extractFaqFromHtml(post.content);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.meta.title,
      "description": post.meta.description || post.excerpt,
      "datePublished": isoDate(post.meta.date),
      "dateModified": isoDate(post.meta.updated || post.meta.date),
      "url": `${SITE_URL}${BLOG_PATH}/${post.meta.slug}/`,
      "image": post.meta.image ? `${SITE_URL}${post.meta.image}` : undefined,
      "wordCount": post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w).length,
      "author": {
        "@type": "Person",
        "name": post.meta.author || "Sandy Adams",
        "jobTitle": "Founder, Entourage Gummies",
        "url": `${SITE_URL}/#about`,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Entourage Gummies",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}${BLOG_PATH}/images/logo-gold.png`,
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}${BLOG_PATH}/${post.meta.slug}/`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${SITE_URL}${BLOG_PATH}/` },
        { "@type": "ListItem", "position": 3, "name": post.meta.category || "Article", "item": `${SITE_URL}${BLOG_PATH}/` },
        { "@type": "ListItem", "position": 4, "name": post.meta.title, "item": `${SITE_URL}${BLOG_PATH}/${post.meta.slug}/` },
      ],
    },
  ];

  if (faqPairs.length >= 3) {
    schema.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqPairs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
    console.log(`    FAQ: ${faqPairs.length} pairs -> FAQPage schema`);
  }

  return schema;
}

// ============================================================
// Build individual post pages
// ============================================================

function buildPostPages(posts, postTemplate) {
  const year = new Date().getFullYear();

  for (const post of posts) {
    const postDir = path.join(DIST, post.meta.slug);
    ensureDir(postDir);

    const schema = buildPostSchema(post);

    const related = posts
      .filter(p => p.meta.slug !== post.meta.slug)
      .filter(p => p.meta.category === post.meta.category)
      .slice(0, 3);

    if (related.length < 3) {
      const additional = posts
        .filter(p => p.meta.slug !== post.meta.slug && !related.includes(p))
        .slice(0, 3 - related.length);
      related.push(...additional);
    }

    const relatedHtml = related.length > 0
      ? related.map(r => `
        <a href="${BLOG_PATH}/${r.meta.slug}/" class="post-card">
          ${r.meta.image ? `<img src="${r.meta.image}" alt="${escapeXml(r.meta.image_alt || r.meta.title)}" class="post-card-img" loading="lazy">` : ''}
          <div class="post-card-body">
            <p class="post-card-category">${escapeXml(r.meta.category || '')}</p>
            <h3 class="post-card-title">${escapeXml(r.meta.title)}</h3>
          </div>
        </a>`).join('\n')
      : '<p>More articles coming soon.</p>';

    let html = postTemplate
      .replace(/\{\{TITLE\}\}/g, escapeXml(post.meta.title))
      .replace(/\{\{TITLE_SHORT\}\}/g, escapeXml(truncate(post.meta.title, 50)))
      .replace(/\{\{META_DESCRIPTION\}\}/g, escapeXml(post.meta.description || post.excerpt))
      .replace(/\{\{SLUG\}\}/g, post.meta.slug)
      .replace(/\{\{OG_IMAGE\}\}/g, post.meta.image ? `${SITE_URL}${post.meta.image}` : `${SITE_URL}${BLOG_PATH}/images/og-default.png`)
      .replace(/\{\{CATEGORY\}\}/g, escapeXml(post.meta.category || 'General'))
      .replace(/\{\{SCHEMA\}\}/g, `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`)
      .replace(/\{\{CONTENT\}\}/g, addLazyLoading(post.content))
      .replace(/\{\{RELATED_POSTS\}\}/g, relatedHtml)
      .replace(/\{\{YEAR\}\}/g, year);

    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    console.log(`  POST: ${post.meta.slug}/`);
  }
}

// ============================================================
// Build index page
// ============================================================

function buildIndexPage(posts, indexTemplate) {
  const year = new Date().getFullYear();

  const cards = posts.map(post => `
    <a href="${BLOG_PATH}/${post.meta.slug}/" class="post-card">
      ${post.meta.image ? `<img src="${post.meta.image}" alt="${escapeXml(post.meta.image_alt || post.meta.title)}" class="post-card-img" loading="lazy">` : '<div class="post-card-img-placeholder"></div>'}
      <div class="post-card-body">
        <p class="post-card-category">${escapeXml(post.meta.category || 'General')}</p>
        <h2 class="post-card-title">${escapeXml(post.meta.title)}</h2>
        <p class="post-card-excerpt">${escapeXml(post.excerpt)}</p>
        <div class="post-card-meta">
          <span>${formatDate(post.meta.date)}</span>
          ${post.meta.read_time ? `<span>${post.meta.read_time} min read</span>` : ''}
        </div>
      </div>
    </a>`).join('\n');

  const html = indexTemplate
    .replace(/\{\{POST_CARDS\}\}/g, cards || '<p class="no-posts">Posts coming soon. Check back for guides on the entourage effect, fast-acting hemp THC, dosing, and the science behind sessionable edibles.</p>')
    .replace(/\{\{YEAR\}\}/g, year);

  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  console.log('  INDEX: /blog/');
}

// ============================================================
// sitemap.xml, rss.xml, robots.txt, _redirects
// ============================================================

function buildSitemap(posts) {
  const urls = [
    `  <url>\n    <loc>${SITE_URL}${BLOG_PATH}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`,
    ...posts.map(post =>
      `  <url>\n    <loc>${SITE_URL}${BLOG_PATH}/${post.meta.slug}/</loc>\n    <lastmod>${post.meta.updated || post.meta.date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  console.log('  SITEMAP: /blog/sitemap.xml');
}

function buildRss(posts) {
  const items = posts.slice(0, 20).map(post => `    <item>
      <title>${escapeXml(post.meta.title)}</title>
      <link>${SITE_URL}${BLOG_PATH}/${post.meta.slug}/</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.meta.date + 'T00:00:00').toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}${BLOG_PATH}/${post.meta.slug}/</guid>
      ${post.meta.category ? `<category>${escapeXml(post.meta.category)}</category>` : ''}
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${SITE_URL}${BLOG_PATH}/</link>
    <description>The entourage effect, fast-acting hemp THC, dosing, and the science behind sessionable edibles. From the makers of Entourage Gummies.</description>
    <language>en-US</language>
    <atom:link href="${SITE_URL}${BLOG_PATH}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(DIST, 'rss.xml'), xml);
  console.log('  RSS: /blog/rss.xml');
}

function buildRobotsTxt() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}${BLOG_PATH}/sitemap.xml

# Entourage Gummies Blog
# Static HTML served via Cloudflare Pages behind a Worker reverse proxy.
`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);
  console.log('  ROBOTS: robots.txt');
}

function buildRedirects() {
  // Templates hardcode /blog/... root-absolute paths so the site works behind the Worker
  // (which strips /blog). On the raw .pages.dev URL there is no Worker, so we rewrite
  // /blog/* -> /* at the Pages edge with a 200 (internal rewrite, not a redirect). This
  // makes CSS and images resolve on both .pages.dev and getentouragegummies.com.
  const redirects = `/blog/*  /:splat  200\n`;
  fs.writeFileSync(path.join(DIST, '_redirects'), redirects);
  console.log('  REDIRECTS: _redirects (rewrite /blog/* -> /*)');
}

// ============================================================
// Copy static assets (CSS + images)
// ============================================================

function copyAssets() {
  const cssDistDir = path.join(DIST, 'css');
  ensureDir(cssDistDir);
  if (fs.existsSync(CSS_DIR)) {
    for (const file of fs.readdirSync(CSS_DIR)) {
      let css = fs.readFileSync(path.join(CSS_DIR, file), 'utf8');
      const originalSize = css.length;
      css = css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{};:,>~+])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim();
      fs.writeFileSync(path.join(cssDistDir, file), css);
      const savings = Math.round((1 - css.length / originalSize) * 100);
      console.log(`  CSS: ${file} (${savings}% smaller)`);
    }
  }

  const imgDistDir = path.join(DIST, 'images');
  ensureDir(imgDistDir);
  if (fs.existsSync(IMAGES_DIR)) {
    for (const file of fs.readdirSync(IMAGES_DIR)) {
      fs.copyFileSync(path.join(IMAGES_DIR, file), path.join(imgDistDir, file));
    }
    console.log(`  IMAGES: ${fs.readdirSync(IMAGES_DIR).length} copied`);
  }
}

// ============================================================
// Ping search engines + IndexNow on build
// ============================================================

function pingSitemap(posts) {
  const sitemapUrl = `${SITE_URL}${BLOG_PATH}/sitemap.xml`;
  const https = require('https');

  const pingUrl = (url) => {
    https.get(url, () => {}).on('error', () => {});
  };

  pingUrl(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
  pingUrl(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
  console.log('  PING: sitemap submitted to Google + Bing');

  if (posts && posts.length > 0) {
    const latestUrls = posts.slice(0, 5).map(p => `${SITE_URL}${BLOG_PATH}/${p.meta.slug}/`);
    const indexNowPayload = JSON.stringify({
      host: new URL(SITE_URL).hostname,
      urlList: [`${SITE_URL}${BLOG_PATH}/`, ...latestUrls],
    });
    const req = https.request({
      hostname: 'api.indexnow.org',
      path: '/indexnow',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, () => {});
    req.on('error', () => {});
    req.write(indexNowPayload);
    req.end();
    console.log(`  INDEXNOW: ${latestUrls.length + 1} URLs submitted`);
  }
}

// ============================================================
// Main
// ============================================================

function main() {
  console.log('\n  Entourage Gummies Blog Build\n');

  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  ensureDir(DIST);

  const postTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'post.html'), 'utf8');
  const indexTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'index.html'), 'utf8');

  const posts = loadPosts();
  console.log(`  Found ${posts.length} post(s)\n`);

  buildPostPages(posts, postTemplate);
  buildIndexPage(posts, indexTemplate);
  buildSitemap(posts);
  buildRss(posts);
  copyAssets();
  buildRobotsTxt();
  buildRedirects();

  pingSitemap(posts);

  console.log(`\n  Build complete: ${posts.length} post(s) -> dist/\n`);
}

main();
