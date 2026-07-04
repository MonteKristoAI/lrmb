import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ClipboardList, LayoutDashboard, ShieldCheck, CheckSquare, LogOut, BellRing, BellOff, Command, Building2, SlidersHorizontal, FileSearch, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface NavItem { label: string; icon: React.ElementType; path: string; }

// Desktop sidebar (md+). Mirrors MobileNav's role-aware items but lays
// them out as a left rail with the brand on top and the user/sign-out
// pinned to the bottom. Mobile (<md) keeps MobileNav at the bottom.
//
// Added 2026-06-11: prior to this the app only rendered MobileNav (with
// md:hidden), so admin/supervisor links disappeared on desktop and the
// only way to reach /admin or /supervisor was typing the URL.
export function DesktopSidebar() {
  const { hasAdminAccess, hasRole, profile, signOut } = useAuth();
  const { t } = useI18n();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const items: NavItem[] = [];
  // v3.0 Wave 2: Command Center goes first for admin/manager since that is their home now
  if (hasAdminAccess()) {
    items.push({ label: t("Command Center"), icon: Command, path: "/command-center" });
  }
  items.push({ label: t("Work Orders"), icon: ClipboardList, path: "/tasks" });
  if (hasAdminAccess()) {
    items.push({ label: t("Admin"), icon: LayoutDashboard, path: "/admin" });
    items.push({ label: t("Properties"), icon: Building2, path: "/admin/properties" });
    items.push({ label: t("SLA Config"), icon: SlidersHorizontal, path: "/admin/sla" });
    items.push({ label: t("Audit Log"), icon: FileSearch, path: "/admin/audit" });
  }
  if (hasRole("supervisor") || hasRole("manager") || hasRole("admin")) {
    items.push({ label: t("Supervisor"), icon: ShieldCheck, path: "/supervisor" });
  }
  items.push({ label: t("Completed"), icon: CheckSquare, path: "/tasks/completed" });
  items.push({ label: t("Help"), icon: HelpCircle, path: "/help" });

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen"
      style={{ background: "rgba(8,14,26,0.97)", borderRight: "1px solid rgba(196,186,177,0.08)" }}
    >
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(196,186,177,0.08)" }}>
        <h1 className="text-base font-bold tracking-tight" style={{ color: "#C4BAB1" }}>LRMB Ops</h1>
        <p className="text-[11px] truncate mt-0.5" style={{ color: "#5A5550" }}>{profile?.full_name || ""}</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {items.map((item) => {
          const isActive = item.path === "/tasks"
            ? location.pathname === "/tasks" || (location.pathname.startsWith("/tasks/") && !location.pathname.startsWith("/tasks/completed"))
            : location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors"
              style={{
                color: isActive ? "#C4BAB1" : "#7A7570",
                background: isActive ? "rgba(196,186,177,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(196,186,177,0.04)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-3 flex items-center gap-1" style={{ borderTop: "1px solid rgba(196,186,177,0.08)" }}>
        {isSupported && (
          <Button
            variant="ghost"
            size="icon"
            onClick={isSubscribed ? unsubscribe : subscribe}
            aria-label={isSubscribed ? t("Disable push notifications") : t("Enable push notifications")}
            className="h-9 w-9"
            title={isSubscribed ? t("Disable push notifications") : t("Enable push notifications")}
            data-testid="push-notifications-toggle"
          >
            {isSubscribed ? <BellRing className="h-4 w-4" style={{ color: "#C4BAB1" }} aria-hidden="true" /> : <BellOff className="h-4 w-4" style={{ color: "#5A5550" }} aria-hidden="true" />}
          </Button>
        )}
        <LanguageSwitcher />
        <NotificationBell />
        <Button
          variant="ghost"
          size="icon"
          onClick={signOut}
          aria-label={t("Sign out")}
          className="h-9 w-9 ml-auto"
        >
          <LogOut className="h-4 w-4" style={{ color: "#5A5550" }} aria-hidden="true" />
        </Button>
      </div>
    </aside>
  );
}
