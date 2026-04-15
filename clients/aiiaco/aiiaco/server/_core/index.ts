import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { handleCalendlyWebhook } from "../webhooks/calendly";
import { handleElevenLabsWebhook } from "../webhooks/elevenlabs";
import { handleResendWebhook } from "../webhooks/resend";
import { startTelnyxPoller } from "../telnyxPoller";
import { startHealthScheduler } from "../healthScheduler";
import { startConversationPoller } from "../conversationPoller";
import { widgetRouter } from "../widgetRoutes";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ── Vanity redirects ─────────────────────────────────────────────────────
  // MUST be the very first routes registered — before body parsers, OAuth,
  // Vite middleware, and the SPA catch-all — so they fire in all environments.
  app.get("/videostudio", (_req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Surrogate-Control", "no-store");
    res.redirect(302, "https://aiivideo-zyf9pqt6.manus.space");
  });

  // ── Calendly webhook — must use raw body for HMAC verification ────────────
  // Register BEFORE the global json() middleware so we can capture the raw buffer.
  app.post(
    "/api/webhooks/calendly",
    express.raw({ type: "application/json", limit: "1mb" }),
    (req, _res, next) => {
      // Store raw buffer for signature verification, then parse JSON for handler
      (req as any).rawBody = req.body as Buffer;
      try {
        req.body = JSON.parse((req.body as Buffer).toString("utf8"));
      } catch {
        req.body = {};
      }
      next();
    },
    handleCalendlyWebhook
  );

  // ── ElevenLabs post-call webhook ─────────────────────────────────────────
  app.post(
    "/api/webhooks/elevenlabs",
    express.raw({ type: "application/json", limit: "5mb" }),
    (req, _res, next) => {
      const rawText = (req.body as Buffer).toString("utf8");
      (req as any).rawBodyText = rawText;
      try {
        req.body = JSON.parse(rawText);
      } catch {
        req.body = {};
      }
      next();
    },
    handleElevenLabsWebhook
  );

  // ── Resend email tracking webhook ───────────────────────────────────────────
  app.post(
    "/api/webhooks/resend",
    express.raw({ type: "application/json", limit: "1mb" }),
    (req, _res, next) => {
      const rawText = (req.body as Buffer).toString("utf8");
      (req as any).rawBodyText = rawText;
      try {
        req.body = JSON.parse(rawText);
      } catch {
        req.body = {};
      }
      next();
    },
    handleResendWebhook
  );

  // ── Widget routes (embed.js + config + conversation capture) ──────────
  // Must be registered before the SPA catch-all but after raw-body webhooks.
  // The /agent/embed.js route serves static JS; /api/widget/* routes use JSON.
  app.use(widgetRouter);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    // Start Telnyx verification poller (auto-provisions phone number when Level 2 is approved)
    startTelnyxPoller();
    // Start periodic health checks (every 5 min, first check after 30s)
    startHealthScheduler();
    // Start conversation poller — safety net to catch any missed webhook calls
    startConversationPoller();
  });
}

startServer().catch(console.error);
