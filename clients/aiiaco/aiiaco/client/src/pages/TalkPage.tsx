/**
 * TalkPage - Dedicated page to talk with AiA directly.
 *
 * Unified UX:
 *   - One smart email field: if email exists in DB → offer magic link to continue;
 *     if new → proceed as new visitor. No separate "continue" card.
 *   - Optional name/phone pre-fill
 *
 * Visual features:
 *   - Holographic video watermark background (auto on first visit, optional replay after)
 *   - Golden microphone icon with 7-second shine pulse
 *   - Speech indicator bars during active conversation
 *   - Live transcription with copy-to-clipboard
 *   - Transcript persisted to DB on conversation end
 */
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useConversation } from "@11labs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Mic,
  MicOff,
  PhoneOff,
  Loader2,
  Mail,
  ArrowLeft,
  User,
  Phone,
  MessageSquare,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  RefreshCw,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrCallDirect from "@/components/OrCallDirect";
import SEO from "@/seo/SEO";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const AGENT_ID: string = import.meta.env.VITE_ELEVENLABS_AGENT_ID ?? "";
const MIC_ICON_URL =
  "/images/gold-microphone.webp";
const VIDEO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310419663031409823/jiUKWZNCEesKEKgdJkoZwj/aia-intro-silent_a0998b5e.mp4";

const FIRST_VISIT_KEY = "aiiaco_talk_visited";

const FF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

interface TranscriptEntry {
  id: number;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

type ConvStatus = "idle" | "connecting" | "connected" | "error";

/** Which screen the user sees */
type PageView = "landing" | "voice" | "magic-link-sent" | "verified";

/** Smart email state */
type EmailState = "idle" | "checking" | "new" | "returning";

interface VerifiedLead {
  id: number;
  name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  conversationSummary: string | null;
  painPoints: string | null;
  wants: string | null;
}

interface PreviousTranscript {
  id: number;
  transcript: string;
  transcriptText: string | null;
  durationSeconds: number | null;
  createdAt: Date;
}

export default function TalkPage() {
  // ─── Page-level state ──────────────────────────────────────────────
  const [view, setView] = useState<PageView>("landing");
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [verifiedLead, setVerifiedLead] = useState<VerifiedLead | null>(null);
  const [previousTranscripts, setPreviousTranscripts] = useState<PreviousTranscript[]>([]);
  const [expandedTranscript, setExpandedTranscript] = useState<number | null>(null);
  const conversationStartRef = useRef<Date | null>(null);

  // ─── Smart email detection ────────────────────────────────────────
  const [emailState, setEmailState] = useState<EmailState>("idle");
  const emailCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Video watermark state ─────────────────────────────────────────
  const [isFirstVisit] = useState(() => !localStorage.getItem(FIRST_VISIT_KEY));
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isFirstVisit) {
      localStorage.setItem(FIRST_VISIT_KEY, "true");
      setVideoPlaying(true);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    if (videoPlaying && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [videoPlaying]);

  const handlePlayVideo = useCallback(() => {
    setVideoPlaying(true);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setVideoPlaying(false);
  }, []);

  // ─── Voice state ───────────────────────────────────────────────────
  const [status, setStatus] = useState<ConvStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [copied, setCopied] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const entryIdRef = useRef(0);

  // ─── Session ID for incremental persistence ────────────────────────
  const sessionIdRef = useRef<string>("");
  const incrementalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSavedLenRef = useRef(0);

  // ─── tRPC mutations ────────────────────────────────────────────────
  const sendMagicLink = trpc.talk.sendMagicLink.useMutation();
  const verifyMagicLink = trpc.talk.verifyMagicLink.useMutation();
  const saveTranscript = trpc.talk.saveTranscript.useMutation();
  const upsertTranscript = trpc.talk.upsertTranscript.useMutation();
  const checkEmail = trpc.talk.checkEmail.useMutation();

  // ─── Check for magic link token in URL on mount ────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      window.history.replaceState({}, "", "/talk");
      verifyMagicLink.mutate(
        { token },
        {
          onSuccess: (data) => {
            setVerifiedLead(data.lead);
            setPreviousTranscripts(
              (data.previousTranscripts ?? []).map((t: any) => ({
                ...t,
                createdAt: new Date(t.createdAt),
              }))
            );
            setVisitorName(data.lead.name ?? "");
            setVisitorEmail(data.lead.email ?? "");
            setVisitorPhone(data.lead.phone ?? "");
            setView("verified");
            toast.success(`Welcome back, ${data.lead.name?.split(" ")[0] ?? "there"}!`);
          },
          onError: (err) => {
            toast.error(err.message || "Invalid or expired link");
            setView("landing");
          },
        }
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Smart email change handler (debounced check) ──────────────────
  const handleEmailChange = useCallback(
    (val: string) => {
      setVisitorEmail(val);
      if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);

      // Reset state if email is empty or invalid
      if (!val.trim() || !val.includes("@") || !val.includes(".")) {
        setEmailState("idle");
        return;
      }

      // Basic email validation before checking
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) {
        setEmailState("idle");
        return;
      }

      setEmailState("checking");
      emailCheckTimeout.current = setTimeout(() => {
        checkEmail.mutate(
          { email: val.trim() },
          {
            onSuccess: (data) => {
              setEmailState(data.exists ? "returning" : "new");
            },
            onError: () => {
              setEmailState("new"); // Default to new on error
            },
          }
        );
      }, 600);
    },
    [checkEmail]
  );

