import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions, isSecureRequest } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  insertLead, getAllLeads, updateLeadStatus, updateLeadById, getLeadById,
  updateLeadEmailStatus,
  getAdminUserByUsername, getAdminUserById, getAllAdminUsers,
  createAdminUser, deleteAdminUser, updateAdminUserPassword, countAdminUsers,
  getAllKnowledgeEntries, getActiveKnowledgeEntries, getKnowledgeEntryById,
  insertKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry, markKnowledgePushed,
  getAnalyticsOverview, getDailyCallVolume, getRecentCalls,
  getEmailEventsByLeadId, getEmailEngagementStats, getRecentEmailEvents,
  insertMagicLinkToken, getMagicLinkByToken, markMagicLinkUsed, getLeadsByEmail,
  insertWebTranscript, getWebTranscriptsByLeadId, getAllWebTranscripts,
  getWebTranscriptBySessionId, updateWebTranscriptById,
} from "./db";
import crypto from "crypto";
import { generateAndSendLeadDiagnostic } from "./leadDiagnostic";
import { sendLeadConfirmationEmail, sendEmail } from "./email";
import { notifyOwner } from "./_core/notification";
import { ENV } from "./_core/env";
import { TRPCError } from "@trpc/server";
import {
  AGENT_CONFIG,
  AGENT_SYSTEM_PROMPT,
  createDiagnosticAgent,
  listAgents,
  getAgent,
  updateAgentPrompt,
  extractConversationIntelligence,
} from "./aiAgent";
import { runHealthCheck } from "./healthMonitor";
import { pollForMissedCalls } from "./conversationPoller";
import { buildCallerSummaryEmail } from "./emailTemplates";
import { vaasRouter, vaasAdminQueries } from "./vaasRouter";


// ─── Admin Session JWT helpers ────────────────────────────────────────────────

const ADMIN_COOKIE = ENV.adminSessionCookieName;
const ADMIN_JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret + "_admin");
const ADMIN_SESSION_TTL = 60 * 60 * 8; // 8 hours

