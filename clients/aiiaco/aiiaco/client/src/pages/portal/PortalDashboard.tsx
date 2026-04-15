/**
 * PortalDashboard - Client dashboard overview.
 * Shows agent status, trial info, quick actions.
 */

import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import { useLocation } from "wouter";
import {
  Bot, MessageSquare, Clock, Zap, ArrowRight, Mic,
  TrendingUp, AlertCircle
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const cardStyle: React.CSSProperties = {
  background: "rgba(8,14,24,0.72)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: 24,
};

export default function PortalDashboard() {
  const [, setLocation] = useLocation();
  const meQuery = trpc.vaas.auth.me.useQuery(undefined, { retry: false });
  const agentsQuery = trpc.vaas.agent.list.useQuery(undefined, { retry: false });

  const client = meQuery.data;
  const agents = agentsQuery.data ?? [];
  const primaryAgent = agents[0];

  // Trial tracking is on the client record, not the agent
  const trialMinutesUsed = (client?.trialSecondsUsed ?? 0) / 60;
  const trialMinutesRemaining = Math.max(0, 15 - trialMinutesUsed);
  const isTrialExpired = client?.status === "trial" && trialMinutesUsed >= 15;
  const isTrial = client?.status === "trial";
  const isActive = client?.status === "active";

  return (
    <PortalLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: FFD, fontSize: 26, fontWeight: 700,
          color: "rgba(255,255,255,0.92)", margin: 0,
        }}>
          Welcome back{client?.contactName ? `, ${client.contactName.split(" ")[0]}` : ""}
        </h1>
        <p style={{
          fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)",
          marginTop: 6,
        }}>
          {client?.companyName} - Voice Agent Portal
        </p>
      </div>

      {/* Trial banner */}
      {isTrial && !isTrialExpired && (
        <div style={{
          background: "rgba(184,156,74,0.08)",
          border: "1px solid rgba(184,156,74,0.25)",
          borderRadius: 12, padding: "16px 20px",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 12,
        }}>
          <Clock size={18} style={{ color: "#B89C4A", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "#B89C4A" }}>
              Free Trial Active
            </span>
            <span style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.55)", marginLeft: 8 }}>
              {trialMinutesRemaining.toFixed(1)} minutes remaining
            </span>
          </div>
          <button
            onClick={() => setLocation("/portal/billing")}
            style={{
              fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#03050A",
              background: "rgba(184,156,74,0.90)", border: "none", borderRadius: 6,
              padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            Activate <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Trial expired banner */}
      {isTrialExpired && (
        <div style={{
          background: "rgba(255,100,100,0.06)",
          border: "1px solid rgba(255,100,100,0.20)",
          borderRadius: 12, padding: "16px 20px",
          marginBottom: 24, display: "flex", alignItems: "center", gap: 12,
        }}>
          <AlertCircle size={18} style={{ color: "rgba(255,100,100,0.80)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "rgba(255,100,100,0.80)" }}>
              Free Trial Ended
            </span>
            <span style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.55)", marginLeft: 8 }}>
              Activate your subscription to continue using your agent
            </span>
          </div>
          <button
            onClick={() => setLocation("/portal/billing")}
            style={{
              fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#03050A",
              background: "rgba(184,156,74,0.90)", border: "none", borderRadius: 6,
              padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            Subscribe Now <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Bot size={18} style={{ color: "#B89C4A" }} />
            <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Agent Status
            </span>
          </div>
          <div style={{
            fontFamily: FFD, fontSize: 22, fontWeight: 700,
            color: primaryAgent?.status === "active" ? "rgba(80,220,150,1)" :
                   primaryAgent?.status === "draft" ? "rgba(200,215,230,0.45)" :
                   primaryAgent?.status === "locked" ? "rgba(255,100,100,0.80)" :
                   "#B89C4A",
          }}>
            {primaryAgent ? (
              primaryAgent.status === "active" ? "Live" :
              primaryAgent.status === "draft" ? "Draft" :
              primaryAgent.status === "paused" ? "Paused" :
              "Locked"
            ) : "No Agent"}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Clock size={18} style={{ color: "#B89C4A" }} />
            <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Minutes Used
            </span>
          </div>
          <div style={{ fontFamily: FFD, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>
            {trialMinutesUsed.toFixed(1)}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <MessageSquare size={18} style={{ color: "#B89C4A" }} />
            <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Conversations
            </span>
          </div>
          <div style={{ fontFamily: FFD, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>
            -
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <TrendingUp size={18} style={{ color: "#B89C4A" }} />
            <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Subscription
            </span>
          </div>
          <div style={{
            fontFamily: FFD, fontSize: 22, fontWeight: 700,
            color: isActive ? "rgba(80,220,150,1)" : "rgba(200,215,230,0.45)",
          }}>
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <h2 style={{
        fontFamily: FFD, fontSize: 16, fontWeight: 700,
        color: "rgba(255,255,255,0.80)", marginBottom: 16,
      }}>
        Quick Actions
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {!primaryAgent && (
          <button
            onClick={() => setLocation("/portal/agent")}
            style={{
              ...cardStyle, cursor: "pointer", textAlign: "left",
              border: "1px solid rgba(184,156,74,0.25)",
              display: "flex", alignItems: "center", gap: 16,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(184,156,74,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Zap size={20} style={{ color: "#B89C4A" }} />
            </div>
            <div>
              <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                Create Your Agent
              </div>
              <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
                Choose a template and customize your AI voice agent
              </div>
            </div>
            <ArrowRight size={16} style={{ color: "rgba(200,215,230,0.35)", marginLeft: "auto" }} />
          </button>
        )}

        {primaryAgent && (
          <>
            <button
              onClick={() => setLocation("/portal/agent")}
              style={{
                ...cardStyle, cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(184,156,74,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Bot size={20} style={{ color: "#B89C4A" }} />
              </div>
              <div>
                <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                  Configure Agent
                </div>
                <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
                  Update personality, knowledge base, and voice
                </div>
              </div>
              <ArrowRight size={16} style={{ color: "rgba(200,215,230,0.35)", marginLeft: "auto" }} />
            </button>

            <button
              onClick={() => setLocation("/portal/conversations")}
              style={{
                ...cardStyle, cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(184,156,74,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <MessageSquare size={20} style={{ color: "#B89C4A" }} />
              </div>
              <div>
                <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                  View Conversations
                </div>
                <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
                  Review transcripts, leads, and caller intelligence
                </div>
              </div>
              <ArrowRight size={16} style={{ color: "rgba(200,215,230,0.35)", marginLeft: "auto" }} />
            </button>

            <button
              onClick={() => setLocation("/portal/embed")}
              style={{
                ...cardStyle, cursor: "pointer", textAlign: "left",
                display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(184,156,74,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Mic size={20} style={{ color: "#B89C4A" }} />
              </div>
              <div>
                <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)" }}>
                  Get Embed Code
                </div>
                <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
                  Add your voice agent to your website
                </div>
              </div>
              <ArrowRight size={16} style={{ color: "rgba(200,215,230,0.35)", marginLeft: "auto" }} />
            </button>
          </>
        )}
      </div>
    </PortalLayout>
  );
}
