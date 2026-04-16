import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  if (loading) return null;

  // Unauthenticated: redirect to login instead of showing broken AppShell
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ background: "#080E1A" }}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold" style={{ color: "#C4BAB1" }}>404</h1>
          <p className="text-lg" style={{ color: "#5A5550" }}>Page not found</p>
          <Button onClick={() => navigate("/login")} className="tap-target" style={{ background: "#C4BAB1", color: "#080E1A" }}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppShell title="Not Found">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">Page not found</p>
          <Button onClick={() => navigate("/tasks")} className="tap-target">
            Back to Tasks
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
