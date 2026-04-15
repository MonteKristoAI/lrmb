import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, bigint, boolean } from "drizzle-orm/mysql-core";
import crypto from "crypto";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table — captures both Executive Call Requests and Structured Intake submissions.
 * type: "call" = fast path (name + email only)
 * type: "intake" = structured intake (full form)
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["call", "intake"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  industry: varchar("industry", { length: 128 }),
  engagementModel: varchar("engagementModel", { length: 128 }),
  annualRevenue: varchar("annualRevenue", { length: 64 }),
  message: text("message"),
  investmentType: varchar("investmentType", { length: 64 }),
  budgetRange: varchar("budgetRange", { length: 64 }),
  problemCategory: varchar("problemCategory", { length: 255 }),
  problemDetail: text("problemDetail"),
  callPreference: varchar("callPreference", { length: 128 }),
  leadSource: varchar("leadSource", { length: 128 }),
  /** AI-generated full diagnostic (owner-only, stored for admin panel display) */
  diagnosticSnapshot: text("diagnosticSnapshot"),
  /** AI-generated lead-facing brief (stored for reference) */
  leadBrief: text("leadBrief"),
  /** Admin-only internal notes (call outcomes, follow-up dates, context) */
  adminNotes: text("adminNotes"),
  /** Full call transcript from ElevenLabs post-call webhook */
  callTranscript: text("callTranscript"),
  /** Structured transcript JSON: Array<{role: 'agent'|'user', message: string, time_in_call_secs?: number}> */
  structuredTranscript: text("structuredTranscript"),
  /** Detected call track: operator | agent | corporate */
  callTrack: varchar("callTrack", { length: 32 }),
  /** AI-extracted pain points from voice conversation */
  painPoints: text("painPoints"),
  /** AI-extracted wants/wishes from voice conversation */
  wants: text("wants"),
  /** AI-extracted current solutions/attempts from voice conversation */
  currentSolutions: text("currentSolutions"),
  /** AI-generated conversation summary */
  conversationSummary: text("conversationSummary"),
  /** Duration of the voice call in seconds */
  callDurationSeconds: int("callDurationSeconds"),
  /** ElevenLabs conversation ID */
  conversationId: varchar("conversationId", { length: 128 }),
  /** Email delivery status: pending (not sent yet), sent, failed, not_applicable (no email on file) */
  emailStatus: mysqlEnum("emailStatus", ["pending", "sent", "failed", "not_applicable"]).default("pending").notNull(),
  /** Timestamp of last email send attempt */
  emailSentAt: timestamp("emailSentAt"),
  status: mysqlEnum("status", ["new", "diagnostic_ready", "reviewed", "contacted", "closed", "incomplete", "abandoned"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Admin users table — dedicated username/password auth for the admin console.
 * Separate from Manus OAuth users. Passwords stored as bcrypt hashes.
 * role "owner" = can create/delete other admins; role "admin" = leads access only.
 */
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  displayName: varchar("displayName", { length: 128 }),
  role: mysqlEnum("adminRole", ["owner", "admin"]).default("admin").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

/**
 * Knowledge base entries — AiA's knowledge that gets pushed to the ElevenLabs agent prompt.
 * Each entry is a named piece of knowledge (e.g., "Agent Package Details", "Company Overview").
 * source: where the knowledge came from (document, website, conversation, manual)
 * category: organizational grouping (packages, company, processes, faq)
 */
export const knowledgeBase = mysqlTable("knowledge_base", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["packages", "company", "processes", "faq", "other"]).default("other").notNull(),
  source: mysqlEnum("source", ["document", "website", "conversation", "manual"]).default("manual").notNull(),
  sourceFile: varchar("sourceFile", { length: 512 }),
  isActive: int("isActive").default(1).notNull(),
  lastPushedAt: timestamp("lastPushedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeEntry = typeof knowledgeBase.$inferSelect;
export type InsertKnowledgeEntry = typeof knowledgeBase.$inferInsert;

/**
 * Email events table — tracks Resend webhook events (delivered, opened, clicked, bounced).
 * Each row is a single event. A single email can generate multiple events
 * (e.g. delivered → opened → clicked → clicked again).
 * leadId links back to the leads table for per-lead email engagement tracking.
 */
export const emailEvents = mysqlTable("email_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Resend email ID — links all events for one email send */
  emailId: varchar("emailId", { length: 128 }).notNull(),
  /** Event type from Resend: email.sent, email.delivered, email.opened, email.clicked, email.bounced, email.complained */
  eventType: varchar("eventType", { length: 64 }).notNull(),
  /** Recipient email address */
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  /** FK to leads table (resolved via tags or recipient email lookup) */
  leadId: int("leadId"),
  /** Email subject line */
  subject: varchar("subject", { length: 512 }),
  /** For click events: the URL that was clicked */
  clickedLink: text("clickedLink"),
  /** For click events: user agent string */
  clickUserAgent: text("clickUserAgent"),
  /** For click events: IP address */
  clickIpAddress: varchar("clickIpAddress", { length: 64 }),
  /** Timestamp from Resend when the event occurred */
  eventTimestamp: timestamp("eventTimestamp"),
  /** Raw JSON payload from Resend (for debugging) */
  rawPayload: text("rawPayload"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailEvent = typeof emailEvents.$inferSelect;
export type InsertEmailEvent = typeof emailEvents.$inferInsert;

/**
 * SMS events table — tracks all outbound SMS messages sent via Telnyx.
 * Supports rate limiting (2/day per phone, 4/4days per phone),
 * delivery tracking, and per-lead SMS engagement history.
 */
export const smsEvents = mysqlTable("sms_events", {
  id: int("id").autoincrement().primaryKey(),
  /** FK to leads table */
  leadId: int("leadId"),
  /** Recipient phone number (E.164 format) */
  phone: varchar("phone", { length: 32 }).notNull(),
  /** Message type/sequence: incomplete_followup, short_followup, post_email_warmup, diagnostic_ready, continue_conversation */
  messageType: varchar("messageType", { length: 64 }).notNull(),
  /** The actual SMS text that was sent */
  messageText: text("messageText").notNull(),
  /** Telnyx message ID for tracking delivery */
  telnyxMessageId: varchar("telnyxMessageId", { length: 128 }),
  /** Delivery status: scheduled, queued, sent, delivered, failed, rate_limited */
  status: mysqlEnum("smsStatus", ["scheduled", "queued", "sent", "delivered", "failed", "rate_limited"]).default("queued").notNull(),
  /** If scheduled via Telnyx send_at, the scheduled delivery time */
  scheduledFor: timestamp("scheduledFor"),
  /** When the SMS was actually sent by Telnyx */
  sentAt: timestamp("sentAt"),
  /** When delivery was confirmed */
  deliveredAt: timestamp("deliveredAt"),
  /** Error message if failed */
  errorMessage: text("errorMessage"),
  /** Cost in USD */
  costAmount: varchar("costAmount", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SmsEvent = typeof smsEvents.$inferSelect;
export type InsertSmsEvent = typeof smsEvents.$inferInsert;

/**
 * Magic link tokens — used for returning lead verification on the /talk page.
 * A token is emailed to the lead; clicking the link verifies their identity
 * and grants access to their conversation history.
 */
export const magicLinkTokens = mysqlTable("magic_link_tokens", {
  id: int("id").autoincrement().primaryKey(),
  /** The token string sent in the magic link URL */
  token: varchar("token", { length: 128 }).notNull().unique(),
  /** Email address the magic link was sent to */
  email: varchar("email", { length: 320 }).notNull(),
  /** FK to leads table — the lead this token authenticates */
  leadId: int("leadId").notNull(),
  /** When the token expires (15 minutes from creation) */
  expiresAt: timestamp("expiresAt").notNull(),
  /** When the token was used (null if unused) */
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MagicLinkToken = typeof magicLinkTokens.$inferSelect;
export type InsertMagicLinkToken = typeof magicLinkTokens.$inferInsert;

/**
 * Web transcripts — stores transcripts from the /talk page voice conversations.
 * These are separate from the webhook-captured transcripts (which come via ElevenLabs post-call webhook).
 * Each row is one complete conversation from the /talk page.
 * If leadId is set, links to an existing lead record.
 */
export const webTranscripts = mysqlTable("web_transcripts", {
  id: int("id").autoincrement().primaryKey(),
  /** FK to leads table (null if anonymous / new visitor) */
  leadId: int("leadId"),
  /** Visitor-provided name (optional, from pre-fill form) */
  visitorName: varchar("visitorName", { length: 255 }),
  /** Visitor-provided email (optional, from pre-fill form) */
  visitorEmail: varchar("visitorEmail", { length: 320 }),
  /** Visitor-provided phone (optional, from pre-fill form) */
  visitorPhone: varchar("visitorPhone", { length: 64 }),
  /** Structured transcript JSON: Array<{role: 'user'|'ai', text: string, timestamp: string}> */
  transcript: text("transcript").notNull(),
  /** Plain text version of the transcript for display */
  transcriptText: text("transcriptText"),
  /** Duration of the conversation in seconds */
  durationSeconds: int("durationSeconds"),
  /** Client-generated session ID for incremental upsert during live calls */
  sessionId: varchar("sessionId", { length: 64 }),
  /** Source: 'web_talk' for /talk page, 'web_widget' for floating widget */
  source: varchar("source", { length: 32 }).default("web_talk").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WebTranscript = typeof webTranscripts.$inferSelect;
export type InsertWebTranscript = typeof webTranscripts.$inferInsert;

// ═══════════════════════════════════════════════════════════════════════════════
// VaaS (Voice Agent as a Service) Platform Tables
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Voice tiers — available voices clients can choose for their agent.
 * tier: "free" = included in monthly plan, "premium" = additional monthly cost.
 */
export const voiceTiers = mysqlTable("voice_tiers", {
  id: int("id").autoincrement().primaryKey(),
  voiceId: varchar("voiceId", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  previewUrl: varchar("previewUrl", { length: 512 }),
  tier: mysqlEnum("tier", ["free", "premium"]).default("free").notNull(),
  /** Additional monthly cost in cents (0 for free tier) */
  monthlyCostCents: int("monthlyCostCents").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VoiceTier = typeof voiceTiers.$inferSelect;
export type InsertVoiceTier = typeof voiceTiers.$inferInsert;

/**
 * Promo codes — discount codes distributed by AiiACo contacts.
 * discount_type: "fixed" = flat amount off (in cents), "percent" = percentage off.
 * Applies to monthly subscription price.
 */
export const promoCodes = mysqlTable("promo_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  discountType: mysqlEnum("discountType", ["fixed", "percent"]).notNull(),
  /** For fixed: amount in cents. For percent: percentage (e.g. 11 = 11% off). */
  discountValue: int("discountValue").notNull(),
  /** Resulting monthly price in cents after discount (e.g. 88800 for $888). Null = calculate dynamically. */
  resultPriceCents: int("resultPriceCents"),
  maxUses: int("maxUses"),
  usesCount: int("usesCount").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = typeof promoCodes.$inferInsert;

/**
 * Platform clients — businesses that sign up for the VaaS platform.
 * Separate auth from admin users and Manus OAuth users.
 * Passwords stored as bcrypt hashes.
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 512 }),
  phone: varchar("phone", { length: 64 }),
  industry: varchar("industry", { length: 128 }),
  /** Account status: trial (15 min free), active (paying), suspended (payment failed), cancelled */
  status: mysqlEnum("clientStatus", ["trial", "active", "suspended", "cancelled"]).default("trial").notNull(),
  /** Stripe customer ID (set after first checkout) */
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  /** Stripe subscription ID */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 128 }),
  /** Promo code used at signup */
  promoCodeUsed: varchar("promoCodeUsed", { length: 64 }),
  /** Monthly price in cents (99900 = $999, 88800 = $888 with promo) */
  monthlyPriceCents: int("monthlyPriceCents").default(99900).notNull(),
  /** Total trial seconds used (max 900 = 15 minutes) */
  trialSecondsUsed: int("trialSecondsUsed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Client agents — each client's customized voice agent instance.
 * Maps to an ElevenLabs agent that AiiACo creates and manages.
 */
export const clientAgents = mysqlTable("client_agents", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  /** Display name for the agent (e.g. "Sarah - Real Estate Assistant") */
  agentName: varchar("agentName", { length: 255 }).notNull(),
  /** Industry template used: real_estate, mortgage, law, hospitality, manufacturing */
  templateType: mysqlEnum("templateType", ["real_estate", "mortgage", "law", "hospitality", "manufacturing"]).notNull(),
  /** ElevenLabs agent ID (set after agent is created on ElevenLabs) */
  elevenlabsAgentId: varchar("elevenlabsAgentId", { length: 128 }),
  /** Custom personality/system prompt additions */
  personality: text("personality"),
  /** Custom first message */
  firstMessage: text("firstMessage"),
  /** Knowledge base content (JSON array of {title, content} entries) */
  knowledgeBase: text("knowledgeBase"),
  /** Selected voice ID (references voice_tiers.voiceId) */
  voiceId: varchar("voiceId", { length: 128 }),
  /** Voice tier: free or premium */
  voiceTier: mysqlEnum("voiceTier", ["free", "premium"]).default("free").notNull(),
  /** Widget appearance config (JSON: {primaryColor, position, greeting}) */
  widgetConfig: text("widgetConfig"),
  /** Unique embed token for the client's website */
  embedToken: varchar("embedToken", { length: 128 }).notNull().unique(),
  /** Agent status: draft (being configured), active (live), paused (client paused), locked (trial expired) */
  status: mysqlEnum("agentStatus", ["draft", "active", "paused", "locked"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientAgent = typeof clientAgents.$inferSelect;
export type InsertClientAgent = typeof clientAgents.$inferInsert;

/**
 * Client conversations — conversations captured by client agents.
 * Each row is one visitor interaction with a client's agent.
 */
export const clientConversations = mysqlTable("client_conversations", {
  id: int("id").autoincrement().primaryKey(),
  clientAgentId: int("clientAgentId").notNull(),
  clientId: int("clientId").notNull(),
  /** ElevenLabs conversation ID */
  elevenlabsConversationId: varchar("elevenlabsConversationId", { length: 128 }),
  /** Caller/visitor name (extracted by AI) */
  callerName: varchar("callerName", { length: 255 }),
  /** Caller/visitor email (extracted by AI) */
  callerEmail: varchar("callerEmail", { length: 320 }),
  /** Caller/visitor phone (extracted by AI) */
  callerPhone: varchar("callerPhone", { length: 64 }),
  /** Full transcript text */
  transcript: text("transcript"),
  /** Structured transcript JSON */
  structuredTranscript: text("structuredTranscript"),
  /** AI-extracted intelligence summary */
  intelligenceSummary: text("intelligenceSummary"),
  /** AI-extracted pain points */
  painPoints: text("painPoints"),
  /** AI-extracted wants/needs */
  wants: text("wants"),
  /** Duration in seconds */
  durationSeconds: int("durationSeconds"),
  /** Lead score (1-10, AI-generated) */
  leadScore: int("leadScore"),
  /** Status: new, reviewed, contacted, converted, archived */
  status: mysqlEnum("conversationStatus", ["new", "reviewed", "contacted", "converted", "archived"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClientConversation = typeof clientConversations.$inferSelect;
export type InsertClientConversation = typeof clientConversations.$inferInsert;

/**
 * Agent templates — predefined configurations for the 5 industry templates.
 * These are the starting points that get cloned when a client picks a template.
 */
export const agentTemplates = mysqlTable("agent_templates", {
  id: int("id").autoincrement().primaryKey(),
  /** Template key: real_estate, mortgage, law, hospitality, manufacturing */
  templateKey: varchar("templateKey", { length: 64 }).notNull().unique(),
  /** Display name */
  displayName: varchar("displayName", { length: 255 }).notNull(),
  /** Description shown during template selection */
  description: text("description").notNull(),
  /** Default system prompt for this industry */
  defaultPrompt: text("defaultPrompt").notNull(),
  /** Default first message */
  defaultFirstMessage: text("defaultFirstMessage").notNull(),
  /** Default knowledge base entries (JSON) */
  defaultKnowledgeBase: text("defaultKnowledgeBase"),
  /** Icon or emoji for display */
  icon: varchar("icon", { length: 32 }),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentTemplate = typeof agentTemplates.$inferSelect;
export type InsertAgentTemplate = typeof agentTemplates.$inferInsert;
