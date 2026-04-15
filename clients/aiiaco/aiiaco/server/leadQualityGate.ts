/**
 * Lead Quality Gate — Anti-spam + Minimum Viable Lead Rules
 *
 * Single source of truth for deciding whether a call is worth processing,
 * whether a lead is "complete" enough for follow-up, and whether to send
 * emails or owner notifications.
 *
 * Used by:
 *   - server/webhooks/elevenlabs.ts (webhook handler)
 *   - server/conversationPoller.ts (fallback poller)
 *
 * RULES:
 *   1. ABANDONED CALL: <30s duration OR <2 user turns → don't save at all
 *   2. INCOMPLETE LEAD: no real name OR no (email + phone) → save as "incomplete", no email, no notification
 *   3. COMPLETE LEAD: has name + (email OR phone) → full pipeline (save, email if has email, notify owner)
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type LeadQuality = "abandoned" | "incomplete" | "complete";

type LeadStatus = "new" | "diagnostic_ready" | "reviewed" | "contacted" | "closed" | "incomplete" | "abandoned";

export interface QualityAssessment {
  quality: LeadQuality;
  reason: string;
  /** Whether to save this lead to the database at all */
  shouldSave: boolean;
  /** Whether to send a follow-up email to the caller */
  shouldEmail: boolean;
  /** Whether to send an owner notification */
  shouldNotifyOwner: boolean;
  /** What status to assign in the DB */
  suggestedStatus: LeadStatus;
}

export interface CallMetrics {
  durationSeconds: number | null | undefined;
  userTurnCount: number;
  totalTurnCount: number;
  callerName: string | null | undefined;
  callerEmail: string | null | undefined;
  callerPhone: string | null | undefined;
  conversationId: string | null | undefined;
  /** ElevenLabs call status — "done", "failed", etc. */
  callStatus?: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const MIN_DURATION_SECONDS = 30;
const MIN_USER_TURNS = 2;

// Placeholder names that don't count as real names
const PLACEHOLDER_NAMES = new Set([
  "voice caller",
  "phone caller",
  "unknown",
  "there",
  "",
]);

// Placeholder emails that don't count as real emails
const PLACEHOLDER_EMAIL_PATTERNS = [
  /@aiiaco\.com$/i,       // Our own placeholder emails
  /^voice-/i,             // voice-{conversationId}@...
  /^unknown@/i,
  /^test@/i,
  /^placeholder@/i,
];

// ── Core Assessment ──────────────────────────────────────────────────────────

export function assessLeadQuality(metrics: CallMetrics): QualityAssessment {
  const {
    durationSeconds,
    userTurnCount,
    callerName,
    callerEmail,
    callerPhone,
    callStatus,
  } = metrics;

  // ── Rule 0: Failed calls are always abandoned ──────────────────────────
  if (callStatus === "failed") {
    return {
      quality: "abandoned",
      reason: `Call failed (status: ${callStatus})`,
      shouldSave: false,
      shouldEmail: false,
      shouldNotifyOwner: false,
      suggestedStatus: "abandoned",
    };
  }

  // ── Rule 1: Anti-spam — too short or too few turns ─────────────────────
  const duration = durationSeconds ?? 0;
  if (duration < MIN_DURATION_SECONDS) {
    return {
      quality: "abandoned",
      reason: `Call too short (${duration}s < ${MIN_DURATION_SECONDS}s minimum)`,
      shouldSave: false,
      shouldEmail: false,
      shouldNotifyOwner: false,
      suggestedStatus: "abandoned",
    };
  }

  if (userTurnCount < MIN_USER_TURNS) {
    return {
      quality: "abandoned",
      reason: `Too few user turns (${userTurnCount} < ${MIN_USER_TURNS} minimum)`,
      shouldSave: false,
      shouldEmail: false,
      shouldNotifyOwner: false,
      suggestedStatus: "abandoned",
    };
  }

  // ── Rule 2: Check for real contact data ────────────────────────────────
  const hasRealName = isRealName(callerName);
  const hasRealEmail = isRealEmail(callerEmail);
  const hasRealPhone = isRealPhone(callerPhone);

  const hasContactMethod = hasRealEmail || hasRealPhone;

  // ── Rule 3: Complete lead = real name + at least one contact method ────
  if (hasRealName && hasContactMethod) {
    return {
      quality: "complete",
      reason: "Has name + contact info",
      shouldSave: true,
      shouldEmail: hasRealEmail, // Only email if we have a real email
      shouldNotifyOwner: true,
      suggestedStatus: "diagnostic_ready",
    };
  }

  // ── Rule 4: Incomplete lead — save but don't email or notify ───────────
  const missingParts: string[] = [];
  if (!hasRealName) missingParts.push("name");
  if (!hasRealEmail) missingParts.push("email");
  if (!hasRealPhone) missingParts.push("phone");

  return {
    quality: "incomplete",
    reason: `Missing: ${missingParts.join(", ")}`,
    shouldSave: true,
    shouldEmail: false,
    shouldNotifyOwner: false,
    suggestedStatus: "incomplete",
  };
}

// ── Helper validators ────────────────────────────────────────────────────────

function isRealName(name: string | null | undefined): boolean {
  if (!name) return false;
  const normalized = name.trim().toLowerCase();
  if (PLACEHOLDER_NAMES.has(normalized)) return false;
  // Must be at least 2 characters and contain a letter
  if (normalized.length < 2) return false;
  if (!/[a-zA-Z\u0600-\u06FF\u4e00-\u9fff\uAC00-\uD7AF]/.test(normalized)) return false;
  return true;
}

function isRealEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.includes("@")) return false;
  // Check against placeholder patterns
  for (const pattern of PLACEHOLDER_EMAIL_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }
  return true;
}

function isRealPhone(phone: string | null | undefined): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  // Must have at least 7 digits to be a real phone number
  return digits.length >= 7;
}

// ── Utility: count user turns from transcript ────────────────────────────────

export function countUserTurns(
  transcript: Array<{ role: string; message?: string }> | undefined | null
): number {
  if (!transcript || !Array.isArray(transcript)) return 0;
  return transcript.filter(
    (t) => t.role === "user" && t.message && t.message.trim().length > 0
  ).length;
}

// ── Export helpers for testing ────────────────────────────────────────────────
export { isRealName, isRealEmail, isRealPhone, MIN_DURATION_SECONDS, MIN_USER_TURNS };
