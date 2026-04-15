/**
 * Round 3 Phase 1 - Image Reference Rewriter
 *
 * Replaces every CloudFront/Manus CDN image URL in the codebase with the
 * corresponding local /images/{name}.webp path.
 *
 * Usage:
 *   node scripts/relink-images.mjs
 */
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// CloudFront base (public assets)
const CF_BASE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj";

// Map of CDN filename → local target (webp, served from /images/)
const FILENAME_MAP = {
  // Logo and OG
  "aiia_logo_pure_gold_transparent_8063797a.png": "logo-gold.webp",
  "aiia-og-image-v3_1b0f8ae3.png": "og-default.webp",

  // Icons
  "aiia-icon-efficiency_6b72c1c5.png": "icon-efficiency.webp",
  "aiia-icon-brain_44428059.png": "icon-brain.webp",
  "aiia-icon-target_497d409f.png": "icon-target.webp",
  "aiia-icon-users_e93f46d8.png": "icon-users.webp",
  "aiia-icon-shield_a56f54cb.png": "icon-shield.webp",
  "aiia-icon-trending_e02fc2b1.png": "icon-trending.webp",
  "aiia-icon-skyline-v1_b078c165.png": "icon-skyline.webp",
  "aiia-icon-mortgage_5eadfd92.png": "icon-mortgage.webp",
  "aiia-icon-cre_2c9f616d.png": "icon-cre.webp",
  "aiia-icon-consulting_43265006.png": "icon-consulting.webp",
  "aiia-icon-workflow-transparent_82f2845e.png": "icon-workflow-transparent.webp",
  "aiia-icon-data-transparent_b28f86bc.png": "icon-data-transparent.webp",
  "aiia-icon-efficiency-transparent_e03b49c8.png": "icon-efficiency-transparent.webp",

  // Already WebP at source - just change hash suffix to local
  "aiia-icon-handshake-aPpLfARcj64PcMhQFxNgTw.webp": "icon-handshake.webp",
  "aiia_gold_microphone_v2-cZjuNxwT4CHFwbMHWYwnRS.webp": "gold-microphone.webp",

  // Landmark illustrations
  "aiia-landmark-models_23cafdae.png": "landmark-models.webp",
  "aiia-landmark-method_c0f60812.png": "landmark-method.webp",
  "aiia-landmark-industries_345f6f1d.png": "landmark-industries.webp",
};

// Manus signed URL patterns → local paths
// We do prefix match on the known session UUID, since the signatures vary
const MANUS_REPLACEMENTS = [
  // hero-bg
  {
    match: /"https:\/\/private-us-east-1\.manuscdn\.com\/sessionFile\/[^"]*KV9rHWJ9VYR1NSAlzZrFLI[^"]*"/g,
    replace: '"/images/hero-bg.webp"',
  },
  // process-bg
  {
    match: /"https:\/\/private-us-east-1\.manuscdn\.com\/sessionFile\/[^"]*F4ncCcII64x2p4VFSvfQPR-img-3[^"]*"/g,
    replace: '"/images/process-bg.webp"',
  },
  // team-bg
  {
    match: /"https:\/\/private-us-east-1\.manuscdn\.com\/sessionFile\/[^"]*F4ncCcII64x2p4VFSvfQPR-img-5[^"]*"/g,
    replace: '"/images/team-bg.webp"',
  },
];

// File extensions to process
const EXT_RE = /\.(tsx|ts|html|js|mjs|jsx|css|json|xml|txt|md)$/i;

// Directories to walk (relative to ROOT)
// Note: scripts/ is EXCLUDED because download-assets.mjs owns the URL list and
// must not be rewritten by this relink pass.
const SCAN_DIRS = ["client/src", "client/public", "client/index.html"];

// Directories to skip
const SKIP_DIRS = new Set(["node_modules", ".manus", ".manus-logs", ".cache", "__manus__", "dist", "build"]);

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    // probably a single file path
    if ((await stat(dir).catch(() => null))?.isFile()) {
      yield dir;
    }
    return;
  }
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else if (EXT_RE.test(e.name)) {
      yield full;
    }
  }
}

async function processFile(filePath) {
  let content = await readFile(filePath, "utf8");
  const original = content;
  let changes = 0;

  // CloudFront URL replacements
  for (const [cdnName, localName] of Object.entries(FILENAME_MAP)) {
    const cdnUrl = `${CF_BASE}/${cdnName}`;
    const localUrl = `/images/${localName}`;
    if (content.includes(cdnUrl)) {
      content = content.split(cdnUrl).join(localUrl);
      changes += 1;
    }
  }

  // Manus signed URL regex replacements
  for (const { match, replace } of MANUS_REPLACEMENTS) {
    if (match.test(content)) {
      content = content.replace(match, replace);
      changes += 1;
    }
  }

  if (content !== original) {
    await writeFile(filePath, content, "utf8");
    return { file: path.relative(ROOT, filePath), changes };
  }
  return null;
}

async function main() {
  console.log("Scanning and rewriting image references...\n");
  const touched = [];

  for (const dirOrFile of SCAN_DIRS) {
    const full = path.resolve(ROOT, dirOrFile);
    for await (const filePath of walk(full)) {
      const result = await processFile(filePath);
      if (result) {
        touched.push(result);
        console.log(`  ✓ ${result.file} (${result.changes} replacements)`);
      }
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`Files modified: ${touched.length}`);
  console.log(`Total replacements: ${touched.reduce((s, r) => s + r.changes, 0)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
