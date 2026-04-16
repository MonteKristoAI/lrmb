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
      <header className="sticky top-0 z-30 px-4 py-3" style={{ background: "rgba(8,14,26,0.95)", borderBottom: "1px solid rgba(196,186,177,0.08)", backdropFilter: "blur(12px)" }}>
        {/* Top row: logo centered, actions right */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] w-20" style={{ color: "#5A5550" }}>{profile?.full_name || ""}</span>
          <img src="/lrmb-logo-white.png" alt="Luxury Rentals Miami Beach" className="h-12 w-auto object-contain" />
          <div className="flex items-center gap-0.5 w-20 justify-end">
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
        </div>
        {/* Page title below logo */}
        {title && <p className="text-center text-[11px] tracking-widest uppercase" style={{ color: "#6A6058" }}>{title}</p>}
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <MobileNav />
    </div>
  );
}
