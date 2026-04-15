/**
 * AiiACo Email Templates — v3 (Magnificent Edition)
 *
 * Three templates:
 * 1. Owner Pilot Brief — full brand-book styled HTML document with all intelligence
 * 2. Caller Summary — personalized, intelligence-driven follow-up with conversation insights
 * 3. Continue Conversation — warm follow-up for short/abandoned calls (< 90s)
 *
 * Both use the AiiA brand system: void black (#0A0804), gold accents (#C9A84C / #F5D77A),
 * Cormorant Garamond + Inter typography, warm paper (#F8F3E8) for content sections.
 *
 * Design: Email-safe inline CSS only. No external stylesheets, no CSS classes.
 * All fonts use web-safe fallbacks. Google Fonts loaded via <link> in <head>.
 */

import type { TrackType, ConversationIntelligence } from "./aiAgent";

// ─── CDN Assets ──────────────────────────────────────────────────────────────

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia_logo_pure_gold_transparent_8063797a.png";
const ARC_ICON_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aiia-arc-icon-final-transparent_883f9364.png";

// ─── Shared Constants ────────────────────────────────────────────────────────

const CALENDLY_URL = "https://calendly.com/aiiaco";

const TRACK_LABELS: Record<TrackType, string> = {
  operator: "Operator Program",
  agent: "Agent Program",
  corporate: "Corporate Program",
  unknown: "Custom Engagement",
};

const TRACK_DESCRIPTIONS: Record<TrackType, string> = {
  operator:
    "Fully managed AI infrastructure — we design, deploy, and operate the entire stack end-to-end. Zero internal overhead.",
  agent:
    "AI-powered growth tools configured for your specific workflow — powerful automation without enterprise overhead.",
  corporate:
    "Enterprise-level AI implementation in modular phases — deep diagnostic, custom roadmap, staged deployment.",
  unknown:
    "A tailored engagement designed around your specific situation and operational needs.",
};

// ─── Helper: format duration ─────────────────────────────────────────────────

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

// ─── Helper: safe HTML escape ────────────────────────────────────────────────

function esc(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}

function escPlain(str: string | null | undefined): string {
  return str ?? "";
}

// ─── Helper: sanitize caller name ───────────────────────────────────────────

/** Common filler words, prepositions, conjunctions, and non-name tokens that
 *  can slip through regex or LLM name extraction. */
const INVALID_NAME_TOKENS = new Set([
  // Filler / conversational
  "so", "now", "well", "great", "sure", "yes", "yeah", "right", "okay", "ok",
  "hey", "hi", "hello", "thanks", "thank", "please", "just", "like", "um", "uh",
  // Prepositions / conjunctions / articles
  "for", "and", "but", "the", "that", "this", "with", "from", "about", "into",
  "over", "then", "also", "very", "much", "more", "some", "any", "all", "not",
  // Verbs / adjectives that are never names
  "is", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does",
  "did", "will", "would", "could", "should", "can", "may", "might", "shall",
  "paid", "said", "told", "got", "get", "let", "put", "set", "run", "see",
  "it", "its", "my", "your", "our", "their", "his", "her", "we", "you", "they",
  // Pronouns / misc
  "there", "here", "where", "when", "what", "which", "who", "how", "why",
  "regarding", "perfectly", "exactly", "actually", "basically", "honestly",
]);

/**
 * Validate and sanitize a name before it reaches any email template.
 * Returns null if the name is invalid (filler word, too short, non-alphabetic).
 */
export function sanitizeName(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length < 2) return null;
  // Reject if it's a known invalid token
  if (INVALID_NAME_TOKENS.has(trimmed.toLowerCase())) return null;
  // Reject if first word is an invalid token (e.g. "for John" → bad extraction)
  const firstWord = trimmed.split(/\s+/)[0];
  if (firstWord && INVALID_NAME_TOKENS.has(firstWord.toLowerCase())) return null;
  // Reject if it contains no letters (pure numbers/symbols)
  if (!/[a-zA-Z]/.test(trimmed)) return null;
  // Reject if it looks like a sentence fragment (4+ words)
  if (trimmed.split(/\s+/).length > 3) return null;
  // Capitalize first letter of each word
  return trimmed
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Helper: parse JSON arrays safely ────────────────────────────────────────

