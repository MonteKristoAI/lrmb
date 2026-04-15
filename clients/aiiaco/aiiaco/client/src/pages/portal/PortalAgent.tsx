/**
 * PortalAgent - Agent configuration & setup wizard.
 * If no agent exists: show template selection + creation wizard.
 * If agent exists: show configuration panel.
 */

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import { toast } from "sonner";
import {
  Bot, Building2, Landmark, Scale, Hotel, Factory,
  Mic, Save, Loader2, ChevronRight, Sparkles, Check
} from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  real_estate: <Building2 size={24} />,
  mortgage: <Landmark size={24} />,
  law: <Scale size={24} />,
  hospitality: <Hotel size={24} />,
  manufacturing: <Factory size={24} />,
};

const TEMPLATE_LABELS: Record<string, string> = {
  real_estate: "Real Estate",
  mortgage: "Mortgage & Lending",
  law: "Law Firms",
  hospitality: "Hospitality",
  manufacturing: "Manufacturing",
};

const inputStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.88)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 8, padding: "12px 14px", width: "100%",
  outline: "none", boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle, minHeight: 120, resize: "vertical",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 12, fontWeight: 600,
  color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: "0.04em",
};

export default function PortalAgent() {
  const agentsQuery = trpc.vaas.agent.list.useQuery(undefined, { retry: false });
  const voicesQuery = trpc.vaas.catalog.voices.useQuery();

  const agents = agentsQuery.data ?? [];
  const primaryAgent = agents[0];

  if (agentsQuery.isLoading) {
    return (
      <PortalLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <Loader2 size={24} style={{ color: "#B89C4A", animation: "spin 1s linear infinite" }} />
        </div>
      </PortalLayout>
    );
  }

  if (!primaryAgent) {
    return <AgentCreationWizard onCreated={() => agentsQuery.refetch()} />;
  }

  return <AgentConfigPanel agent={primaryAgent} voices={voicesQuery.data ?? []} onUpdated={() => agentsQuery.refetch()} />;
}

// ─── Creation Wizard ──────────────────────────────────────────────────────────

