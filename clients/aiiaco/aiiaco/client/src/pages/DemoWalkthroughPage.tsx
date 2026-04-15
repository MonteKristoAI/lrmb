/**
 * /demo-walkthrough - Interactive Sales Demo Experience
 *
 * 4-step guided walkthrough that proves AiA works:
 *   Step 1: "What's your biggest missed-call headache?" (personalization form)
 *   Step 2: "Watch AiA answer a call for [Business Name]" (simulated call with audio)
 *   Step 3: "Here's what happens next - automatically" (follow-up timeline)
 *   Step 4: "Want me to flip the switch for you today?" (CTA)
 *
 * Design: Liquid Glass Bio-Organic, matching aiiaco.com design system
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, PhoneOff, ArrowRight, ArrowLeft, Mic, Mail, MessageSquare,
  Clock, Calendar, FileText, Bell, CheckCircle2, Play, Pause,
  Volume2, Building2, Sparkles, Shield, ChevronRight, User,
  AlertTriangle, DollarSign, TrendingUp, Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/seo/SEO";
import OrCallDirect from "@/components/OrCallDirect";
import { CALENDLY_URL, DIRECT_DIAL, DIRECT_DIAL_TEL } from "@/const";

/* ─── Design tokens ─── */
const sf = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const sfd = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";
const gold = "#B89C4A";
const goldBright = "#D4A843";
const goldDim = "rgba(184,156,74,0.55)";
const goldGlow = "rgba(184,156,74,0.18)";
const goldBorder = "rgba(184,156,74,0.28)";
const textPrimary = "rgba(255,255,255,0.96)";
const textSecondary = "rgba(200,215,230,0.72)";
const textMuted = "rgba(200,215,230,0.45)";
const glassDark = "rgba(8, 14, 24, 0.72)";
const glassBorder = "rgba(255,255,255,0.10)";
const void_ = "#03050A";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj";

/* ─── Audio URLs ─── */
const AUDIO = {
  fullCall: `${CDN}/aia-demo-full-call_9058ccd6.wav`,
  greeting: `${CDN}/aia-demo-greeting_c9cbce30.wav`,
  caller1: `${CDN}/aia-demo-caller_167734e8.wav`,
  booking: `${CDN}/aia-demo-booking_64310cfe.wav`,
  caller2: `${CDN}/aia-demo-caller2_f71b81b9.wav`,
  confirm: `${CDN}/aia-demo-confirm_d4e21b7e.wav`,
  caller3: `${CDN}/aia-demo-caller3_6d9fbf7a.wav`,
  closing: `${CDN}/aia-demo-closing_2b0b08ed.wav`,
};

/* ─── Industry data ─── */
const INDUSTRIES = [
  { key: "dental", label: "Dental Practice", icon: "🦷", painDefault: "Patients calling after hours go to voicemail and never call back" },
  { key: "medspa", label: "Med Spa / Aesthetics", icon: "✨", painDefault: "High-value Botox and filler leads lost to slow follow-up" },
  { key: "realestate", label: "Real Estate", icon: "🏠", painDefault: "Buyer leads from Zillow and Realtor.com go cold within minutes" },
  { key: "hvac", label: "HVAC / Home Services", icon: "🔧", painDefault: "Emergency calls after 5pm go to an answering service that can't book" },
  { key: "legal", label: "Law Firm", icon: "⚖️", painDefault: "Potential clients call once, get voicemail, and hire someone else" },
  { key: "other", label: "Other", icon: "🏢", painDefault: "Missed calls are costing us revenue and we can't staff 24/7" },
] as const;

/* ─── Transcript lines for the simulated call ─── */
const TRANSCRIPT_LINES = [
  { speaker: "aia", text: "Thank you for calling {business}. This is AiA, your AI assistant. How can I help you today?", time: "0:01" },
  { speaker: "caller", text: "Hi, yeah, I'd like to schedule a teeth cleaning. I haven't been in a while, maybe two years? Do you have anything available this week?", time: "0:04" },
  { speaker: "aia", text: "Of course! I'd be happy to help you get that scheduled. We actually have a few openings this Thursday and Friday. Would either of those work for you? And while I pull that up, could I get your name please?", time: "0:10" },
  { speaker: "caller", text: "Sure, it's Marcus. Marcus Chen. Thursday afternoon would be great if you have it.", time: "0:19" },
  { speaker: "aia", text: "Perfect, Marcus. I've got you down for Thursday at 2:30 PM with Dr. Patel for a comprehensive cleaning and checkup. Since it's been a couple of years, the doctor may want to take some X-rays as well. Could I grab your email so I can send you a confirmation and the new patient forms ahead of time?", time: "0:24" },
  { speaker: "caller", text: "Yeah, it's marcus.chen@gmail.com. That sounds great, thank you so much.", time: "0:38" },
  { speaker: "aia", text: "You're all set, Marcus! You'll receive a confirmation email shortly with all the details. We look forward to seeing you Thursday. Have a wonderful day!", time: "0:44" },
];