function parseJsonArray(val: string | null | undefined): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. OWNER PILOT BRIEF — Magnificent brand-book styled HTML email
// ═══════════════════════════════════════════════════════════════════════════════

export interface OwnerPilotBriefData {
  // Lead info
  leadId: number;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  industry?: string | null;
  leadSource?: string | null;
  callPreference?: string | null;
  submittedAt?: string;
  // Call data
  track: TrackType;
  callDurationSeconds?: number | null;
  conversationId?: string | null;
  // Intelligence
  conversationSummary?: string | null;
  painPoints?: string | null; // JSON array string
  wants?: string | null; // JSON array string
  currentSolutions?: string | null; // JSON array string
  // Diagnostic (from LLM)
  recapSnapshot?: string | null;
  whatTheyToldUs?: string | null;
  fullDiagnostic?: string | null;
  solutionAreas?: string | null;
  salesCallNextSteps?: string | null;
  leadBrief?: string | null;
  // Quality
  quality?: string | null;
}

export function buildOwnerPilotBriefEmail(data: OwnerPilotBriefData): {
  subject: string;
  html: string;
  text: string;
} {
  const cleanName = sanitizeName(data.name);
  const firstName = cleanName ? cleanName.split(" ")[0] : null;
  const displayName = cleanName ?? data.name; // For owner brief, show raw name even if suspicious
  const trackLabel = TRACK_LABELS[data.track] ?? "Custom Engagement";
  const painPoints = parseJsonArray(data.painPoints);
  const wants = parseJsonArray(data.wants);
  const currentSolutions = parseJsonArray(data.currentSolutions);

  const subject = `PILOT BRIEF — ${data.name}${data.company ? ` | ${data.company}` : ""} | ${trackLabel}`;

  // ── Build HTML sections ────────────────────────────────────────────────────

  const painPointsHtml =
    painPoints.length > 0
      ? painPoints
          .map(
            (p) =>
              `<tr><td style="padding: 6px 0 6px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #3D2E0A; border-bottom: 1px solid rgba(139,105,20,0.10);">
                <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span>${esc(p)}
              </td></tr>`
          )
          .join("")
      : `<tr><td style="padding: 8px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; color: #6B5320; font-style: italic;">No specific pain points extracted</td></tr>`;

  const wantsHtml =
    wants.length > 0
      ? wants
          .map(
            (w) =>
              `<tr><td style="padding: 6px 0 6px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #3D2E0A; border-bottom: 1px solid rgba(139,105,20,0.10);">
                <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span>${esc(w)}
              </td></tr>`
          )
          .join("")
      : "";

  const currentSolutionsHtml =
    currentSolutions.length > 0
      ? currentSolutions
          .map(
            (s) =>
              `<tr><td style="padding: 6px 0 6px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #3D2E0A; border-bottom: 1px solid rgba(139,105,20,0.10);">
                <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span>${esc(s)}
              </td></tr>`
          )
          .join("")
      : "";

  const salesStepsHtml = data.salesCallNextSteps
    ? data.salesCallNextSteps
        .split("\n")
        .filter((l) => l.trim())
        .map(
          (step) =>
            `<tr><td style="padding: 6px 0 6px 16px; font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: #F5D77A;">
              ${esc(step)}
            </td></tr>`
        )
        .join("")
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pilot Brief — ${esc(data.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; padding: 0; background-color: #1A1208; font-family: 'Inter', Arial, sans-serif;">

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1208;">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <!-- Main container -->
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width: 640px; width: 100%;">

          <!-- ═══ COVER HEADER ═══ -->
          <tr>
            <td style="background: #0A0804; border: 1px solid rgba(201,168,76,0.25); border-bottom: none; padding: 32px 36px 24px;">
              <!-- Logo row -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="${LOGO_URL}" alt="AiiACo" width="44" height="44" style="display: block;" />
                  </td>
                  <td style="text-align: right;">
                    <span style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(201,168,76,0.50);">PILOT BRIEF</span>
                  </td>
                </tr>
              </table>

              <!-- Gold rule -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0 16px;">
                <tr>
                  <td style="height: 1px; background: linear-gradient(90deg, transparent, #F5D77A, transparent);"></td>
                </tr>
              </table>

              <!-- Title -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 32px; font-weight: 300; line-height: 1.1; color: #F5D77A; text-align: center; padding-bottom: 8px;">
                    ${esc(data.name)}
                  </td>
                </tr>
                ${
                  data.company
                    ? `<tr><td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 300; font-style: italic; color: #C9A84C; text-align: center; padding-bottom: 4px;">${esc(data.company)}</td></tr>`
                    : ""
                }
                <tr>
                  <td style="font-family: 'Inter', Arial, sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(245,215,122,0.60); text-align: center; padding-top: 8px;">
                    ${trackLabel} &nbsp;&middot;&nbsp; Lead #${data.leadId}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ LEAD PROFILE CARD ═══ -->
          <tr>
            <td style="background: #0A0804; border-left: 1px solid rgba(201,168,76,0.25); border-right: 1px solid rgba(201,168,76,0.25); padding: 0 36px 24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(201,168,76,0.65); padding-bottom: 12px;" colspan="2">LEAD PROFILE</td>
                      </tr>
                      <tr>
                        <td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0; width: 100px;">Email</td>
                        <td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.85); padding: 4px 0;"><a href="mailto:${esc(data.email)}" style="color: #C9A84C; text-decoration: none;">${esc(data.email)}</a></td>
                      </tr>
                      ${data.phone ? `<tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0;">Phone</td><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.85); padding: 4px 0;">${esc(data.phone)}</td></tr>` : ""}
                      ${data.industry ? `<tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0;">Industry</td><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.85); padding: 4px 0;">${esc(data.industry)}</td></tr>` : ""}
                      <tr>
                        <td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0;">Source</td>
                        <td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.85); padding: 4px 0;">${esc(data.leadSource ?? "—")}</td>
                      </tr>
                      ${data.callDurationSeconds ? `<tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0;">Call Duration</td><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.85); padding: 4px 0;">${formatDuration(data.callDurationSeconds)}</td></tr>` : ""}
                      ${data.callPreference ? `<tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0;">Call Pref</td><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.85); padding: 4px 0;">${esc(data.callPreference)}</td></tr>` : ""}
                      ${data.quality ? `<tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.50); padding: 4px 0;">Quality</td><td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: ${data.quality === "high" ? "#4ADE80" : data.quality === "medium" ? "#FBBF24" : "#FB923C"}; padding: 4px 0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">${esc(data.quality)}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ TRANSITION TO PAPER ═══ -->
          <tr>
            <td style="background: #0A0804; border-left: 1px solid rgba(201,168,76,0.25); border-right: 1px solid rgba(201,168,76,0.25); padding: 0 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height: 1px; background: linear-gradient(90deg, transparent, #C9A84C, transparent);"></td></tr>
              </table>
            </td>
          </tr>

          <!-- ═══ CONTENT BODY (warm paper) ═══ -->
          <tr>
            <td style="background: #F8F3E8; border-left: 1px solid rgba(139,105,20,0.25); border-right: 1px solid rgba(139,105,20,0.25); padding: 28px 36px 0;">

              ${
                data.recapSnapshot
                  ? `
              <!-- WHO THEY ARE -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; WHO THEY ARE</td></tr>
                <tr><td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px; font-weight: 400; line-height: 1.5; color: #1A1208;">${esc(data.recapSnapshot)}</td></tr>
              </table>
              `
                  : ""
              }

              ${
                data.whatTheyToldUs
                  ? `
              <!-- WHAT THEY TOLD US -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; WHAT THEY TOLD US</td></tr>
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 300; line-height: 1.75; color: #3D2E0A;">${esc(data.whatTheyToldUs)}</td></tr>
              </table>
              `
                  : ""
              }

              ${
                data.conversationSummary &&
                data.conversationSummary !== "Transcript analysis unavailable."
                  ? `
              <!-- CONVERSATION SUMMARY -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; CONVERSATION SUMMARY</td></tr>
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 300; line-height: 1.75; color: #3D2E0A;">${esc(data.conversationSummary)}</td></tr>
              </table>
              `
                  : ""
              }

              <!-- PAIN POINTS -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; PAIN POINTS</td></tr>
                ${painPointsHtml}
              </table>

              ${
                wants.length > 0
                  ? `
              <!-- WANTS & WISHES -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; WANTS &amp; WISHES</td></tr>
                ${wantsHtml}
              </table>
              `
                  : ""
              }

              ${
                currentSolutions.length > 0
                  ? `
              <!-- CURRENT SOLUTIONS -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; CURRENT SOLUTIONS &amp; ATTEMPTS</td></tr>
                ${currentSolutionsHtml}
              </table>
              `
                  : ""
              }

            </td>
          </tr>

          <!-- ═══ FULL DIAGNOSTIC (dark block) ═══ -->
          ${
            data.fullDiagnostic
              ? `
          <tr>
            <td style="background: #0A0804; border-left: 1px solid rgba(201,168,76,0.25); border-right: 1px solid rgba(201,168,76,0.25); padding: 0 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height: 1px; background: linear-gradient(90deg, transparent, #F5D77A, transparent);"></td></tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(201,168,76,0.65); padding-bottom: 12px;">&#9670; FULL DIAGNOSTIC — OWNER ONLY</td></tr>
                <tr><td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 400; font-style: italic; line-height: 1.6; color: rgba(245,215,122,0.85);">${esc(data.fullDiagnostic)}</td></tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- ═══ SOLUTION AREAS (paper) ═══ -->
          ${
            data.solutionAreas
              ? `
          <tr>
            <td style="background: #F8F3E8; border-left: 1px solid rgba(139,105,20,0.25); border-right: 1px solid rgba(139,105,20,0.25); padding: 24px 36px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 8px;">&#9670; SOLUTION AREAS</td></tr>
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 300; line-height: 1.75; color: #3D2E0A;">${esc(data.solutionAreas)}</td></tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- ═══ SALES CALL NEXT STEPS (dark block) ═══ -->
          ${
            data.salesCallNextSteps
              ? `
          <tr>
            <td style="background: #0A0804; border-left: 1px solid rgba(201,168,76,0.25); border-right: 1px solid rgba(201,168,76,0.25); padding: 0 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height: 1px; background: linear-gradient(90deg, transparent, #F5D77A, transparent);"></td></tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 24px 0;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(201,168,76,0.65); padding-bottom: 12px;">&#9670; SALES CALL — NEXT STEPS</td></tr>
                ${salesStepsHtml}
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- ═══ LEAD BRIEF PREVIEW (paper) ═══ -->
          ${
            data.leadBrief
              ? `
          <tr>
            <td style="background: #F8F3E8; border-left: 1px solid rgba(139,105,20,0.25); border-right: 1px solid rgba(139,105,20,0.25); padding: 24px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #F2EAD6; border: 1px solid rgba(139,105,20,0.20); border-radius: 8px; padding: 20px 24px;">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #8B6914; padding-bottom: 10px;">PREVIEW — WHAT THE CALLER WILL RECEIVE</td></tr>
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 13px; font-weight: 300; font-style: italic; line-height: 1.75; color: #3D2E0A;">${esc(data.leadBrief)}</td></tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td style="background: #0A0804; border: 1px solid rgba(201,168,76,0.25); border-top: none; padding: 20px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,0.30), transparent); margin-bottom: 16px;"></td></tr>
                <tr>
                  <td style="padding-top: 16px; font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: rgba(200,215,230,0.35); text-align: center;">
                    AiiACo &nbsp;&middot;&nbsp; AI Integration Authority for the Corporate Age &nbsp;&middot;&nbsp; <a href="https://aiiaco.com" style="color: rgba(201,168,76,0.50); text-decoration: none;">aiiaco.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 6px; font-family: 'Inter', Arial, sans-serif; font-size: 10px; color: rgba(200,215,230,0.20); text-align: center; letter-spacing: 1px; text-transform: uppercase;">
                    CONFIDENTIAL — INTERNAL USE ONLY
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  // ── Plain text fallback ────────────────────────────────────────────────────

  const text = [
    `PILOT BRIEF — ${data.name}${data.company ? ` | ${data.company}` : ""}`,
    `Track: ${trackLabel} | Lead #${data.leadId}`,
    ``,
    `LEAD PROFILE`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.industry ? `Industry: ${data.industry}` : null,
    `Source: ${data.leadSource ?? "—"}`,
    data.callDurationSeconds ? `Call Duration: ${formatDuration(data.callDurationSeconds)}` : null,
    data.callPreference ? `Call Preference: ${data.callPreference}` : null,
    data.quality ? `Quality: ${data.quality}` : null,
    ``,
    data.recapSnapshot ? `WHO THEY ARE\n${data.recapSnapshot}\n` : null,
    data.whatTheyToldUs ? `WHAT THEY TOLD US\n${data.whatTheyToldUs}\n` : null,
    data.conversationSummary && data.conversationSummary !== "Transcript analysis unavailable."
      ? `CONVERSATION SUMMARY\n${data.conversationSummary}\n`
      : null,
    painPoints.length > 0
      ? `PAIN POINTS\n${painPoints.map((p) => `  • ${p}`).join("\n")}\n`
      : null,
    wants.length > 0
      ? `WANTS & WISHES\n${wants.map((w) => `  • ${w}`).join("\n")}\n`
      : null,
    currentSolutions.length > 0
      ? `CURRENT SOLUTIONS\n${currentSolutions.map((s) => `  • ${s}`).join("\n")}\n`
      : null,
    `─────────────────────────────────────`,
    data.fullDiagnostic ? `FULL DIAGNOSTIC (OWNER ONLY)\n${data.fullDiagnostic}\n` : null,
    data.solutionAreas ? `SOLUTION AREAS\n${data.solutionAreas}\n` : null,
    data.salesCallNextSteps ? `SALES CALL — NEXT STEPS\n${data.salesCallNextSteps}\n` : null,
    `─────────────────────────────────────`,
    data.leadBrief ? `PREVIEW — WHAT THE CALLER WILL RECEIVE\n${data.leadBrief}\n` : null,
    ``,
    `AiiACo · aiiaco.com · CONFIDENTIAL`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CALLER SUMMARY — Personalized, intelligence-driven follow-up email
// ═══════════════════════════════════════════════════════════════════════════════

export interface CallerSummaryData {
  name: string;
  email: string;
  company?: string | null;
  track: TrackType;
  // Intelligence (from LLM extraction)
  conversationSummary?: string | null;
  painPoints?: string | null; // JSON array string
  wants?: string | null; // JSON array string
  // Diagnostic brief (lead-facing, no internal language)
  leadBrief?: string | null;
}

export function buildCallerSummaryEmail(data: CallerSummaryData): {
  subject: string;
  html: string;
  text: string;
} {
  const cleanName = sanitizeName(data.name);
  const firstName = cleanName ? cleanName.split(" ")[0] : null;
  const trackLabel = TRACK_LABELS[data.track] ?? "Custom Engagement";
  const trackDesc = TRACK_DESCRIPTIONS[data.track] ?? TRACK_DESCRIPTIONS.unknown;
  const painPoints = parseJsonArray(data.painPoints);
  const wants = parseJsonArray(data.wants);

  const subject = firstName
    ? `${firstName}, here's your AiiACo conversation summary`
    : `Your AiiACo conversation summary`;

  // Build pain points section for the caller (reframed positively)
  const insightsHtml =
    painPoints.length > 0
      ? painPoints
          .map(
            (p) =>
              `<tr><td style="padding: 6px 0 6px 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.65; color: rgba(200,215,230,0.80); border-bottom: 1px solid rgba(255,255,255,0.04);">
                <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span>${esc(p)}
              </td></tr>`
          )
          .join("")
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Conversation Summary — AiiACo</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; padding: 0; background-color: #03050A; font-family: 'Inter', Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #03050A;">
    <tr>
      <td align="center" style="padding: 32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- ═══ HEADER ═══ -->
          <tr>
            <td style="padding: 0 0 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="${LOGO_URL}" alt="AiiACo" width="36" height="36" style="display: block;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold divider -->
          <tr>
            <td style="padding: 0 0 28px;">
              <table role="presentation" width="48" cellpadding="0" cellspacing="0">
                <tr><td style="height: 1px; background: linear-gradient(90deg, rgba(201,168,76,0.80), rgba(201,168,76,0.15));"></td></tr>
              </table>
            </td>
          </tr>

          <!-- ═══ GREETING ═══ -->
          <tr>
            <td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 300; line-height: 1.2; color: #F0F4F8; padding-bottom: 16px;">
              ${firstName ? `${esc(firstName)}, thank` : "Thank"} you for the conversation.
            </td>
          </tr>

          <tr>
            <td style="font-family: 'Inter', Arial, sans-serif; font-size: 15px; font-weight: 300; line-height: 1.75; color: rgba(200,215,230,0.80); padding-bottom: 24px;">
              We appreciate you taking the time to walk us through your situation${data.company ? ` at <strong style="color: rgba(240,192,80,0.90);">${esc(data.company)}</strong>` : ""}. Here's a summary of what we discussed and what happens next.
            </td>
          </tr>

          ${
            data.leadBrief
              ? `
          <!-- ═══ INITIAL ASSESSMENT ═══ -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(201,168,76,0.65); padding-bottom: 12px;">YOUR INITIAL ASSESSMENT</td></tr>
                      <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 300; line-height: 1.75; color: rgba(200,215,230,0.85); font-style: italic;">${esc(data.leadBrief)}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          ${
            painPoints.length > 0
              ? `
          <!-- ═══ KEY AREAS WE IDENTIFIED ═══ -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(201,168,76,0.65); padding-bottom: 12px;">KEY AREAS WE IDENTIFIED</td></tr>
                ${insightsHtml}
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- ═══ RECOMMENDED PROGRAM ═══ -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.15); border-radius: 8px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(201,168,76,0.65); padding-bottom: 8px;">SUGGESTED PROGRAM</td></tr>
                      <tr><td style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 600; color: #C9A84C; padding-bottom: 8px;">${trackLabel}</td></tr>
                      <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 300; line-height: 1.65; color: rgba(200,215,230,0.80);">${esc(trackDesc)}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ WHAT HAPPENS NEXT ═══ -->
          <tr>
            <td style="padding-bottom: 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(240,192,80,0.80); padding-bottom: 12px;">WHAT HAPPENS NEXT</td></tr>
                      <tr><td style="font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 300; line-height: 1.75; color: rgba(200,215,230,0.80);">
                        A specialist from our team will be reaching out to you personally to discuss the full picture and walk you through potential next steps. In the meantime, you can book a strategy call directly:
                      </td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ CTA BUTTON ═══ -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <a href="${CALENDLY_URL}" style="display: inline-block; background: #C9A84C; color: #0A0804; font-family: 'Inter', Arial, sans-serif; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">Book Your Strategy Call &rarr;</a>
            </td>
          </tr>

          <!-- ═══ CLOSING ═══ -->
          <tr>
            <td style="font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 300; line-height: 1.65; color: rgba(200,215,230,0.50); padding-bottom: 8px;">
              If you have any questions before the call, reply directly to this email.
            </td>
          </tr>
          <tr>
            <td style="font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 300; color: rgba(200,215,230,0.50); padding-bottom: 32px;">
              — The AiiACo Team
            </td>
          </tr>

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(200,215,230,0.30); line-height: 1.6;">
                    AiiACo &nbsp;&middot;&nbsp; AI Integration Authority for the Corporate Age<br />
                    <a href="https://aiiaco.com" style="color: rgba(201,168,76,0.50); text-decoration: none;">aiiaco.com</a>
                  </td>
                </tr>
                <tr>
                  <td style="font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: rgba(200,215,230,0.20); padding-top: 8px;">
                    You received this email because you spoke with AiA, our AI diagnostic intelligence.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  // ── Plain text fallback ────────────────────────────────────────────────────

  const text = [
    firstName ? `${firstName}, thank you for the conversation.` : `Thank you for the conversation.`,
    ``,
    `We appreciate you taking the time to walk us through your situation${data.company ? ` at ${data.company}` : ""}.`,
    ``,
    data.leadBrief ? `YOUR INITIAL ASSESSMENT\n${data.leadBrief}\n` : null,
    painPoints.length > 0
      ? `KEY AREAS WE IDENTIFIED\n${painPoints.map((p) => `  • ${p}`).join("\n")}\n`
      : null,
    `SUGGESTED PROGRAM: ${trackLabel}`,
    trackDesc,
    ``,
    `WHAT HAPPENS NEXT`,
    `A specialist from our team will be reaching out to you personally. In the meantime, you can book a strategy call: ${CALENDLY_URL}`,
    ``,
    `If you have any questions, reply directly to this email.`,
    ``,
    `— The AiiACo Team`,
    `aiiaco.com`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}


// ═══════════════════════════════════════════════════════════════════════════════
// 3. CONTINUE CONVERSATION — Warm follow-up for short/abandoned calls (< 90s)
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContinueConversationData {
  name: string;
  email: string;
  company?: string | null;
  industry?: string | null;
}

export function buildContinueConversationEmail(data: ContinueConversationData): {
  subject: string;
  html: string;
  text: string;
} {
  const cleanName = sanitizeName(data.name);
  const firstName = cleanName ? cleanName.split(" ")[0] : null;
  const companyRef = data.company
    ? ` at <strong style="color: #1A1508;">${esc(data.company)}</strong>`
    : "";
  const companyRefPlain = data.company ? ` at ${data.company}` : "";

  const subject = firstName
    ? `${firstName}, let's pick up where we left off`
    : `Let's pick up where we left off`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Continue the Conversation — AiiACo</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin: 0; padding: 0; background-color: #0A0804; font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0804;">
    <tr><td align="center" style="padding: 40px 16px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

        <!-- Logo header -->
        <tr><td style="padding: 32px 40px 24px 40px; text-align: center;">
          <img src="${LOGO_URL}" alt="AiiA" width="48" height="48" style="display: block; margin: 0 auto 16px auto; width: 48px; height: 48px;" />
          <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 11px; font-weight: 700; letter-spacing: 0.25em; color: rgba(201,168,76,0.70); text-transform: uppercase;">AI Integration Authority</div>
        </td></tr>

        <!-- Gold divider -->
        <tr><td style="padding: 0 40px;">
          <div style="height: 1px; background: linear-gradient(90deg, transparent, #C9A84C, transparent);"></div>
        </td></tr>

        <!-- Main content on warm paper -->
        <tr><td style="padding: 0 40px;">
          <div style="background-color: #F8F3E8; border-radius: 0 0 8px 8px; padding: 40px 36px;">

            <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 600; color: #1A1508; margin: 0 0 20px 0; line-height: 1.3;">
              ${firstName ? `${esc(firstName)}, great` : "Great"} connecting with you.
            </p>

            <p style="font-family: 'Inter', Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #3D3520; margin: 0 0 20px 0;">
              It sounds like we got cut short before we could really dig into what's happening${companyRef}. No worries — that happens.
            </p>

            <p style="font-family: 'Inter', Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #3D3520; margin: 0 0 20px 0;">
              We help companies eliminate the operational friction that eats into margins — things like manual coordination overhead, administrative bottleneck, and workflow gaps that slow teams down.
            </p>

            <!-- What we'd cover -->
            <div style="background-color: rgba(201,168,76,0.08); border-left: 3px solid #C9A84C; border-radius: 0 6px 6px 0; padding: 20px 24px; margin: 28px 0;">
              <p style="font-family: 'Inter', Arial, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; color: #8B7A3A; text-transform: uppercase; margin: 0 0 12px 0;">
                On a 15-minute call, we'd cover
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding: 5px 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #3D3520;">
                  <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span> Where your team is spending time on tasks that don't generate revenue
                </td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #3D3520;">
                  <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span> Which operational workflows have the highest automation potential
                </td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #3D3520;">
                  <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span> A quick diagnostic of your current systems and where AI fits in
                </td></tr>
                <tr><td style="padding: 5px 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #3D3520;">
                  <span style="color: #C9A84C; margin-right: 8px;">&#9670;</span> Whether there's a fit — and if not, we'll tell you straight
                </td></tr>
              </table>
            </div>

            <p style="font-family: 'Inter', Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #3D3520; margin: 0 0 28px 0;">
              No pitch deck, no pressure. Just a focused conversation about what's actually possible for your operation.
            </p>

            <!-- CTA Button -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding: 8px 0 32px 0;">
                <a href="${CALENDLY_URL}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #C9A84C, #E8D48B); color: #1A1508; font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.06em; text-decoration: none; padding: 14px 36px; border-radius: 6px; text-transform: uppercase;">
                  Pick a Time That Works
                </a>
              </td></tr>
            </table>

            <p style="font-family: 'Inter', Arial, sans-serif; font-size: 13px; line-height: 1.6; color: rgba(61,53,32,0.50); margin: 0; text-align: center;">
              Or just reply to this email and we'll coordinate directly.
            </p>

          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding: 32px 40px 40px 40px; text-align: center;">
          <p style="font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: rgba(201,168,76,0.35); margin: 0 0 6px 0;">
            AiiACo &middot; AI Integration Authority for the Corporate Age
          </p>
          <p style="font-family: 'Inter', Arial, sans-serif; font-size: 11px; color: rgba(200,215,230,0.20); margin: 0;">
            <a href="https://aiiaco.com" style="color: rgba(201,168,76,0.40); text-decoration: none;">aiiaco.com</a>
            &nbsp;&middot;&nbsp; 888-808-0001
          </p>
        </td></tr>

      </table>

    </td></tr>
  </table>

</body>
</html>`;

  const text = `${firstName ? `${firstName}, great` : "Great"} connecting with you.

It sounds like we got cut short before we could really dig into what's happening${companyRefPlain}. No worries — that happens.

We help companies eliminate the operational friction that eats into margins — things like manual coordination overhead, administrative bottleneck, and workflow gaps that slow teams down.

ON A 15-MINUTE CALL, WE'D COVER:
  • Where your team is spending time on tasks that don't generate revenue
  • Which operational workflows have the highest automation potential
  • A quick diagnostic of your current systems and where AI fits in
  • Whether there's a fit — and if not, we'll tell you straight

No pitch deck, no pressure. Just a focused conversation about what's actually possible for your operation.

Book a time: ${CALENDLY_URL}

Or just reply to this email and we'll coordinate directly.

— AiiACo
AI Integration Authority for the Corporate Age
aiiaco.com | 888-808-0001`;

  return { subject, html, text };
}
