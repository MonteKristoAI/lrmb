import { useState } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as { from?: string })?.from || "/tasks";

  if (authLoading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "linear-gradient(180deg, #060B14 0%, #0D1526 50%, #080E1A 100%)" }}>
      <div className="text-lg animate-pulse" style={{ color: "#C4BAB1" }}>Loading...</div>
    </div>
  );
  if (session) return <Navigate to={from} replace />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: "linear-gradient(180deg, #060B14 0%, #0D1526 50%, #080E1A 100%)" }}>
      {/* Logo centered */}
      <div className="mb-10 text-center">
        <img src="/lrmb-logo-white.png" alt="Luxury Rentals Miami Beach" className="h-24 w-auto mx-auto object-contain mb-4" />
        <div className="h-px w-16 mx-auto" style={{ background: "linear-gradient(90deg, transparent, #C4BAB1, transparent)" }} />
        <p className="text-xs tracking-[0.25em] uppercase mt-4" style={{ color: "#8A8078" }}>Field Operations</p>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="rounded-xl p-6 space-y-5" style={{ background: "rgba(13,21,38,0.8)", border: "1px solid rgba(196,186,177,0.1)", backdropFilter: "blur(12px)" }}>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium" style={{ color: "#8A8078" }}>Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@lrmb.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="tap-target bg-transparent border-0 text-sm"
              style={{ borderBottom: "1px solid rgba(196,186,177,0.15)", borderRadius: 0, paddingLeft: 0, color: "#E8E2DC" }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium" style={{ color: "#8A8078" }}>Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="tap-target bg-transparent border-0 text-sm"
              style={{ borderBottom: "1px solid rgba(196,186,177,0.15)", borderRadius: 0, paddingLeft: 0, color: "#E8E2DC" }}
            />
          </div>
          <Button
            type="submit"
            className="w-full tap-target text-sm font-semibold tracking-wide mt-2"
            style={{ background: "#C4BAB1", color: "#080E1A", borderRadius: "6px", height: "48px" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-[11px] mt-6" style={{ color: "#4A4540" }}>
          Contact your administrator for account access
        </p>
      </div>
    </div>
  );
};

export default Login;
