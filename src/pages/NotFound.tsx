import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#080E1A" }}>
        <div className="text-lg animate-pulse" style={{ color: "#C4BAB1" }}>{t("Loading...")}</div>
      </div>
    );
  }

  // Unauthenticated: redirect to login instead of showing broken AppShell
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={{ background: "#080E1A" }}>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold" style={{ color: "#C4BAB1" }}>404</h1>
          <p className="text-lg" style={{ color: "#8B8680" }}>{t("Page not found")}</p>
          <Button onClick={() => navigate("/login")} className="tap-target" style={{ background: "#C4BAB1", color: "#080E1A" }}>
            {t("Go to Login")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AppShell title={t("Not Found")}>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">{t("Page not found")}</p>
          <Button onClick={() => navigate("/tasks")} className="tap-target">
            {t("Back to Work Orders")}
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default NotFound;
