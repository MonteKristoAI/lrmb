import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      if (profileRes.data) {
        const p = profileRes.data as Profile;
        if (p.active === false) {
          await supabase.auth.signOut();
          setSession(null);
          setProfile(null);
          setRoles([]);
          return false;
        }
        setProfile(p);
      }
      if (rolesRes.data) setRoles((rolesRes.data as { role: AppRole }[]).map((r) => r.role));
      return true;
    } catch {
      setProfile(null);
      setRoles([]);
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

  const hasRole = (role: AppRole) => roles.includes(role);
  const hasAdminAccess = () => roles.some((r) => ["admin", "manager"].includes(r));

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        roles,
        loading,
        hasRole,
        hasAdminAccess,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
