/**
 * Round 3 Phase 1 - Asset Migration
 *
 * Downloads every remote image referenced by the AiiACo site to local
 * .cache/image-originals/ so we can self-host, convert to WebP/AVIF,
 * and eliminate the dependency on Manus's CloudFront and signed CDN URLs.
 *
 * The 3 Manus signed URLs (hero, process, team backgrounds) expire 2026-11-01.
 * After that date, those sections render blank on the live site. Self-hosting
 * is mandatory to prevent that incident.
 *
 * Usage:
 *   node scripts/download-assets.mjs
 *
 * Outputs go to .cache/image-originals/ (gitignored). Run scripts/optimize-images.mjs
 * after this to convert them to WebP + AVIF + responsive variants in client/public/images/.
 *
 * NOTE: This file is ignored by scripts/relink-images.mjs so that its URL list
 * remains authoritative even after a relink pass rewrites production references.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", ".cache", "image-originals");

// CloudFront public asset base
const CF = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj";

/**
 * Asset list: [localName, remoteUrl]
 *
 * CATEGORY 1: Manus signed URLs (expire 2026-11-01 - URGENT)
 * CATEGORY 2: CloudFront logos, OG image, icons, landmarks (rehosted for independence + CWV)
 *
 * Signed URLs below are from the live site captured 2026-04-11. If re-running after that
 * date, they may need refresh via re-scraping from the live aiiaco.com HTML source.
 */
const MANUS_HERO = `https://private-us-east-1.manuscdn.com/sessionFile/FvSFBd374GXzqjgBtweNkq/sandbox/KV9rHWJ9VYR1NSAlzZrFLI-img-1_1771979979000_na1fn_YWlpYS1nbGFzcy1oZXJv.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRnZTRkJkMzc0R1h6cWpnQnR3ZU5rcS9zYW5kYm94L0tWOXJIV0o5VllSMU5TQWx6WnJGTEktaW1nLTFfMTc3MTk3OTk3OTAwMF9uYTFmbl9ZV2xwWVMxbmJHRnpjeTFvWlhKdi5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=IIazNlOoHV8170uFXchIaHa34J5vzX23qrQb3LVV9AzF~OiH9Btz6EwN7L0xgFpZUpHLzjZBGC2NCSJn5EmFUhL2xrlVox-b-NOvzv0SO4hPEa18Zl32uzJoHrGaSqeyyyatH2USmFpbJw2xHVVXrhJB3ALS0Xk-uE1E6GVda3za0ztjngT50984lFRGyMW8eHm8hrWKrXimODsn3WolhqTB5aHLxMbD8Pgr-QWkFrVXmyhtWUh-psF3WuzurBLB~FQEs5oh4pQ1csdxuziIv1MoaWyYbJt5e6VFIbCKGhcd6~Hbf4qDtWpuRhknbOX2z2poIASSL5rf7rDsLfB0Pg__`;

const MANUS_PROCESS = `https://private-us-east-1.manuscdn.com/sessionFile/FvSFBd374GXzqjgBtweNkq/sandbox/F4ncCcII64x2p4VFSvfQPR-img-3_1771960348000_na1fn_YWlpYS1wcm9jZXNzLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRjRuY0NjSUk2NHgycDRWRlN2ZlFQUi1pbWctM18xNzcxOTYwMzQ4MDAwX25hMWZuX1lXbHBZUzF3Y205alpYTnpMV0puLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=u3MLJGTEmjVIMESL9DMUp3rkUwwh4mzs957IdyGxpC5eJZq8KG9Z0qBHLJjQq1lML5jCPjLiGnlV~6ckIBAs6YsLuWHs6j7N27dP4J68PgnAce5VjBNReZxHEvtXvV-MY9IQ46iI0~x5Cny21UjJ226k9TMwenaPxth6-~y4eoa8eZ9Mc6Alu9kY0PRKfTLCtwuLoUF0Xfky23hoG2QNZ90fTsYxwFTRUUGmX0AZdVFXhQh3BmVRWGRcNOvsftfXFOBnf9XeVTel5FXkn~540yJO9zljLOdmjw87PvftAARPVql7jSCe8leJ5DtOVqT5zEWNJzhqiIR8I1EvZ6d27Q__`;

