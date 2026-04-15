/**
 * PortalConversations - View all conversations from the client's agent.
 * Shows list of conversations with caller info, duration, and transcript.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import {
  MessageSquare, User, Clock, Mail, Phone, ChevronDown,
  ChevronUp, Loader2, Inbox
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export default function PortalConversations() {
  const conversationsQuery = trpc.vaas.conversation.all.useQuery(undefined, { retry: false });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const conversations = conversationsQuery.data ?? [];

  return (
    <PortalLayout>
      <div style={{ maxWidth: 800 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: FFD, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
            Conversations
          </h1>
          <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)", marginTop: 6 }}>
            Review all interactions with your voice agent
          </p>
        </div>

        {conversationsQuery.isLoading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
            <Loader2 size={24} style={{ color: "#B89C4A", animation: "spin 1s linear infinite" }} />
          </div>
        )}

        {!conversationsQuery.isLoading && conversations.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Inbox size={40} style={{ color: "rgba(200,215,230,0.25)", marginBottom: 16 }} />
            <h2 style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.80)" }}>
              No Conversations Yet
            </h2>
            <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)", marginTop: 8 }}>
              Conversations will appear here once visitors interact with your agent.
            </p>
          </div>
        )}

        {/* Conversation list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {conversations.map((conv: any) => {
            const isExpanded = expandedId === conv.id;
            const duration = conv.durationSeconds ? `${Math.floor(conv.durationSeconds / 60)}m ${conv.durationSeconds % 60}s` : "-";

            return (
              <div key={conv.id} style={{
                background: "rgba(8,14,24,0.72)",
                border: `1px solid ${isExpanded ? "rgba(184,156,74,0.25)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14, overflow: "hidden",
                transition: "border-color 0.15s ease",
              }}>
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : conv.id)}
                  style={{
                    width: "100%", padding: "16px 20px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 14,
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "rgba(184,156,74,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <User size={18} style={{ color: "#B89C4A" }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: FF, fontSize: 14, fontWeight: 600,
                      color: "rgba(255,255,255,0.88)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {conv.callerName || "Unknown Caller"}
                    </div>
                    <div style={{
                      fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.45)",
                      marginTop: 2, display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} /> {duration}
                      </span>
                      {conv.callerEmail && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={11} /> {conv.callerEmail}
                        </span>
                      )}
                      {conv.callerPhone && (
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Phone size={11} /> {conv.callerPhone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    fontFamily: FF, fontSize: 11, color: "rgba(200,215,230,0.40)",
                    marginRight: 8,
                  }}>
                    {new Date(conv.createdAt).toLocaleDateString()}
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={16} style={{ color: "rgba(200,215,230,0.35)" }} />
                  ) : (
                    <ChevronDown size={16} style={{ color: "rgba(200,215,230,0.35)" }} />
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{
                    padding: "0 20px 20px",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    {/* Intelligence summary */}
                    {conv.intelligenceSummary && (
                      <div style={{
                        background: "rgba(184,156,74,0.06)",
                        border: "1px solid rgba(184,156,74,0.15)",
                        borderRadius: 8, padding: 14, marginTop: 14, marginBottom: 14,
                      }}>
                        <div style={{
                          fontFamily: FF, fontSize: 11, fontWeight: 600,
                          color: "#B89C4A", textTransform: "uppercase",
                          letterSpacing: "0.04em", marginBottom: 6,
                        }}>
                          AI Summary
                        </div>
                        <div style={{
                          fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.70)",
                          lineHeight: 1.6,
                        }}>
                          {conv.intelligenceSummary}
                        </div>
                      </div>
                    )}

                    {/* Transcript */}
                    <div style={{
                      fontFamily: FF, fontSize: 11, fontWeight: 600,
                      color: "rgba(200,215,230,0.40)", textTransform: "uppercase",
                      letterSpacing: "0.04em", marginTop: 14, marginBottom: 8,
                    }}>
                      Transcript
                    </div>
                    <div style={{
                      fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.60)",
                      lineHeight: 1.7, maxHeight: 300, overflow: "auto",
                      background: "rgba(0,0,0,0.20)",
                      borderRadius: 8, padding: 14,
                      whiteSpace: "pre-wrap",
                    }}>
                      {conv.transcript || "No transcript available"}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </PortalLayout>
  );
}