async function signAdminToken(payload: { id: number; username: string; role: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${ADMIN_SESSION_TTL}s`)
    .setIssuedAt()
    .sign(ADMIN_JWT_SECRET);
}

async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload as { id: number; username: string; role: string };
  } catch {
    return null;
  }
}

function getAdminCookieOptions(req: import("express").Request) {
  return {
    httpOnly: true,
    sameSite: "none" as const,
    path: "/",
    secure: isSecureRequest(req),
    maxAge: ADMIN_SESSION_TTL,
  };
}

// ─── Admin-authenticated procedure ───────────────────────────────────────────

const adminAuthedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // Read token from custom header (primary) or cookie (fallback)
  const headerToken = ctx.req.headers["x-admin-token"] as string | undefined;
  const cookieToken = ctx.req.cookies?.[ADMIN_COOKIE];
  const token = headerToken || cookieToken;
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
  const session = await verifyAdminToken(token);
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired session" });
  return next({ ctx: { ...ctx, adminSession: session } });
});

// Owner-only procedure (can manage other admins)
const ownerProcedure = adminAuthedProcedure.use(async ({ ctx, next }) => {
  if ((ctx as any).adminSession.role !== "owner") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Owner access required" });
  }
  return next({ ctx });
});

// ─── CRM Webhook Helper ───────────────────────────────────────────────────────

async function fireCrmWebhook(payload: Record<string, unknown>): Promise<void> {
  if (!ENV.crmWebhookUrl) return;
  try {
    await fetch(ENV.crmWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "aiiaco.com", timestamp: new Date().toISOString() }),
    });
  } catch (err) {
    console.warn("[CRM Webhook] Failed to deliver:", err);
  }
}

// ─── Lead Schemas ─────────────────────────────────────────────────────────────

const callSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(320),
  message: z.string().max(2000).optional(),
  investmentType: z.string().max(64).optional(),
  budgetRange: z.string().max(64).optional(),
});

const intakeSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(320),
  company: z.string().max(255).optional(),
  phone: z.string().max(64).optional(),
  industry: z.string().max(128).optional(),
  engagementModel: z.string().max(128).optional(),
  annualRevenue: z.string().max(64).optional(),
  message: z.string().max(5000).optional(),
});

// New 3-step qualifier schemas
const qualifierStep1Schema = z.object({
  name: z.string().min(1).max(255),
  company: z.string().min(1).max(255),
  email: z.string().email().max(320),
  phone: z.string().max(64).optional(),
  source: z.string().max(128).optional(),
});

const qualifierStep2Schema = z.object({
  leadId: z.number().int().positive(),
  problemCategory: z.string().max(255),
  problemDetail: z.string().max(5000).optional(),
});

const qualifierStep3Schema = z.object({
  leadId: z.number().int().positive(),
  callPreference: z.string().max(128),
});

// ─── Analytics Router ────────────────────────────────────────────────────────

const analyticsRouter = router({
  /** Overview KPIs: total leads, voice calls, avg duration, conversion rate, breakdowns */
  overview: adminAuthedProcedure.query(async () => {
    return getAnalyticsOverview();
  }),

  /** Daily call volume for the last N days (default 30) */
  dailyVolume: adminAuthedProcedure
    .input(z.object({ days: z.number().int().min(7).max(90).default(30) }).optional())
    .query(async ({ input }) => {
      return getDailyCallVolume(input?.days ?? 30);
    }),

  /** Recent calls with key metrics */
  recentCalls: adminAuthedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(50).default(10) }).optional())
    .query(async ({ input }) => {
      return getRecentCalls(input?.limit ?? 10);
    }),

  /** Email engagement stats (open rate, click rate, bounce rate) */
  emailEngagement: adminAuthedProcedure.query(async () => {
    return getEmailEngagementStats();
  }),

  /** Recent email events (activity feed) */
  recentEmailEvents: adminAuthedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }).optional())
    .query(async ({ input }) => {
      return getRecentEmailEvents(input?.limit ?? 20);
    }),

  /** Email events for a specific lead */
  emailEventsByLead: adminAuthedProcedure
    .input(z.object({ leadId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return getEmailEventsByLeadId(input.leadId);
    }),
});

// ─── Health Monitor Router ───────────────────────────────────────────────────

const healthRouter = router({
  /** Run full diagnostic chain health check */
  check: adminAuthedProcedure.query(async () => {
    return runHealthCheck();
  }),
});

// ─── Agent Management Router ──────────────────────────────────────────────────

const agentRouter = router({
  /**
   * Get the current agent configuration (prompt + first message).
   * Falls back to the default config if no agent ID is stored.
   */
  getConfig: adminAuthedProcedure.query(async () => {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!agentId) {
      return {
        agentId: null,
        systemPrompt: AGENT_CONFIG.systemPrompt,
        firstMessage: AGENT_CONFIG.firstMessage,
        voiceId: AGENT_CONFIG.voiceId,
        isLive: false,
      };
    }
    try {
      const agent = await getAgent(agentId) as Record<string, unknown>;
      const config = (agent.conversation_config as Record<string, unknown>) ?? {};
      const agentSection = (config.agent as Record<string, unknown>) ?? {};
      const prompt = (agentSection.prompt as Record<string, unknown>) ?? {};
      return {
        agentId,
        systemPrompt: (prompt.prompt as string) ?? AGENT_CONFIG.systemPrompt,
        firstMessage: (agentSection.first_message as string) ?? AGENT_CONFIG.firstMessage,
        voiceId: AGENT_CONFIG.voiceId,
        isLive: true,
      };
    } catch (err) {
      console.error("[Agent] Failed to fetch agent config:", err);
      return {
        agentId,
        systemPrompt: AGENT_CONFIG.systemPrompt,
        firstMessage: AGENT_CONFIG.firstMessage,
        voiceId: AGENT_CONFIG.voiceId,
        isLive: false,
      };
    }
  }),

  updateConfig: adminAuthedProcedure
    .input(z.object({
      systemPrompt: z.string().min(100).max(20000),
      firstMessage: z.string().min(10).max(1000),
    }))
    .mutation(async ({ input }) => {
      const agentId = process.env.ELEVENLABS_AGENT_ID;
      if (!agentId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "ELEVENLABS_AGENT_ID is not configured. Create the agent first.",
        });
      }
      await updateAgentPrompt(agentId, input.systemPrompt, input.firstMessage);
      return { success: true };
    }),

  createAgent: adminAuthedProcedure
    .input(z.object({ webhookUrl: z.string().url() }))
    .mutation(async ({ input }) => {
      const agentId = await createDiagnosticAgent(input.webhookUrl);
      return { agentId };
    }),

  listAgents: adminAuthedProcedure.query(async () => {
    return listAgents();
  }),
});

// ─── Knowledge Base Router ────────────────────────────────────────────────────────────

const knowledgeRouter = router({
  /** List all knowledge entries */
  list: adminAuthedProcedure.query(async () => {
    return getAllKnowledgeEntries();
  }),

  /** Get a single entry by ID */
  get: adminAuthedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const entry = await getKnowledgeEntryById(input.id);
      if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Knowledge entry not found" });
      return entry;
    }),

  /** Create a new knowledge entry */
  create: adminAuthedProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      content: z.string().min(1).max(50000),
      category: z.enum(["packages", "company", "processes", "faq", "other"]).default("other"),
      source: z.enum(["document", "website", "conversation", "manual"]).default("manual"),
      sourceFile: z.string().max(512).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await insertKnowledgeEntry({
        title: input.title,
        content: input.content,
        category: input.category,
        source: input.source,
        sourceFile: input.sourceFile ?? null,
      });
      return { success: true, id: result.insertId };
    }),

  /** Update an existing entry */
  update: adminAuthedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      title: z.string().min(1).max(255).optional(),
      content: z.string().min(1).max(50000).optional(),
      category: z.enum(["packages", "company", "processes", "faq", "other"]).optional(),
      source: z.enum(["document", "website", "conversation", "manual"]).optional(),
      isActive: z.number().min(0).max(1).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...patch } = input;
      await updateKnowledgeEntry(id, patch);
      return { success: true };
    }),

  /** Delete an entry */
  delete: adminAuthedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteKnowledgeEntry(input.id);
      return { success: true };
    }),

  /** Toggle active/inactive */
  toggleActive: adminAuthedProcedure
    .input(z.object({ id: z.number().int().positive(), isActive: z.number().min(0).max(1) }))
    .mutation(async ({ input }) => {
      await updateKnowledgeEntry(input.id, { isActive: input.isActive });
      return { success: true };
    }),

  /**
   * Push all active knowledge entries to the ElevenLabs agent prompt.
   * Rebuilds the full prompt from the base template + all active knowledge entries,
   * then pushes it to the live agent.
   */
  pushToAgent: adminAuthedProcedure.mutation(async () => {
    const agentId = process.env.ELEVENLABS_AGENT_ID;
    if (!agentId) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "ELEVENLABS_AGENT_ID not configured" });
    }

    // Get all active knowledge entries
    const entries = await getActiveKnowledgeEntries();

    // Build the knowledge section from active entries
    const knowledgeSection = entries.map(e => {
      return `### ${e.title}\n${e.content}`;
    }).join("\n\n");

    // Build the full prompt: base prompt structure + dynamic knowledge
    // We inject the knowledge into the "Deep Company Knowledge" section
    const basePrompt = AGENT_SYSTEM_PROMPT;
    
    // Find the Deep Company Knowledge section and replace/append
    const knowledgeMarker = "## Deep Company Knowledge";
    const nextSectionMarker = "## Identity & Adversarial Resilience";
    
    let fullPrompt: string;
    if (basePrompt.includes(knowledgeMarker) && basePrompt.includes(nextSectionMarker)) {
      // Replace the knowledge section with dynamic content
      const beforeKnowledge = basePrompt.split(knowledgeMarker)[0];
      const afterKnowledge = basePrompt.split(nextSectionMarker).slice(1).join(nextSectionMarker);
      fullPrompt = `${beforeKnowledge}${knowledgeMarker}\n\nYou know AiiACo inside and out. Use this knowledge naturally in conversation when relevant — don't dump it all at once.\n\n${knowledgeSection}\n\n${nextSectionMarker}${afterKnowledge}`;
    } else {
      // Fallback: append knowledge at the end
      fullPrompt = `${basePrompt}\n\n## Additional Knowledge\n\n${knowledgeSection}`;
    }

    // Push to ElevenLabs
    await updateAgentPrompt(agentId, fullPrompt, AGENT_CONFIG.firstMessage);

    // Mark all entries as pushed
    await markKnowledgePushed(entries.map(e => e.id));

    return {
      success: true,
      entriesPushed: entries.length,
      promptLength: fullPrompt.length,
    };
  }),
});

