/**
 * Local prerender script for LuxeShutters SPA.
 * Runs after `npm run build`, spins up a local server, visits each route
 * with Puppeteer, waits for window.prerenderReady, and saves the rendered
 * HTML to dist/ so Cloudflare Pages serves real content to bots.
 *
 * Usage: node scripts/prerender.mjs
 */

import { launch } from "puppeteer";
import { createServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 4173;
const ROUTES = ["/", "/services", "/gallery", "/blog", "/contact"];

// Simple static file server for dist/
function startServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
  };

  const server = createServer((req, res) => {
    let filePath = join(DIST, req.url === "/" ? "index.html" : req.url);

    // SPA fallback: if file doesn't exist, serve index.html
    if (!existsSync(filePath)) {
      filePath = join(DIST, "index.html");
    }

    try {
      const data = readFileSync(filePath);
      const ext = "." + filePath.split(".").pop();
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/html" });
      res.end(data);
    } catch {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(readFileSync(join(DIST, "index.html")));
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Static server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log("Starting prerender of", ROUTES.length, "routes...\n");

  const server = await startServer();
  const browser = await launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    console.log(`Rendering ${route}...`);

    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (compatible; Prerenderbot/1.0)");

    await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });

    // Wait for prerenderReady signal (set by usePrerenderReady hook)
    await page.waitForFunction("window.prerenderReady === true", {
      timeout: 10000,
    }).catch(() => {
      console.warn(`  Warning: prerenderReady not set for ${route}, using networkidle0 fallback`);
    });

    // Extra delay for any late renders
    await new Promise((r) => setTimeout(r, 500));

    let html = await page.content();

    // Remove any scripts that would re-hydrate (optional - keeps them for hydration)
    // We keep scripts so the page works as SPA after initial load

    // Determine output path
    const outDir = route === "/" ? DIST : join(DIST, route.slice(1));
    const outFile = join(outDir, "index.html");

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    writeFileSync(outFile, html);
    const sizeKB = (Buffer.byteLength(html) / 1024).toFixed(1);
    console.log(`  Saved ${outFile} (${sizeKB} KB)\n`);

    await page.close();
  }

  await browser.close();
  server.close();
  console.log("Prerender complete! All", ROUTES.length, "routes saved to dist/");
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
