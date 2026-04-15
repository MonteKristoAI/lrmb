/**
 * Widget Express Routes
 *
 * Three endpoints for the embeddable VaaS widget:
 *   GET  /api/widget/:token        — returns agent config JSON for the widget
 *   GET  /agent/embed.js           — serves the self-contained vanilla JS widget
 *   POST /api/widget/:token/conversation — stores a captured conversation
 *
 * These are plain Express routes (not tRPC) because they're consumed by
 * external websites via the embed script — no auth cookies, no tRPC client.
 */

import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { getClientAgentByEmbedToken, getClientById, insertClientConversation } from "./db";

const widgetRouter = Router();

// ─── GET /api/widget/:token — Widget config ─────────────────────────────────

widgetRouter.get("/api/widget/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token || !token.startsWith("aia_")) {
      return res.status(400).json({ error: "Invalid embed token format" });
    }

    const agent = await getClientAgentByEmbedToken(token);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    // Check agent status
    if (agent.status === "locked") {
      return res.status(403).json({ error: "Trial expired. Please activate your subscription." });
    }
    if (agent.status === "draft") {
      return res.status(403).json({ error: "Agent is still being configured." });
    }
    if (agent.status === "paused") {
      return res.status(403).json({ error: "Agent is currently paused by the owner." });
    }

    // Get client to check subscription status and trial time
    const client = await getClientById(agent.clientId);
    if (!client) {
      return res.status(404).json({ error: "Client account not found" });
    }

    if (client.status === "cancelled" || client.status === "suspended") {
      return res.status(403).json({ error: "Account inactive. Please contact support." });
    }

    // Parse widget config
    let widgetConfig: Record<string, any> = {};
    try {
      if (agent.widgetConfig) {
        widgetConfig = JSON.parse(agent.widgetConfig);
      }
    } catch {
      // Use defaults
    }

    // Calculate trial remaining
    const trialSecondsRemaining = client.status === "trial"
      ? Math.max(0, 900 - client.trialSecondsUsed)
      : null; // null means unlimited (active subscription)

    if (client.status === "trial" && trialSecondsRemaining === 0) {
      return res.status(403).json({ error: "Trial period has ended. Please activate your subscription." });
    }

    // Build the config response
    const config = {
      agentId: agent.elevenlabsAgentId,
      agentName: agent.agentName,
      companyName: client.companyName,
      // Widget appearance
      primaryColor: widgetConfig.primaryColor || "#B89C4A",
      position: widgetConfig.position || "bottom-right",
      greeting: widgetConfig.greeting || agent.firstMessage || `Hi! I'm ${agent.agentName}. How can I help you today?`,
      logoUrl: widgetConfig.logoUrl || null,
      buttonSize: widgetConfig.buttonSize || 60,
      // Trial info
      isTrial: client.status === "trial",
      trialSecondsRemaining,
      // Agent metadata
      agentStatus: agent.status,
      templateType: agent.templateType,
    };

    // Cache for 60 seconds (config doesn't change often)
    res.setHeader("Cache-Control", "public, max-age=60");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    return res.json(config);

  } catch (err) {
    console.error("[Widget Config] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /api/widget/:token/conversation — Store conversation ──────────────

widgetRouter.post("/api/widget/:token/conversation", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const {
      elevenlabsConversationId,
      callerName,
      callerEmail,
      callerPhone,
      transcript,
      structuredTranscript,
      durationSeconds,
    } = req.body;

    if (!token || !token.startsWith("aia_")) {
      return res.status(400).json({ error: "Invalid embed token" });
    }

    const agent = await getClientAgentByEmbedToken(token);
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    // Store the conversation
    const conversationId = await insertClientConversation({
      clientAgentId: agent.id,
      clientId: agent.clientId,
      elevenlabsConversationId: elevenlabsConversationId || null,
      callerName: callerName || null,
      callerEmail: callerEmail || null,
      callerPhone: callerPhone || null,
      transcript: transcript || null,
      structuredTranscript: structuredTranscript ? JSON.stringify(structuredTranscript) : null,
      durationSeconds: durationSeconds || null,
      status: "new",
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.json({ success: true, conversationId });

  } catch (err) {
    console.error("[Widget Conversation] Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── OPTIONS preflight for CORS ──────────────────────────────────────────────

widgetRouter.options("/api/widget/:token", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});

widgetRouter.options("/api/widget/:token/conversation", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(204).end();
});

// ─── GET /agent/embed.js — Serve the widget script ──────────────────────────

widgetRouter.get("/agent/embed.js", (_req: Request, res: Response) => {
  const scriptPath = path.resolve(import.meta.dirname, "../client/public/agent/embed.js");

  if (!fs.existsSync(scriptPath)) {
    return res.status(404).send("// Widget script not found");
  }

  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300"); // 5 min cache
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.sendFile(scriptPath);
});

export { widgetRouter };
