import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "field_staff" | "admin" | "supervisor" | "manager";
  requireAdminAccess?: boolean;
}

export function ProtectedRoute({ children, requiredRole, requireAdminAccess }: ProtectedRouteProps) {
  const { session, loading, hasRole, hasAdminAccess } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-primary text-lg animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole) && !hasAdminAccess()) return <Navigate to="/tasks" replace />;
  if (requireAdminAccess && !hasAdminAccess()) return <Navigate to="/tasks" replace />;

  return <>{children}</>;
}
