/*
 * AiiACo Contact Section - 3-Step Qualifier with Progressive Lead Capture
 *
 * Step 1: Name, Company, Email, Phone  → saved to DB immediately
 * Step 2: Problem dropdown (8 options + "I don't know" + "Other")
 * Step 3: Call preference (time slot) or Calendly booking
 *
 * Progressive capture: lead is created on Step 1 completion, updated on each step.
 * CRM webhook fires on every step.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import CallNowButton from "@/components/CallNowButton";
import OrCallDirect from "@/components/OrCallDirect";
import { useCalendlyTracking } from "@/hooks/useCalendlyTracking";

type Step = "contact" | "problem" | "booking" | "done";

interface QualifierData {
  name: string;
  company: string;
  email: string;
  phone: string;
  problemCategory: string;
  problemDetail: string;
  callPreference: string;
}

const PROBLEM_OPTIONS = [
  "My team spends too much time on manual, repetitive tasks",
  "We lose leads because follow-up is slow or inconsistent",
  "Our data lives in multiple systems and we can't trust the numbers",
  "Document processing and approvals take too long",
  "Client communication requires too much manual coordination",
  "We lack real-time visibility into operations and performance",
  "Proposal and deliverable creation is slow and resource-heavy",
  "We're growing but can't scale without adding headcount",
  "I don't know - I just know something needs to change",
  "Other - let me describe it",
];

const CALL_PREFERENCES = [
  { id: "morning", label: "Morning", sub: "Weekdays 8am - 12pm" },
  { id: "afternoon", label: "Afternoon", sub: "Weekdays 12pm - 5pm" },
  { id: "weekdays", label: "Any Weekday", sub: "Morning or afternoon, your call" },
  { id: "anytime", label: "Anytime", sub: "Flexible - reach me when available" },
  { id: "calendly", label: "Book a Specific Time", sub: "Choose an exact slot on Calendly" },
];

const stepVariants = {
  enter: { opacity: 0, y: 18 },
  center: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

const SF: React.CSSProperties = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
};

const inputStyle: React.CSSProperties = {
  ...SF,
  width: "100%",
  padding: "14px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(184,156,74,0.22)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.92)",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s ease",
};

const labelStyle: React.CSSProperties = {
  ...SF,
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "rgba(184,156,74,0.75)",
  textTransform: "uppercase",
  marginBottom: "6px",
  display: "block",
};

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function GoldButton({
  onClick,
  disabled,
  loading,
  children,
  variant = "primary",
}: {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...SF,
        padding: "14px 28px",
        background: variant === "primary"
          ? "linear-gradient(135deg, #C9A227 0%, #F0C050 50%, #C9A227 100%)"
          : "transparent",
        border: variant === "primary" ? "none" : "1px solid rgba(184,156,74,0.35)",
        borderRadius: "10px",
        color: variant === "primary" ? "#03050A" : "rgba(184,156,74,0.85)",
        fontSize: "15px",
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled || loading ? 0.6 : 1,
        transition: "opacity 0.15s ease",
        letterSpacing: "0.02em",
      }}
    >
      {loading ? "Saving…" : children}
    </button>
  );
}

const whatHappensNext = [
  { n: "01", t: "Review within 24 hours" },
  { n: "02", t: "Direct response aligned to your scenario" },
  { n: "03", t: "Scope and feasibility confirmed on the call" },
  { n: "04", t: "First operational module scoped and initiated" },
];

export default function ContactSection({ leadSource, initialOpen }: { leadSource?: string; initialOpen?: boolean } = {}) {
  const [step, setStep] = useState<Step>("contact");
  const [leadId, setLeadId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [showCalendly, setShowCalendly] = useState(false);
  useCalendlyTracking("contact_section");
  const [data, setData] = useState<QualifierData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    problemCategory: "",
    problemDetail: "",
    callPreference: "",
  });

  const step1Mutation = trpc.leads.qualifierStep1.useMutation({
    onSuccess: (res) => {
      setLeadId(res.leadId);
      setStep("problem");
      setError("");
    },
    onError: (err) => setError(err.message),
  });

  const step2Mutation = trpc.leads.qualifierStep2.useMutation({
    onSuccess: () => {
      setStep("booking");
      setError("");
    },
    onError: (err) => setError(err.message),
  });

  const step3Mutation = trpc.leads.qualifierStep3.useMutation({
    onSuccess: () => {
      setStep("done");
      setError("");
    },
    onError: (err) => setError(err.message),
  });

  const handleStep1 = () => {
    if (!data.name.trim()) return setError("Please enter your name.");
    if (!data.company.trim()) return setError("Please enter your company name.");
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return setError("Please enter a valid email address.");
    setError("");
    step1Mutation.mutate({
      name: data.name.trim(),
      company: data.company.trim(),
      email: data.email.trim(),
      phone: data.phone.trim() || undefined,
      source: leadSource || "Direct",
    });
  };

  const handleStep2 = () => {
    if (!data.problemCategory) return setError("Please select the challenge that fits best.");
    if (!leadId) return setError("Session error - please refresh and try again.");
    setError("");
    step2Mutation.mutate({
      leadId,
      problemCategory: data.problemCategory,
      problemDetail: data.problemDetail.trim() || undefined,
    });
  };

  const handleStep3 = (preference: string) => {
    if (!leadId) return;
    setData((d) => ({ ...d, callPreference: preference }));
    if (preference === "calendly") {
      setShowCalendly(true);
      step3Mutation.mutate({ leadId, callPreference: "Calendly booking" });
    } else {
      step3Mutation.mutate({ leadId, callPreference: preference });
    }
  };

  const progressSteps = [
    { id: "contact", label: "Contact" },
    { id: "problem", label: "Challenge" },
    { id: "booking", label: "Book Call" },
  ];
  const currentIdx = progressSteps.findIndex((s) => s.id === step);

  return (
    <section
      id="contact"
      className="mobile-section"
      style={{
        background: "#03050A",
        padding: "120px 0 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .aiia-contact-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 80px;
          align-items: start;
        }
        .aiia-contact-outer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }
        @media (max-width: 860px) {
          .aiia-contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .aiia-contact-outer {
            padding: 0 16px;
          }
          .aiia-contact-form-card {
            padding: 20px !important;
          }
          .aiia-contact-section {
            padding: 60px 0 60px !important;
          }
          .aiia-contact-header {
            margin-bottom: 40px !important;
          }
          .aiia-contact-sidebar {
            display: none;
          }
          .aiia-contact-name-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "600px",
          height: "600px",
          background: "radial-gradient(ellipse at center, rgba(184,156,74,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Calendly full-screen modal */}
      {showCalendly && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(3,5,10,0.97)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(184,156,74,0.6), transparent)" }} />
          <button
            onClick={() => setShowCalendly(false)}
            style={{
              position: "absolute", top: "24px", right: "24px",
              background: "rgba(184,156,74,0.08)", border: "1px solid rgba(184,156,74,0.22)",
              borderRadius: "8px", color: "rgba(184,156,74,0.80)",
              ...SF, fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em",
              padding: "8px 16px", cursor: "pointer", textTransform: "uppercase",
            }}
          >
            Close
          </button>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: "center", marginBottom: "32px" }}
          >
            <h2 style={{ ...SF, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "rgba(255,255,255,0.96)", margin: "0 0 8px" }}>
              Select a time for your <span style={{ color: "#D4A843" }}>Strategy Call.</span>
            </h2>
            <p style={{ ...SF, fontSize: "14px", color: "rgba(200,215,230,0.55)", margin: 0 }}>
              Your submission has been received. Choose a slot that works for your schedule.
            </p>
          </motion.div>
          <div style={{ width: "100%", maxWidth: "720px", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(184,156,74,0.18)", background: "#060B14" }}>
            <iframe
              src="https://calendly.com/aiiaco?embed_type=Inline&hide_gdpr_banner=1&background_color=060B14&text_color=d2dceb&primary_color=B89C4A"
              width="100%" height="580" frameBorder="0"
              title="Schedule a call with AiiA"
              style={{ display: "block" }}
            />
          </div>
        </motion.div>
      )}

        <div className="aiia-contact-outer">
        {/* Header */}
        <div style={{ marginBottom: "64px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              border: "1px solid rgba(184,156,74,0.25)",
              borderRadius: "100px",
              marginBottom: "24px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C9A227", display: "inline-block" }} />
            <span style={{ ...SF, fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", color: "rgba(184,156,74,0.85)", textTransform: "uppercase" }}>
              REQUEST UPGRADE
            </span>
          </div>
          <h2 style={{ ...SF, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 16px" }}>
            Start the Conversation.
          </h2>
          <p style={{ ...SF, fontSize: "18px", color: "rgba(200,215,230,0.55)", maxWidth: "520px", lineHeight: 1.6, margin: "0 0 24px" }}>
            Three questions. Two minutes. We'll reach out with a direct response aligned to your situation.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <CallNowButton
              variant="outline"
              size="md"
              style={{
                ...SF,
                color: "rgba(200,215,230,0.90)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "12px",
                padding: "12px 20px",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            />
            <span style={{ ...SF, fontSize: "13px", color: "rgba(200,215,230,0.35)" }}>AI answers 24/7 &middot; routes you to the right program</span>
          </div>
        </div>

        <div className="aiia-contact-grid">
          {/* Left - Form */}
          <div>
            {/* Progress indicator */}
            {step !== "done" && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
                {progressSteps.map((s, i) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < progressSteps.length - 1 ? 1 : 0 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: i <= currentIdx
                            ? "linear-gradient(135deg, #C9A227, #F0C050)"
                            : "rgba(255,255,255,0.06)",
                          border: i <= currentIdx ? "none" : "1px solid rgba(184,156,74,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {i < currentIdx ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 7L5.5 10L11.5 4" stroke="#03050A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span style={{ ...SF, fontSize: "13px", fontWeight: 700, color: i <= currentIdx ? "#03050A" : "rgba(255,255,255,0.3)" }}>
                            {i + 1}
                          </span>
                        )}
                      </div>
                      <span style={{ ...SF, fontSize: "11px", fontWeight: 600, color: i <= currentIdx ? "rgba(184,156,74,0.9)" : "rgba(255,255,255,0.25)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {s.label}
                      </span>
                    </div>
                    {i < progressSteps.length - 1 && (
                      <div style={{ flex: 1, height: "1px", background: i < currentIdx ? "rgba(184,156,74,0.4)" : "rgba(255,255,255,0.08)", margin: "0 12px", marginBottom: "22px", transition: "background 0.3s ease" }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Step panels */}
            <div
              className="aiia-contact-form-card"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(184,156,74,0.12)",
                borderRadius: "16px",
                padding: "36px",
                minHeight: "360px",
              }}
            >
              <AnimatePresence mode="wait">
                {/* ── STEP 1: Contact Info ── */}
                {step === "contact" && (
                  <motion.div key="contact" variants={stepVariants} initial="enter" animate="center" exit="exit">
                    <h3 style={{ ...SF, fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                      Let's start with you.
                    </h3>
                    <p style={{ ...SF, fontSize: "14px", color: "rgba(200,215,230,0.45)", margin: "0 0 28px" }}>
                      We'll use this to reach you directly - no spam, no handoffs.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="aiia-contact-name-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <FieldGroup label="Your Name *">
                          <input
                            style={inputStyle}
                            placeholder="First & last name"
                            value={data.name}
                            onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                          />
                        </FieldGroup>
                        <FieldGroup label="Company *">
                          <input
                            style={inputStyle}
                            placeholder="Company or firm name"
                            value={data.company}
                            onChange={(e) => setData((d) => ({ ...d, company: e.target.value }))}
                            onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                          />
                        </FieldGroup>
                      </div>
                      <FieldGroup label="Email Address *">
                        <input
                          style={inputStyle}
                          type="email"
                          placeholder="you@company.com"
                          value={data.email}
                          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                        />
                      </FieldGroup>
                      <FieldGroup label="Mobile Phone">
                        <input
                          style={inputStyle}
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={data.phone}
                          onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleStep1()}
                        />
                      </FieldGroup>
                    </div>
                    {error && (
                      <p style={{ ...SF, fontSize: "13px", color: "#ff6b6b", margin: "12px 0 0" }}>{error}</p>
                    )}
                    <div style={{ marginTop: "24px" }}>
                      <GoldButton onClick={handleStep1} loading={step1Mutation.isPending}>
                        Continue →
                      </GoldButton>
                      <OrCallDirect center={false} marginTop="10px" />
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Problem Dropdown ── */}
                {step === "problem" && (
                  <motion.div key="problem" variants={stepVariants} initial="enter" animate="center" exit="exit">
                    <h3 style={{ ...SF, fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                      What's the core challenge?
                    </h3>
                    <p style={{ ...SF, fontSize: "14px", color: "rgba(200,215,230,0.45)", margin: "0 0 24px" }}>
                      Choose the one that fits closest - or select "Other" to describe it in your own words.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                      {PROBLEM_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setData((d) => ({ ...d, problemCategory: opt }))}
                          style={{
                            ...SF,
                            textAlign: "left",
                            padding: "13px 16px",
                            background: data.problemCategory === opt
                              ? "rgba(184,156,74,0.12)"
                              : "rgba(255,255,255,0.025)",
                            border: data.problemCategory === opt
                              ? "1px solid rgba(184,156,74,0.5)"
                              : "1px solid rgba(184,156,74,0.1)",
                            borderRadius: "10px",
                            cursor: "pointer",
                            fontSize: "14px",
                            color: data.problemCategory === opt ? "rgba(240,192,80,0.95)" : "rgba(255,255,255,0.7)",
                            fontWeight: data.problemCategory === opt ? 600 : 400,
                            transition: "all 0.15s ease",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              border: data.problemCategory === opt ? "none" : "1.5px solid rgba(184,156,74,0.3)",
                              background: data.problemCategory === opt
                                ? "linear-gradient(135deg, #C9A227, #F0C050)"
                                : "transparent",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {data.problemCategory === opt && (
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1.5 4L3 5.5L6.5 2" stroke="#03050A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Free text for "Other" or "I don't know" */}
                    {(data.problemCategory === "Other - let me describe it" || data.problemCategory === "I don't know - I just know something needs to change") && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginBottom: "16px" }}>
                        <textarea
                          style={{
                            ...inputStyle,
                            minHeight: "90px",
                            resize: "vertical",
                          } as React.CSSProperties}
                          placeholder="Describe what's happening in a few words or a paragraph…"
                          value={data.problemDetail}
                          onChange={(e) => setData((d) => ({ ...d, problemDetail: e.target.value }))}
                        />
                      </motion.div>
                    )}

                    {error && (
                      <p style={{ ...SF, fontSize: "13px", color: "#ff6b6b", margin: "0 0 12px" }}>{error}</p>
                    )}
                    <div style={{ display: "flex", gap: "12px" }}>
                      <GoldButton onClick={handleStep2} loading={step2Mutation.isPending}>
                        Continue →
                      </GoldButton>
                      <GoldButton variant="ghost" onClick={() => setStep("contact")}>
                        ← Back
                      </GoldButton>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: Call Booking ── */}
                {step === "booking" && (
                  <motion.div key="booking" variants={stepVariants} initial="enter" animate="center" exit="exit">
                    <h3 style={{ ...SF, fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
                      How should we reach you?
                    </h3>
                    <p style={{ ...SF, fontSize: "14px", color: "rgba(200,215,230,0.45)", margin: "0 0 24px" }}>
                      Choose a time preference and we'll call your mobile - or book a specific slot.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {CALL_PREFERENCES.map((pref) => (
                        <button
                          key={pref.id}
                          onClick={() => handleStep3(pref.id)}
                          disabled={step3Mutation.isPending}
                          style={{
                            ...SF,
                            textAlign: "left",
                            padding: "16px 20px",
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(184,156,74,0.15)",
                            borderRadius: "12px",
                            cursor: step3Mutation.isPending ? "not-allowed" : "pointer",
                            transition: "all 0.15s ease",
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,156,74,0.08)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,156,74,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.025)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,156,74,0.15)";
                          }}
                        >
                          <span style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                            {pref.id === "calendly" ? "📅 " : ""}{pref.label}
                          </span>
                          <span style={{ fontSize: "13px", color: "rgba(200,215,230,0.45)" }}>{pref.sub}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <GoldButton variant="ghost" onClick={() => setStep("problem")}>
                        ← Back
                      </GoldButton>
                      <OrCallDirect center={false} marginTop="0" />
                    </div>
                  </motion.div>
                )}

                {/* ── DONE ── */}
                {step === "done" && (
                  <motion.div key="done" variants={stepVariants} initial="enter" animate="center" exit="exit">
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #C9A227, #F0C050)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 24px",
                        }}
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M5 14L11 20L23 8" stroke="#03050A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <h3 style={{ ...SF, fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>
                        You're on our radar.
                      </h3>
                      <p style={{ ...SF, fontSize: "16px", color: "rgba(200,215,230,0.55)", maxWidth: "380px", margin: "0 auto 32px", lineHeight: 1.6 }}>
                        We'll review your submission and reach out within 24 hours with a direct, scenario-specific response.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", margin: "0 auto" }}>
                        {whatHappensNext.map((item) => (
                          <div key={item.n} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <span style={{ ...SF, fontSize: "11px", fontWeight: 700, color: "rgba(184,156,74,0.6)", letterSpacing: "0.08em", minWidth: "24px" }}>
                              {item.n}
                            </span>
                            <span style={{ ...SF, fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{item.t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right - What Happens Next */}
          <div className="aiia-contact-sidebar" style={{ paddingTop: "80px" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(184,156,74,0.1)",
                borderRadius: "16px",
                padding: "32px",
              }}
            >
              <p style={{ ...SF, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(184,156,74,0.6)", textTransform: "uppercase", margin: "0 0 20px" }}>
                WHAT HAPPENS NEXT
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {whatHappensNext.map((item) => (
                  <div key={item.n} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                    <span
                      style={{
                        ...SF,
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "rgba(184,156,74,0.5)",
                        letterSpacing: "0.06em",
                        minWidth: "24px",
                        paddingTop: "2px",
                      }}
                    >
                      {item.n}
                    </span>
                    <span style={{ ...SF, fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                      {item.t}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(184,156,74,0.1)",
                }}
              >
                <p style={{ ...SF, fontSize: "13px", color: "rgba(200,215,230,0.4)", lineHeight: 1.6, margin: 0 }}>
                  No sales deck. No generic pitch. Every response is written specifically for your situation by the team that will execute the work.
                </p>
              </div>
            </div>

            {/* Trust signals */}
            <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "Performance-based engagements available",
                "Direct access to the integration team",
                "No long-term contracts required",
              ].map((signal) => (
                <div key={signal} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7L5.5 10.5L12 3.5" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ ...SF, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
