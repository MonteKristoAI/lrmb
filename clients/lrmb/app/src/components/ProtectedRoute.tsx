import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "field_staff" | "admin" | "supervisor" | "manager";
  requireAdminAccess?: boolean;
  requireSupervisorAccess?: boolean;
}

export function ProtectedRoute({ children, requiredRole, requireAdminAccess, requireSupervisorAccess }: ProtectedRouteProps) {
  const { session, loading, hasRole, hasAdminAccess } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary text-lg animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (requiredRole && !hasRole(requiredRole) && !hasAdminAccess()) return <Navigate to="/tasks" replace />;
  if (requireAdminAccess && !hasAdminAccess()) return <Navigate to="/tasks" replace />;
  if (requireSupervisorAccess && !hasRole("supervisor") && !hasRole("manager") && !hasRole("admin")) return <Navigate to="/tasks" replace />;

  return <>{children}</>;
}
