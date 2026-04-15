/**
 * /demo - Voice Agent Setup Wizard
 *
 * Multi-step conversion funnel:
 *   Step 1: Showcase (what you get)
 *   Step 2: Create Account (minimal fields)
 *   Step 3: Choose Your Industry (template selection)
 *   Step 4: Customize Your Agent (name, personality, voice)
 *   Step 5: Try It Free (15-min live trial)
 *   Step 6: Activate (payment gate)
 *
 * Design principle: ONE thing at a time. Always obvious what to do next.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { setClientToken, getClientToken, clearClientToken } from "@/lib/clientToken";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/seo/SEO";
import { CALENDLY_URL, DIRECT_DIAL, DIRECT_DIAL_TEL } from "@/const";
import {
  Mic, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2,
  Building2, Briefcase, Scale, Hotel, Factory, Check,
  Sparkles, Play, Lock, ChevronRight, Phone, Volume2,
  Crown, Star,
} from "lucide-react";

const sf = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const sfd = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

const gold = "rgba(184,156,74,0.90)";
const goldDim = "rgba(184,156,74,0.55)";
const goldBg = "rgba(184,156,74,0.06)";
const goldBorder = "rgba(184,156,74,0.18)";
const textPrimary = "rgba(255,255,255,0.92)";
const textSecondary = "rgba(200,215,230,0.55)";
const textMuted = "rgba(200,215,230,0.38)";

/* ─── Template data ─── */
const TEMPLATES = [
  { key: "real_estate", label: "Real Estate", icon: <Building2 size={28} />, desc: "Qualify buyers, book viewings, capture investment preferences" },
  { key: "mortgage", label: "Mortgage & Lending", icon: <Briefcase size={28} />, desc: "Capture loan requirements, pre-qualify borrowers, route to officers" },
  { key: "law", label: "Law Firms", icon: <Scale size={28} />, desc: "Capture case details, assess urgency, schedule consultations" },
  { key: "hospitality", label: "Hospitality", icon: <Hotel size={28} />, desc: "Handle bookings, capture guest preferences, route VIP requests" },
  { key: "manufacturing", label: "Manufacturing", icon: <Factory size={28} />, desc: "Qualify leads, capture specifications, route technical inquiries" },
] as const;

type TemplateKey = typeof TEMPLATES[number]["key"];

/* ─── Step indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginBottom: "40px" }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: isActive ? 32 : 10,
              height: 10,
              borderRadius: 5,
              background: isDone ? "rgba(184,156,74,0.70)" : isActive ? gold : "rgba(255,255,255,0.10)",
              transition: "all 0.3s ease",
            }} />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Shared input style ─── */
const inputStyle: React.CSSProperties = {
  fontFamily: sf, fontSize: 15, color: "rgba(255,255,255,0.88)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 10, padding: "14px 16px", width: "100%",
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.15s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: sf, fontSize: 12, fontWeight: 600,
  color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6,
};

