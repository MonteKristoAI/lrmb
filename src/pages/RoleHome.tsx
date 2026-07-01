import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

// v3.0 Wave 1/2 (2026-07-01): role-based post-login landing.
// L10 fix: 4s safety timeout so a signed-in user with zero user_roles
// rows falls through to /tasks instead of hanging on a spinner. Uses
// useState so the timer actually triggers a re-render (a useRef flip
// does not).
export default function RoleHome() {
  const { loading, roles, hasAdminAccess, hasRole } = useAuth();
  const { t } = useI18n();
  const [safetyElapsed, setSafetyElapsed] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSafetyElapsed(true), 4000);
    return () => clearTimeout(id);
  }, []);

  const stillHydrating = (loading || roles.length === 0) && !safetyElapsed;
  if (stillHydrating) {
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
