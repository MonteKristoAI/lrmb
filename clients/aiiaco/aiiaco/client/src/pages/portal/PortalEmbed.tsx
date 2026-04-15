/**
 * PortalEmbed - Embed code, widget customization, live preview, and integration guide.
 */

import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import PortalLayout from "@/components/PortalLayout";
import { toast } from "sonner";
import { Code2, Copy, Check, Loader2, Lock, Palette, Eye, Settings2, Sparkles } from "lucide-react";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const PRESET_COLORS = [
  "#B89C4A", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6",
  "#F59E0B", "#EC4899", "#06B6D4", "#6366F1", "#14B8A6",
];

export default function PortalEmbed() {
  const meQuery = trpc.vaas.auth.me.useQuery(undefined, { retry: false });
  const agentsQuery = trpc.vaas.agent.list.useQuery(undefined, { retry: false });
  const updateAgent = trpc.vaas.agent.update.useMutation({
    onSuccess: () => { agentsQuery.refetch(); toast.success("Widget settings saved"); },
    onError: (e) => toast.error(e.message),
  });

  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<"code" | "customize" | "preview">("code");

  const client = meQuery.data;
  const agents = agentsQuery.data ?? [];
  const primaryAgent = agents[0];
  const isActive = client?.status === "active";

  // Parse existing widget config
  const existingConfig = useMemo(() => {
    if (!primaryAgent?.widgetConfig) return {};
    try { return JSON.parse(primaryAgent.widgetConfig); } catch { return {}; }
  }, [primaryAgent?.widgetConfig]);

  const [primaryColor, setPrimaryColor] = useState(existingConfig.primaryColor || "#B89C4A");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">(existingConfig.position || "bottom-right");
  const [greeting, setGreeting] = useState(existingConfig.greeting || "");
  const [buttonSize, setButtonSize] = useState(existingConfig.buttonSize || 60);

  // Sync when data loads
  useEffect(() => {
    if (existingConfig.primaryColor) setPrimaryColor(existingConfig.primaryColor);
    if (existingConfig.position) setPosition(existingConfig.position);
    if (existingConfig.greeting) setGreeting(existingConfig.greeting);
    if (existingConfig.buttonSize) setButtonSize(existingConfig.buttonSize);
  }, [existingConfig.primaryColor, existingConfig.position, existingConfig.greeting, existingConfig.buttonSize]);

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
    return (
      <PortalLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <Code2 size={40} style={{ color: "rgba(200,215,230,0.25)", marginBottom: 16 }} />
          <h2 style={{ fontFamily: FFD, fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.80)" }}>
            No Agent Yet
          </h2>
          <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)", marginTop: 8 }}>
            Create your voice agent first, then come back here for the embed code.
          </p>
        </div>
      </PortalLayout>
    );
  }

  const embedSnippet = `<!-- AiiACo Voice Agent Widget -->\n<script\n  src="${window.location.origin}/agent/embed.js"\n  data-token="${primaryAgent.embedToken}"\n  async\n></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = () => {
    const config = JSON.stringify({
      primaryColor,
      position,
      greeting: greeting || undefined,
      buttonSize,
    });
    updateAgent.mutate({ id: primaryAgent.id, widgetConfig: config });
  };

  const sectionBtn = (section: typeof activeSection, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActiveSection(section)}
      style={{
        fontFamily: FF, fontSize: 12, fontWeight: 600,
        color: activeSection === section ? "rgba(212,180,80,1)" : "rgba(200,215,230,0.45)",
        background: activeSection === section ? "rgba(184,156,74,0.10)" : "transparent",
        border: activeSection === section ? "1px solid rgba(184,156,74,0.25)" : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8, padding: "10px 18px",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
      }}
    >
      {icon} {label}
    </button>
  );

  return (
    <PortalLayout>
      <div style={{ maxWidth: 800 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: FFD, fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.92)", margin: 0 }}>
            Embed & Integrate
          </h1>
          <p style={{ fontFamily: FF, fontSize: 14, color: "rgba(200,215,230,0.50)", marginTop: 6 }}>
            Add your AI voice agent to your website with a single line of code
          </p>
        </div>

        {/* Lock notice */}
        {!isActive && (
          <div style={{
            background: "rgba(255,180,60,0.06)",
            border: "1px solid rgba(255,180,60,0.20)",
            borderRadius: 12, padding: "16px 20px",
            marginBottom: 24, display: "flex", alignItems: "center", gap: 12,
          }}>
            <Lock size={18} style={{ color: "rgba(255,180,60,0.80)", flexShrink: 0 }} />
            <span style={{ fontFamily: FF, fontSize: 13, color: "rgba(255,180,60,0.80)" }}>
              Activate your subscription to enable the embed widget on your website.
              You can preview the code and customize below.
            </span>
          </div>
        )}

        {/* Section tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {sectionBtn("code", <Code2 size={14} />, "Embed Code")}
          {sectionBtn("customize", <Palette size={14} />, "Customize")}
          {sectionBtn("preview", <Eye size={14} />, "Live Preview")}
        </div>

        {/* ═══ EMBED CODE SECTION ═══ */}
        {activeSection === "code" && (
          <div>
            {/* Embed Token */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{
                fontFamily: FF, fontSize: 12, fontWeight: 600,
                color: "rgba(200,215,230,0.50)", marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                Your Embed Token
              </div>
              <div style={{
                fontFamily: "monospace", fontSize: 13,
                color: "rgba(184,156,74,0.90)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 6, padding: "10px 14px",
                wordBreak: "break-all",
              }}>
                {primaryAgent.embedToken}
              </div>
            </div>

            {/* Code Snippet */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  fontFamily: FF, fontSize: 12, fontWeight: 600,
                  color: "rgba(200,215,230,0.50)",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                }}>
                  Embed Code
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    fontFamily: FF, fontSize: 12, fontWeight: 600,
                    color: copied ? "rgba(80,220,150,1)" : "rgba(200,215,230,0.55)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6, padding: "6px 12px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre style={{
                fontFamily: "monospace", fontSize: 13, lineHeight: 1.6,
                color: "rgba(255,255,255,0.75)",
                background: "rgba(0,0,0,0.30)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: 16,
                overflow: "auto", margin: 0,
              }}>
                {embedSnippet}
              </pre>
            </div>

            {/* Instructions */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24,
            }}>
              <div style={{
                fontFamily: FF, fontSize: 12, fontWeight: 600,
                color: "rgba(200,215,230,0.50)", marginBottom: 16,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                How to Install
              </div>

              {[
                { step: "1", text: "Copy the embed code above" },
                { step: "2", text: "Paste it before the closing </body> tag on your website" },
                { step: "3", text: "The voice agent widget will appear in the bottom-right corner" },
                { step: "4", text: "Visitors can click to start a conversation with your AI agent" },
              ].map((item) => (
                <div key={item.step} style={{
                  display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14,
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: "rgba(184,156,74,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FF, fontSize: 12, fontWeight: 700, color: "#B89C4A",
                    flexShrink: 0,
                  }}>
                    {item.step}
                  </div>
                  <span style={{ fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.70)", lineHeight: 1.5 }}>
                    {item.text}
                  </span>
                </div>
              ))}

              {/* Platform-specific tips */}
              <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
                <p style={{ fontFamily: FF, fontSize: 11, fontWeight: 700, color: "rgba(200,215,230,0.40)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>Platform Tips</p>
                {[
                  { platform: "WordPress", tip: "Add to your theme's footer.php or use a plugin like \"Insert Headers and Footers\"" },
                  { platform: "Shopify", tip: "Go to Online Store \u2192 Themes \u2192 Edit Code \u2192 theme.liquid, paste before </body>" },
                  { platform: "Wix", tip: "Settings \u2192 Custom Code \u2192 Add Custom Code \u2192 Body End" },
                  { platform: "Squarespace", tip: "Settings \u2192 Advanced \u2192 Code Injection \u2192 Footer" },
                  { platform: "Webflow", tip: "Project Settings \u2192 Custom Code \u2192 Footer Code" },
                ].map((item) => (
                  <div key={item.platform} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(184,156,74,0.70)", minWidth: 80 }}>{item.platform}</span>
                    <span style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.50)" }}>{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CUSTOMIZE SECTION ═══ */}
        {activeSection === "customize" && (
          <div>
            {/* Color picker */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Palette size={16} style={{ color: "rgba(184,156,74,0.70)" }} />
                <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Brand Color
                </span>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: color,
                      border: primaryColor === color ? "2px solid white" : "2px solid transparent",
                      cursor: "pointer",
                      boxShadow: primaryColor === color ? `0 0 12px ${color}50` : "none",
                      transition: "all 0.2s ease",
                    }}
                  />
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.40)" }}>Custom:</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{ width: 40, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    fontFamily: "monospace", fontSize: 13,
                    color: "rgba(255,255,255,0.75)",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6, padding: "6px 12px", width: 100,
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Position */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Settings2 size={16} style={{ color: "rgba(184,156,74,0.70)" }} />
                <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Widget Position
                </span>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {(["bottom-right", "bottom-left"] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    style={{
                      fontFamily: FF, fontSize: 13, fontWeight: 600,
                      color: position === pos ? "rgba(255,255,255,0.85)" : "rgba(200,215,230,0.45)",
                      background: position === pos ? "rgba(184,156,74,0.12)" : "rgba(255,255,255,0.03)",
                      border: position === pos ? "1px solid rgba(184,156,74,0.30)" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, padding: "12px 24px",
                      cursor: "pointer", textTransform: "capitalize",
                    }}
                  >
                    {pos.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Greeting */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Sparkles size={16} style={{ color: "rgba(184,156,74,0.70)" }} />
                <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Greeting Message
                </span>
              </div>
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                placeholder={`Hi! I'm ${primaryAgent.agentName}. How can I help you today?`}
                rows={3}
                style={{
                  fontFamily: FF, fontSize: 13, color: "rgba(255,255,255,0.75)",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "12px 14px",
                  width: "100%", resize: "vertical", outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <p style={{ fontFamily: FF, fontSize: 11, color: "rgba(200,215,230,0.30)", marginTop: 8 }}>
                Shown in the widget panel before the visitor starts a conversation. Leave blank for default.
              </p>
            </div>

            {/* Button size */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Settings2 size={16} style={{ color: "rgba(184,156,74,0.70)" }} />
                <span style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.50)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Button Size
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <input
                  type="range"
                  min={44}
                  max={80}
                  value={buttonSize}
                  onChange={(e) => setButtonSize(Number(e.target.value))}
                  style={{ flex: 1, accentColor: primaryColor }}
                />
                <span style={{ fontFamily: "monospace", fontSize: 13, color: "rgba(200,215,230,0.55)", minWidth: 40 }}>{buttonSize}px</span>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveConfig}
              disabled={updateAgent.isPending}
              style={{
                fontFamily: FF, fontSize: 14, fontWeight: 700,
                color: "#03050A",
                background: "rgba(184,156,74,0.90)",
                border: "none", borderRadius: 10,
                padding: "13px 32px", cursor: "pointer",
                opacity: updateAgent.isPending ? 0.6 : 1,
                width: "100%",
              }}
            >
              {updateAgent.isPending ? "Saving..." : "Save Widget Settings"}
            </button>
          </div>
        )}

        {/* ═══ LIVE PREVIEW SECTION ═══ */}
        {activeSection === "preview" && (
          <div>
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24, marginBottom: 20,
            }}>
              <div style={{
                fontFamily: FF, fontSize: 12, fontWeight: 600,
                color: "rgba(200,215,230,0.50)", marginBottom: 16,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                Widget Preview
              </div>

              {/* Mock website */}
              <div style={{
                position: "relative",
                background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                borderRadius: 12, height: 420,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
              }}>
                {/* Fake browser chrome */}
                <div style={{
                  background: "#dee2e6", padding: "8px 16px",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff6b6b" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffd93d" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#6bcb77" }} />
                  </div>
                  <div style={{
                    flex: 1, background: "white", borderRadius: 4, padding: "4px 12px",
                    fontFamily: FF, fontSize: 11, color: "#868e96",
                  }}>
                    {client?.websiteUrl || "https://yourwebsite.com"}
                  </div>
                </div>

                {/* Fake page content */}
                <div style={{ padding: "32px 24px" }}>
                  <div style={{ width: "60%", height: 20, background: "#dee2e6", borderRadius: 4, marginBottom: 12 }} />
                  <div style={{ width: "80%", height: 12, background: "#e9ecef", borderRadius: 3, marginBottom: 8 }} />
                  <div style={{ width: "70%", height: 12, background: "#e9ecef", borderRadius: 3, marginBottom: 8 }} />
                  <div style={{ width: "75%", height: 12, background: "#e9ecef", borderRadius: 3, marginBottom: 24 }} />
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ width: "30%", height: 100, background: "#dee2e6", borderRadius: 8 }} />
                    <div style={{ width: "30%", height: 100, background: "#dee2e6", borderRadius: 8 }} />
                    <div style={{ width: "30%", height: 100, background: "#dee2e6", borderRadius: 8 }} />
                  </div>
                </div>

                {/* Widget button preview */}
                <div style={{
                  position: "absolute",
                  [position === "bottom-left" ? "left" : "right"]: 20,
                  bottom: 20,
                }}>
                  {/* Floating button */}
                  <div style={{
                    width: buttonSize, height: buttonSize,
                    borderRadius: "50%",
                    background: primaryColor,
                    boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 0 ${primaryColor}40`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    animation: "aiiaco-preview-pulse 2.5s ease-in-out infinite",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </div>
                </div>
              </div>

              <p style={{ fontFamily: FF, fontSize: 11, color: "rgba(200,215,230,0.30)", marginTop: 12, textAlign: "center" }}>
                This is how the widget button will appear on your website. Click "Customize" to change colors, position, and greeting.
              </p>
            </div>

            {/* Agent info card */}
            <div style={{
              background: "rgba(8,14,24,0.72)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: 24,
            }}>
              <div style={{
                fontFamily: FF, fontSize: 12, fontWeight: 600,
                color: "rgba(200,215,230,0.50)", marginBottom: 16,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                Agent Details
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Agent Name", value: primaryAgent.agentName },
                  { label: "Template", value: primaryAgent.templateType.replace("_", " ") },
                  { label: "Voice Tier", value: primaryAgent.voiceTier },
                  { label: "Status", value: primaryAgent.status },
                  { label: "Color", value: primaryColor },
                  { label: "Position", value: position.replace("-", " ") },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontFamily: FF, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,215,230,0.30)", margin: "0 0 4px" }}>{item.label}</p>
                    <p style={{ fontFamily: FF, fontSize: 13, color: "rgba(255,255,255,0.70)", margin: 0, textTransform: "capitalize" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes aiiaco-preview-pulse { 0%, 100% { box-shadow: 0 4px 24px rgba(0,0,0,0.25), 0 0 0 0 rgba(184,156,74,0.40); } 50% { box-shadow: 0 4px 24px rgba(0,0,0,0.25), 0 0 0 12px rgba(184,156,74,0); } }
      `}</style>
    </PortalLayout>
  );
}