// ─── Router ───────────────────────────────────────────────────────────────────────────

// ─── Magic Link Email Template ──────────────────────────────────────────────

function buildMagicLinkEmailHtml(firstName: string | null, magicUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Continue your conversation — AiiACo</title>
  <style>
    body {
      margin: 0; padding: 0;
      background-color: #03050A;
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      color: #C8D7E6;
    }
    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .logo {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.20em;
      color: rgba(184,156,74,0.90);
      text-transform: uppercase;
      margin-bottom: 36px;
    }
    .divider-gold {
      width: 48px;
      height: 1px;
      background: linear-gradient(90deg, rgba(184,156,74,0.80), rgba(184,156,74,0.15));
      margin-bottom: 32px;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #F0F4F8;
      margin: 0 0 14px 0;
      line-height: 1.3;
    }
    p {
      font-size: 15px;
      line-height: 1.75;
      color: rgba(200,215,230,0.80);
      margin: 0 0 18px 0;
    }
    .btn-magic {
      display: inline-block;
      background: linear-gradient(135deg, #D4A843 0%, #B89C4A 100%);
      color: #03050A;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.04em;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      margin: 24px 0;
    }
    .expire-note {
      font-size: 13px;
      color: rgba(200,215,230,0.45);
      margin: 0 0 8px 0;
    }
    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.06);
      font-size: 12px;
      color: rgba(200,215,230,0.30);
      line-height: 1.6;
    }
    a { color: rgba(184,156,74,0.75); text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">AiiACo</div>
    <div class="divider-gold"></div>

    <h1>${firstName ? `Welcome back, ${firstName}.` : `Welcome back.`}</h1>

    <p>
      Click the button below to continue your conversation with AiA.
      She remembers your previous discussions and is ready to pick up where you left off.
    </p>

    <a href="${magicUrl}" class="btn-magic">Continue Conversation &rarr;</a>

    <p class="expire-note">This link expires in 15 minutes for your security.</p>
    <p class="expire-note">If you didn't request this, you can safely ignore this email.</p>

    <div class="footer">
      <p style="margin:0;">
        AiiACo &nbsp;&middot;&nbsp; AI Integration Authority for the Corporate Age<br />
        <a href="https://aiiaco.com">aiiaco.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Talk Router (Magic Link + Transcript Persistence) ──────────────────────

const talkRouter = router({
  /**
   * Send a magic link to a returning lead's email.
   * Looks up the lead by email, generates a secure token, and sends the link.
   */
  sendMagicLink: publicProcedure
    .input(z.object({
      email: z.string().email().max(320),
      origin: z.string().url(),
    }))
    .mutation(async ({ input }) => {
      const leadsList = await getLeadsByEmail(input.email.toLowerCase().trim());
      if (leadsList.length === 0) {
        // Don't reveal whether the email exists — always return success
        return { success: true, message: "If we have your email on file, you'll receive a magic link shortly." };
      }

      const lead = leadsList[0]; // Most recent lead
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await insertMagicLinkToken({
        token,
        email: input.email.toLowerCase().trim(),
        leadId: lead.id,
        expiresAt,
      });

      const magicUrl = `${input.origin}/talk?token=${token}`;
      const { sanitizeName } = await import("./emailTemplates");
      const cleanName = sanitizeName(lead.name);
      const firstName = cleanName ? cleanName.split(" ")[0] : null;

      // Send the magic link email
      await sendEmail({
        to: input.email,
        subject: `Continue your conversation with AiA`,
        html: buildMagicLinkEmailHtml(firstName, magicUrl),
        text: `${firstName ? `Hi ${firstName},` : `Hi,`}\n\nClick the link below to continue your conversation with AiA:\n\n${magicUrl}\n\nThis link expires in 15 minutes.\n\n— The AiiACo Team`,
        leadId: lead.id,
      });

      return { success: true, message: "If we have your email on file, you'll receive a magic link shortly." };
    }),

  /**
   * Verify a magic link token and return the lead's conversation history.
   */
  verifyMagicLink: publicProcedure
    .input(z.object({ token: z.string().min(1).max(128) }))
    .mutation(async ({ input }) => {
      const record = await getMagicLinkByToken(input.token);
      if (!record) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired link" });
      }
      if (record.usedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This link has already been used" });
      }
      if (record.expiresAt < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This link has expired. Please request a new one." });
      }

      // Mark as used
      await markMagicLinkUsed(record.id);

      // Fetch the lead
      const lead = await getLeadById(record.leadId);
      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead record not found" });
      }

      // Fetch previous web transcripts for this lead
      const previousTranscripts = await getWebTranscriptsByLeadId(lead.id);

      // Also include the webhook-captured transcript if available
      const webhookTranscript = lead.callTranscript ? {
        source: "phone" as const,
        transcript: lead.structuredTranscript ?? lead.callTranscript,
        summary: lead.conversationSummary,
        createdAt: lead.createdAt,
      } : null;

      return {
        success: true,
        lead: {
          id: lead.id,
          name: lead.name,
          email: lead.email,
          company: lead.company,
          phone: lead.phone,
          conversationSummary: lead.conversationSummary,
          painPoints: lead.painPoints,
          wants: lead.wants,
        },
        previousTranscripts: previousTranscripts.map(t => ({
          id: t.id,
          transcript: t.transcript,
          transcriptText: t.transcriptText,
          durationSeconds: t.durationSeconds,
          createdAt: t.createdAt,
        })),
        webhookTranscript,
      };
    }),

  /**
   * Save a transcript from the /talk page when the conversation ends.
   */
  saveTranscript: publicProcedure
    .input(z.object({
      leadId: z.number().int().positive().optional(),
      visitorName: z.string().max(255).optional(),
      visitorEmail: z.string().email().max(320).optional(),
      visitorPhone: z.string().max(64).optional(),
      transcript: z.string().min(1).max(500000),
      transcriptText: z.string().max(500000).optional(),
      durationSeconds: z.number().int().min(0).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await insertWebTranscript({
        leadId: input.leadId ?? null,
        visitorName: input.visitorName ?? null,
        visitorEmail: input.visitorEmail?.toLowerCase().trim() ?? null,
        visitorPhone: input.visitorPhone ?? null,
        transcript: input.transcript,
        transcriptText: input.transcriptText ?? null,
        durationSeconds: input.durationSeconds ?? null,
        source: "web_talk",
      });

      // If we have an email but no leadId, try to link to an existing lead
      if (!input.leadId && input.visitorEmail) {
        const existingLeads = await getLeadsByEmail(input.visitorEmail.toLowerCase().trim());
        if (existingLeads.length > 0) {
          // Could update the web_transcript with the leadId, but for now just log
          console.log(`[Talk] Transcript saved for existing lead email: ${input.visitorEmail}`);
        }
      }

      return { success: true, transcriptId: result.insertId };
    }),

  /**
   * Check if an email belongs to an existing lead (for smart unified form).
   * Returns whether the email is recognized WITHOUT revealing any lead data.
   */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email().max(320) }))
    .mutation(async ({ input }) => {
      const leads = await getLeadsByEmail(input.email.toLowerCase().trim());
      return { exists: leads.length > 0 };
    }),

  /**
   * Incremental upsert — called every 30s during an active /talk conversation.
   * Creates the row on first call (using sessionId), updates transcript on subsequent calls.
   */
  upsertTranscript: publicProcedure
    .input(z.object({
      sessionId: z.string().min(8).max(64),
      leadId: z.number().int().positive().optional(),
      visitorName: z.string().max(255).optional(),
      visitorEmail: z.string().email().max(320).optional(),
      visitorPhone: z.string().max(64).optional(),
      transcript: z.string().min(1).max(500000),
      transcriptText: z.string().max(500000).optional(),
      durationSeconds: z.number().int().min(0).optional(),
      isFinal: z.boolean().optional(),
      /** Source of the conversation: 'web_talk' (default) or 'web_widget' */
      source: z.enum(["web_talk", "web_widget"]).default("web_talk").optional(),
    }))
    .mutation(async ({ input }) => {
      const source = input.source ?? "web_talk";
      const existing = await getWebTranscriptBySessionId(input.sessionId);
      if (existing) {
        // Update existing row with latest transcript data
        await updateWebTranscriptById(existing.id, {
          transcript: input.transcript,
          transcriptText: input.transcriptText ?? null,
          durationSeconds: input.durationSeconds ?? null,
        });
        return { success: true, transcriptId: existing.id, created: false };
      } else {
        // Create new row
        const result = await insertWebTranscript({
          sessionId: input.sessionId,
          leadId: input.leadId ?? null,
          visitorName: input.visitorName ?? null,
          visitorEmail: input.visitorEmail?.toLowerCase().trim() ?? null,
          visitorPhone: input.visitorPhone ?? null,
          transcript: input.transcript,
          transcriptText: input.transcriptText ?? null,
          durationSeconds: input.durationSeconds ?? null,
          source,
        });
        return { success: true, transcriptId: result.insertId, created: true };
      }
    }),

  /**
   * Admin: list all web transcripts (for admin console).
   */
  listTranscripts: adminAuthedProcedure.query(async () => {
    return getAllWebTranscripts();
  }),
});

