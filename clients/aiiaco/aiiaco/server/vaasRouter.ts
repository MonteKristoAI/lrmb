/**
 * VaaS (Voice Agent as a Service) Platform Router
 *
 * Handles client authentication, agent management, billing,
 * templates, voice tiers, promo codes, and conversation retrieval.
 */

import { z } from "zod";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { isSecureRequest } from "./_core/cookies";
import { ENV } from "./_core/env";
import {
  createClient, getClientByEmail, getClientById, updateClientById, getAllClients,
  createClientAgent, getClientAgentsByClientId, getClientAgentById, getClientAgentByEmbedToken,
  updateClientAgentById, getAllClientAgents,
  getClientConversationsByClientId, getClientConversationsByAgentId, getAllClientConversations,
  getPromoCodeByCode, incrementPromoCodeUsage, getAllPromoCodes,
  getActiveVoiceTiers, getVoiceTierByVoiceId,
  getActiveAgentTemplates, getAgentTemplateByKey,
} from "./db";

// ─── Client Session JWT ─────────────────────────────────────────────────────────

const CLIENT_COOKIE = "aiiaco_client_session";
const CLIENT_JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret + "_client");
const CLIENT_SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

async function signClientToken(payload: { id: number; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${CLIENT_SESSION_TTL}s`)
    .setIssuedAt()
    .sign(CLIENT_JWT_SECRET);
}

async function verifyClientToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, CLIENT_JWT_SECRET);
    return payload as { id: number; email: string };
  } catch {
    return null;
  }
}

function getClientCookieOptions(req: import("express").Request) {
  return {
    httpOnly: true,
    sameSite: "none" as const,
    path: "/",
    secure: isSecureRequest(req),
    maxAge: CLIENT_SESSION_TTL,
  };
}

// ─── Client-authenticated procedure ─────────────────────────────────────────────

const clientAuthedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const headerToken = ctx.req.headers["x-client-token"] as string | undefined;
  const cookieToken = ctx.req.cookies?.[CLIENT_COOKIE];
  const token = headerToken || cookieToken;
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Client login required" });
  const session = await verifyClientToken(token);
  if (!session) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired session" });
  const client = await getClientById(session.id);
  if (!client) throw new TRPCError({ code: "UNAUTHORIZED", message: "Client account not found" });
  return next({ ctx: { ...ctx, client } });
});

// ─── Auth Router ────────────────────────────────────────────────────────────────

const clientAuthRouter = router({
  /** Sign up a new client account */
  signup: publicProcedure
    .input(z.object({
      email: z.string().email().max(320),
      password: z.string().min(8).max(128),
      companyName: z.string().min(1).max(255),
      contactName: z.string().min(1).max(255),
      websiteUrl: z.string().max(512).optional(),
      phone: z.string().max(64).optional(),
      industry: z.string().max(128).optional(),
      promoCode: z.string().max(64).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if email already exists
      const existing = await getClientByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists" });
      }

      // Validate promo code if provided
      let monthlyPriceCents = 99900; // $999 default
      let promoCodeUsed: string | undefined;
      if (input.promoCode) {
        const promo = await getPromoCodeByCode(input.promoCode);
        if (!promo || !promo.isActive) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid promo code" });
        }
        if (promo.maxUses && promo.usesCount >= promo.maxUses) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Promo code has reached its usage limit" });
        }
        // Apply discount
        if (promo.resultPriceCents) {
          monthlyPriceCents = promo.resultPriceCents;
        } else if (promo.discountType === "fixed") {
          monthlyPriceCents = Math.max(0, 99900 - promo.discountValue);
        } else if (promo.discountType === "percent") {
          monthlyPriceCents = Math.round(99900 * (1 - promo.discountValue / 100));
        }
        promoCodeUsed = promo.code;
        await incrementPromoCodeUsage(promo.id);
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const clientId = await createClient({
        email: input.email,
        passwordHash,
        companyName: input.companyName,
        contactName: input.contactName,
        websiteUrl: input.websiteUrl ?? null,
        phone: input.phone ?? null,
        industry: input.industry ?? null,
        promoCodeUsed: promoCodeUsed ?? null,
        monthlyPriceCents,
      });

      // Sign session token
      const token = await signClientToken({ id: clientId, email: input.email });
      ctx.res.cookie(CLIENT_COOKIE, token, getClientCookieOptions(ctx.req));

      return {
        success: true,
        clientId,
        token,
        monthlyPriceCents,
      };
    }),

  /** Log in an existing client */
  login: publicProcedure
    .input(z.object({
      email: z.string().email().max(320),
      password: z.string().min(1).max(128),
    }))
    .mutation(async ({ input, ctx }) => {
      const client = await getClientByEmail(input.email);
      if (!client) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }
      const valid = await bcrypt.compare(input.password, client.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const token = await signClientToken({ id: client.id, email: client.email });
      ctx.res.cookie(CLIENT_COOKIE, token, getClientCookieOptions(ctx.req));

      return {
        success: true,
        clientId: client.id,
        token,
        status: client.status,
      };
    }),

  /** Get current client session */
  me: clientAuthedProcedure.query(async ({ ctx }) => {
    const { passwordHash, ...safeClient } = ctx.client;
    return safeClient;
  }),

  /** Log out */
  logout: clientAuthedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(CLIENT_COOKIE, { path: "/" });
    return { success: true };
  }),
});

// ─── Agent Management Router ────────────────────────────────────────────────────

const clientAgentRouter = router({
  /** Create a new agent from a template */
  create: clientAuthedProcedure
    .input(z.object({
      agentName: z.string().min(1).max(255),
      templateType: z.enum(["real_estate", "mortgage", "law", "hospitality", "manufacturing"]),
      personality: z.string().max(5000).optional(),
      firstMessage: z.string().max(1000).optional(),
      knowledgeBase: z.string().max(50000).optional(),
      voiceId: z.string().max(128).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if client already has an agent (limit 1 per client for now)
      const existing = await getClientAgentsByClientId(ctx.client.id);
      if (existing.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You already have an agent. Upgrade your plan for additional agents." });
      }

      // Get template defaults
      const template = await getAgentTemplateByKey(input.templateType);

      // Determine voice tier
      let voiceTier: "free" | "premium" = "free";
      if (input.voiceId) {
        const voice = await getVoiceTierByVoiceId(input.voiceId);
        if (voice) voiceTier = voice.tier as "free" | "premium";
      }

      // Generate unique embed token
      const embedToken = `aia_${crypto.randomBytes(24).toString("hex")}`;

      const agentId = await createClientAgent({
        clientId: ctx.client.id,
        agentName: input.agentName,
        templateType: input.templateType,
        personality: input.personality ?? template?.defaultPrompt ?? null,
        firstMessage: input.firstMessage ?? template?.defaultFirstMessage ?? null,
        knowledgeBase: input.knowledgeBase ?? template?.defaultKnowledgeBase ?? null,
        voiceId: input.voiceId ?? null,
        voiceTier,
        embedToken,
        status: "draft",
      });

      return { agentId, embedToken };
    }),

  /** Get client's agents */
  list: clientAuthedProcedure.query(async ({ ctx }) => {
    return getClientAgentsByClientId(ctx.client.id);
  }),

  /** Get a single agent by ID (must belong to client) */
  get: clientAuthedProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const agent = await getClientAgentById(input.id);
      if (!agent || agent.clientId !== ctx.client.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return agent;
    }),

  /** Update agent configuration */
  update: clientAuthedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      agentName: z.string().min(1).max(255).optional(),
      personality: z.string().max(5000).optional(),
      firstMessage: z.string().max(1000).optional(),
      knowledgeBase: z.string().max(50000).optional(),
      voiceId: z.string().max(128).optional(),
      widgetConfig: z.string().max(5000).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const agent = await getClientAgentById(input.id);
      if (!agent || agent.clientId !== ctx.client.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }

      const { id, ...updateData } = input;

      // Check voice tier if voice is changing
      if (updateData.voiceId) {
        const voice = await getVoiceTierByVoiceId(updateData.voiceId);
        if (voice) {
          (updateData as any).voiceTier = voice.tier;
        }
      }

      await updateClientAgentById(id, updateData);
      return { success: true };
    }),

  /** Toggle agent status (pause/resume) */
  toggleStatus: clientAuthedProcedure
    .input(z.object({
      id: z.number().int().positive(),
      status: z.enum(["active", "paused"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const agent = await getClientAgentById(input.id);
      if (!agent || agent.clientId !== ctx.client.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      // Only allow toggling if client is active (paying)
      if (ctx.client.status !== "active" && input.status === "active") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Activate your subscription to enable your agent" });
      }
      await updateClientAgentById(input.id, { status: input.status });
      return { success: true };
    }),
});

// ─── Conversations Router ───────────────────────────────────────────────────────

const clientConversationRouter = router({
  /** Get conversations for a specific agent */
  byAgent: clientAuthedProcedure
    .input(z.object({ agentId: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const agent = await getClientAgentById(input.agentId);
      if (!agent || agent.clientId !== ctx.client.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
      }
      return getClientConversationsByAgentId(input.agentId);
    }),

  /** Get all conversations for the client */
  all: clientAuthedProcedure.query(async ({ ctx }) => {
    return getClientConversationsByClientId(ctx.client.id);
  }),
});

// ─── Billing Router (Stripe-ready stubs) ────────────────────────────────────────

const clientBillingRouter = router({
  /** Get billing status */
  status: clientAuthedProcedure.query(async ({ ctx }) => {
    return {
      status: ctx.client.status,
      monthlyPriceCents: ctx.client.monthlyPriceCents,
      stripeCustomerId: ctx.client.stripeCustomerId,
      stripeSubscriptionId: ctx.client.stripeSubscriptionId,
      trialSecondsUsed: ctx.client.trialSecondsUsed,
      trialSecondsRemaining: Math.max(0, 900 - ctx.client.trialSecondsUsed),
    };
  }),

  /** Create checkout session (Stripe stub — returns placeholder until Stripe is wired) */
  createCheckout: clientAuthedProcedure.mutation(async ({ ctx }) => {
    // TODO: Wire Stripe checkout session creation
    // For now, return a placeholder
    return {
      checkoutUrl: null as string | null,
      message: "Stripe integration pending. Contact AiiACo to activate your subscription.",
    };
  }),

  /** Validate a promo code (public — used during signup) */
  validatePromo: publicProcedure
    .input(z.object({ code: z.string().min(1).max(64) }))
    .query(async ({ input }) => {
      const promo = await getPromoCodeByCode(input.code);
      if (!promo || !promo.isActive) {
        return { valid: false, monthlyPriceCents: 99900 };
      }
      if (promo.maxUses && promo.usesCount >= promo.maxUses) {
        return { valid: false, monthlyPriceCents: 99900 };
      }
      let finalPrice = 99900;
      if (promo.resultPriceCents) {
        finalPrice = promo.resultPriceCents;
      } else if (promo.discountType === "fixed") {
        finalPrice = Math.max(0, 99900 - promo.discountValue);
      } else if (promo.discountType === "percent") {
        finalPrice = Math.round(99900 * (1 - promo.discountValue / 100));
      }
      return { valid: true, monthlyPriceCents: finalPrice };
    }),

  /** Record trial usage (called by embed widget) */
  recordTrialUsage: clientAuthedProcedure
    .input(z.object({ seconds: z.number().int().min(1).max(900) }))
    .mutation(async ({ input, ctx }) => {
      const newTotal = Math.min(900, ctx.client.trialSecondsUsed + input.seconds);
      await updateClientById(ctx.client.id, { trialSecondsUsed: newTotal });
      return {
        trialSecondsUsed: newTotal,
        trialSecondsRemaining: Math.max(0, 900 - newTotal),
        trialExpired: newTotal >= 900,
      };
    }),
});

// ─── Templates & Voices (public) ────────────────────────────────────────────────

const catalogRouter = router({
  /** Get all active agent templates */
  templates: publicProcedure.query(async () => {
    return getActiveAgentTemplates();
  }),

  /** Get all active voice options */
  voices: publicProcedure.query(async () => {
    return getActiveVoiceTiers();
  }),
});

// ─── Admin VaaS Router (for AiiACo admin console) ───────────────────────────────
// Note: This uses the admin auth from the main routers.ts — we export raw queries
// and the main router will wrap them in adminAuthedProcedure

export const vaasAdminQueries = {
  getAllClients,
  getAllClientAgents,
  getAllClientConversations,
  getAllPromoCodes,
};

// ─── Combined VaaS Router ───────────────────────────────────────────────────────

export const vaasRouter = router({
  auth: clientAuthRouter,
  agent: clientAgentRouter,
  conversation: clientConversationRouter,
  billing: clientBillingRouter,
  catalog: catalogRouter,
});
