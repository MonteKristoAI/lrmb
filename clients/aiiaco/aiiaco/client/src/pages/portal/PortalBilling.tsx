/**
 * PortalBilling - Subscription management & billing.
 * Shows current plan, trial status, and payment options.
 */

import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import { toast } from "sonner";
import {
  CreditCard, Check, Zap, Shield, Clock,
  Loader2, ArrowRight, Star
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export default function PortalBilling() {
  const meQuery = trpc.vaas.auth.me.useQuery(undefined, { retry: false });
  const billingQuery = trpc.vaas.billing.status.useQuery(undefined, { retry: false });
  const checkoutMutation = trpc.vaas.billing.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.info(data.message);
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const client = meQuery.data;
  const billing = billingQuery.data;
  const isActive = client?.status === "active";
  const isTrial = client?.status === "trial";
  const monthlyPrice = billing ? (billing.monthlyPriceCents / 100).toFixed(0) : "999";

  return (
    <PortalLayout>
      <div style={{ maxWidth: 700 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: FFD, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
            Billing & Subscription
          </h1>
          <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)", marginTop: 6 }}>
            Manage your voice agent subscription
          </p>
        </div>

        {/* Current status */}
        <div style={{
          background: "rgba(8,14,24,0.72)",
          border: `1px solid ${isActive ? "rgba(80,220,150,0.25)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 14, padding: 28, marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: isActive ? "rgba(80,220,150,0.10)" : "rgba(184,156,74,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isActive ? <Check size={22} style={{ color: "rgba(80,220,150,1)" }} /> : <Clock size={22} style={{ color: "#B89C4A" }} />}
            </div>
            <div>
              <div style={{ fontFamily: FF, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>
                {isActive ? "Active Subscription" : isTrial ? "Free Trial" : "Inactive"}
              </div>
              <div style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
                {isActive
                  ? `$${monthlyPrice}/month - billed monthly`
                  : isTrial
                  ? `${((billing?.trialSecondsRemaining ?? 0) / 60).toFixed(1)} minutes remaining`
                  : "Subscribe to activate your agent"}
              </div>
            </div>
          </div>

          {isTrial && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 8, padding: 4, marginBottom: 20,
            }}>
              <div style={{
                height: 6, borderRadius: 3,
                background: `linear-gradient(90deg, #B89C4A ${Math.min(100, ((billing?.trialSecondsUsed ?? 0) / 900) * 100)}%, rgba(255,255,255,0.06) 0%)`,
              }} />
            </div>
          )}
        </div>

        {/* Pricing card */}
        {!isActive && (
          <div style={{
            background: "rgba(8,14,24,0.72)",
            border: "1px solid rgba(184,156,74,0.25)",
            borderRadius: 14, padding: 32, marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Star size={18} style={{ color: "#B89C4A" }} />
              <span style={{
                fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#B89C4A",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>
                Voice Agent Subscription
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
              <span style={{ fontFamily: FFD, fontSize: 48, fontWeight: 800, color: "rgba(255,255,255,0.92)" }}>
                ${monthlyPrice}
              </span>
              <span style={{ fontFamily: FF, fontSize: 16, color: "rgba(200,215,230,0.45)" }}>/month</span>
            </div>
            <p style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.50)", marginBottom: 24 }}>
              No commitment. Cancel anytime. Billed monthly.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[
                "Your own AI voice agent on your website",
                "Full control panel - personality, voice, knowledge",
                "Conversation transcripts & lead intelligence",
                "Embed widget with one line of code",
                "Managed by AiiACo - we handle the infrastructure",
              ].map((feature, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Check size={14} style={{ color: "#B89C4A", flexShrink: 0 }} />
                  <span style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.70)" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              style={{
                fontFamily: FF, fontSize: 15, fontWeight: 700,
                color: "#03050A", background: "rgba(184,156,74,0.90)",
                border: "none", borderRadius: 8, padding: "15px 28px",
                cursor: checkoutMutation.isPending ? "wait" : "pointer",
                width: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                opacity: checkoutMutation.isPending ? 0.7 : 1,
              }}
            >
              {checkoutMutation.isPending ? (
                <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <>Subscribe Now <ArrowRight size={16} /></>
              )}
            </button>

            <p style={{
              fontFamily: FF, fontSize: 11, color: "rgba(200,215,230,0.35)",
              textAlign: "center", marginTop: 12,
            }}>
              Have a promo code? Contact your AiiACo representative.
            </p>
          </div>
        )}

        {/* Security note */}
        <div style={{
          background: "rgba(8,14,24,0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 20,
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <Shield size={20} style={{ color: "rgba(200,215,230,0.35)", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "rgba(200,215,230,0.60)" }}>
              Secure Payments
            </div>
            <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.40)", marginTop: 2 }}>
              All payments processed securely through Stripe. Your card information is never stored on our servers.
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </PortalLayout>
  );
}
