/**
 * Track-Specific Email Templates — Shared by Webhook + Poller
 *
 * Single source of truth for all post-call follow-up emails.
 * Used by:
 *   - server/webhooks/elevenlabs.ts (webhook handler)
 *   - server/conversationPoller.ts (fallback poller)
 *   - server/routers.ts (admin re-send email button)
 */

import type { TrackType } from "./aiAgent";

export function getTrackEmail(track: TrackType, callerName: string | null): {
  subject: string;
  html: string;
  text: string;
} {
  const name = callerName ?? "there";

  const trackContent: Record<TrackType, { subject: string; html: string; text: string }> = {
    operator: {
      subject: "Your AiiACo Operator Program Overview",
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #03050A; color: #C8D7E6; padding: 40px 32px;">
        <div style="margin-bottom: 32px;">
          <img src="https://cdn.aiiaco.com/logo-gold.png" alt="AiiACo" style="height: 36px;" />
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #B89C4A; margin: 0 0 16px;">The Operator Program</h1>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Based on your diagnostic, you're a strong fit for the <strong style="color: #B89C4A;">AiiACo Operator Program</strong> — where we build, deploy, and manage your entire AI infrastructure end-to-end.</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">This is the same model powering growth-stage companies across real estate, mortgage, and consulting — fully managed, performance-oriented AI operations with zero internal overhead on your team.</p>
        <div style="background: rgba(184,156,74,0.08); border: 1px solid rgba(184,156,74,0.20); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="font-size: 13px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(184,156,74,0.75); margin: 0 0 12px;">What's included</p>
          <ul style="font-size: 14px; line-height: 1.8; color: rgba(200,215,230,0.80); margin: 0; padding-left: 20px;">
            <li>Full AI infrastructure design and deployment</li>
            <li>Dedicated AiiACo operations team</li>
            <li>Monthly performance reporting</li>
            <li>Ongoing optimization and expansion</li>
          </ul>
        </div>
        <a href="https://calendly.com/aiia" style="display: inline-block; background: #B89C4A; color: #03050A; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 8px 0 24px;">Book Your Strategy Call →</a>
        <p style="font-size: 13px; color: rgba(200,215,230,0.45); margin: 24px 0 0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">AiiACo · AI Integration Authority for the Corporate Age · <a href="https://aiiaco.com" style="color: rgba(184,156,74,0.65);">aiiaco.com</a></p>
      </div>`,
      text: `Hi ${name},\n\nBased on your diagnostic, you're a strong fit for the AiiACo Operator Program — fully managed AI infrastructure, end-to-end.\n\nBook your strategy call: https://calendly.com/aiia\n\nAiiACo · aiiaco.com`,
    },
    agent: {
      subject: "Your AiiACo Agent Program Overview",
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #03050A; color: #C8D7E6; padding: 40px 32px;">
        <div style="margin-bottom: 32px;">
          <img src="https://cdn.aiiaco.com/logo-gold.png" alt="AiiACo" style="height: 36px;" />
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #B89C4A; margin: 0 0 16px;">The Agent Program</h1>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Based on your diagnostic, the <strong style="color: #B89C4A;">AiiACo Agent Program</strong> is built for operators like you — powerful AI tools you control, without the enterprise overhead.</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">This is the model powering independent professionals and boutique firms who want to run faster without hiring more people.</p>
        <div style="background: rgba(184,156,74,0.08); border: 1px solid rgba(184,156,74,0.20); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="font-size: 13px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(184,156,74,0.75); margin: 0 0 12px;">What's included</p>
          <ul style="font-size: 14px; line-height: 1.8; color: rgba(200,215,230,0.80); margin: 0; padding-left: 20px;">
            <li>AI tools configured for your specific workflow</li>
            <li>Onboarding and setup support</li>
            <li>Monthly check-ins and optimizations</li>
            <li>Access to the AiiACo agent toolkit</li>
          </ul>
        </div>
        <a href="https://calendly.com/aiia" style="display: inline-block; background: #B89C4A; color: #03050A; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 8px 0 24px;">Book Your Strategy Call →</a>
        <p style="font-size: 13px; color: rgba(200,215,230,0.45); margin: 24px 0 0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">AiiACo · AI Integration Authority for the Corporate Age · <a href="https://aiiaco.com" style="color: rgba(184,156,74,0.65);">aiiaco.com</a></p>
      </div>`,
      text: `Hi ${name},\n\nBased on your diagnostic, the AiiACo Agent Program is built for operators like you.\n\nBook your strategy call: https://calendly.com/aiia\n\nAiiACo · aiiaco.com`,
    },
    corporate: {
      subject: "Your AiiACo Corporate Program Overview",
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #03050A; color: #C8D7E6; padding: 40px 32px;">
        <div style="margin-bottom: 32px;">
          <img src="https://cdn.aiiaco.com/logo-gold.png" alt="AiiACo" style="height: 36px;" />
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #B89C4A; margin: 0 0 16px;">The Corporate Program</h1>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Based on your diagnostic, you're a fit for the <strong style="color: #B89C4A;">AiiACo Corporate Program</strong> — enterprise-level AI implementation delivered in modular, bite-sized packages.</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">We start with a deep diagnostic, build a custom implementation roadmap, and deploy in phases — so you see results at every stage without betting the whole company on a single initiative.</p>
        <div style="background: rgba(184,156,74,0.08); border: 1px solid rgba(184,156,74,0.20); border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="font-size: 13px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: rgba(184,156,74,0.75); margin: 0 0 12px;">Implementation phases</p>
          <ul style="font-size: 14px; line-height: 1.8; color: rgba(200,215,230,0.80); margin: 0; padding-left: 20px;">
            <li>Phase 1: Cold Email Agent</li>
            <li>Phase 2: SDR Agent + Website + AI Receptionist</li>
            <li>Phase 3: Full Agent &amp; Operator Packages</li>
            <li>Phase 4+: Paid Ads, Podcast, Social Media Management</li>
          </ul>
        </div>
        <a href="https://calendly.com/aiia" style="display: inline-block; background: #B89C4A; color: #03050A; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 8px 0 24px;">Book Your Strategy Call →</a>
        <p style="font-size: 13px; color: rgba(200,215,230,0.45); margin: 24px 0 0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">AiiACo · AI Integration Authority for the Corporate Age · <a href="https://aiiaco.com" style="color: rgba(184,156,74,0.65);">aiiaco.com</a></p>
      </div>`,
      text: `Hi ${name},\n\nBased on your diagnostic, the AiiACo Corporate Program is the right fit — enterprise AI in modular phases.\n\nBook your strategy call: https://calendly.com/aiia\n\nAiiACo · aiiaco.com`,
    },
    unknown: {
      subject: "Thank you for calling AiiACo",
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #03050A; color: #C8D7E6; padding: 40px 32px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #B89C4A; margin: 0 0 16px;">Thanks for calling AiiACo</h1>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Hi ${name},</p>
        <p style="font-size: 15px; line-height: 1.7; color: rgba(200,215,230,0.85); margin: 0 0 20px;">Our team will be in touch shortly to follow up on your inquiry.</p>
        <a href="https://calendly.com/aiia" style="display: inline-block; background: #B89C4A; color: #03050A; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 8px 0 24px;">Book a Strategy Call →</a>
        <p style="font-size: 13px; color: rgba(200,215,230,0.45); margin: 24px 0 0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px;">AiiACo · AI Integration Authority for the Corporate Age · <a href="https://aiiaco.com" style="color: rgba(184,156,74,0.65);">aiiaco.com</a></p>
      </div>`,
      text: `Hi ${name},\n\nThank you for calling AiiACo. Our team will be in touch shortly.\n\nBook a strategy call: https://calendly.com/aiia\n\nAiiACo · aiiaco.com`,
    },
  };

  return trackContent[track] ?? trackContent.unknown;
}
