/**
 * Round 3 Phase 1 - Image Optimization Pipeline
 *
 * Reads every file in client/public/images/originals/ and emits:
 *   - {name}.webp  - primary format (quality 82)
 *   - {name}.avif  - secondary format (quality 60)
 *
 * For the 3 hero-class backgrounds (hero-bg, process-bg, team-bg), also emits
 * responsive variants at widths 640, 960, 1280, 1920 for CWV optimization:
 *   - {name}-640.webp, {name}-960.webp, {name}-1280.webp, {name}-1920.webp
 *   - {name}-640.avif, {name}-960.avif, {name}-1280.avif, {name}-1920.avif
 *
 * For small icons (<= 256px), skip responsive variants - single-size is enough.
 *
 * Usage:
 *   node scripts/optimize-images.mjs
 */
import { readdir, stat, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMG_DIR = path.resolve(__dirname, "..", "client", "public", "images");
const IN_DIR = path.resolve(__dirname, "..", ".cache", "image-originals");

// Which files get responsive variants (hero backgrounds that affect LCP/CWV)
const RESPONSIVE_BASENAMES = new Set(["hero-bg", "process-bg", "team-bg"]);
const RESPONSIVE_WIDTHS = [640, 960, 1280, 1920];

// Icons get a max-width cap to prevent shipping massive 5MB PNGs
const ICON_BASENAMES = new Set([
  "icon-efficiency",
  "icon-brain",
  "icon-target",
  "icon-users",
  "icon-shield",
  "icon-trending",
  "icon-skyline",
  "icon-mortgage",
  "icon-cre",
  "icon-consulting",
  "icon-workflow-transparent",
  "icon-data-transparent",
  "icon-efficiency-transparent",
  "icon-handshake",
  "gold-microphone",
]);
const ICON_MAX_WIDTH = 256;

// Logo gets capped too
const LOGO_MAX_WIDTH = 512;

// Landmarks are medium-scale decorative illustrations
const LANDMARK_BASENAMES = new Set(["landmark-models", "landmark-method", "landmark-industries"]);
const LANDMARK_MAX_WIDTH = 1200;

async function optimizeOne(inputPath) {
  const filename = path.basename(inputPath);
  const basename = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "");

  let results = [];

  const input = sharp(inputPath);
  const meta = await input.metadata();
  const origBytes = (await stat(inputPath)).size;

  // Determine target width (cap for icons, logos, landmarks; full for hero backgrounds)
  let targetWidth = meta.width ?? 1920;
  if (ICON_BASENAMES.has(basename)) {
    targetWidth = Math.min(meta.width ?? ICON_MAX_WIDTH, ICON_MAX_WIDTH);
  } else if (basename === "logo-gold") {
    targetWidth = Math.min(meta.width ?? LOGO_MAX_WIDTH, LOGO_MAX_WIDTH);
  } else if (LANDMARK_BASENAMES.has(basename)) {
    targetWidth = Math.min(meta.width ?? LANDMARK_MAX_WIDTH, LANDMARK_MAX_WIDTH);
  } else if (basename === "og-default") {
    targetWidth = 1200; // OG standard
  }

  // Primary size
  const primary = sharp(inputPath).resize({ width: targetWidth, withoutEnlargement: true });

  const webpPath = path.join(IMG_DIR, `${basename}.webp`);
  const avifPath = path.join(IMG_DIR, `${basename}.avif`);

  await primary.clone().webp({ quality: 82, effort: 4 }).toFile(webpPath);
  await primary.clone().avif({ quality: 60, effort: 4 }).toFile(avifPath);

  const webpBytes = (await stat(webpPath)).size;
  const avifBytes = (await stat(avifPath)).size;
  results.push({ format: "webp", size: targetWidth, bytes: webpBytes });
  results.push({ format: "avif", size: targetWidth, bytes: avifBytes });

  // Responsive variants for hero-class backgrounds
  if (RESPONSIVE_BASENAMES.has(basename)) {
    for (const w of RESPONSIVE_WIDTHS) {
      if (w > (meta.width ?? 1920)) continue; // don't upscale
      const resized = sharp(inputPath).resize({ width: w, withoutEnlargement: true });
      const wp = path.join(IMG_DIR, `${basename}-${w}.webp`);
      const ap = path.join(IMG_DIR, `${basename}-${w}.avif`);
      await resized.clone().webp({ quality: 82, effort: 4 }).toFile(wp);
      await resized.clone().avif({ quality: 60, effort: 4 }).toFile(ap);
      results.push({ format: "webp", size: w, bytes: (await stat(wp)).size });
      results.push({ format: "avif", size: w, bytes: (await stat(ap)).size });
    }
  }

  const totalNew = results.reduce((s, r) => s + r.bytes, 0);
  const savings = (((origBytes - totalNew) / origBytes) * 100).toFixed(1);
  const primaryWebp = results.find((r) => r.format === "webp" && r.size === targetWidth);

  console.log(
    `  ${basename.padEnd(32)} orig ${(origBytes / 1024).toFixed(0).padStart(5)}K → webp ${(primaryWebp.bytes / 1024).toFixed(0).padStart(4)}K (${results.length} files, net ${savings}% reduction)`,
  );

  return { basename, origBytes, totalNew, variants: results.length };
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  console.log(`Optimizing ${IN_DIR}\n`);

  const files = (await readdir(IN_DIR)).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  if (files.length === 0) {
    console.error("No source images found. Run download-assets.mjs first.");
    process.exit(1);
  }

  const summary = [];
  for (const f of files.sort()) {
    try {
      summary.push(await optimizeOne(path.join(IN_DIR, f)));
    } catch (err) {
      console.error(`  ✗ ${f}: ${err.message}`);
    }
  }

  const totalOrig = summary.reduce((s, r) => s + r.origBytes, 0);
  const totalNew = summary.reduce((s, r) => s + r.totalNew, 0);
  const totalVariants = summary.reduce((s, r) => s + r.variants, 0);
  const overallSavings = (((totalOrig - totalNew) / totalOrig) * 100).toFixed(1);

  console.log(`\n─────────────────────────────────────`);
  console.log(`Optimized ${summary.length} source images → ${totalVariants} output files`);
  console.log(`Original total: ${(totalOrig / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New total:      ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Net savings:    ${overallSavings}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
