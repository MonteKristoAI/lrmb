/**
 * PortalAuth - Client login & signup for the Voice Agent Portal.
 * Dark gold AiiACo aesthetic. Email/password auth.
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { setClientToken } from "@/lib/clientToken";
import { useLocation } from "wouter";
import { Mic, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const FF = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
const FFD = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export default function PortalAuth() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [website, setWebsite] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = trpc.vaas.auth.login.useMutation({
    onSuccess: (data) => {
      setClientToken(data.token);
      toast.success("Welcome back");
      setLocation("/portal");
    },
    onError: (err) => toast.error(err.message),
  });

  const signupMutation = trpc.vaas.auth.signup.useMutation({
    onSuccess: (data) => {
      setClientToken(data.token);
      toast.success("Account created - welcome to AiiACo");
      setLocation("/portal");
    },
    onError: (err) => toast.error(err.message),
  });

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      loginMutation.mutate({ email, password });
    } else {
      if (!companyName.trim()) { toast.error("Company name is required"); return; }
      signupMutation.mutate({ email, password, companyName, contactName, websiteUrl: website || undefined });
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: FF, fontSize: 14, color: "rgba(255,255,255,0.88)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 8, padding: "12px 14px", width: "100%",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s ease",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#03050A",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
            background: "rgba(184,156,74,0.12)",
            border: "1px solid rgba(184,156,74,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Mic size={26} style={{ color: "#B89C4A" }} />
          </div>
          <h1 style={{
            fontFamily: FFD, fontSize: 22, fontWeight: 700, color: "#B89C4A",
            letterSpacing: "0.02em", margin: 0,
          }}>
            AiiACo Voice Agent Portal
          </h1>
          <p style={{
            fontFamily: FF, fontSize: 13, color: "rgba(200,215,230,0.50)",
            marginTop: 8,
          }}>
            {mode === "login" ? "Sign in to manage your AI voice agent" : "Create your account to get started"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          background: "rgba(8,14,24,0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, padding: 28,
        }}>
          {mode === "signup" && (
            <>
              <label style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6 }}>
                Company Name *
              </label>
              <input
                type="text" value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
                style={{ ...inputStyle, marginBottom: 16 }}
                required
              />

              <label style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6 }}>
                Your Name *
              </label>
              <input
                type="text" value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your full name"
                style={{ ...inputStyle, marginBottom: 16 }}
                required
              />

              <label style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6 }}>
                Website
              </label>
              <input
                type="url" value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                style={{ ...inputStyle, marginBottom: 16 }}
              />
            </>
          )}

          <label style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{ ...inputStyle, marginBottom: 16 }}
            required
          />

          <label style={{ fontFamily: FF, fontSize: 12, fontWeight: 600, color: "rgba(200,215,230,0.55)", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative", marginBottom: 24 }}>
            <input
              type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: 44 }}
              required minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "rgba(200,215,230,0.40)",
                cursor: "pointer", padding: 0,
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              fontFamily: FF, fontSize: 14, fontWeight: 700,
              color: "#03050A", background: "rgba(184,156,74,0.90)",
              border: "none", borderRadius: 8, padding: "13px 28px",
              cursor: isLoading ? "wait" : "pointer", width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.15s ease",
            }}
          >
            {isLoading ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <>
                {mode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{
              fontFamily: FF, fontSize: 13, color: "rgba(184,156,74,0.80)",
              background: "none", border: "none", cursor: "pointer",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Back to main site */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <a
            href="/"
            style={{
              fontFamily: FF, fontSize: 12, color: "rgba(200,215,230,0.35)",
              textDecoration: "none",
            }}
          >
            ← Back to aiiaco.com
          </a>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input:focus { border-color: rgba(184,156,74,0.40) !important; }
      `}</style>
    </div>
  );
}
