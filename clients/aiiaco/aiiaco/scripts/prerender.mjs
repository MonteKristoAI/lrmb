/**
 * AiiACo Static Site Generation Script
 * Runs AFTER `vite build` and `build:ssr` to inject rendered HTML into each route.
 *
 * CRITICAL: Saves a clean copy of the Vite shell BEFORE overwriting any route files.
 * This prevents the homepage content from polluting sub-route shells.
 *
 * Usage: node scripts/prerender.mjs
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist", "public");

const STATIC_ROUTES = [
  "/",
  "/manifesto",
  "/method",
  "/industries",
  "/models",
  "/case-studies",
  "/results",
  "/upgrade",
  "/privacy",
  "/terms",
  "/ai-integration",
  "/ai-implementation-services",
  "/ai-automation-for-business",
  "/ai-governance",
  "/ai-crm-integration",
  "/ai-workflow-automation",
  "/ai-revenue-engine",
  "/ai-for-real-estate",
  "/ai-for-vacation-rentals",
  "/workplace",
  "/corporate",
  "/agentpackage",
  "/operator",
  "/demo",
  "/talk",
];

// Note: /blog/* routes are handled by the separate aiiaco-blog static site
// served via Cloudflare Worker proxy at aiiaco.com/blog/*. They are NOT
// part of this React app's prerender pipeline.

// Industry microsite slugs - pulled from client/src/data/industries.ts
// Off-brand slugs (high-risk-merchant-services, beauty-health-wellness,
// cosmetics-personal-care, helium-specialty-gas, biofuel-sustainable-fuels)
// are intentionally excluded from SEO pre-rendering per the SEO audit.
const INDUSTRY_SLUGS = [
  "real-estate-brokerage",
  "mortgage-lending",
  "commercial-real-estate",
  "management-consulting",
  "insurance",
  "financial-services",
  "investment-wealth-management",
  "luxury-lifestyle-hospitality",
  "software-technology",
  "agency-operations",
  "energy",
  "solar-renewable-energy",
  "automotive-ev",
  "food-beverage",
  "cryptocurrency-digital-assets",
  "software-consulting",
  "software-engineering",
  "oil-gas",
  "alternative-energy",
  "battery-ev-technology",
];

const ROUTES = [
  ...STATIC_ROUTES,
  ...INDUSTRY_SLUGS.map(slug => `/industries/${slug}`),
];

// ─── Step 1: Load the clean Vite-built shell ───────────────────────────────
const shellPath = join(DIST, "index.html");
if (!existsSync(shellPath)) {
  console.error("❌ dist/public/index.html not found. Run `pnpm build:vite` first.");
  process.exit(1);
}

// Save a clean copy of the shell BEFORE we overwrite index.html with homepage content
const cleanShell = readFileSync(shellPath, "utf-8");

// Verify the shell is clean (root div should be empty)
if (!cleanShell.includes('<div id="root"></div>')) {
  console.error("❌ Shell is not clean - <div id=\"root\"> already has content.");
  console.error("   Run `pnpm build:vite` to regenerate a clean shell first.");
  process.exit(1);
}

console.log(`✅ Clean HTML shell loaded (${cleanShell.length} bytes)`);

// ─── Step 2: Load the SSR server entry ────────────────────────────────────
const serverEntryPath = join(ROOT, "dist", "server-entry.js");
if (!existsSync(serverEntryPath)) {
  console.error("❌ dist/server-entry.js not found. Run `pnpm build:ssr` first.");
  process.exit(1);
}

const { renderRoute } = await import(serverEntryPath);
console.log("✅ Server entry loaded");

// ─── Step 3: Render each route ────────────────────────────────────────────
let successCount = 0;
let errorCount = 0;

/**
 * Post-process Framer Motion inline styles so the SSR HTML shows hero/body content
 * in its FINAL (visible) state rather than the initial (hidden, opacity:0) state.
 *
 * Framer Motion renders `initial={{ opacity: 0, y: 24 }}` as an inline style attribute
 * like `style="...;opacity:0;transform:translateY(24px);..."`. Googlebot's renderer
 * captures the first frame, so hero content is invisible in its screenshot.
 *
 * SCOPING: we only rewrite elements where BOTH `opacity:0` AND a matching
 * `transform:translateY(Npx)` (or `translateX`) appear within the SAME style
 * attribute. That pattern is Framer-specific and will not accidentally nuke
 * legitimate static layout transforms (badge centering via `translateX(-50%)`,
 * progress-bar fills, hidden modals/tooltips) because those don't co-occur with
 * `opacity:0` as a Framer initial. The match is per-style-attribute.
 */