/* ─── Step 1: Showcase ─── */
function StepShowcase({ onNext }: { onNext: () => void }) {
  const RESULTS = [
    { headline: "Sounds Like Your Best Employee", body: "A voice that reads the room - calm when someone's frustrated, warm when they're interested. Your visitors won't know it's AI.", accent: gold, bg: goldBg, border: goldBorder },
    { headline: "Responds Before They Lose Interest", body: "Sub-second response time. No awkward pauses. The conversation flows naturally - because to the caller, it is.", accent: "rgba(120,200,255,0.80)", bg: "rgba(120,200,255,0.06)", border: "rgba(120,200,255,0.18)" },
    { headline: "Captures Everything. Misses Nothing.", body: "Every conversation is transcribed, analyzed, and turned into actionable intelligence. Your team gets a full brief before they pick up the phone.", accent: "rgba(100,220,160,0.80)", bg: "rgba(100,220,160,0.06)", border: "rgba(100,220,160,0.18)" },
    { headline: "Follows Up While You Sleep", body: "After every call, your prospect gets a personalized email. Your team gets a full brief. No manual work. The pipeline fills itself.", accent: "rgba(200,160,255,0.80)", bg: "rgba(200,160,255,0.06)", border: "rgba(200,160,255,0.18)" },
  ];

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "100px 24px 60px", textAlign: "center", position: "relative" }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "600px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(184,156,74,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontFamily: sf, fontSize: "10px", fontWeight: 800, letterSpacing: "0.20em", textTransform: "uppercase", color: goldDim, marginBottom: "20px" }}>
            Voice Agent as a Service
          </p>
          <h1 style={{ fontFamily: sfd, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.1, color: textPrimary, margin: "0 0 24px" }}>
            Your Website's Most
            <br />
            <span style={{ color: gold }}>Intelligent Employee</span>
          </h1>
          <p style={{ fontFamily: sf, fontSize: "17px", lineHeight: 1.7, color: textSecondary, maxWidth: "600px", margin: "0 auto 40px" }}>
            We build voice agents that live on your website, have real conversations with
            your visitors, and turn every interaction into a qualified lead.
          </p>
          <button
            onClick={onNext}
            className="btn-gold"
            style={{ fontSize: "14px", padding: "16px 40px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px" }}
          >
            Build Yours Free <ArrowRight size={18} />
          </button>
          <p style={{ fontFamily: sf, fontSize: "12px", color: textMuted, marginTop: "14px" }}>
            15 minutes free - no credit card required
          </p>
        </div>
      </section>

      {/* Results grid */}
      <section style={{ padding: "40px 24px 60px", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, min(100%, 460px))", gap: "14px", justifyContent: "center" }}>
          {RESULTS.map((r) => (
            <div key={r.headline} style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: "12px", padding: "24px 22px" }}>
              <h3 style={{ fontFamily: sfd, fontSize: "16px", fontWeight: 800, color: r.accent, margin: "0 0 10px" }}>{r.headline}</h3>
              <p style={{ fontFamily: sf, fontSize: "14px", lineHeight: 1.7, color: "rgba(200,215,230,0.60)", margin: 0 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "40px 24px 80px", textAlign: "center" }}>
        <button
          onClick={onNext}
          className="btn-gold"
          style={{ fontSize: "14px", padding: "16px 40px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px" }}
        >
          Get Started - It's Free <ArrowRight size={18} />
        </button>
      </section>
    </>
  );
}

