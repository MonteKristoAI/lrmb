/**
 * Admin - AI Agent & Health Monitor
 *
 * Redesigned as a corporate intelligence diagnostic service dashboard.
 * Shows: health vitals across the full AiiA chain, agent config editor,
 * and positions this as a service AiiACo offers to clients.
 */
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2, Bot, CheckCircle2, AlertCircle, RefreshCw, Phone,
  Shield, Activity, Zap, Database, Mail, Brain, Bell,
  ChevronDown, ChevronUp, Globe, Mic, Building2, ArrowRight,
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

// ─── Health Vitals Panel ─────────────────────────────────────────────────────

function HealthVitals() {
  const { data: health, isLoading, refetch, isFetching } = trpc.health.check.useQuery(undefined, {
    refetchInterval: 60000, // auto-check every 60 seconds
    staleTime: 30000,
  });

  const statusIcon = (status: string) => {
    if (status === "healthy") return <CheckCircle2 size={16} style={{ color: "#4ade80" }} />;
    if (status === "degraded") return <AlertCircle size={16} style={{ color: "#fbbf24" }} />;
    return <AlertCircle size={16} style={{ color: "#f87171" }} />;
  };

  const vitalIcon = (name: string) => {
    if (name.includes("Agent")) return <Mic size={14} style={{ color: "#B89C4A" }} />;
    if (name.includes("Webhook")) return <Zap size={14} style={{ color: "#B89C4A" }} />;
    if (name.includes("Database")) return <Database size={14} style={{ color: "#B89C4A" }} />;
    if (name.includes("Email")) return <Mail size={14} style={{ color: "#B89C4A" }} />;
    if (name.includes("LLM")) return <Brain size={14} style={{ color: "#B89C4A" }} />;
    if (name.includes("Notification")) return <Bell size={14} style={{ color: "#B89C4A" }} />;
    return <Activity size={14} style={{ color: "#B89C4A" }} />;
  };

  const statusColor = (status: string) => {
    if (status === "healthy") return { bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.20)", text: "#4ade80" };
    if (status === "degraded") return { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.20)", text: "#fbbf24" };
    return { bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.20)", text: "#f87171" };
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <Loader2 className="animate-spin" size={24} style={{ color: "#B89C4A" }} />
        <span style={{ marginLeft: "10px", fontSize: "13px", color: "rgba(200,215,230,0.55)" }}>Running health checks across the diagnostic chain…</span>
      </div>
    );
  }

  const overall = health?.overall ?? "down";
  const score = health?.score ?? 0;
  const vitals = health?.vitals ?? [];
  const oc = statusColor(overall);

  return (
    <div style={{ marginBottom: "32px" }}>
      {/* Overall health bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: oc.bg, border: `1px solid ${oc.border}`, borderRadius: "12px",
        padding: "16px 20px", marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Shield size={22} style={{ color: oc.text }} />
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#F0F4F8" }}>
              Diagnostic Chain: {overall === "healthy" ? "All Systems Operational" : overall === "degraded" ? "Partially Degraded" : "Systems Down"}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(200,215,230,0.50)", marginTop: "2px" }}>
              Health Score: {score}/100 · Last checked: {health?.checkedAt ? new Date(health.checkedAt).toLocaleTimeString() : "-"}
              {health?.alertsSent && <span style={{ color: "#f87171", marginLeft: "8px" }}>⚠ Alerts sent to owner</span>}
            </div>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            fontFamily: FF, fontSize: "12px", fontWeight: 600, color: "#B89C4A",
            background: "rgba(184,156,74,0.10)", border: "1px solid rgba(184,156,74,0.25)",
            borderRadius: "8px", padding: "6px 14px", cursor: isFetching ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "6px",
          }}
        >
          <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? "Checking…" : "Re-check"}
        </button>
      </div>

      {/* Individual vitals grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
        {vitals.map((v: any) => {
          const vc = statusColor(v.status);
          return (
            <div key={v.name} style={{
              background: "rgba(255,255,255,0.02)", border: `1px solid ${vc.border}`,
              borderRadius: "10px", padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {vitalIcon(v.name)}
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#F0F4F8" }}>{v.name}</span>
                </div>
                {statusIcon(v.status)}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(200,215,230,0.55)", lineHeight: 1.5 }}>
                {v.details}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(200,215,230,0.30)", marginTop: "6px" }}>
                {v.latencyMs}ms
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Service Offering Banner ─────────────────────────────────────────────────

function ServiceOfferingBanner() {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(184,156,74,0.08) 0%, rgba(184,156,74,0.02) 100%)",
      border: "1px solid rgba(184,156,74,0.18)",
      borderRadius: "14px",
      padding: "28px 28px",
      marginBottom: "32px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: "rgba(184,156,74,0.15)", border: "1px solid rgba(184,156,74,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Building2 size={24} style={{ color: "#D4A843" }} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#F0F4F8", margin: "0 0 8px" }}>
            Corporate Intelligence Diagnostic Service
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(200,215,230,0.65)", margin: "0 0 16px", lineHeight: 1.7 }}>
            What you're looking at is the same system AiiACo deploys for enterprise clients. A voice-powered AI diagnostic agent that captures leads, runs intelligent conversations, extracts business intelligence, and feeds everything into a real-time admin console. This is a service we build and manage for companies across industries.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
            {[
              { icon: <Mic size={15} />, label: "Voice AI Agent", desc: "Custom-trained on your business" },
              { icon: <Brain size={15} />, label: "Intelligence Extraction", desc: "Pain points, wants, solutions" },
              { icon: <Database size={15} />, label: "Lead Pipeline", desc: "Auto-qualified and routed" },
              { icon: <Mail size={15} />, label: "Automated Follow-up", desc: "Emails, notifications, CRM sync" },
              { icon: <Activity size={15} />, label: "Health Monitoring", desc: "24/7 chain-wide diagnostics" },
              { icon: <Globe size={15} />, label: "Website Integration", desc: "Embeddable voice widget" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "10px 12px",
              }}>
                <span style={{ color: "#B89C4A", marginTop: "1px" }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(200,215,230,0.85)" }}>{item.label}</div>
                  <div style={{ fontSize: "11px", color: "rgba(200,215,230,0.45)" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "13px", color: "rgba(200,215,230,0.50)", margin: 0, fontStyle: "italic" }}>
            Example: A property management firm could have one that books everything with voice - property tours, maintenance, tenant communications - all through a single AI agent that knows their entire operation.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── VaaS Platform Quick Stats ──────────────────────────────────────────────

function VaaSQuickStats() {
  const { data: clients } = trpc.leads.vaasClients.useQuery(undefined, { staleTime: 60000 });
  const { data: agents } = trpc.leads.vaasAgents.useQuery(undefined, { staleTime: 60000 });

  const totalClients = clients?.length ?? 0;
  const activeClients = clients?.filter((c: any) => c.status === "active").length ?? 0;
  const trialClients = clients?.filter((c: any) => c.status === "trial").length ?? 0;
  const totalAgents = agents?.length ?? 0;
  const activeAgents = agents?.filter((a: any) => a.status === "active").length ?? 0;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "14px", padding: "24px 28px", marginBottom: "32px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Globe size={18} style={{ color: "#B89C4A" }} />
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#F0F4F8", margin: 0 }}>VaaS Platform</h3>
        </div>
        <a href="/admin" style={{
          fontSize: "12px", fontWeight: 600, color: "rgba(184,156,74,0.70)",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px",
        }}>
          Full Dashboard <ArrowRight size={12} />
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
        {[
          { label: "Total Clients", value: totalClients, color: "#B89C4A" },
          { label: "Active", value: activeClients, color: "#4ade80" },
          { label: "In Trial", value: trialClients, color: "#fbbf24" },
          { label: "Total Agents", value: totalAgents, color: "#B89C4A" },
          { label: "Live Agents", value: activeAgents, color: "#4ade80" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "rgba(255,255,255,0.02)", borderRadius: "10px", padding: "14px 16px",
            border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: stat.color, marginBottom: "4px" }}>{stat.value}</div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Agent Config Editor ─────────────────────────────────────────────────────

function AgentConfigEditor() {
  const { data: config, isLoading, refetch } = trpc.agent.getConfig.useQuery();
  const [systemPrompt, setSystemPrompt] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(
    typeof window !== "undefined" ? `${window.location.origin}/api/webhooks/elevenlabs` : ""
  );

  useEffect(() => {
    if (config) {
      setSystemPrompt(config.systemPrompt);
      setFirstMessage(config.firstMessage);
      setIsDirty(false);
    }
  }, [config]);

  const updateMutation = trpc.agent.updateConfig.useMutation({
    onSuccess: () => {
      toast.success("Agent updated - system prompt pushed to ElevenLabs.");
      setIsDirty(false);
      refetch();
    },
    onError: (err) => toast.error(`Update failed: ${err.message}`),
  });

  const createMutation = trpc.agent.createAgent.useMutation({
    onSuccess: (data) => {
      toast.success(`Agent created! ID: ${data.agentId} - add as ELEVENLABS_AGENT_ID in Secrets.`, { duration: 15000 });
      refetch();
    },
    onError: (err) => toast.error(`Create failed: ${err.message}`),
  });

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
        <Loader2 className="animate-spin" size={24} style={{ color: "#B89C4A" }} />
      </div>
    );
  }

  const isLive = config?.isLive ?? false;
  const agentId = config?.agentId;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px",
      overflow: "hidden",
    }}>
      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          fontFamily: FF, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", background: "transparent", border: "none", cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Bot size={20} style={{ color: "#B89C4A" }} />
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#F0F4F8" }}>Agent Configuration</span>
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
            color: isLive ? "#4ade80" : "#f87171",
            background: isLive ? "rgba(74,222,128,0.10)" : "rgba(248,113,113,0.10)",
            border: `1px solid ${isLive ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
            borderRadius: "20px", padding: "3px 10px",
          }}>
            {isLive ? "● Live" : "○ Not configured"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {agentId && (
            <span style={{ fontSize: "12px", color: "rgba(200,215,230,0.35)" }}>
              {agentId.slice(0, 12)}…
            </span>
          )}
          {isExpanded ? <ChevronUp size={18} style={{ color: "rgba(200,215,230,0.50)" }} /> : <ChevronDown size={18} style={{ color: "rgba(200,215,230,0.50)" }} />}
        </div>
      </button>

      {isExpanded && (
        <div style={{ padding: "0 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {/* Status info */}
          <div style={{ padding: "16px 0 20px", fontSize: "13px", color: "rgba(200,215,230,0.55)" }}>
            {isLive ? (
              <span>
                Agent ID: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>{agentId}</code>
                {" · "}Phone: <strong style={{ color: "#D4A843" }}>+1 (888) 808-0001</strong>
                {" · "}Webhook: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>/api/webhooks/elevenlabs</code>
              </span>
            ) : (
              <div>
                <p style={{ margin: "0 0 12px" }}>Agent not yet created. Click "Create Agent" to provision in ElevenLabs.</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="Webhook URL"
                    style={{
                      fontFamily: FF, fontSize: "13px", color: "#F0F4F8",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px", padding: "9px 14px", width: "360px", maxWidth: "100%", outline: "none",
                    }}
                  />
                  <button
                    onClick={() => { if (webhookUrl.trim()) createMutation.mutate({ webhookUrl }); }}
                    disabled={createMutation.isPending}
                    style={{
                      fontFamily: FF, fontSize: "13px", fontWeight: 700, color: "#03050A",
                      background: createMutation.isPending ? "rgba(184,156,74,0.5)" : "#B89C4A",
                      border: "none", borderRadius: "8px", padding: "9px 18px",
                      cursor: createMutation.isPending ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: "6px",
                    }}
                  >
                    {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                    Create Agent
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* System prompt editor */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "rgba(200,215,230,0.65)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                System Prompt
              </label>
              <span style={{ fontSize: "11px", color: "rgba(200,215,230,0.30)" }}>
                {systemPrompt.length.toLocaleString()} chars
              </span>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => { setSystemPrompt(e.target.value); setIsDirty(true); }}
              rows={16}
              style={{
                fontFamily: "ui-monospace, 'SF Mono', 'Fira Code', monospace",
                fontSize: "12px", lineHeight: 1.6, color: "rgba(200,215,230,0.90)",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "10px", padding: "14px", width: "100%", resize: "vertical",
                outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(184,156,74,0.35)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
            />
          </div>

          {/* First message editor */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: "rgba(200,215,230,0.65)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              First Message
            </label>
            <textarea
              value={firstMessage}
              onChange={(e) => { setFirstMessage(e.target.value); setIsDirty(true); }}
              rows={3}
              style={{
                fontFamily: FF, fontSize: "13px", lineHeight: 1.6, color: "rgba(200,215,230,0.90)",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "10px", padding: "14px 16px", width: "100%", resize: "vertical",
                outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(184,156,74,0.35)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
            />
          </div>

          {/* Save button */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button
              onClick={() => { if (systemPrompt.trim() && firstMessage.trim()) updateMutation.mutate({ systemPrompt, firstMessage }); }}
              disabled={!isDirty || updateMutation.isPending || !isLive}
              style={{
                fontFamily: FF, fontSize: "13px", fontWeight: 700, color: "#03050A",
                background: (!isDirty || !isLive) ? "rgba(184,156,74,0.35)" : "#B89C4A",
                border: "none", borderRadius: "10px", padding: "10px 22px",
                cursor: (!isDirty || !isLive) ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "8px", transition: "background 0.15s",
              }}
            >
              {updateMutation.isPending
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : <><RefreshCw size={14} /> Push to ElevenLabs</>
              }
            </button>
            {isDirty && isLive && (
              <span style={{ fontSize: "12px", color: "rgba(184,156,74,0.70)" }}>Unsaved changes</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Diagnostic Chain Diagram ────────────────────────────────────────────────

function DiagnosticChainDiagram() {
  const steps = [
    { icon: <Globe size={16} />, label: "Visitor clicks widget", sub: "aiiaco.com" },
    { icon: <Mic size={16} />, label: "AiiA voice agent", sub: "ElevenLabs" },
    { icon: <Brain size={16} />, label: "Diagnostic conversation", sub: "4-phase flow" },
    { icon: <Zap size={16} />, label: "Post-call webhook", sub: "Transcript capture" },
    { icon: <Brain size={16} />, label: "Intelligence extraction", sub: "LLM analysis" },
    { icon: <Database size={16} />, label: "Lead created", sub: "Pipeline entry" },
    { icon: <Mail size={16} />, label: "Emails sent", sub: "Caller + Admin" },
    { icon: <Bell size={16} />, label: "Owner notified", sub: "Full intelligence" },
  ];

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px",
      padding: "20px 24px",
      marginBottom: "32px",
    }}>
      <h3 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(200,215,230,0.65)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>
        Diagnostic Chain - End to End
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              padding: "10px 12px", borderRadius: "10px",
              background: "rgba(184,156,74,0.05)", border: "1px solid rgba(184,156,74,0.12)",
              minWidth: "85px",
            }}>
              <span style={{ color: "#B89C4A" }}>{step.icon}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(200,215,230,0.80)", textAlign: "center", lineHeight: 1.3 }}>{step.label}</span>
              <span style={{ fontSize: "10px", color: "rgba(200,215,230,0.35)", textAlign: "center" }}>{step.sub}</span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight size={14} style={{ color: "rgba(184,156,74,0.35)", flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminAgentPage() {
  return (
    <div style={{ fontFamily: FF, maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <Bot size={24} style={{ color: "#B89C4A" }} />
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#F0F4F8", margin: 0 }}>
            AiiA Diagnostic Intelligence
          </h1>
        </div>
        <p style={{ fontSize: "14px", color: "rgba(200,215,230,0.55)", margin: 0, lineHeight: 1.6 }}>
          Voice-powered corporate intelligence diagnostic system. Monitors the full chain from golden microphone click through diagnostic completion, email delivery, and admin propagation.
        </p>
      </div>

      {/* Service offering banner */}
      <ServiceOfferingBanner />

      {/* VaaS Platform Quick Stats */}
      <VaaSQuickStats />

      {/* Health vitals */}
      <HealthVitals />

      {/* Diagnostic chain diagram */}
      <DiagnosticChainDiagram />

      {/* Agent config editor (collapsible) */}
      <AgentConfigEditor />
    </div>
  );
}
