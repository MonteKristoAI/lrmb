import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOut, BellRing, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { profile, signOut } = useAuth();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080E1A" }}>
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(8,14,26,0.95)", borderBottom: "1px solid rgba(196,186,177,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="min-w-0 flex items-center gap-3">
          <img src="/lrmb-logo-horizontal-white.webp" alt="LRMB" className="h-6 w-auto object-contain flex-shrink-0 opacity-90" />
          {title && (
            <div className="min-w-0">
              <span className="text-[11px] font-medium tracking-wide truncate" style={{ color: "#C4BAB1" }}>{title}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] mr-2 hidden sm:block" style={{ color: "#5A5550" }}>{profile?.full_name || ""}</span>
          {isSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isSubscribed ? unsubscribe : subscribe}
              className="tap-target"
              title={isSubscribed ? "Disable push notifications" : "Enable push notifications"}
            >
              {isSubscribed ? <BellRing className="h-4.5 w-4.5" style={{ color: "#C4BAB1" }} /> : <BellOff className="h-4.5 w-4.5" style={{ color: "#5A5550" }} />}
            </Button>
          )}
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={signOut} className="tap-target">
            <LogOut className="h-4.5 w-4.5" style={{ color: "#5A5550" }} />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <MobileNav />
    </div>
  );
}