/* ─── Timing map: when each transcript line should appear (seconds into audio) ─── */
const TRANSCRIPT_TIMINGS = [1.5, 6, 14, 23, 28, 42, 49];

/* ─── Step indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "48px" }}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: isActive ? 40 : isDone ? 32 : 32,
              height: 32,
              borderRadius: isActive ? 16 : 16,
              background: isDone ? "rgba(184,156,74,0.25)" : isActive ? "rgba(184,156,74,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isDone ? "rgba(184,156,74,0.50)" : isActive ? goldBorder : "rgba(255,255,255,0.08)"}`,
              transition: "all 0.4s ease",
            }}>
              {isDone ? (
                <CheckCircle2 size={16} color={goldBright} />
              ) : (
                <span style={{
                  fontFamily: sf, fontSize: 13, fontWeight: 700,
                  color: isActive ? goldBright : textMuted,
                }}>{step}</span>
              )}
            </div>
            {i < total - 1 && (
              <div style={{
                width: 40, height: 1,
                background: isDone ? "rgba(184,156,74,0.40)" : "rgba(255,255,255,0.08)",
                transition: "background 0.4s ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Audio waveform visualizer ─── */
function WaveformVisualizer({ isPlaying, barCount = 24 }: { isPlaying: boolean; barCount?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 32, padding: "0 8px" }}>
      {Array.from({ length: barCount }, (_, i) => (
        <motion.div
          key={i}
          animate={isPlaying ? {
            height: [4, 8 + Math.random() * 20, 4, 12 + Math.random() * 16, 4],
          } : { height: 4 }}
          transition={isPlaying ? {
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            repeatType: "loop",
            delay: i * 0.03,
          } : { duration: 0.3 }}
          style={{
            width: 3,
            borderRadius: 2,
            background: isPlaying
              ? `linear-gradient(180deg, ${goldBright}, ${goldDim})`
              : "rgba(255,255,255,0.12)",
            transition: "background 0.3s",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STEP 1 - What's your biggest missed-call headache?
   ═══════════════════════════════════════════════════════════════════════ */
function Step1({
  onNext,
  businessName,
  setBusinessName,
  industry,
  setIndustry,
  painPoint,
  setPainPoint,
}: {
  onNext: () => void;
  businessName: string;
  setBusinessName: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  painPoint: string;
  setPainPoint: (v: string) => void;
}) {
  const canProceed = businessName.trim().length > 0 && industry;

  // Auto-fill pain point when industry changes
  useEffect(() => {
    if (industry && !painPoint) {
      const ind = INDUSTRIES.find(i => i.key === industry);
      if (ind) setPainPoint(ind.painDefault);
    }
  }, [industry]);

  const inputStyle: React.CSSProperties = {
    fontFamily: sf, fontSize: 15, color: "rgba(255,255,255,0.88)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 12, padding: "14px 16px",
    outline: "none", width: "100%",
    transition: "border-color 0.2s, background 0.2s",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 560, margin: "0 auto" }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="section-pill" style={{ margin: "0 auto 20px", display: "inline-flex" }}>
          <span className="dot" />
          STEP 1 OF 4
        </div>
        <h1 style={{
          fontFamily: sfd, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700,
          lineHeight: 1.05, letterSpacing: "-0.5px", color: textPrimary, margin: "0 0 16px",
        }}>
          What's your biggest<br />
          <span style={{ color: goldBright }}>missed-call headache?</span>
        </h1>
        <p style={{ fontFamily: sf, fontSize: 16, color: textSecondary, lineHeight: 1.6, margin: 0 }}>
          Tell us about your business so we can show you exactly how AiA handles your calls.
        </p>
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Business name */}
        <div>
          <label style={{ fontFamily: sf, fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Your Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={e => setBusinessName(e.target.value)}
            placeholder="e.g. Bright Smile Dental"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "rgba(184,156,74,0.40)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
          />
        </div>

        {/* Industry */}
        <div>
          <label style={{ fontFamily: sf, fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Your Industry
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {INDUSTRIES.map(ind => (
              <button
                key={ind.key}
                onClick={() => { setIndustry(ind.key); if (!painPoint || INDUSTRIES.some(i => i.painDefault === painPoint)) setPainPoint(ind.painDefault); }}
                style={{
                  fontFamily: sf, fontSize: 14, fontWeight: 600,
                  color: industry === ind.key ? goldBright : "rgba(255,255,255,0.65)",
                  background: industry === ind.key ? "rgba(184,156,74,0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${industry === ind.key ? "rgba(184,156,74,0.40)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10, padding: "12px 14px",
                  cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 8,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 20 }}>{ind.icon}</span>
                {ind.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pain point */}
        <div>
          <label style={{ fontFamily: sf, fontSize: 12, fontWeight: 700, color: textMuted, letterSpacing: "0.8px", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Your Biggest Pain Point
          </label>
          <textarea
            value={painPoint}
            onChange={e => setPainPoint(e.target.value)}
            placeholder="What happens when you miss a call right now?"
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            onFocus={e => { e.target.style.borderColor = "rgba(184,156,74,0.40)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.10)"; e.target.style.background = "rgba(255,255,255,0.04)"; }}
          />
        </div>

        {/* CTA */}
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn-gold"
          style={{
            width: "100%", marginTop: 8,
            opacity: canProceed ? 1 : 0.4,
            pointerEvents: canProceed ? "auto" : "none",
          }}
        >
          Show Me How AiA Handles It
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STEP 2 - Watch AiA answer a call for [Business Name]
   ═══════════════════════════════════════════════════════════════════════ */
function Step2({
  onNext,
  onBack,
  businessName,
}: {
  onNext: () => void;
  onBack: () => void;
  businessName: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [callState, setCallState] = useState<"idle" | "ringing" | "connected" | "ended">("idle");
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(AUDIO.fullCall);
    audio.preload = "auto";
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
    audio.addEventListener("timeupdate", () => setCurrentTime(audio.currentTime));
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCallState("ended");
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Reveal transcript lines based on audio time
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < TRANSCRIPT_TIMINGS.length; i++) {
      if (currentTime >= TRANSCRIPT_TIMINGS[i]) count = i + 1;
    }
    setVisibleLines(count);
  }, [currentTime]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleLines]);

  const handlePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (callState === "idle") {
      setCallState("ringing");
      setTimeout(() => {
        setCallState("connected");
        audioRef.current?.play();
        setIsPlaying(true);
      }, 1500);
    } else if (callState === "ended") {
      audioRef.current.currentTime = 0;
      setVisibleLines(0);
      setCallState("ringing");
      setTimeout(() => {
        setCallState("connected");
        audioRef.current?.play();
        setIsPlaying(true);
      }, 1500);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [callState, isPlaying]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const biz = businessName || "Your Business";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 680, margin: "0 auto" }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div className="section-pill" style={{ margin: "0 auto 20px", display: "inline-flex" }}>
          <span className="dot" />
          STEP 2 OF 4
        </div>
        <h1 style={{
          fontFamily: sfd, fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700,
          lineHeight: 1.08, letterSpacing: "-0.5px", color: textPrimary, margin: "0 0 12px",
        }}>
          Watch AiA answer a call for<br />
          <span style={{ color: goldBright }}>{biz}</span>
        </h1>
        <p style={{ fontFamily: sf, fontSize: 15, color: textSecondary, lineHeight: 1.6, margin: 0 }}>
          This is a simulated call. In production, AiA uses your business name, your hours, your services.
        </p>
      </div>

      {/* Phone UI */}
      <div className="glass-card-gold" style={{ padding: 0, overflow: "hidden" }}>
        {/* Call header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(184,156,74,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: callState === "connected" ? "rgba(184,156,74,0.20)" : callState === "ringing" ? "rgba(184,156,74,0.12)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${callState === "connected" ? "rgba(184,156,74,0.40)" : "rgba(255,255,255,0.10)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
            }}>
              {callState === "ringing" ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                  <Phone size={20} color={goldBright} />
                </motion.div>
              ) : callState === "connected" ? (
                <Mic size={20} color={goldBright} />
              ) : callState === "ended" ? (
                <PhoneOff size={20} color={textMuted} />
              ) : (
                <Phone size={20} color={textMuted} />
              )}
            </div>
            <div>
              <div style={{ fontFamily: sf, fontSize: 15, fontWeight: 700, color: textPrimary }}>
                {callState === "idle" ? "Ready to demo" : callState === "ringing" ? "Ringing..." : callState === "connected" ? "Call in progress" : "Call ended"}
              </div>
              <div style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>
                {callState === "connected" ? formatTime(currentTime) + " / " + formatTime(duration) : callState === "ended" ? "Duration: " + formatTime(duration) : biz}
              </div>
            </div>
          </div>
          <WaveformVisualizer isPlaying={isPlaying} barCount={16} />
        </div>

        {/* Transcript area */}
        <div style={{
          padding: "20px 24px",
          minHeight: 280,
          maxHeight: 380,
          overflowY: "auto",
          background: "rgba(0,0,0,0.15)",
        }}>
          {callState === "idle" && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <Phone size={40} color={goldDim} style={{ marginBottom: 16 }} />
              <p style={{ fontFamily: sf, fontSize: 15, color: textMuted, margin: 0 }}>
                Press play to hear AiA answer a call for <strong style={{ color: textSecondary }}>{biz}</strong>
              </p>
            </div>
          )}
          {callState === "ringing" && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                <Phone size={48} color={goldBright} />
              </motion.div>
              <p style={{ fontFamily: sf, fontSize: 16, color: goldBright, marginTop: 20, fontWeight: 600 }}>
                Incoming call...
              </p>
              <p style={{ fontFamily: sf, fontSize: 13, color: textMuted, margin: "4px 0 0" }}>
                (555) 012-3456
              </p>
            </div>
          )}
          {(callState === "connected" || callState === "ended") && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {TRANSCRIPT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    flexDirection: line.speaker === "caller" ? "row-reverse" : "row",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                    background: line.speaker === "aia" ? "rgba(184,156,74,0.20)" : "rgba(255,255,255,0.08)",
                    border: `1px solid ${line.speaker === "aia" ? "rgba(184,156,74,0.35)" : "rgba(255,255,255,0.12)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {line.speaker === "aia" ? (
                      <Sparkles size={14} color={goldBright} />
                    ) : (
                      <User size={14} color={textMuted} />
                    )}
                  </div>
                  <div style={{
                    maxWidth: "75%",
                    padding: "10px 14px",
                    borderRadius: line.speaker === "aia" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                    background: line.speaker === "aia" ? "rgba(184,156,74,0.10)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${line.speaker === "aia" ? "rgba(184,156,74,0.20)" : "rgba(255,255,255,0.08)"}`,
                  }}>
                    <div style={{ fontFamily: sf, fontSize: 10, fontWeight: 700, color: line.speaker === "aia" ? goldDim : textMuted, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>
                      {line.speaker === "aia" ? "AiA" : "Caller"} · {line.time}
                    </div>
                    <div style={{ fontFamily: sf, fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
                      {line.text.replace("{business}", biz)}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          )}
        </div>

        {/* Play controls */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid rgba(184,156,74,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <button
            onClick={handlePlay}
            style={{
              fontFamily: sf, fontSize: 15, fontWeight: 700,
              color: callState === "idle" || callState === "ended" ? "#0a0800" : isPlaying ? textPrimary : "#0a0800",
              background: callState === "idle" || callState === "ended"
                ? `linear-gradient(135deg, ${gold}, ${goldBright})`
                : isPlaying
                  ? "rgba(255,255,255,0.08)"
                  : `linear-gradient(135deg, ${gold}, ${goldBright})`,
              border: isPlaying ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(184,156,74,0.50)",
              borderRadius: 12, padding: "12px 32px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              boxShadow: isPlaying ? "none" : "0 8px 30px rgba(184,156,74,0.30)",
              transition: "all 0.2s",
            }}
          >
            {callState === "idle" ? <><Play size={18} /> Play Demo Call</> :
             callState === "ringing" ? <><motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}><Phone size={18} /></motion.div> Connecting...</> :
             callState === "ended" ? <><Play size={18} /> Replay</> :
             isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Resume</>}
          </button>
          {callState === "connected" && (
            <div style={{ fontFamily: sf, fontSize: 12, color: textMuted }}>
              <Volume2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              Sound on
            </div>
          )}
        </div>
      </div>

      {/* Intelligence preview - shows after call ends */}
      <AnimatePresence>
        {callState === "ended" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card"
            style={{ marginTop: 24, padding: "24px" }}
          >
            <div style={{ fontFamily: sf, fontSize: 11, fontWeight: 800, color: goldDim, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 16 }}>
              Intelligence Extracted
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Caller Name", value: "Marcus Chen" },
                { label: "Email", value: "marcus.chen@gmail.com" },
                { label: "Appointment", value: "Thu 2:30 PM - Cleaning" },
                { label: "Lead Score", value: "92 / 100" },
              ].map(item => (
                <div key={item.label} style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ fontFamily: sf, fontSize: 10, fontWeight: 700, color: textMuted, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: sf, fontSize: 14, fontWeight: 600, color: textPrimary }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: "rgba(184,156,74,0.06)", border: "1px solid rgba(184,156,74,0.15)" }}>
              <div style={{ fontFamily: sf, fontSize: 10, fontWeight: 700, color: goldDim, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>
                Pain Point Detected
              </div>
              <div style={{ fontFamily: sf, fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>
                Patient hasn't visited in 2 years - potential reactivation opportunity. Mentioned needing X-rays. High intent.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 14, fontWeight: 600, color: textMuted,
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 0",
        }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={callState !== "ended"}
          className="btn-gold"
          style={{
            opacity: callState === "ended" ? 1 : 0.3,
            pointerEvents: callState === "ended" ? "auto" : "none",
          }}
        >
          See What Happens Next <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STEP 3 - Here's what happens next - automatically
   ═══════════════════════════════════════════════════════════════════════ */
function Step3({
  onNext,
  onBack,
  businessName,
}: {
  onNext: () => void;
  onBack: () => void;
  businessName: string;
}) {
  const [revealedItems, setRevealedItems] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealedItems(prev => {
        if (prev >= 5) { clearInterval(timer); return prev; }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const timelineItems = [
    {
      icon: <Mail size={20} />,
      time: "Instant",
      title: "Caller gets a summary email",
      desc: `Marcus receives a personalized email: "Thank you for your conversation with ${businessName || "us"}. Here's a summary of what we discussed and your appointment details."`,
      color: goldBright,
    },
    {
      icon: <Bell size={20} />,
      time: "2 minutes",
      title: "You get a pilot brief",
      desc: "Full intelligence report lands in your inbox: caller name, email, pain points, lead score, recommended next steps, and the complete transcript.",
      color: "#60A5FA",
    },
    {
      icon: <Calendar size={20} />,
      time: "5 minutes",
      title: "Appointment confirmed",
      desc: "Calendar invite sent to both Marcus and Dr. Patel. New patient forms attached. No manual data entry needed.",
      color: "#34D399",
    },
    {
      icon: <MessageSquare size={20} />,
      time: "24 hours before",
      title: "No-show prevention SMS",
      desc: "Marcus gets a friendly reminder: \"Hi Marcus, just a reminder about your cleaning tomorrow at 2:30 PM. Reply C to confirm or R to reschedule.\"",
      color: "#F59E0B",
    },
    {
      icon: <TrendingUp size={20} />,
      time: "After visit",
      title: "Reactivation sequence starts",
      desc: "If Marcus doesn't book a follow-up, an automated nurture sequence begins - keeping your chair full without you lifting a finger.",
      color: "#A78BFA",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 640, margin: "0 auto" }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="section-pill" style={{ margin: "0 auto 20px", display: "inline-flex" }}>
          <span className="dot" />
          STEP 3 OF 4
        </div>
        <h1 style={{
          fontFamily: sfd, fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700,
          lineHeight: 1.08, letterSpacing: "-0.5px", color: textPrimary, margin: "0 0 12px",
        }}>
          Here's what happens next -<br />
          <span style={{ color: goldBright }}>automatically</span>
        </h1>
        <p style={{ fontFamily: sf, fontSize: 15, color: textSecondary, lineHeight: 1.6, margin: 0 }}>
          After every single call, AiA triggers this entire sequence. No human required.
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative", paddingLeft: 40 }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: 15, top: 0, bottom: 0, width: 2,
          background: "linear-gradient(180deg, rgba(184,156,74,0.40) 0%, rgba(255,255,255,0.06) 100%)",
        }} />

        {timelineItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={i < revealedItems ? { opacity: 1, x: 0 } : { opacity: 0.15, x: 0 }}
            transition={{ duration: 0.4, delay: i < revealedItems ? 0 : 0 }}
            style={{ marginBottom: i < timelineItems.length - 1 ? 24 : 0, position: "relative" }}
          >
            {/* Dot */}
            <div style={{
              position: "absolute", left: -33, top: 4,
              width: 12, height: 12, borderRadius: 6,
              background: i < revealedItems ? item.color : "rgba(255,255,255,0.12)",
              boxShadow: i < revealedItems ? `0 0 12px ${item.color}40` : "none",
              transition: "all 0.4s",
            }} />

            {/* Card */}
            <div style={{
              padding: "16px 20px", borderRadius: 14,
              background: i < revealedItems ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${i < revealedItems ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)"}`,
              transition: "all 0.4s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ color: item.color, opacity: i < revealedItems ? 1 : 0.3 }}>{item.icon}</div>
                <div style={{
                  fontFamily: sf, fontSize: 11, fontWeight: 700,
                  color: item.color, letterSpacing: "0.5px", textTransform: "uppercase",
                  opacity: i < revealedItems ? 0.8 : 0.3,
                }}>
                  {item.time}
                </div>
              </div>
              <div style={{ fontFamily: sf, fontSize: 16, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
                {item.title}
              </div>
              <div style={{ fontFamily: sf, fontSize: 14, color: textSecondary, lineHeight: 1.55 }}>
                {item.desc}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cost comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealedItems >= 5 ? 1 : 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card-gold"
        style={{ marginTop: 32, padding: "24px" }}
      >
        <div style={{ fontFamily: sf, fontSize: 11, fontWeight: 800, color: goldDim, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 16 }}>
          What this replaces
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontFamily: sf, fontSize: 13, fontWeight: 700, color: "rgba(255,100,100,0.80)", marginBottom: 8 }}>Without AiA</div>
            {["Receptionist salary: $3,200/mo", "Answering service: $800/mo", "Missed calls: 40% lost", "No-show rate: 25-30%", "Manual follow-up: 2+ hours/day"].map(item => (
              <div key={item} style={{ fontFamily: sf, fontSize: 13, color: textMuted, padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={12} color="rgba(255,100,100,0.60)" /> {item}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: sf, fontSize: 13, fontWeight: 700, color: goldBright, marginBottom: 8 }}>With AiA</div>
            {["AiA: $499/mo", "24/7/365 coverage", "0% missed calls", "No-show rate: 8-12%", "Zero manual follow-up"].map(item => (
              <div key={item} style={{ fontFamily: sf, fontSize: 13, color: textSecondary, padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={12} color={goldBright} /> {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32 }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 14, fontWeight: 600, color: textMuted,
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, padding: "10px 0",
        }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onNext} className="btn-gold">
          I Want This <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   STEP 4 - Want me to flip the switch for you today?
   ═══════════════════════════════════════════════════════════════════════ */
function Step4({
  onBack,
  businessName,
  industry,
  painPoint,
}: {
  onBack: () => void;
  businessName: string;
  industry: string;
  painPoint: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={{ maxWidth: 580, margin: "0 auto" }}
    >
      {/* Headline */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div className="section-pill" style={{ margin: "0 auto 20px", display: "inline-flex" }}>
          <span className="dot" />
          STEP 4 OF 4
        </div>
        <h1 style={{
          fontFamily: sfd, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 700,
          lineHeight: 1.05, letterSpacing: "-0.5px", color: textPrimary, margin: "0 0 16px",
        }}>
          Want me to flip the switch<br />
          <span style={{ color: goldBright }}>for you today?</span>
        </h1>
        <p style={{ fontFamily: sf, fontSize: 16, color: textSecondary, lineHeight: 1.6, margin: 0, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
          Start your 14-day free pilot. No credit card. No contracts. If AiA doesn't earn her keep, you walk away.
        </p>
      </div>

      {/* Offer card */}
      <div className="glass-card-gold" style={{ padding: "32px", textAlign: "center" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 32, margin: "0 auto 20px",
          background: "linear-gradient(135deg, rgba(184,156,74,0.30), rgba(212,168,67,0.15))",
          border: "1px solid rgba(184,156,74,0.40)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(184,156,74,0.20)",
        }}>
          <Zap size={28} color={goldBright} />
        </div>

        <h2 style={{ fontFamily: sfd, fontSize: 24, fontWeight: 700, color: textPrimary, margin: "0 0 8px" }}>
          14-Day Free Pilot
        </h2>
        <p style={{ fontFamily: sf, fontSize: 14, color: textMuted, margin: "0 0 24px" }}>
          AiA configured for {businessName || "your business"} · Live in 48 hours
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", marginBottom: 28 }}>
          {[
            "AiA trained on your business, your services, your hours",
            "Answers every call 24/7 - nights, weekends, holidays",
            "Books real appointments on your calendar",
            "Sends you a full intelligence brief after every call",
            "Automated follow-up texts that cut no-shows in half",
            "Full conversation dashboard with transcripts and analytics",
          ].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "2px 0" }}>
              <CheckCircle2 size={16} color={goldBright} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: sf, fontSize: 14, color: textSecondary, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{ width: "100%", display: "flex", justifyContent: "center", textDecoration: "none", fontSize: 16, padding: "16px 32px" }}
        >
          Book My Free Pilot Call
          <ArrowRight size={20} />
        </a>
        <OrCallDirect marginTop="12px" />

        {/* Trust signals */}
        <div style={{
          marginTop: 24, paddingTop: 20,
          borderTop: "1px solid rgba(184,156,74,0.12)",
          display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap",
        }}>
          {[
            { icon: <Shield size={14} />, text: "No credit card" },
            { icon: <Clock size={14} />, text: "Live in 48 hours" },
            { icon: <FileText size={14} />, text: "No contracts" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: goldDim }}>{item.icon}</span>
              <span style={{ fontFamily: sf, fontSize: 12, fontWeight: 600, color: textMuted }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative: call directly */}
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <p style={{ fontFamily: sf, fontSize: 14, color: textMuted, margin: "0 0 12px" }}>
          Prefer to talk to a human first?
        </p>
        <a
          href={DIRECT_DIAL_TEL}
          style={{
            fontFamily: sf, fontSize: 15, fontWeight: 700, color: goldBright,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 12,
            background: "rgba(184,156,74,0.08)",
            border: "1px solid rgba(184,156,74,0.20)",
            transition: "all 0.2s",
          }}
        >
          <Phone size={18} /> Call {DIRECT_DIAL}
        </a>
      </div>

      {/* Back */}
      <div style={{ marginTop: 32 }}>
        <button onClick={onBack} style={{
          fontFamily: sf, fontSize: 14, fontWeight: 600, color: textMuted,
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6, padding: "10px 0",
        }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function DemoWalkthroughPage() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [painPoint, setPainPoint] = useState("");

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <>
      <SEO
        title="See AiA in Action | AiiACo Voice AI Demo"
        description="Watch a live demo of AiA answering calls for your business. See the automated follow-up, intelligence extraction, and no-show prevention in action."
        path="/demo-walkthrough"
        keywords="AI voice agent demo, AI receptionist demo, voice AI for business, automated call handling, AI appointment booking"
      />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: void_ }}>
        <Navbar />
        <main style={{ flex: 1, padding: "48px 20px 80px" }}>
          <StepIndicator current={step} total={4} />
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1
                key="step1"
                onNext={() => setStep(2)}
                businessName={businessName}
                setBusinessName={setBusinessName}
                industry={industry}
                setIndustry={setIndustry}
                painPoint={painPoint}
                setPainPoint={setPainPoint}
              />
            )}
            {step === 2 && (
              <Step2
                key="step2"
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
                businessName={businessName}
              />
            )}
            {step === 3 && (
              <Step3
                key="step3"
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
                businessName={businessName}
              />
            )}
            {step === 4 && (
              <Step4
                key="step4"
                onBack={() => setStep(3)}
                businessName={businessName}
                industry={industry}
                painPoint={painPoint}
              />
            )}
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </>
  );
}