  // ─── Magic link for returning lead ─────────────────────────────────
  const handleSendMagicLink = useCallback(() => {
    if (!visitorEmail.trim()) return;
    sendMagicLink.mutate(
      { email: visitorEmail.trim(), origin: window.location.origin },
      {
        onSuccess: (data) => {
          setView("magic-link-sent");
          toast.success(data.message);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to send magic link");
        },
      }
    );
  }, [visitorEmail, sendMagicLink]);

  // ─── ElevenLabs conversation ───────────────────────────────────────
  const conversation = useConversation({
    onConnect: () => setStatus("connected"),
    onDisconnect: () => {
      setStatus("idle");
      setAgentSpeaking(false);
    },
    onError: () => setStatus("error"),
    onMessage: (payload: { message: string; source: "user" | "ai" }) => {
      setAgentSpeaking(payload.source === "ai");
      if (payload.message && payload.message.trim()) {
        entryIdRef.current += 1;
        setTranscript((prev) => [
          ...prev,
          {
            id: entryIdRef.current,
            role: payload.source,
            text: payload.message.trim(),
            timestamp: new Date(),
          },
        ]);
      }
    },
  });

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const startConversation = useCallback(async () => {
    if (!AGENT_ID) {
      console.error("VITE_ELEVENLABS_AGENT_ID not set");
      setStatus("error");
      return;
    }
    try {
      setStatus("connecting");
      setTranscript([]);
      conversationStartRef.current = new Date();
      // Generate unique session ID for incremental persistence
      sessionIdRef.current = `web_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;  
      lastSavedLenRef.current = 0;
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // Build dynamic variables for identity injection
      const dynamicVars: Record<string, string> = {};
      if (visitorName.trim()) dynamicVars.visitor_name = visitorName.trim();
      if (visitorEmail.trim()) dynamicVars.visitor_email = visitorEmail.trim();
      if (visitorPhone.trim()) dynamicVars.visitor_phone = visitorPhone.trim();

      // Build overrides for personalized greeting
      const overrides: Record<string, unknown> = {};
      if (verifiedLead) {
        // Returning verified lead - greet with context
        const parts = [`Welcome back${verifiedLead.name ? `, ${verifiedLead.name}` : ""}.`];
        if (verifiedLead.conversationSummary) {
          parts.push(`Last time we discussed: ${verifiedLead.conversationSummary}`);
        }
        parts.push("How can I help you today?");
        overrides.agent = {
          firstMessage: parts.join(" "),
        };
        dynamicVars.is_returning = "true";
        if (verifiedLead.company) dynamicVars.visitor_company = verifiedLead.company;
        if (verifiedLead.painPoints) dynamicVars.visitor_pain_points = verifiedLead.painPoints;
      } else if (visitorName.trim()) {
        // New visitor with name - personalized greeting
        overrides.agent = {
          firstMessage: `Hi ${visitorName.trim()}, I'm AiA - your AI diagnostic intelligence. I'm here to understand your business and show you exactly where AI integration can make an impact. What industry are you in?`,
        };
      }

      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
        ...(Object.keys(dynamicVars).length > 0 && { dynamicVariables: dynamicVars }),
        ...(Object.keys(overrides).length > 0 && { overrides }),
      });
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [conversation, visitorName, visitorEmail, visitorPhone, verifiedLead]);

  // ─── Incremental save helper (called by timer and on end) ─────────
  const doIncrementalSave = useCallback((entries: TranscriptEntry[], isFinal: boolean) => {
    if (entries.length === 0 || !sessionIdRef.current) return;
    // Only save if there are new messages since last save (or final)
    if (!isFinal && entries.length === lastSavedLenRef.current) return;
    lastSavedLenRef.current = entries.length;

    const durationSeconds = conversationStartRef.current
      ? Math.round((Date.now() - conversationStartRef.current.getTime()) / 1000)
      : undefined;

    const transcriptJson = JSON.stringify(
      entries.map((e) => ({
        role: e.role,
        text: e.text,
        timestamp: e.timestamp.toISOString(),
      }))
    );
    const transcriptText = entries
      .map((e) => `${e.role === "ai" ? "AiA" : "Visitor"}: ${e.text}`)
      .join("\n\n");

    upsertTranscript.mutate({
      sessionId: sessionIdRef.current,
      leadId: verifiedLead?.id,
      visitorName: visitorName || undefined,
      visitorEmail: visitorEmail || undefined,
      visitorPhone: visitorPhone || undefined,
      transcript: transcriptJson,
      transcriptText,
      durationSeconds,
      isFinal,
    });
  }, [upsertTranscript, verifiedLead, visitorName, visitorEmail, visitorPhone]);

  // ─── 30-second incremental save timer ─────────────────────────────
  useEffect(() => {
    if (status === "connected") {
      incrementalTimerRef.current = setInterval(() => {
        // Access transcript via ref-like pattern: use the latest state
        setTranscript((prev) => {
          if (prev.length > 0) doIncrementalSave(prev, false);
          return prev; // no mutation, just reading
        });
      }, 30000);
    } else {
      if (incrementalTimerRef.current) {
        clearInterval(incrementalTimerRef.current);
        incrementalTimerRef.current = null;
      }
    }
    return () => {
      if (incrementalTimerRef.current) {
        clearInterval(incrementalTimerRef.current);
        incrementalTimerRef.current = null;
      }
    };
  }, [status, doIncrementalSave]);

  const endConversation = useCallback(async () => {
    // Stop incremental timer
    if (incrementalTimerRef.current) {
      clearInterval(incrementalTimerRef.current);
      incrementalTimerRef.current = null;
    }
    await conversation.endSession();
    setStatus("idle");
    setAgentSpeaking(false);

    if (transcript.length > 0) {
      // Final save with duration
      doIncrementalSave(transcript, true);
      toast.success("Transcript saved", {
        description: "Your conversation has been recorded.",
      });
    }
  }, [conversation, transcript, doIncrementalSave]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      conversation.setVolume({ volume: prev ? 1 : 0 });
      return !prev;
    });
  }, [conversation]);

  const copyTranscript = useCallback(() => {
    const text = transcript
      .map((e) => `${e.role === "ai" ? "AiA" : "You"}: ${e.text}`)
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [transcript]);

  const isActive = status === "connected" || status === "connecting";

  const handleStartAsNew = useCallback(() => {
    setView("voice");
  }, []);

  // ─── Shared input style ────────────────────────────────────────────
  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      padding: "12px 16px",
      borderRadius: "10px",
      border: "1px solid rgba(212,168,67,0.20)",
      background: "rgba(255,255,255,0.04)",
      color: "var(--pearl)",
      fontFamily: FF,
      fontSize: "14px",
      outline: "none",
      transition: "border-color 0.2s",
    }),
    []
  );

  // ─── Render helpers ────────────────────────────────────────────────

  /** Unified landing view - one smart form */
  const renderLanding = () => (
    <div style={{ maxWidth: "520px", margin: "0 auto" }}>
      <div
        style={{
          background: "rgba(5,8,15,0.85)",
          border: "1px solid rgba(212,168,67,0.18)",
          borderRadius: "16px",
          padding: "32px",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Name field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
          <div style={{ position: "relative" }}>
            <User
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(212,168,67,0.4)",
              }}
            />
            <input
              type="text"
              placeholder="Your name (optional)"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "40px" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,168,67,0.45)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,168,67,0.20)")}
            />
          </div>

          {/* Smart email field */}
          <div style={{ position: "relative" }}>
            <Mail
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color:
                  emailState === "returning"
                    ? "rgba(74,222,128,0.6)"
                    : "rgba(212,168,67,0.4)",
                transition: "color 0.3s",
              }}
            />
            <input
              type="email"
              placeholder="Email - enter to continue a prior conversation"
              value={visitorEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && emailState === "returning") {
                  handleSendMagicLink();
                }
              }}
              style={{
                ...inputStyle,
                paddingLeft: "40px",
                paddingRight: emailState === "checking" ? "40px" : "16px",
                borderColor:
                  emailState === "returning"
                    ? "rgba(74,222,128,0.30)"
                    : "rgba(212,168,67,0.20)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor =
                  emailState === "returning"
                    ? "rgba(74,222,128,0.5)"
                    : "rgba(212,168,67,0.45)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor =
                  emailState === "returning"
                    ? "rgba(74,222,128,0.30)"
                    : "rgba(212,168,67,0.20)")
              }
            />
            {/* Checking spinner */}
            {emailState === "checking" && (
              <Loader2
                size={14}
                className="animate-spin"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(212,168,67,0.5)",
                }}
              />
            )}
          </div>

          {/* Phone field */}
          <div style={{ position: "relative" }}>
            <Phone
              size={16}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(212,168,67,0.4)",
              }}
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={visitorPhone}
              onChange={(e) => setVisitorPhone(e.target.value)}
              style={{ ...inputStyle, paddingLeft: "40px" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(212,168,67,0.45)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(212,168,67,0.20)")}
            />
          </div>
        </div>

        {/* Smart context message - appears when email is recognized */}
        <AnimatePresence>
          {emailState === "returning" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden", marginBottom: "16px" }}
            >
              <div
                style={{
                  background: "rgba(74,222,128,0.06)",
                  border: "1px solid rgba(74,222,128,0.18)",
                  borderRadius: "10px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(74,222,128,0.12)",
                    border: "1px solid rgba(74,222,128,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <RefreshCw size={13} style={{ color: "#4ade80" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "rgba(74,222,128,0.9)",
                      lineHeight: 1.4,
                    }}
                  >
                    We found your previous conversation.
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--pearl-dim)",
                      lineHeight: 1.4,
                      marginTop: "2px",
                    }}
                  >
                    Click below to receive a secure link and pick up where you left off.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contextual hint below email when idle */}
        {emailState === "idle" && !visitorEmail && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--pearl-dim)",
              opacity: 0.5,
              lineHeight: 1.5,
              marginBottom: "16px",
              paddingLeft: "2px",
            }}
          >
            Providing your email lets you continue conversations later.
          </p>
        )}

        {/* New email hint */}
        {emailState === "new" && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--pearl-dim)",
              opacity: 0.6,
              lineHeight: 1.5,
              marginBottom: "16px",
              paddingLeft: "2px",
            }}
          >
            New here? Great - AiA will remember you for next time.
          </p>
        )}

        {/* Buttons - context-dependent */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Primary: Talk to AiA (always shown) */}
          {emailState !== "returning" && (
            <motion.button
              onClick={handleStartAsNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(212,168,67,0.35)",
                background:
                  "linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(184,156,74,0.10) 100%)",
                color: "var(--gold-bright)",
                fontFamily: FF,
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.2s",
              }}
            >
              <img
                src={MIC_ICON_URL}
                alt=""
                style={{ width: "24px", height: "24px", objectFit: "contain" }}
              />
              Talk to AiA
            </motion.button>
          )}

          {/* Returning lead: Send Magic Link button */}
          {emailState === "returning" && (
            <>
              <motion.button
                onClick={handleSendMagicLink}
                disabled={sendMagicLink.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid rgba(74,222,128,0.30)",
                  background:
                    "linear-gradient(135deg, rgba(74,222,128,0.12) 0%, rgba(74,222,128,0.06) 100%)",
                  color: "rgba(74,222,128,0.9)",
                  fontFamily: FF,
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: sendMagicLink.isPending ? "not-allowed" : "pointer",
                  opacity: sendMagicLink.isPending ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.2s",
                }}
              >
                {sendMagicLink.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Mail size={16} />
                )}
                {sendMagicLink.isPending
                  ? "Sending…"
                  : "Continue Previous Conversation"}
              </motion.button>

              {/* Secondary: Start fresh anyway */}
              <motion.button
                onClick={handleStartAsNew}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid rgba(212,168,67,0.15)",
                  background: "transparent",
                  color: "var(--pearl-dim)",
                  fontFamily: FF,
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  opacity: 0.7,
                  transition: "all 0.2s",
                }}
              >
                <img
                  src={MIC_ICON_URL}
                  alt=""
                  style={{ width: "18px", height: "18px", objectFit: "contain", opacity: 0.6 }}
                />
                Or start a new conversation
              </motion.button>
            </>
          )}
        </div>
        <OrCallDirect marginTop="12px" />
      </div>
    </div>
  );

  /** Magic link sent confirmation */
  const renderMagicLinkSent = () => (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(5,8,15,0.85)",
          border: "1px solid rgba(100,140,200,0.18)",
          borderRadius: "16px",
          padding: "48px 32px",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(100,140,200,0.12)",
            border: "1px solid rgba(100,140,200,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <Mail size={28} style={{ color: "rgba(140,170,220,0.8)" }} />
        </div>

        <h2
          style={{
            fontFamily: FF,
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--pearl)",
            marginBottom: "12px",
          }}
        >
          Check Your Email
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--pearl-dim)",
            lineHeight: 1.7,
            marginBottom: "8px",
          }}
        >
          If we have{" "}
          <strong style={{ color: "var(--pearl-muted)" }}>{visitorEmail}</strong>{" "}
          on file, you'll receive a magic link shortly.
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "var(--pearl-dim)",
            opacity: 0.6,
            marginBottom: "32px",
          }}
        >
          The link expires in 15 minutes for your security.
        </p>

        <button
          onClick={() => setView("landing")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(212,168,67,0.20)",
            background: "transparent",
            color: "var(--pearl-dim)",
            fontFamily: FF,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </div>
    </div>
  );

  /** Verified lead context banner */
  const renderVerifiedBanner = () => {
    if (!verifiedLead) return null;
    return (
      <div
        style={{
          background: "rgba(74,222,128,0.06)",
          border: "1px solid rgba(74,222,128,0.18)",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(74,222,128,0.12)",
            border: "1px solid rgba(74,222,128,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Check size={18} style={{ color: "#4ade80" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--pearl)" }}>
            Verified: {verifiedLead.name ?? verifiedLead.email}
          </div>
          <div style={{ fontSize: "12px", color: "var(--pearl-dim)", marginTop: "2px" }}>
            AiA has your context and is ready to continue.
            {verifiedLead.company && ` (${verifiedLead.company})`}
          </div>
        </div>
      </div>
    );
  };

  /** Previous transcripts accordion */
  const renderPreviousTranscripts = () => {
    if (previousTranscripts.length === 0) return null;
    return (
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--pearl-dim)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Previous Conversations ({previousTranscripts.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {previousTranscripts.map((t) => {
            const isExpanded = expandedTranscript === t.id;
            let parsedEntries: { role: string; text: string }[] = [];
            try {
              parsedEntries = JSON.parse(t.transcript);
            } catch {
              /* fallback to text */
            }
            return (
              <div
                key={t.id}
                style={{
                  background: "rgba(5,8,15,0.7)",
                  border: "1px solid rgba(212,168,67,0.12)",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setExpandedTranscript(isExpanded ? null : t.id)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--pearl-muted)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MessageSquare size={14} style={{ color: "rgba(212,168,67,0.5)" }} />
                    <span style={{ fontSize: "13px", fontFamily: FF, fontWeight: 500 }}>
                      {new Date(t.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {t.durationSeconds != null && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--pearl-dim)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <Clock size={10} />
                        {Math.floor(t.durationSeconds / 60)}m {t.durationSeconds % 60}s
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{ padding: "0 16px 16px", maxHeight: "300px", overflowY: "auto" }}
                        className="transcript-scroll"
                      >
                        {parsedEntries.length > 0
                          ? parsedEntries.map((entry, i) => (
                              <div
                                key={i}
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.6,
                                  marginBottom: "8px",
                                  color: "var(--pearl-dim)",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 700,
                                    color:
                                      entry.role === "ai"
                                        ? "var(--gold-bright)"
                                        : "rgba(140,170,220,0.8)",
                                    marginRight: "6px",
                                  }}
                                >
                                  {entry.role === "ai" ? "AiA:" : "You:"}
                                </span>
                                {entry.text}
                              </div>
                            ))
                          : t.transcriptText?.split("\n\n").map((line, i) => (
                              <div
                                key={i}
                                style={{
                                  fontSize: "13px",
                                  lineHeight: 1.6,
                                  marginBottom: "8px",
                                  color: "var(--pearl-dim)",
                                }}
                              >
                                {line}
                              </div>
                            ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /** Voice conversation UI */
  const renderVoiceUI = () => (
    <>
      {/* Voice Control Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          marginBottom: "40px",
        }}
      >
        {/* Main microphone button */}
        <div style={{ position: "relative" }}>
          {/* 7-second shine pulse ring - only when idle */}
          {!isActive && status === "idle" && (
            <motion.div
              style={{
                position: "absolute",
                inset: "-8px",
                borderRadius: "50%",
                border: "2px solid rgba(212,168,67,0.4)",
                pointerEvents: "none",
              }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(212,168,67,0)",
                  "0 0 0px rgba(212,168,67,0)",
                  "0 0 0px rgba(212,168,67,0)",
                  "0 0 30px rgba(212,168,67,0.5), inset 0 0 20px rgba(212,168,67,0.15)",
                  "0 0 0px rgba(212,168,67,0)",
                ],
                borderColor: [
                  "rgba(212,168,67,0.15)",
                  "rgba(212,168,67,0.15)",
                  "rgba(212,168,67,0.15)",
                  "rgba(212,168,67,0.6)",
                  "rgba(212,168,67,0.15)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 7,
                ease: "easeInOut",
                times: [0, 0.6, 0.7, 0.85, 1],
              }}
            />
          )}

          {/* Speech indicator bars - shown when connected */}
          {status === "connected" && (
            <div
              style={{
                position: "absolute",
                inset: "-16px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <motion.div
                  key={deg}
                  style={{
                    position: "absolute",
                    width: "3px",
                    borderRadius: "2px",
                    background: agentSpeaking ? "#D4A843" : "rgba(212,168,67,0.35)",
                    transformOrigin: "center 76px",
                    transform: `rotate(${deg}deg) translateY(-76px)`,
                  }}
                  animate={
                    agentSpeaking
                      ? { height: [6, 20, 6, 24, 6], opacity: [0.5, 1, 0.5, 1, 0.5] }
                      : { height: [4, 10, 4, 8, 4], opacity: [0.3, 0.6, 0.3, 0.5, 0.3] }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: agentSpeaking ? 0.6 : 1.4,
                    delay: (deg / 360) * (agentSpeaking ? 0.3 : 0.7),
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}

          <motion.button
            onClick={isActive ? endConversation : startConversation}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              position: "relative",
              background: isActive
                ? "radial-gradient(circle at 40% 35%, rgba(232,192,96,0.25), rgba(184,156,74,0.15) 60%, rgba(138,110,42,0.1))"
                : "radial-gradient(circle at 40% 35%, rgba(200,168,64,0.12), rgba(138,110,42,0.08) 60%, transparent)",
              boxShadow: isActive
                ? "0 0 0 4px rgba(212,168,67,0.35), 0 0 60px rgba(212,168,67,0.35), 0 4px 32px rgba(0,0,0,0.5)"
                : "0 0 0 2px rgba(212,168,67,0.18), 0 4px 24px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "box-shadow 0.3s ease",
              overflow: "visible",
              padding: 0,
              zIndex: 2,
            }}
            title={isActive ? "End conversation" : "Talk to AiA"}
          >
            {isActive && (
              <motion.div
                style={{
                  position: "absolute",
                  inset: "-12px",
                  borderRadius: "50%",
                  border: "2px solid rgba(212,168,67,0.5)",
                }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              />
            )}
            {status === "connecting" ? (
              <Loader2 size={44} style={{ color: "#D4A843" }} className="animate-spin" />
            ) : isActive ? (
              <PhoneOff size={44} style={{ color: "#ff6b6b" }} />
            ) : (
              <img
                src={MIC_ICON_URL}
                alt="Talk to AiA"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 2px 12px rgba(212,168,67,0.5))",
                  pointerEvents: "none",
                }}
              />
            )}
          </motion.button>
        </div>

        {/* Status + controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color:
                status === "error"
                  ? "#ff6b6b"
                  : status === "idle"
                    ? "var(--pearl-dim)"
                    : "var(--gold-bright)",
            }}
          >
            {status === "idle" && "Press to start"}
            {status === "connecting" && "Connecting…"}
            {status === "connected" && (agentSpeaking ? "AiA is speaking…" : "Listening…")}
            {status === "error" && "Mic access required"}
          </div>

          {status === "connected" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              style={{
                background: isMuted ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(212,168,67,0.25)",
                borderRadius: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                color: isMuted ? "#D4A843" : "rgba(200,215,230,0.7)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
              {isMuted ? "Unmute" : "Mute"}
            </motion.button>
          )}
        </div>
      </div>

      {/* ─── Transcript Box ──────────────────────────────────── */}
      <div
        style={{
          background: "rgba(5,8,15,0.85)",
          border: "1px solid rgba(212,168,67,0.18)",
          borderRadius: "16px",
          overflow: "hidden",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isActive
                  ? "#4ade80"
                  : transcript.length > 0
                    ? "var(--gold-bright)"
                    : "rgba(200,215,230,0.25)",
                boxShadow: isActive ? "0 0 8px rgba(74,222,128,0.5)" : "none",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "var(--pearl-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Live Transcript
            </span>
          </div>

          <button
            onClick={copyTranscript}
            disabled={transcript.length === 0}
            title="Copy transcript to clipboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid rgba(212,168,67,0.25)",
              background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
              color: copied ? "#4ade80" : "var(--pearl-dim)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: transcript.length === 0 ? "not-allowed" : "pointer",
              opacity: transcript.length === 0 ? 0.4 : 1,
              transition: "all 0.2s ease",
              letterSpacing: "0.03em",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div
          style={{
            minHeight: "200px",
            maxHeight: "420px",
            overflowY: "auto",
            padding: "20px",
            scrollBehavior: "smooth",
          }}
          className="transcript-scroll"
        >
          {transcript.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "160px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "rgba(212,168,67,0.08)",
                  border: "1px solid rgba(212,168,67,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mic size={20} style={{ color: "rgba(212,168,67,0.4)" }} />
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--pearl-dim)",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                {isActive
                  ? "Waiting for conversation to begin…"
                  : "Start a conversation to see the live transcript here."}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {transcript.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background:
                        entry.role === "ai" ? "rgba(212,168,67,0.15)" : "rgba(100,140,200,0.12)",
                      border: `1px solid ${
                        entry.role === "ai" ? "rgba(212,168,67,0.3)" : "rgba(100,140,200,0.2)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color:
                        entry.role === "ai" ? "var(--gold-bright)" : "rgba(140,170,220,0.8)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {entry.role === "ai" ? "AiA" : "You"}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background:
                        entry.role === "ai" ? "rgba(212,168,67,0.06)" : "rgba(100,140,200,0.05)",
                      border: `1px solid ${
                        entry.role === "ai" ? "rgba(212,168,67,0.12)" : "rgba(100,140,200,0.08)"
                      }`,
                      borderRadius: "12px",
                      padding: "12px 16px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.6,
                        color: "var(--pearl-muted)",
                        margin: 0,
                      }}
                    >
                      {entry.text}
                    </p>
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--pearl-dim)",
                        marginTop: "6px",
                        display: "block",
                        opacity: 0.6,
                      }}
                    >
                      {entry.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          )}
        </div>
      </div>
    </>
  );

  // ─── Main render ───────────────────────────────────────────────────
  return (
    <>
      <SEO
        title="Talk to AiA | AiiACo"
        description="Speak directly with AiA, AiiACo's AI diagnostic agent. Get instant answers about AI integration, operational intelligence, and managed automation for your business."
        path="/talk"
        keywords="talk to AiA, AI voice agent, AiiACo diagnostic, AI consultation, voice AI"
      />
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#03050A", position: "relative", overflow: "hidden" }}
      >
        {/* ─── Holographic Video Watermark Background ─── */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          onEnded={handleVideoEnded}
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "100vw",
            minHeight: "100vh",
            width: "auto",
            height: "auto",
            objectFit: "cover",
            zIndex: 0,
            opacity: videoPlaying ? 0.35 : 0,
            transition: "opacity 1.5s ease-in-out",
            pointerEvents: "none",
            mixBlendMode: "screen",
            filter: "saturate(0.7) brightness(1.4)",
          }}
        />
        {/* Lighter gradient overlay - lets more video through */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(ellipse at center, rgba(3,5,10,0.15) 0%, rgba(3,5,10,0.50) 70%, rgba(3,5,10,0.80) 100%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar />

          <main
            className="flex-1"
            style={{
              paddingTop: "140px",
              paddingBottom: "80px",
              fontFamily: FF,
            }}
          >
            <div
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                padding: "0 24px",
              }}
            >
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <div className="section-pill" style={{ marginBottom: "20px" }}>
                  <span className="dot" />
                  <span>VOICE DIAGNOSTIC</span>
                </div>
                <h1
                  style={{
                    fontFamily: FF,
                    fontSize: "clamp(32px, 5vw, 48px)",
                    fontWeight: 700,
                    color: "var(--pearl)",
                    lineHeight: 1.15,
                    marginBottom: "16px",
                  }}
                >
                  Talk to{" "}
                  <span style={{ color: "var(--gold-bright)" }}>AiA</span>
                </h1>
                <p
                  style={{
                    fontFamily: FF,
                    fontSize: "16px",
                    color: "var(--pearl-dim)",
                    maxWidth: "520px",
                    margin: "0 auto",
                    lineHeight: 1.6,
                  }}
                >
                  {view === "verified"
                    ? "Welcome back. AiA has your context and is ready to continue where you left off."
                    : "AiA is our AI diagnostic agent. Share your details or just start talking."}
                </p>
              </div>

              {/* View-specific content */}
              {view === "landing" && renderLanding()}
              {view === "magic-link-sent" && renderMagicLinkSent()}
              {view === "voice" && renderVoiceUI()}
              {view === "verified" && (
                <>
                  {renderVerifiedBanner()}
                  {renderPreviousTranscripts()}
                  {renderVoiceUI()}
                </>
              )}

              {/* Phone fallback */}
              {(view === "voice" || view === "verified") && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    color: "var(--pearl-dim)",
                    marginTop: "20px",
                    opacity: 0.6,
                    lineHeight: 1.5,
                  }}
                >
                  You can also call AiA directly at{" "}
                  <a
                    href="tel:+18888080001"
                    style={{ color: "var(--gold-bright)", textDecoration: "none" }}
                  >
                    +1 (888) 808-0001
                  </a>
                </p>
              )}

              {/* Back to landing from voice view */}
              {view === "voice" && (
                <div style={{ textAlign: "center", marginTop: "16px" }}>
                  <button
                    onClick={() => {
                      if (isActive) endConversation();
                      setView("landing");
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(212,168,67,0.15)",
                      background: "transparent",
                      color: "var(--pearl-dim)",
                      fontFamily: FF,
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: 0.7,
                    }}
                  >
                    <ArrowLeft size={12} />
                    Back to options
                  </button>
                </div>
              )}
            </div>
          </main>

          <Footer />
        </div>

        {/* ─── Play Video button for return visitors ─── */}
        {!isFirstVisit && !videoPlaying && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handlePlayVideo}
            title="Play AiA intro video"
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(212,168,67,0.18)",
              background: "rgba(3,5,10,0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "rgba(200,215,230,0.5)",
              fontFamily: FF,
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(212,168,67,0.8)";
              e.currentTarget.style.borderColor = "rgba(212,168,67,0.35)";
              e.currentTarget.style.background = "rgba(3,5,10,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(200,215,230,0.5)";
              e.currentTarget.style.borderColor = "rgba(212,168,67,0.18)";
              e.currentTarget.style.background = "rgba(3,5,10,0.6)";
            }}
          >
            <Play size={14} />
            Play Intro
          </motion.button>
        )}
      </div>

      <style>{`
        .transcript-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .transcript-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .transcript-scroll::-webkit-scrollbar-thumb {
          background: rgba(212,168,67,0.2);
          border-radius: 3px;
        }
        .transcript-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(212,168,67,0.35);
        }
      `}</style>
    </>
  );
}
