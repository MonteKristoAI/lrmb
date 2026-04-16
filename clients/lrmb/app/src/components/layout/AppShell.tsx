import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOut, BellRing, BellOff, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const ROOT_PATHS = ["/tasks", "/admin", "/supervisor", "/tasks/completed"];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { profile, signOut } = useAuth();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = !ROOT_PATHS.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080E1A" }}>
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(8,14,26,0.95)", borderBottom: "1px solid rgba(196,186,177,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-1 min-w-0">
          {showBack && (
            <button onClick={() => navigate(-1)} className="tap-target flex items-center justify-center h-9 w-9 shrink-0 -ml-2" style={{ color: "#C4BAB1" }}>
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate" style={{ color: "#C4BAB1" }}>{title || "LRMB Ops"}</h1>
            <p className="text-[10px] truncate" style={{ color: "#5A5550" }}>{profile?.full_name || ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {isSupported && (
            <Button variant="ghost" size="icon" onClick={isSubscribed ? unsubscribe : subscribe} className="tap-target h-9 w-9" title={isSubscribed ? "Disable push notifications" : "Enable push notifications"}>
              {isSubscribed ? <BellRing className="h-4 w-4" style={{ color: "#C4BAB1" }} /> : <BellOff className="h-4 w-4" style={{ color: "#5A5550" }} />}
            </Button>
          )}
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={signOut} className="tap-target h-9 w-9">
            <LogOut className="h-4 w-4" style={{ color: "#5A5550" }} />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <MobileNav />
    </div>
  );
}
