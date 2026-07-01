import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// v3.0 Wave 1/2 (2026-07-01): role-based post-login landing.
// L10 fix: only wait on auth.loading, not on roles.length. A signed-in user
// with zero user_roles rows would infinite-load forever otherwise.
// Also translated the loading string.
export default function RoleHome() {
  const { loading, hasAdminAccess, hasRole } = useAuth();
  const { t } = useI18n();
  const timeoutFired = useRef(false);

  // Safety net: if auth still says loading after 4s, fall through to /tasks
  // rather than trap the user on a spinner. Real hydration usually completes
  // in <1s.
  useEffect(() => {
    const id = setTimeout(() => { timeoutFired.current = true; }, 4000);
    return () => clearTimeout(id);
  }, []);

  if (loading && !timeoutFired.current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary text-lg animate-pulse">{t("Loading…")}</div>
      </div>
    );
  }

  if (hasAdminAccess()) {
    return <Navigate to="/command-center" replace />;
  }
  if (hasRole("supervisor")) {
    return <Navigate to="/supervisor/today" replace />;
  }
  return <Navigate to="/tasks" replace />;
}
