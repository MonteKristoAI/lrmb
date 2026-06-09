import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "field_staff" | "admin" | "supervisor" | "manager";

interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  active: boolean;
  // 2026-05-29: vendor_id powers vendor-membership visibility on tasks
  // (the .or() filter in useTasks). Was being read at runtime via
  // TS-erasure; making it explicit so future readers know it's a real
  // load-bearing field. department is included for the same reason
  // (admin UI surfaces it).
  vendor_id: string | null;
  department: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  loading: boolean;
  hasRole: (role: AppRole) => boolean;
  hasAdminAccess: () => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndRoles = async (userId: string): Promise<boolean> => {
    // v31: harden auth flow — any failure mode in profile or roles fetch
    // must sign the user out instead of leaving them in a half-authenticated
    // state with stale roles. Previously a profile fetch error silently kept
    // the prior roles, and an inactive profile that errored on fetch would
    // remain signed in with admin role granted from a previous session.
    setRoles([]);
    setProfile(null);
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);

      if (profileRes.error) {
        console.error("auth: profile fetch failed", profileRes.error);
        await supabase.auth.signOut();
        setSession(null);
        return false;
      }
      if (!profileRes.data) {
        console.warn("auth: no profile row for user", userId);
        await supabase.auth.signOut();
        setSession(null);
        return false;
      }
      const p = profileRes.data as Profile;
      if (p.active === false) {
        await supabase.auth.signOut();
        setSession(null);
        return false;
      }
      if (rolesRes.error) {
        console.error("auth: roles fetch failed", rolesRes.error);
        await supabase.auth.signOut();
        setSession(null);
        return false;
      }

      setProfile(p);
      setRoles((rolesRes.data ?? []).map((r) => (r as { role: AppRole }).role));
      return true;
    } catch (err) {
      console.error("auth: unexpected error in fetchProfileAndRoles", err);
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
      setSession(null);
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const syncSessionState = async (nextSession: Session | null) => {
      if (!isMounted) return;

      setSession(nextSession);
      if (nextSession?.user) {
        await fetchProfileAndRoles(nextSession.user.id);
      } else {
        setProfile(null);
        setRoles([]);
      }
      if (isMounted) setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      // Keep callback synchronous to avoid gotrue lock contention.
      queueMicrotask(() => {
        void syncSessionState(nextSession);
      });
      // L10 wave 16 (2026-06-10): tell the SW to wipe Supabase REST/storage
      // caches on sign-in/sign-out so user A's NetworkFirst-cached RLS-
      // filtered responses can't flash onto user B's first paint.
      if (_event === "SIGNED_OUT" || _event === "SIGNED_IN" || _event === "TOKEN_REFRESHED") {
        try {
          navigator.serviceWorker?.controller?.postMessage({ type: "lrmb_wipe_supabase_cache" });
        } catch { /* SW may not be ready yet */ }
      }
    });

    const initialize = async () => {
      setLoading(true);
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      await syncSessionState(initialSession);
    };

    void initialize();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // QA P1 Q-FE-1: stable function identities + memoized context value so we
  // don't re-render every consumer on each provider render.
  const hasRole = useCallback((role: AppRole) => roles.includes(role), [roles]);
  const hasAdminAccess = useCallback(
    () => roles.some((r) => ["admin", "manager"].includes(r)),
    [roles],
  );
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRoles([]);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      roles,
      loading,
      hasRole,
      hasAdminAccess,
      signOut,
    }),
    [session, profile, roles, loading, hasRole, hasAdminAccess, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