/* ─── Step 2: Create Account ─── */
function StepAccount({ onNext, onBack }: { onNext: (token: string) => void; onBack: () => void }) {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signupMutation = trpc.vaas.auth.signup.useMutation({
    onSuccess: (data) => {
      setClientToken(data.token);
      toast.success("Account created");
      onNext(data.token);
    },
    onError: (err) => toast.error(err.message),
  });

  const loginMutation = trpc.vaas.auth.login.useMutation({
    onSuccess: (data) => {
      setClientToken(data.token);
      toast.success("Welcome back");
      onNext(data.token);
    },
    onError: (err) => toast.error(err.message),
  });

  const isLoading = signupMutation.isPending || loginMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (!companyName.trim()) { toast.error("Company name is required"); return; }
      if (!contactName.trim()) { toast.error("Your name is required"); return; }
      signupMutation.mutate({ email, password, companyName, contactName });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <section style={{ padding: "80px 24px", maxWidth: "440px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
          background: "rgba(184,156,74,0.12)", border: "1px solid rgba(184,156,74,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Mic size={26} style={{ color: "#B89C4A" }} />
        </div>
        <h2 style={{ fontFamily: sfd, fontSize: "24px", fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>
          {mode === "signup" ? "Create Your Account" : "Welcome Back"}
        </h2>
        <p style={{ fontFamily: sf, fontSize: "14px", color: textSecondary, margin: 0 }}>
          {mode === "signup" ? "Takes 30 seconds. No credit card needed." : "Sign in to continue building your agent."}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: "rgba(8,14,24,0.72)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: "28px",
      }}>
        {mode === "signup" && (
          <>
            <label style={labelStyle}>Your Name *</label>
            <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)}
              placeholder="Jane Smith" style={{ ...inputStyle, marginBottom: 16 }} required />

            <label style={labelStyle}>Company Name *</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp" style={{ ...inputStyle, marginBottom: 16 }} required />
          </>
        )}

        <label style={labelStyle}>Email *</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com" style={{ ...inputStyle, marginBottom: 16 }} required />

        <label style={labelStyle}>Password *</label>
        <div style={{ position: "relative", marginBottom: 24 }}>
          <input type={showPassword ? "text" : "password"} value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters" style={{ ...inputStyle, paddingRight: 44 }}
            required minLength={8} />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(200,215,230,0.40)", cursor: "pointer", padding: 0 }}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button type="submit" disabled={isLoading} style={{
          fontFamily: sf, fontSize: 14, fontWeight: 700, color: "#03050A",
          background: isLoading ? "rgba(184,156,74,0.5)" : gold,
          border: "none", borderRadius: 10, padding: "14px 28px",
          cursor: isLoading ? "wait" : "pointer", width: "100%",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.15s ease",
        }}>
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : (
            <>{mode === "signup" ? "Create Account" : "Sign In"} <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          style={{ fontFamily: sf, fontSize: 13, color: goldDim, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
          {mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </div>

      {/* Back */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 13, color: textMuted, background: "none", border: "none",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    </section>
  );
}

/* ─── Step 3: Choose Industry ─── */
function StepTemplate({ onNext, onBack }: { onNext: (template: TemplateKey) => void; onBack: () => void }) {
  const [selected, setSelected] = useState<TemplateKey | null>(null);

  return (
    <section style={{ padding: "80px 24px", maxWidth: "640px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 style={{ fontFamily: sfd, fontSize: "24px", fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>
          What Industry Are You In?
        </h2>
        <p style={{ fontFamily: sf, fontSize: "14px", color: textSecondary, margin: 0 }}>
          We'll pre-configure your agent with industry-specific intelligence.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
        {TEMPLATES.map((t) => {
          const isSelected = selected === t.key;
          return (
            <button key={t.key} onClick={() => setSelected(t.key)}
              style={{
                fontFamily: sf, textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "16px",
                padding: "18px 20px", borderRadius: 14,
                background: isSelected ? "rgba(184,156,74,0.08)" : "rgba(255,255,255,0.02)",
                border: `2px solid ${isSelected ? "rgba(184,156,74,0.50)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.2s ease",
              }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: isSelected ? "rgba(184,156,74,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${isSelected ? "rgba(184,156,74,0.30)" : "rgba(255,255,255,0.08)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: isSelected ? "#D4A843" : "rgba(200,215,230,0.50)",
                transition: "all 0.2s ease",
              }}>
                {t.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: isSelected ? textPrimary : "rgba(200,215,230,0.75)", marginBottom: 3 }}>
                  {t.label}
                </div>
                <div style={{ fontSize: "13px", color: textMuted, lineHeight: 1.5 }}>
                  {t.desc}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: gold, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Check size={16} style={{ color: "#03050A" }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 13, color: textMuted, background: "none", border: "none",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 700, color: "#03050A",
            background: selected ? gold : "rgba(184,156,74,0.25)",
            border: "none", borderRadius: 10, padding: "14px 32px",
            cursor: selected ? "pointer" : "not-allowed",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "all 0.2s ease",
          }}>
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

/* ─── Step 4: Customize Agent ─── */
function StepCustomize({
  template, onNext, onBack,
}: {
  template: TemplateKey;
  onNext: (config: { agentName: string; personality: string; firstMessage: string; voiceId: string }) => void;
  onBack: () => void;
}) {
  const templateLabel = TEMPLATES.find(t => t.key === template)?.label ?? template;
  const [agentName, setAgentName] = useState("");
  const [personality, setPersonality] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const { data: voices } = trpc.vaas.catalog.voices.useQuery();
  const { data: templates } = trpc.vaas.catalog.templates.useQuery();

  // Pre-fill from template defaults
  useEffect(() => {
    if (templates) {
      const t = (templates as any[]).find((tp: any) => tp.templateKey === template);
      if (t) {
        if (!personality) setPersonality(t.defaultPrompt || "");
        if (!firstMessage) setFirstMessage(t.defaultFirstMessage || "");
      }
    }
  }, [templates, template]);

  // Pre-select first free voice
  useEffect(() => {
    if (voices && !selectedVoice) {
      const freeVoice = (voices as any[]).find((v: any) => v.tier === "free");
      if (freeVoice) setSelectedVoice(freeVoice.voiceId);
    }
  }, [voices]);

  const freeVoices = (voices as any[] || []).filter((v: any) => v.tier === "free");
  const premiumVoices = (voices as any[] || []).filter((v: any) => v.tier === "premium");

  return (
    <section style={{ padding: "80px 24px", maxWidth: "560px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h2 style={{ fontFamily: sfd, fontSize: "24px", fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>
          Customize Your Agent
        </h2>
        <p style={{ fontFamily: sf, fontSize: "14px", color: textSecondary, margin: 0 }}>
          Pre-configured for <span style={{ color: gold }}>{templateLabel}</span>. Adjust anything you like.
        </p>
      </div>

      <div style={{
        background: "rgba(8,14,24,0.72)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: "28px",
      }}>
        {/* Agent name */}
        <label style={labelStyle}>Agent Name *</label>
        <input type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)}
          placeholder="e.g. Sarah, Max, or your company name"
          style={{ ...inputStyle, marginBottom: 20 }} />

        {/* Voice selection */}
        <label style={labelStyle}>Choose a Voice</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: 20 }}>
          {freeVoices.map((v: any) => (
            <button key={v.voiceId} onClick={() => setSelectedVoice(v.voiceId)}
              style={{
                fontFamily: sf, textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: 10,
                background: selectedVoice === v.voiceId ? "rgba(184,156,74,0.08)" : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${selectedVoice === v.voiceId ? "rgba(184,156,74,0.40)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s ease",
              }}>
              <Volume2 size={16} style={{ color: selectedVoice === v.voiceId ? "#D4A843" : "rgba(200,215,230,0.40)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: selectedVoice === v.voiceId ? textPrimary : "rgba(200,215,230,0.70)" }}>
                  {v.name}
                </span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(100,220,160,0.70)", background: "rgba(100,220,160,0.08)", padding: "3px 8px", borderRadius: 6 }}>
                Free
              </span>
            </button>
          ))}
          {premiumVoices.map((v: any) => (
            <button key={v.voiceId} onClick={() => setSelectedVoice(v.voiceId)}
              style={{
                fontFamily: sf, textAlign: "left", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: 10,
                background: selectedVoice === v.voiceId ? "rgba(184,156,74,0.08)" : "rgba(255,255,255,0.02)",
                border: `1.5px solid ${selectedVoice === v.voiceId ? "rgba(184,156,74,0.40)" : "rgba(255,255,255,0.06)"}`,
                transition: "all 0.15s ease",
              }}>
              <Volume2 size={16} style={{ color: selectedVoice === v.voiceId ? "#D4A843" : "rgba(200,215,230,0.40)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: "14px", fontWeight: 600, color: selectedVoice === v.voiceId ? textPrimary : "rgba(200,215,230,0.70)" }}>
                  {v.name}
                </span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(200,160,255,0.70)", background: "rgba(200,160,255,0.08)", padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 3 }}>
                <Crown size={10} /> Premium
              </span>
            </button>
          ))}
        </div>

        {/* First message */}
        <label style={labelStyle}>First Message</label>
        <p style={{ fontFamily: sf, fontSize: "12px", color: textMuted, margin: "0 0 6px" }}>
          What your agent says when someone starts a conversation.
        </p>
        <textarea value={firstMessage} onChange={(e) => setFirstMessage(e.target.value)}
          rows={3} placeholder="Hi! I'm here to help you with..."
          style={{ ...inputStyle, resize: "vertical", marginBottom: 20 }} />

        {/* Personality */}
        <label style={labelStyle}>Personality & Instructions</label>
        <p style={{ fontFamily: sf, fontSize: "12px", color: textMuted, margin: "0 0 6px" }}>
          How should your agent behave? What should it know about your business?
        </p>
        <textarea value={personality} onChange={(e) => setPersonality(e.target.value)}
          rows={5} placeholder="You are a friendly and professional assistant for..."
          style={{ ...inputStyle, resize: "vertical", marginBottom: 4 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 13, color: textMuted, background: "none", border: "none",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <ArrowLeft size={14} /> Back
        </button>
        <button
          onClick={() => {
            if (!agentName.trim()) { toast.error("Give your agent a name"); return; }
            onNext({ agentName, personality, firstMessage, voiceId: selectedVoice });
          }}
          style={{
            fontFamily: sf, fontSize: 14, fontWeight: 700, color: "#03050A",
            background: gold, border: "none", borderRadius: 10, padding: "14px 32px",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
          }}>
          Create & Try Free <Play size={16} />
        </button>
      </div>
    </section>
  );
}

/* ─── Step 5: Free Trial ─── */
function StepTrial({
  agentName, trialSecondsRemaining, onActivate, onBack,
}: {
  agentName: string;
  trialSecondsRemaining: number;
  onActivate: () => void;
  onBack: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(trialSecondsRemaining);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recordUsage = trpc.vaas.billing.recordTrialUsage.useMutation();

  const startTrial = useCallback(() => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false);
          toast.info("Your free trial has ended. Activate your agent to continue.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Record usage every 30 seconds
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      recordUsage.mutate({ seconds: 30 });
    }, 30000);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = ((900 - secondsLeft) / 900) * 100;
  const trialExpired = secondsLeft <= 0;

  return (
    <section style={{ padding: "80px 24px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, margin: "0 auto 16px",
          background: trialExpired ? "rgba(255,100,100,0.10)" : "rgba(184,156,74,0.12)",
          border: `1px solid ${trialExpired ? "rgba(255,100,100,0.25)" : "rgba(184,156,74,0.25)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {trialExpired ? <Lock size={28} style={{ color: "#f87171" }} /> : <Sparkles size={28} style={{ color: "#D4A843" }} />}
        </div>
        <h2 style={{ fontFamily: sfd, fontSize: "24px", fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>
          {trialExpired ? `${agentName} Is Ready` : `Meet ${agentName}`}
        </h2>
        <p style={{ fontFamily: sf, fontSize: "14px", color: textSecondary, margin: 0 }}>
          {trialExpired
            ? "Your free trial has ended. Activate to put your agent on your website."
            : "Your agent is live. Try having a conversation - see how it handles your visitors."
          }
        </p>
      </div>

      {/* Timer bar */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: sf, fontSize: "13px", fontWeight: 600, color: "rgba(200,215,230,0.65)" }}>
            Free Trial
          </span>
          <span style={{
            fontFamily: "ui-monospace, 'SF Mono', monospace", fontSize: "18px", fontWeight: 700,
            color: trialExpired ? "#f87171" : secondsLeft < 120 ? "#fbbf24" : gold,
          }}>
            {minutes}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3,
            background: trialExpired ? "#f87171" : `linear-gradient(90deg, rgba(184,156,74,0.80), rgba(184,156,74,0.50))`,
            width: `${progress}%`, transition: "width 1s linear",
          }} />
        </div>
        <p style={{ fontFamily: sf, fontSize: "11px", color: textMuted, margin: "8px 0 0", textAlign: "center" }}>
          {trialExpired ? "Trial complete" : `${minutes} min ${secs}s remaining`}
        </p>
      </div>

      {/* Trial area */}
      {!trialExpired && !isActive && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button onClick={startTrial} style={{
            fontFamily: sf, fontSize: 14, fontWeight: 700, color: "#03050A",
            background: gold, border: "none", borderRadius: 10, padding: "14px 32px",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <Play size={16} /> Start Conversation
          </button>
          <p style={{ fontFamily: sf, fontSize: "12px", color: textMuted, marginTop: 10 }}>
            Click to start a live test conversation with {agentName}
          </p>
        </div>
      )}

      {isActive && (
        <div style={{
          background: "rgba(184,156,74,0.04)", border: "1px solid rgba(184,156,74,0.15)",
          borderRadius: 14, padding: "32px 24px", textAlign: "center", marginBottom: 24,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", margin: "0 auto 16px",
            background: "rgba(184,156,74,0.15)", border: "2px solid rgba(184,156,74,0.40)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            <Mic size={22} style={{ color: "#D4A843" }} />
          </div>
          <p style={{ fontFamily: sf, fontSize: "15px", fontWeight: 600, color: textPrimary, margin: "0 0 8px" }}>
            {agentName} is listening...
          </p>
          <p style={{ fontFamily: sf, fontSize: "13px", color: textSecondary, margin: 0 }}>
            Speak naturally - your agent is ready to respond.
          </p>
        </div>
      )}

      {/* Activate CTA */}
      <div style={{
        background: "rgba(184,156,74,0.04)", border: "1px solid rgba(184,156,74,0.18)",
        borderRadius: 14, padding: "24px", textAlign: "center",
      }}>
        <h3 style={{ fontFamily: sfd, fontSize: "17px", fontWeight: 700, color: textPrimary, margin: "0 0 8px" }}>
          {trialExpired ? "Ready to Go Live?" : "Like What You See?"}
        </h3>
        <p style={{ fontFamily: sf, fontSize: "13px", color: textSecondary, margin: "0 0 16px" }}>
          Activate your agent to embed it on your website and start capturing leads 24/7.
        </p>
        <button onClick={onActivate} style={{
          fontFamily: sf, fontSize: 14, fontWeight: 700, color: "#03050A",
          background: gold, border: "none", borderRadius: 10, padding: "14px 36px",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Activate My Agent <ArrowRight size={16} />
        </button>
      </div>

      {!trialExpired && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button onClick={onBack} style={{
            fontFamily: sf, fontSize: 13, color: textMuted, background: "none", border: "none",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <ArrowLeft size={14} /> Back to customization
          </button>
        </div>
      )}
    </section>
  );
}

/* ─── Step 6: Payment Gate ─── */
function StepActivate({ agentName, onBack }: { agentName: string; onBack: () => void }) {
  const [, setLocation] = useLocation();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState(999);

  const validatePromo = trpc.vaas.billing.validatePromo.useQuery(
    { code: promoCode },
    { enabled: false }
  );

  const checkoutMutation = trpc.vaas.billing.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.success("Subscription activation in progress. Check your portal for updates.");
        setLocation("/portal");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    const result = await validatePromo.refetch();
    if (result.data?.valid) {
      setMonthlyPrice(Math.round((result.data.monthlyPriceCents || 99900) / 100));
      setPromoApplied(true);
      toast.success("Promo code applied!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  return (
    <section style={{ padding: "80px 24px", maxWidth: "520px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, margin: "0 auto 16px",
          background: "rgba(184,156,74,0.12)", border: "1px solid rgba(184,156,74,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Star size={28} style={{ color: "#D4A843" }} />
        </div>
        <h2 style={{ fontFamily: sfd, fontSize: "24px", fontWeight: 800, color: textPrimary, margin: "0 0 8px" }}>
          Activate {agentName}
        </h2>
        <p style={{ fontFamily: sf, fontSize: "14px", color: textSecondary, margin: 0 }}>
          Put your agent on your website today. Cancel anytime.
        </p>
      </div>

      {/* Pricing card */}
      <div style={{
        background: "rgba(8,14,24,0.72)", border: "1px solid rgba(184,156,74,0.20)",
        borderRadius: 18, padding: "32px 28px", marginBottom: 24,
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
            <span style={{ fontFamily: sfd, fontSize: "48px", fontWeight: 800, color: gold }}>
              ${monthlyPrice}
            </span>
            <span style={{ fontFamily: sf, fontSize: "16px", color: textMuted }}>/month</span>
          </div>
          {promoApplied && monthlyPrice < 999 && (
            <p style={{ fontFamily: sf, fontSize: "13px", color: "rgba(100,220,160,0.80)", margin: "8px 0 0" }}>
              Promo applied - you save ${999 - monthlyPrice}/month
            </p>
          )}
          <p style={{ fontFamily: sf, fontSize: "13px", color: textMuted, margin: "8px 0 0" }}>
            No commitment. Cancel anytime. Minimum 1 month.
          </p>
        </div>

        {/* What's included */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: sf, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,215,230,0.45)", marginBottom: 12 }}>
            Everything Included
          </p>
          {[
            "Custom AI voice agent on your website",
            "Full conversation intelligence & transcripts",
            "Lead capture & qualification pipeline",
            "Automated follow-up emails",
            "Real-time analytics dashboard",
            "Embed code - install in 2 minutes",
            "Ongoing optimization by AiiACo",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Check size={14} style={{ color: "rgba(100,220,160,0.70)", flexShrink: 0 }} />
              <span style={{ fontFamily: sf, fontSize: "13px", color: "rgba(200,215,230,0.65)" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Promo code */}
        {!promoApplied && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ ...labelStyle, marginBottom: 6 }}>Have a promo code?</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE" style={{ ...inputStyle, flex: 1, fontSize: 13, letterSpacing: "0.08em" }} />
              <button onClick={handlePromo} style={{
                fontFamily: sf, fontSize: 13, fontWeight: 700, color: gold,
                background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.25)",
                borderRadius: 10, padding: "0 18px", cursor: "pointer", whiteSpace: "nowrap",
              }}>
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Activate button */}
        <button
          onClick={() => checkoutMutation.mutate()}
          disabled={checkoutMutation.isPending}
          style={{
            fontFamily: sf, fontSize: 15, fontWeight: 700, color: "#03050A",
            background: checkoutMutation.isPending ? "rgba(184,156,74,0.5)" : gold,
            border: "none", borderRadius: 10, padding: "16px 28px",
            cursor: checkoutMutation.isPending ? "wait" : "pointer", width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
          {checkoutMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : (
            <>Activate for ${monthlyPrice}/month <ChevronRight size={16} /></>
          )}
        </button>
      </div>

      {/* Alternative: talk to us */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: sf, fontSize: "13px", color: textMuted, marginBottom: 12 }}>
          Questions? Talk to a human.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: sf, fontSize: 12, fontWeight: 600, color: goldDim, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            Book a Call <ArrowRight size={12} />
          </a>
          <a href={DIRECT_DIAL_TEL}
            style={{ fontFamily: sf, fontSize: 12, fontWeight: 600, color: goldDim, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Phone size={12} /> {DIRECT_DIAL}
          </a>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 13, color: textMuted, background: "none", border: "none",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <ArrowLeft size={14} /> Back to trial
        </button>
      </div>
    </section>
  );
}

/* ─── Main Wizard ─── */
type WizardStep = "showcase" | "account" | "template" | "customize" | "trial" | "activate";

const STEP_ORDER: WizardStep[] = ["showcase", "account", "template", "customize", "trial", "activate"];
const stepNumber = (step: WizardStep) => STEP_ORDER.indexOf(step) + 1;

export default function DiagnosticDemoPage() {
  const [step, setStep] = useState<WizardStep>("showcase");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey | null>(null);
  const [agentConfig, setAgentConfig] = useState<{ agentName: string; personality: string; firstMessage: string; voiceId: string } | null>(null);
  const [agentCreated, setAgentCreated] = useState(false);
  const [trialSecondsRemaining, setTrialSecondsRemaining] = useState(900);

  const createAgentMutation = trpc.vaas.agent.create.useMutation({
    onSuccess: () => {
      setAgentCreated(true);
      toast.success("Your agent is ready!");
      setStep("trial");
    },
    onError: (err) => {
      // If they already have an agent, skip to trial
      if (err.message.includes("already have")) {
        setAgentCreated(true);
        setStep("trial");
      } else {
        toast.error(err.message);
      }
    },
  });

  // Check if user is already logged in as a client
  useEffect(() => {
    const token = getClientToken();
    if (token && step === "showcase") {
      // They have a token - could resume from where they left off
      // For now, let them start fresh but skip account creation
    }
  }, []);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const handleAccountCreated = (_token: string) => {
    setStep("template");
  };

  const handleTemplateSelected = (template: TemplateKey) => {
    setSelectedTemplate(template);
    setStep("customize");
  };

  const handleCustomized = (config: { agentName: string; personality: string; firstMessage: string; voiceId: string }) => {
    setAgentConfig(config);
    // Create the agent
    createAgentMutation.mutate({
      agentName: config.agentName,
      templateType: selectedTemplate!,
      personality: config.personality || undefined,
      firstMessage: config.firstMessage || undefined,
      voiceId: config.voiceId || undefined,
    });
  };

  const showStepIndicator = step !== "showcase";

  return (
    <>
      <SEO
        title="Build Your AI Voice Agent | AiiACo"
        description="Create a custom AI voice agent for your website in minutes. 15 minutes free - no credit card required. Sounds human, responds instantly, captures leads 24/7."
        path="/demo"
        keywords="AI voice agent, build AI agent, voice AI for business, AI lead qualification, conversational AI"
      />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#03050A" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {showStepIndicator && (
            <div style={{ paddingTop: "40px" }}>
              <StepIndicator current={stepNumber(step)} total={6} />
            </div>
          )}

          {step === "showcase" && (
            <StepShowcase onNext={() => setStep("account")} />
          )}

          {step === "account" && (
            <StepAccount
              onNext={handleAccountCreated}
              onBack={() => setStep("showcase")}
            />
          )}

          {step === "template" && (
            <StepTemplate
              onNext={handleTemplateSelected}
              onBack={() => setStep("account")}
            />
          )}

          {step === "customize" && selectedTemplate && (
            <StepCustomize
              template={selectedTemplate}
              onNext={handleCustomized}
              onBack={() => setStep("template")}
            />
          )}

          {step === "trial" && agentConfig && (
            <StepTrial
              agentName={agentConfig.agentName}
              trialSecondsRemaining={trialSecondsRemaining}
              onActivate={() => setStep("activate")}
              onBack={() => setStep("customize")}
            />
          )}

          {step === "activate" && agentConfig && (
            <StepActivate
              agentName={agentConfig.agentName}
              onBack={() => setStep("trial")}
            />
          )}

          {/* Creating agent loading overlay */}
          {createAgentMutation.isPending && (
            <div style={{
              position: "fixed", inset: 0, background: "rgba(3,5,10,0.85)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              zIndex: 1000,
            }}>
              <Loader2 size={40} className="animate-spin" style={{ color: "#D4A843", marginBottom: 16 }} />
              <p style={{ fontFamily: sfd, fontSize: "18px", fontWeight: 700, color: textPrimary }}>
                Building your agent...
              </p>
              <p style={{ fontFamily: sf, fontSize: "14px", color: textSecondary, marginTop: 8 }}>
                This takes just a moment.
              </p>
            </div>
          )}
        </main>
        {step === "showcase" && <Footer />}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        input:focus, textarea:focus { border-color: rgba(184,156,74,0.40) !important; }
      `}</style>
    </>
  );
}
