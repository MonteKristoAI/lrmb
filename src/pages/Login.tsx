import { useEffect, useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// QA Agent C P2-07 (2026-05-29): client-side brute-force gate.
// Supabase server-side rate-limits exist but are not user-visible.
// Track failed attempts in localStorage, gate the form for 60s after
// 5 failures within the same 60s window. Counter survives page reload
// (so refreshing doesn't reset the gate).
const BF_KEY = "lrmb_login_bf_v1";
const BF_WINDOW_MS = 60_000;
const BF_MAX = 5;
const BF_LOCKOUT_MS = 60_000;
type BFState = { attempts: number[]; lockedUntil?: number };
const loadBF = (): BFState => {
  try {
    const raw = localStorage.getItem(BF_KEY);
    if (!raw) return { attempts: [] };
    const s = JSON.parse(raw) as BFState;
    const now = Date.now();
    s.attempts = (s.attempts ?? []).filter((t) => now - t < BF_WINDOW_MS);
    if (s.lockedUntil && s.lockedUntil < now) delete s.lockedUntil;
    return s;
  } catch {
    return { attempts: [] };
  }
};
const saveBF = (s: BFState) => {
  try { localStorage.setItem(BF_KEY, JSON.stringify(s)); } catch { /* ignore */ }
};

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSending, setMagicSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutLeft, setLockoutLeft] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  // v3.0 Wave 1: default to "/" so post-login bounces through RoleHome and
  // each role lands on their own home (admin/manager -> /admin, supervisor ->
  // /supervisor/today, else -> /tasks). Was "/tasks" which forced everyone
  // through the field-staff home regardless of role.
  const from = (location.state as { from?: string })?.from || "/";

  // Countdown tick when locked out.
  useEffect(() => {
    const tick = () => {
      const s = loadBF();
      const left = s.lockedUntil ? Math.max(0, s.lockedUntil - Date.now()) : 0;
      setLockoutLeft(left);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (authLoading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(180deg, #060B14 0%, #0D1526 50%, #080E1A 100%)" }}>
      <div className="text-lg animate-pulse" style={{ color: "#C4BAB1" }}>{t("Loading...")}</div>
    </div>
  );
  if (session) return <Navigate to={from} replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const state = loadBF();
    const now = Date.now();
    if (state.lockedUntil && state.lockedUntil > now) {
      const left = Math.ceil((state.lockedUntil - now) / 1000);
      setErrorMessage(`${t("Too many attempts. Try again in")} ${left}s.`);
      return;
    }
    setErrorMessage(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      // Record failure + lock if over threshold.
      const next: BFState = { attempts: [...state.attempts, now] };
      if (next.attempts.length >= BF_MAX) {
        next.lockedUntil = now + BF_LOCKOUT_MS;
        next.attempts = [];
        setLockoutLeft(BF_LOCKOUT_MS);
        setErrorMessage(`${t("Too many attempts. Try again in")} ${Math.ceil(BF_LOCKOUT_MS / 1000)}s.`);
      } else {
        setErrorMessage(error.message);
      }
      saveBF(next);
      toast({ title: t("Login failed"), description: error.message, variant: "destructive" });
    } else {
      // Clear counter on success.
      saveBF({ attempts: [] });
      navigate(from, { replace: true });
    }
  };

  // Per Nemr Directive §15 + Emma reply: field staff log in via magic link.
  // Sends a one-time login link to the email; user clicks → straight in.
  const handleMagicLink = async () => {
    setErrorMessage(null);
    if (!email) {
      setErrorMessage(t("Enter your email first."));
      return;
    }
    setMagicSending(true);
    const redirectTo = `${window.location.origin}${from}`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
    });
    setMagicSending(false);
    if (error) {
      setErrorMessage(error.message);
      toast({ title: t("Could not send link"), description: error.message, variant: "destructive" });
    } else {
      setMagicSent(true);
      toast({ title: t("Check your email"), description: t("We sent you a one-time login link.") });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: "linear-gradient(180deg, #060B14 0%, #0D1526 50%, #080E1A 100%)" }}>
      {/* Logo centered */}
      <div className="mb-10 text-center">
        <img src="/lrmb-logo-white.png" alt="Luxury Rentals Miami Beach" className="h-24 w-auto mx-auto object-contain mb-4" />
        <div className="h-px w-16 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C4BAB1, transparent)" }} />
        <p className="text-xs tracking-[0.25em] uppercase mt-4" style={{ color: "#8A8078" }}>{t("Field Operations")}</p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="rounded-xl p-6 space-y-5" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(196,186,177,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium" style={{ color: "#8A8078" }}>{t("Email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@lrmb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="tap-target bg-transparent border-0 text-sm"
              style={{ borderBottom: "1px solid rgba(196,186,177,0.4)", borderRadius: 0, paddingLeft: 0, color: "#E8E2DC" }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium" style={{ color: "#8A8078" }}>{t("Password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="tap-target bg-transparent border-0 text-sm"
              style={{ borderBottom: "1px solid rgba(196,186,177,0.4)", borderRadius: 0, paddingLeft: 0, color: "#E8E2DC" }}
            />
          </div>
          <Button
            type="submit"
            className="w-full tap-target text-sm font-semibold tracking-wide mt-2"
            style={{ background: "#C4BAB1", color: "#080E1A", borderRadius: "6px", height: "48px" }}
            disabled={loading || magicSending || lockoutLeft > 0}
          >
            {lockoutLeft > 0
              ? `${t("Locked")} (${Math.ceil(lockoutLeft / 1000)}s)`
              : loading
                ? t("Signing in...")
                : t("Sign In")}
          </Button>

          <div className="flex items-center gap-2 my-1">
            <div className="flex-1 h-px" style={{ background: "rgba(196,186,177,0.1)" }} />
            <span className="text-[10px] tracking-wider uppercase" style={{ color: "#4A4540" }}>{t("or")}</span>
            <div className="flex-1 h-px" style={{ background: "rgba(196,186,177,0.1)" }} />
          </div>

          <Button
            type="button"
            onClick={handleMagicLink}
            className="w-full tap-target text-sm font-medium tracking-wide"
            style={{ background: "transparent", border: "1px solid rgba(196,186,177,0.3)", color: "#C4BAB1", borderRadius: "6px", height: "44px" }}
            disabled={magicSending || loading || magicSent}
          >
            {magicSent ? t("Link sent — check your email") : magicSending ? t("Sending...") : t("Email me a sign-in link")}
          </Button>

          {errorMessage && (
            <p role="alert" aria-live="assertive" className="text-xs mt-2" style={{ color: "#FCA5A5" }}>
              {errorMessage}
            </p>
          )}
        </form>

        <p className="text-center text-[11px] mt-6" style={{ color: "#4A4540" }}>
          {t("Accounts are admin-provisioned. Contact your administrator for access.")}
        </p>
      </div>
    </div>
  );
};

export default Login;
