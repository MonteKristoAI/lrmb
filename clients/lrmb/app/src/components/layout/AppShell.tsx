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
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="min-w-0 flex items-center gap-3">
          <img src="/lrmb-logo-horizontal-white.webp" alt="LRMB" className="h-7 w-auto object-contain flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-foreground truncate">{title || ""}</h1>
            <p className="text-xs text-muted-foreground truncate">{profile?.full_name || ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={isSubscribed ? unsubscribe : subscribe}
              className="tap-target"
              title={isSubscribed ? "Disable push notifications" : "Enable push notifications"}
            >
              {isSubscribed ? <BellRing className="h-5 w-5 text-primary" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
            </Button>
          )}
          <NotificationBell />
          <Button variant="ghost" size="icon" onClick={signOut} className="tap-target">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <MobileNav />
    </div>
  );
}