function AgentCreationWizard({ onCreated }: { onCreated: () => void }) {
  const [step, setStep] = useState<"template" | "customize">("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [agentName, setAgentName] = useState("");
  const [personality, setPersonality] = useState("");
  const [firstMessage, setFirstMessage] = useState("");

  const createMutation = trpc.vaas.agent.create.useMutation({
    onSuccess: () => {
      toast.success("Agent created - you can now customize and test it");
      onCreated();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleCreate = () => {
    if (!agentName.trim()) { toast.error("Agent name is required"); return; }
    createMutation.mutate({
      agentName,
      templateType: selectedTemplate as any,
      personality: personality || undefined,
      firstMessage: firstMessage || undefined,
    });
  };

  return (
    <PortalLayout>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "rgba(184,156,74,0.12)",
            border: "1px solid rgba(184,156,74,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={26} style={{ color: "#B89C4A" }} />
          </div>
          <h1 style={{
            fontFamily: FFD, fontSize: 24, fontWeight: 700,
            color: "rgba(255,255,255,0.92)", margin: 0,
          }}>
            Create Your Voice Agent
          </h1>
          <p style={{
            fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)", marginTop: 8,
          }}>
            Choose an industry template and customize it for your business
          </p>
        </div>

        {/* Step 1: Template Selection */}
        {step === "template" && (
          <div>
            <h2 style={{ fontFamily: FFD, fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.80)", marginBottom: 16 }}>
              Select Your Industry
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {Object.entries(TEMPLATE_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  style={{
                    background: selectedTemplate === key ? "rgba(184,156,74,0.12)" : "rgba(8,14,24,0.72)",
                    border: `1px solid ${selectedTemplate === key ? "rgba(184,156,74,0.40)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 12, padding: 20,
                    cursor: "pointer", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: selectedTemplate === key ? "rgba(184,156,74,0.18)" : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: selectedTemplate === key ? "#B89C4A" : "rgba(200,215,230,0.50)",
                  }}>
                    {TEMPLATE_ICONS[key]}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: FF, fontSize: 14, fontWeight: 600,
                      color: selectedTemplate === key ? "#B89C4A" : "rgba(255,255,255,0.80)",
                    }}>
                      {label}
                    </div>
                  </div>
                  {selectedTemplate === key && (
                    <Check size={16} style={{ color: "#B89C4A", marginLeft: "auto" }} />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (selectedTemplate) setStep("customize"); else toast.error("Select a template first"); }}
              disabled={!selectedTemplate}
              style={{
                fontFamily: FF, fontSize: 14, fontWeight: 700,
                color: "#03050A", background: selectedTemplate ? "rgba(184,156,74,0.90)" : "rgba(184,156,74,0.30)",
                border: "none", borderRadius: 8, padding: "13px 28px",
                cursor: selectedTemplate ? "pointer" : "not-allowed",
                width: "100%", marginTop: 20,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Customize */}
        {step === "customize" && (
          <div>
            <button
              onClick={() => setStep("template")}
              style={{
                fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.55)",
                background: "none", border: "none", cursor: "pointer", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              ← Back to templates
            </button>

            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 28,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(184,156,74,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#B89C4A",
                }}>
                  {TEMPLATE_ICONS[selectedTemplate]}
                </div>
                <div>
                  <div style={{ fontFamily: FF, fontSize: 14, fontWeight: 600, color: "#B89C4A" }}>
                    {TEMPLATE_LABELS[selectedTemplate]}
                  </div>
                  <div style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.45)" }}>
                    Customize your agent
                  </div>
                </div>
              </div>

              <label style={labelStyle}>Agent Name *</label>
              <input
                type="text" value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. Sarah - Real Estate Assistant"
                style={{ ...inputStyle, marginBottom: 20 }}
              />

              <label style={labelStyle}>Personality & Instructions</label>
              <textarea
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Describe how your agent should behave, what tone to use, what information to collect from callers..."
                style={{ ...textareaStyle, marginBottom: 20 }}
              />

              <label style={labelStyle}>First Message (Greeting)</label>
              <textarea
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Hi! Thanks for calling [Your Company]. I'm here to help. What can I do for you today?"
                style={{ ...textareaStyle, minHeight: 80, marginBottom: 24 }}
              />

              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                style={{
                  fontFamily: FF, fontSize: 14, fontWeight: 700,
                  color: "#03050A", background: "rgba(184,156,74,0.90)",
                  border: "none", borderRadius: 8, padding: "13px 28px",
                  cursor: createMutation.isPending ? "wait" : "pointer",
                  width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: createMutation.isPending ? 0.7 : 1,
                }}
              >
                {createMutation.isPending ? (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                ) : (
                  <>Create Agent <Sparkles size={16} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </PortalLayout>
  );
}

// ─── Config Panel ─────────────────────────────────────────────────────────────

function AgentConfigPanel({ agent, voices, onUpdated }: {
  agent: any;
  voices: any[];
  onUpdated: () => void;
}) {
  const [agentName, setAgentName] = useState(agent.agentName);
  const [personality, setPersonality] = useState(agent.personality ?? "");
  const [firstMessage, setFirstMessage] = useState(agent.firstMessage ?? "");
  const [voiceId, setVoiceId] = useState(agent.voiceId ?? "");

  const updateMutation = trpc.vaas.agent.update.useMutation({
    onSuccess: () => {
      toast.success("Agent updated");
      onUpdated();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: agent.id,
      agentName: agentName || undefined,
      personality: personality || undefined,
      firstMessage: firstMessage || undefined,
      voiceId: voiceId || undefined,
    });
  };

  return (
    <PortalLayout>
      <div style={{ maxWidth: 700 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(184,156,74,0.12)",
            border: "1px solid rgba(184,156,74,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bot size={24} style={{ color: "#B89C4A" }} />
          </div>
          <div>
            <h1 style={{ fontFamily: FFD, fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
              Agent Configuration
            </h1>
            <p style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.50)", marginTop: 2 }}>
              {TEMPLATE_LABELS[agent.templateType] ?? agent.templateType} template
            </p>
          </div>
          <span style={{
            marginLeft: "auto",
            fontFamily: FF, fontSize: 11, fontWeight: 600,
            color: agent.status === "active" ? "rgba(80,220,150,1)" : "#B89C4A",
            background: agent.status === "active" ? "rgba(80,220,150,0.12)" : "rgba(184,156,74,0.12)",
            border: `1px solid ${agent.status === "active" ? "rgba(80,220,150,0.30)" : "rgba(184,156,74,0.25)"}`,
            borderRadius: 4, padding: "4px 10px",
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            {agent.status}
          </span>
        </div>

        {/* Config form */}
        <div style={{
          background: "rgba(8,14,24,0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 28,
        }}>
          <label style={labelStyle}>Agent Name</label>
          <input
            type="text" value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            style={{ ...inputStyle, marginBottom: 20 }}
          />

          <label style={labelStyle}>Personality & Instructions</label>
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="Describe how your agent should behave..."
            style={{ ...textareaStyle, marginBottom: 20 }}
          />

          <label style={labelStyle}>First Message (Greeting)</label>
          <textarea
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            placeholder="The first thing your agent says when someone calls..."
            style={{ ...textareaStyle, minHeight: 80, marginBottom: 20 }}
          />

          <label style={labelStyle}>Voice</label>
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            style={{
              ...inputStyle, marginBottom: 24, cursor: "pointer",
              appearance: "none",
            }}
          >
            <option value="">Default Voice</option>
            {voices.map((v: any) => (
              <option key={v.voiceId} value={v.voiceId}>
                {v.name} {v.tier === "premium" ? `(Premium - $${(v.monthlyCostCents / 100).toFixed(0)}/mo)` : "(Free)"}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            style={{
              fontFamily: FF, fontSize: 14, fontWeight: 700,
              color: "#03050A", background: "rgba(184,156,74,0.90)",
              border: "none", borderRadius: 8, padding: "13px 28px",
              cursor: updateMutation.isPending ? "wait" : "pointer",
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: updateMutation.isPending ? 0.7 : 1,
            }}
          >
            {updateMutation.isPending ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <>Save Changes <Save size={16} /></>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus { border-color: rgba(184,156,74,0.40) !important; }
      `}</style>
    </PortalLayout>
  );
}
