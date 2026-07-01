import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

// v3.0 Wave 1/2 (2026-07-01): role-based post-login landing.
// Sits at the root path so a fresh sign-in bounces here first. Reads
// useAuth() roles and forwards each role to their own home:
//   admin OR manager -> /command-center
//   supervisor       -> /supervisor/today
//   else             -> /tasks
// Renders a Loading placeholder until roles hydrate to prevent a brief
// flash of the default-role destination for privileged users.
export default function RoleHome() {
  const { loading, roles, hasAdminAccess, hasRole } = useAuth();

  if (loading || roles.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary text-lg animate-pulse">Loading…</div>
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