const MANUS_TEAM = `https://private-us-east-1.manuscdn.com/sessionFile/FvSFBd374GXzqjgBtweNkq/sandbox/F4ncCcII64x2p4VFSvfQPR-img-5_1771960358000_na1fn_YWlpYS10ZWFtLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvRjRuY0NjSUk2NHgycDRWRlN2ZlFQUi1pbWctNV8xNzcxOTYwMzU4MDAwX25hMWZuX1lXbHBZUzEwWldGdExXSm4ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=FsELEcDryNG7bE292XlRJT2Fo93-S-Ax4lH7RCe~jjqgZYEBSnDbWxenW1D-OhEBdn-fCA6NTETaQjCORIog2oNEEL49LCqgD13ohtRxIVuujsn49UGxhfpsojrXCQx7bHHHQSHk6wHxFVfIenFX3vN41Be0e1krzI8G7-BWlx8A0nu8PeGqb0rzxGRtGHKYmQzp1jydp0AZXzGaLDV5RevaAE5D5gaAUWMaqonMTaZ6DRaQEjUr4gjlzUPXnqznGQcF9uA5VOp2WpbHn5UY92F-qDj6gqjA5va7tyHeEGQKf9-hDYbL-OKgPJU0FN8iqMJTlXYDnrbKd9SjP2Kjag__`;

const ASSETS = [
  // Category 1: Manus signed URLs (URGENT - expire 2026-11-01)
  ["hero-bg.png", MANUS_HERO],
  ["process-bg.png", MANUS_PROCESS],
  ["team-bg.png", MANUS_TEAM],

  // Category 2: CloudFront logos and OG
  ["logo-gold.png", `${CF}/aiia_logo_pure_gold_transparent_8063797a.png`],
  ["og-default.png", `${CF}/aiia-og-image-v3_1b0f8ae3.png`],

  // Icons (PNG)
  ["icon-efficiency.png", `${CF}/aiia-icon-efficiency_6b72c1c5.png`],
  ["icon-brain.png", `${CF}/aiia-icon-brain_44428059.png`],
  ["icon-target.png", `${CF}/aiia-icon-target_497d409f.png`],
  ["icon-users.png", `${CF}/aiia-icon-users_e93f46d8.png`],
  ["icon-shield.png", `${CF}/aiia-icon-shield_a56f54cb.png`],
  ["icon-trending.png", `${CF}/aiia-icon-trending_e02fc2b1.png`],
  ["icon-skyline.png", `${CF}/aiia-icon-skyline-v1_b078c165.png`],
  ["icon-mortgage.png", `${CF}/aiia-icon-mortgage_5eadfd92.png`],
  ["icon-cre.png", `${CF}/aiia-icon-cre_2c9f616d.png`],
  ["icon-consulting.png", `${CF}/aiia-icon-consulting_43265006.png`],
  ["icon-workflow-transparent.png", `${CF}/aiia-icon-workflow-transparent_82f2845e.png`],
  ["icon-data-transparent.png", `${CF}/aiia-icon-data-transparent_b28f86bc.png`],
  ["icon-efficiency-transparent.png", `${CF}/aiia-icon-efficiency-transparent_e03b49c8.png`],

  // Icons (native WebP)
  ["icon-handshake.webp", `${CF}/aiia-icon-handshake-aPpLfARcj64PcMhQFxNgTw.webp`],
  ["gold-microphone.webp", `${CF}/aiia_gold_microphone_v2-cZjuNxwT4CHFwbMHWYwnRS.webp`],

  // Landmark illustrations
  ["landmark-models.png", `${CF}/aiia-landmark-models_23cafdae.png`],
  ["landmark-method.png", `${CF}/aiia-landmark-method_c0f60812.png`],
  ["landmark-industries.png", `${CF}/aiia-landmark-industries_345f6f1d.png`],
];

async function download(name, url) {
  const outPath = path.join(OUT_DIR, name);

  if (existsSync(outPath)) {
    const stats = await stat(outPath);
    if (stats.size > 0) {
      console.log(`  skip (exists): ${name} (${(stats.size / 1024).toFixed(1)} KB)`);
      return { name, skipped: true, bytes: stats.size };
    }
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AiiACo-asset-migrator/1.0",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(outPath, buf);
    console.log(`  ✓ ${name} (${(buf.length / 1024).toFixed(1)} KB)`);
    return { name, bytes: buf.length };
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    return { name, error: err.message };
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Downloading ${ASSETS.length} assets to ${OUT_DIR}\n`);

  const results = [];
  for (const [name, url] of ASSETS) {
    results.push(await download(name, url));
  }

  const ok = results.filter((r) => !r.error);
  const failed = results.filter((r) => r.error);
  const totalBytes = ok.reduce((sum, r) => sum + (r.bytes || 0), 0);

  console.log(`\n─────────────────────────────────────`);
  console.log(`Done: ${ok.length}/${ASSETS.length} assets, ${(totalBytes / 1024 / 1024).toFixed(2)} MB total`);
  if (failed.length > 0) {
    console.log(`\nFailed:`);
    for (const f of failed) console.log(`  - ${f.name}: ${f.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
