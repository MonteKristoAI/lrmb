import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) { setIsAdmin(false); setIsAuthenticated(false); setLoading(false); }
        return;
      }

      if (!cancelled) setIsAuthenticated(true);

      const { data, error } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!cancelled) {
        setIsAdmin(!error && !!data);
        setLoading(false);
      }
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  return { isAdmin, isAuthenticated, loading };
}