function makeFramerContentVisible(html) {
  return html.replace(/style="([^"]*)"/g, (_match, styleBody) => {
    // Only touch style attributes that look like a Framer initial state:
    //   contain `opacity: 0` AND a `transform: translate{X|Y}(...)`
    const hasOpacityZero = /opacity:\s*0(?![.\d])/.test(styleBody);
    const hasTranslate = /transform:\s*translate[XY]\([^)]+\)/.test(styleBody);
    if (!hasOpacityZero || !hasTranslate) return `style="${styleBody}"`;
    let rewritten = styleBody
      .replace(/opacity:\s*0(?![.\d])/g, "opacity:1")
      .replace(/transform:\s*translate[XY]\([^)]+\)/g, "transform:none");
    return `style="${rewritten}"`;
  });
}

for (const route of ROUTES) {
  try {
    const { html: rawHtml, helmetContext } = renderRoute(route);
    const renderedHtml = makeFramerContentVisible(rawHtml);
    const helmet = helmetContext.helmet;

    // Start with the CLEAN shell every time (not the previously modified file)
    let output = cleanShell;

    // Inject rendered body HTML into the empty <div id="root">
    output = output.replace(
      '<div id="root"></div>',
      `<div id="root">${renderedHtml}</div>`
    );

    // Build helmet head tags string
    if (helmet) {
      const helmetTitleStr = helmet.title?.toString() ?? "";
      const helmetMetaStr = helmet.meta?.toString() ?? "";
      const helmetLinkStr = helmet.link?.toString() ?? "";
      const helmetScriptStr = helmet.script?.toString() ?? "";
      const helmetStyleStr = helmet.style?.toString() ?? "";
      const helmetNoscriptStr = helmet.noscript?.toString() ?? "";

      const headTags = [
        helmetTitleStr,
        helmetMetaStr,
        helmetLinkStr,
        helmetScriptStr,
        helmetStyleStr,
        helmetNoscriptStr,
      ]
        .filter(s => s && s.trim().length > 0)
        .join("\n    ");

      if (headTags) {
        // ONLY remove the default shell title if helmet actually produced a title tag.
        // Otherwise we would strip the fallback and leave the page with NO title at all.
        if (helmetTitleStr && helmetTitleStr.trim().length > 0) {
          output = output.replace(/<title>[^<]*<\/title>/, "");
        }
        // Inject helmet tags before </head>
        output = output.replace("</head>", `  ${headTags}\n  </head>`);
      }
    }

    // Determine output path
    const routeDir = route === "/" ? DIST : join(DIST, route.slice(1));
    mkdirSync(routeDir, { recursive: true });
    const outPath = join(routeDir, "index.html");
    writeFileSync(outPath, output, "utf-8");

    // Sanity check - count visible text words in the rendered HTML only
    const textContent = renderedHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = textContent.split(" ").filter(w => w.length > 2).length;

    // Verify title was injected
    const titleMatch = output.match(/<title[^>]*>([^<]+)/);
    const titleText = titleMatch ? titleMatch[1] : "NO TITLE";

    console.log(`✅ ${route.padEnd(15)} → ${wordCount} words | title: "${titleText.slice(0, 50)}"`);
    successCount++;
  } catch (err) {
    console.error(`❌ Failed to render ${route}:`, err.message);
    if (process.env.DEBUG) console.error(err.stack);
    errorCount++;
  }
}

console.log(`\n🏁 Prerender complete: ${successCount} routes OK, ${errorCount} errors.`);
if (errorCount > 0) process.exit(1);

console.log("\n📋 Output files:");
for (const route of ROUTES) {
  const routeDir = route === "/" ? DIST : join(DIST, route.slice(1));
  const outPath = join(routeDir, "index.html");
  const size = existsSync(outPath) ? Math.round(readFileSync(outPath).length / 1024) : 0;
  console.log(`   ${route.padEnd(15)} → ${outPath.replace(ROOT, "")} (${size}KB)`);
}