export const appRouter = router({
  system: systemRouter,
  agent: agentRouter,
  health: healthRouter,
  knowledge: knowledgeRouter,
  analytics: analyticsRouter,
  talk: talkRouter,
  vaas: vaasRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Admin Console Auth ─────────────────────────────────────────────────────
  adminAuth: router({
    /**
     * Login with username + password.
     * Returns session cookie on success.
     */
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1).max(64),
        password: z.string().min(1).max(128),
      }))
      .mutation(async ({ input, ctx }) => {
        const adminUser = await getAdminUserByUsername(input.username.toLowerCase().trim());
        if (!adminUser) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        }
        const valid = await bcrypt.compare(input.password, adminUser.passwordHash);
        if (!valid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        }
        const token = await signAdminToken({
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
        });
        ctx.res.cookie(ADMIN_COOKIE, token, getAdminCookieOptions(ctx.req));
        return {
          success: true,
          token, // Return token for localStorage storage (cookie may be blocked by proxy)
          user: {
            id: adminUser.id,
            username: adminUser.username,
            displayName: adminUser.displayName,
            role: adminUser.role,
          },
        };
      }),

    /**
     * Get current admin session info.
     */
    me: publicProcedure.query(async ({ ctx }) => {
      // Check header first (localStorage-based), then cookie fallback
      const headerToken = ctx.req.headers["x-admin-token"] as string | undefined;
      const cookieToken = ctx.req.cookies?.[ADMIN_COOKIE];
      const token = headerToken || cookieToken;
      if (!token) return null;
      const session = await verifyAdminToken(token);
      if (!session) return null;
      const adminUser = await getAdminUserById(session.id);
      if (!adminUser) return null;
      return {
        id: adminUser.id,
        username: adminUser.username,
        displayName: adminUser.displayName,
        role: adminUser.role,
      };
    }),

    /**
     * Logout — clears admin session cookie.
     */
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE, { path: "/", httpOnly: true });
      return { success: true };
    }),

    /**
     * Public: check if any admin accounts exist (used to show setup vs login).
     */
    hasAdmins: publicProcedure.query(async () => {
      const count = await countAdminUsers();
      return { hasAdmins: count > 0 };
    }),

    /**
     * Setup: create the first owner account (only works when no admins exist).
     */
    setup: publicProcedure
      .input(z.object({
        username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
        password: z.string().min(8).max(128),
        displayName: z.string().max(128).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const count = await countAdminUsers();
        if (count > 0) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Setup already complete. Use the admin console to manage users." });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const newUser = await createAdminUser({
          username: input.username.toLowerCase().trim(),
          passwordHash,
          displayName: input.displayName ?? input.username,
          role: "owner",
        });
        // Auto-login: set session cookie immediately after setup
        const token = await signAdminToken({
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        });
        ctx.res.cookie(ADMIN_COOKIE, token, getAdminCookieOptions(ctx.req));
        return { success: true, token }; // Return token for localStorage storage
      }),

    /**
     * Owner: create a new admin user.
     */
    createAdmin: ownerProcedure
      .input(z.object({
        username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
        password: z.string().min(8).max(128),
        displayName: z.string().max(128).optional(),
        role: z.enum(["owner", "admin"]).default("admin"),
      }))
      .mutation(async ({ input }) => {
        const existing = await getAdminUserByUsername(input.username.toLowerCase().trim());
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Username already taken" });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        await createAdminUser({
          username: input.username.toLowerCase().trim(),
          passwordHash,
          displayName: input.displayName ?? input.username,
          role: input.role,
        });
        return { success: true };
      }),

    /**
     * Owner: list all admin users (no passwords).
     */
    listAdmins: adminAuthedProcedure.query(async () => {
      return getAllAdminUsers();
    }),

    /**
     * Owner: delete an admin user (cannot delete yourself).
     */
    deleteAdmin: ownerProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input, ctx }) => {
        const session = (ctx as any).adminSession;
        if (input.id === session.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot delete your own account" });
        }
        await deleteAdminUser(input.id);
        return { success: true };
      }),

    /**
     * Change own password.
     */
    changePassword: adminAuthedProcedure
      .input(z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8).max(128),
      }))
      .mutation(async ({ input, ctx }) => {
        const session = (ctx as any).adminSession;
        const adminUser = await getAdminUserById(session.id);
        if (!adminUser) throw new TRPCError({ code: "NOT_FOUND", message: "Admin user not found" });
        const valid = await bcrypt.compare(input.currentPassword, adminUser.passwordHash);
        if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect" });
        const passwordHash = await bcrypt.hash(input.newPassword, 12);
        await updateAdminUserPassword(session.id, passwordHash);
        return { success: true };
      }),
  }),

  // ─── Text-to-Speech (ElevenLabs) ────────────────────────────────────────────
  tts: router({
    /**
     * Synthesize text using ElevenLabs Rachel voice.
     * Returns base64-encoded MP3 audio.
     * Rate-limited to 3000 chars per request to control API usage.
     */
    synthesize: publicProcedure
      .input(z.object({
        text: z.string().min(1).max(3000),
      }))
      .mutation(async ({ input }) => {
        const apiKey = ENV.elevenLabsApiKey;
        if (!apiKey) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "TTS not configured" });

        // Rachel voice ID — warm, authoritative, American
        const VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

        // ── Sanitize text for natural speech ──────────────────────────────────
        // Preserve URLs (don't strip dots inside them), then clean everything else
        const sanitized = input.text
          // Fix brand name pronunciation FIRST (before any other transforms)
          // "AiiACo" → "AiA Co" so ElevenLabs reads it as two words: Aya + Co
          // "AiiACo" → "AiA Co" for speech
          .replace(/AiiACo/gi, "AiA Co")
          // Protect URLs: temporarily replace dots inside URLs
          .replace(/https?:\/\/[^\s]+/g, (url) => url.replace(/\./g, "__DOT__"))
          // Remove bullet/list symbols
          .replace(/[•·▪▸►→✓✔★☆]/g, " ")
          // Remove standalone dots (e.g. nav labels like "Platform. Method.")
          .replace(/(?<![\w])\.(?![\w])/g, " ")
          // Remove other non-speech punctuation that TTS reads literally
          .replace(/[|\\^~`<>{}\[\]]/g, " ")
          // Remove excessive dashes used as decorators (not hyphens in words)
          .replace(/\s[-–—]{1,3}\s/g, ", ")
          // Remove repeated punctuation
          .replace(/([!?]){2,}/g, "$1")
          // Restore URL dots
          .replace(/__DOT__/g, ".")
          // Collapse multiple spaces
          .replace(/\s{2,}/g, " ")
          .trim();

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": apiKey,
              "Content-Type": "application/json",
              "Accept": "audio/mpeg",
            },
            body: JSON.stringify({
              text: sanitized,
              model_id: "eleven_multilingual_v2",  // Better prosody and naturalness than turbo
              voice_settings: {
                stability: 0.30,          // Lower = more expressive, less monotone
                similarity_boost: 0.75,   // Keeps Rachel's character
                style: 0.40,              // Higher style = more personality and wit
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (!response.ok) {
          const err = await response.text();
          console.error("[ElevenLabs TTS Error]", err);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Voice synthesis failed" });
        }

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return { audio: base64, mimeType: "audio/mpeg" };
      }),
  }),

  // ─── Leads ──────────────────────────────────────────────────────────────────
  leads: router({
    submitCall: publicProcedure
      .input(callSchema)
      .mutation(async ({ input }) => {
        await insertLead({
          type: "call",
          name: input.name,
          email: input.email,
          message: input.message ?? null,
          investmentType: input.investmentType ?? null,
          budgetRange: input.budgetRange ?? null,
        });
        await notifyOwner({
          title: `New Call Request — ${input.name}`,
          content: `Name: ${input.name}\nEmail: ${input.email}\nInvestment Type: ${input.investmentType ?? 'Not specified'}\nBudget Range: ${input.budgetRange ?? 'Not specified'}\nType: Executive Call Request`,
        }).catch(() => {});
        await fireCrmWebhook({ type: "call_request", name: input.name, email: input.email, investmentType: input.investmentType, budgetRange: input.budgetRange });
        return { success: true };
      }),

    submitIntake: publicProcedure
      .input(intakeSchema)
      .mutation(async ({ input }) => {
        await insertLead({
          type: "intake",
          name: input.name,
          email: input.email,
          company: input.company ?? null,
          phone: input.phone ?? null,
          industry: input.industry ?? null,
          engagementModel: input.engagementModel ?? null,
          annualRevenue: input.annualRevenue ?? null,
          message: input.message ?? null,
        });
        const lines = [
          `Name: ${input.name}`,
          `Email: ${input.email}`,
          input.company ? `Company: ${input.company}` : null,
          input.phone ? `Phone: ${input.phone}` : null,
          input.industry ? `Industry: ${input.industry}` : null,
          input.engagementModel ? `Engagement: ${input.engagementModel}` : null,
          input.annualRevenue ? `Revenue: ${input.annualRevenue}` : null,
          input.message ? `\nMessage:\n${input.message}` : null,
        ].filter(Boolean).join("\n");
        await notifyOwner({
          title: `New Structured Intake — ${input.name} (${input.company ?? "no company"})`,
          content: lines,
        }).catch(() => {});
        await fireCrmWebhook({
          type: "structured_intake",
          name: input.name,
          email: input.email,
          company: input.company ?? null,
          phone: input.phone ?? null,
          industry: input.industry ?? null,
          engagementModel: input.engagementModel ?? null,
          annualRevenue: input.annualRevenue ?? null,
          message: input.message ?? null,
        });
        return { success: true };
      }),

    /**
     * Step 1: Save name + company + email + phone immediately.
     * Returns leadId for subsequent steps.
     */
    qualifierStep1: publicProcedure
      .input(qualifierStep1Schema)
      .mutation(async ({ input }) => {
        const result = await insertLead({
          type: "intake",
          name: input.name,
          company: input.company,
          email: input.email,
          phone: input.phone ?? null,
          leadSource: input.source ?? "Direct",
        });
        const leadId = result.insertId;
        // Notify + CRM immediately on first capture
        await notifyOwner({
          title: `New Lead Started — ${input.name} (${input.company})`,
          content: `Name: ${input.name}\nCompany: ${input.company}\nEmail: ${input.email}\nPhone: ${input.phone ?? 'Not provided'}\nSource: ${input.source ?? 'Direct'}\nStatus: Step 1 captured`,
        }).catch(() => {});
        await fireCrmWebhook({
          type: "qualifier_step1",
          name: input.name,
          company: input.company,
          email: input.email,
          phone: input.phone ?? null,
          leadSource: input.source ?? "Direct",
        });
        return { success: true, leadId };
      }),

    /**
     * Step 2: Update lead with problem category + detail.
     */
    qualifierStep2: publicProcedure
      .input(qualifierStep2Schema)
      .mutation(async ({ input }) => {
        await updateLeadById(input.leadId, {
          problemCategory: input.problemCategory,
          problemDetail: input.problemDetail ?? null,
        });
        await fireCrmWebhook({
          type: "qualifier_step2",
          leadId: input.leadId,
          problemCategory: input.problemCategory,
          problemDetail: input.problemDetail ?? null,
        });
        return { success: true };
      }),

    /**
     * Step 3: Update lead with call preference. Sends full notification.
     */
    qualifierStep3: publicProcedure
      .input(qualifierStep3Schema)
      .mutation(async ({ input }) => {
        await updateLeadById(input.leadId, {
          callPreference: input.callPreference,
        });
        await fireCrmWebhook({
          type: "qualifier_complete",
          leadId: input.leadId,
          callPreference: input.callPreference,
        });
        // Fire confirmation email to lead + AI diagnostic to owner (both non-blocking)
        getLeadById(input.leadId)
          .then((lead) => {
            if (lead) {
              // 1. Send thank-you confirmation to the lead (no diagnostic content)
              sendLeadConfirmationEmail({
                name: lead.name,
                email: lead.email,
                company: lead.company,
                callPreference: lead.callPreference,
              }).catch((err) => console.error("[Email] Confirmation error:", err));

              // 2. Send full AI diagnostic exclusively to the owner
              generateAndSendLeadDiagnostic(lead).catch((err) =>
                console.error("[LeadDiagnostic] Background error:", err)
              );
            }
          })
          .catch((err) => console.error("[LeadDiagnostic] getLeadById error:", err));
        return { success: true };
      }),

    list: adminAuthedProcedure.query(async () => {
      return getAllLeads();
    }),

    /**
     * Re-run the AI diagnostic for an existing lead.
     * Regenerates the GPT-4o diagnostic, updates the DB, and re-sends the owner notification.
     * Does NOT re-send the lead confirmation email (to avoid spamming the lead).
     */
    rerunDiagnostic: adminAuthedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const lead = await getLeadById(input.id);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
        await generateAndSendLeadDiagnostic(lead);
        return { success: true };
      }),

    updateStatus: adminAuthedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        status: z.enum(["new", "diagnostic_ready", "reviewed", "contacted", "closed", "incomplete", "abandoned"]),
      }))
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.id, input.status);
        return { success: true };
      }),

    /**
     * Re-analyze a lead's transcript with LLM to extract/refresh conversation intelligence.
     * Useful for leads captured before the intelligence system existed, or to refresh stale analysis.
     */
    reanalyzeTranscript: adminAuthedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const lead = await getLeadById(input.id);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });

        const transcript = lead.callTranscript;
        if (!transcript || transcript.trim().length < 20) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Lead has no transcript to analyze" });
        }

        const intelligence = await extractConversationIntelligence(transcript);

        await updateLeadById(input.id, {
          painPoints: intelligence.painPoints.length > 0 ? JSON.stringify(intelligence.painPoints) : null,
          wants: intelligence.wants.length > 0 ? JSON.stringify(intelligence.wants) : null,
          currentSolutions: intelligence.currentSolutions.length > 0 ? JSON.stringify(intelligence.currentSolutions) : null,
          conversationSummary: intelligence.conversationSummary || null,
          // Also update contact info if LLM found better data
          ...(intelligence.callerName && !lead.name ? { name: intelligence.callerName } : {}),
          ...(intelligence.callerEmail && !lead.email ? { email: intelligence.callerEmail } : {}),
          ...(intelligence.companyName && !lead.company ? { company: intelligence.companyName } : {}),
          ...(intelligence.callerPhone && !lead.phone ? { phone: intelligence.callerPhone } : {}),
        });

        return {
          success: true,
          painPoints: intelligence.painPoints,
          wants: intelligence.wants,
          currentSolutions: intelligence.currentSolutions,
          summary: intelligence.conversationSummary,
        };
      }),

    /**
     * Save admin-only internal notes for a lead.
     * Notes are free-text and stored in the adminNotes column.
     */
    saveNotes: adminAuthedProcedure
      .input(z.object({
        id: z.number().int().positive(),
        notes: z.string().max(10000),
      }))
      .mutation(async ({ input }) => {
        await updateLeadById(input.id, { adminNotes: input.notes });
        return { success: true };
      }),

    /**
     * Manually trigger the conversation poller to recover any missed calls.
     * Returns the number of calls recovered.
     */
    recoverMissedCalls: adminAuthedProcedure
      .mutation(async () => {
        try {
          await pollForMissedCalls();
          return { success: true, message: "Poller ran successfully. Check leads list for any recovered calls." };
        } catch (err: any) {
          console.error("[Admin] Manual poll failed:", err);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to run poller: " + (err.message ?? "Unknown error") });
        }
      }),

    /**
     * Re-send the follow-up email for a lead.
     * Uses the lead's callTrack to determine which track-specific email template to send.
     * Will NOT re-send if the lead has no email address.
     */
    resendEmail: adminAuthedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const lead = await getLeadById(input.id);
        if (!lead) throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
        if (!lead.email || lead.email.includes("@aiiaco.com")) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Lead has no valid email address" });
        }

        const track = (lead.callTrack as "operator" | "agent" | "corporate" | "unknown") ?? "unknown";
        const emailContent = buildCallerSummaryEmail({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          track,
          conversationSummary: lead.conversationSummary,
          painPoints: lead.painPoints,
          wants: lead.wants,
          leadBrief: lead.leadBrief ?? lead.conversationSummary,
        });

        const emailResult = await sendEmail({
          to: lead.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
          leadId: input.id,
        });

        await updateLeadEmailStatus(input.id, emailResult.success ? "sent" : "failed");

        if (!emailResult.success) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Email failed to send — check Resend domain verification" });
        }

        return { success: true, sentTo: lead.email };
      }),

    // ─── VaaS Platform Admin ─────────────────────────────────────────────────
    vaasClients: adminAuthedProcedure.query(async () => {
      return vaasAdminQueries.getAllClients();
    }),
    vaasAgents: adminAuthedProcedure.query(async () => {
      return vaasAdminQueries.getAllClientAgents();
    }),
    vaasConversations: adminAuthedProcedure.query(async () => {
      return vaasAdminQueries.getAllClientConversations();
    }),
    vaasPromoCodes: adminAuthedProcedure.query(async () => {
      return vaasAdminQueries.getAllPromoCodes();
    }),

    /** Admin toggle agent status (active/paused/locked) */
    vaasToggleAgent: adminAuthedProcedure
      .input(z.object({
        agentId: z.number().int().positive(),
        status: z.enum(["active", "paused", "locked"]),
      }))
      .mutation(async ({ input }) => {
        const { updateClientAgentById } = await import("./db");
        await updateClientAgentById(input.agentId, { status: input.status });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
