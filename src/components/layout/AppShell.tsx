import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOut, BellRing, BellOff, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const ROOT_PATHS = ["/tasks", "/admin", "/supervisor", "/tasks/completed"];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { profile, signOut } = useAuth();
  const { t } = useI18n();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = !ROOT_PATHS.includes(location.pathname);

  // L10 wave 5 (2026-06-09) a11y: deep-linked landings (push notif click,
  // share-link viewer) have history.length <= 1 — Back button strands them
  // on about:blank. Fall back to /tasks (the role-home shell decides where).
  const handleBack = () => {
    if (window.history.length <= 1) {
      navigate("/tasks");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080E1A" }}>
      {/* L10 wave 5 a11y P2-2: skip link for screen-reader / keyboard users.
          Visually hidden until focused; jumps past the header + nav to main. */}
      <a
        href="#lrmb-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:rounded focus:bg-white focus:text-black focus:shadow-lg"
      >
        {t("Skip to main content")}
      </a>
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(8,14,26,0.95)", borderBottom: "1px solid rgba(196,186,177,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-1 min-w-0">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label={t("Back")}
              className="tap-target flex items-center justify-center h-9 w-9 shrink-0 -ml-2"
              style={{ color: "#C4BAB1" }}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate" style={{ color: "#C4BAB1" }}>{title || "LRMB Ops"}</h1>
            <p className="text-[10px] truncate" style={{ color: "#5A5550" }}>{profile?.full_name || ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {isSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isSubscribed ? unsubscribe : subscribe}
              aria-label={isSubscribed ? t("Disable push notifications") : t("Enable push notifications")}
              className="tap-target h-9 w-9"
              title={isSubscribed ? t("Disable push notifications") : t("Enable push notifications")}
            >
              {isSubscribed ? <BellRing className="h-4 w-4" style={{ color: "#C4BAB1" }} aria-hidden="true" /> : <BellOff className="h-4 w-4" style={{ color: "#5A5550" }} aria-hidden="true" />}
            </Button>
          )}
          <NotificationBell />
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            aria-label={t("Sign out")}
            className="tap-target h-9 w-9"
          >
            <LogOut className="h-4 w-4" style={{ color: "#5A5550" }} aria-hidden="true" />
          </Button>
        </div>
      </header>
      {/* L10 BUG-004 (2026-05-29): pb-24 (~88px) reserves space for the
          fixed MobileNav. Without it, the last item in any scrollable
          list sits behind the nav bar on desktop AND iOS Safari with
          tab-bar visible. The MobileNav height is ~80px; pb-24 covers
          it with breathing room. */}
      <main id="lrmb-main-content" className="flex-1 overflow-y-auto pb-24">{children}</main>
      <MobileNav />
    </div>
  );
}
