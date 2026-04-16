import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOut, BellRing, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { profile, signOut } = useAuth();
  const { locale, setLocale } = useI18n();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#080E1A" }}>
      <header className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(8,14,26,0.95)", borderBottom: "1px solid rgba(196,186,177,0.08)", backdropFilter: "blur(12px)" }}>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold truncate" style={{ color: "#C4BAB1" }}>{title || "LRMB Ops"}</h1>
          <p className="text-[10px] truncate" style={{ color: "#5A5550" }}>{profile?.full_name || ""}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocale(locale === "en" ? "es" : "en")}
            className="tap-target h-9 w-9"
            title={locale === "en" ? "Cambiar a Espanol" : "Switch to English"}
          >
            <span className="text-[10px] font-bold" style={{ color: "#5A5550" }}>{locale === "en" ? "ES" : "EN"}</span>
          </Button>
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
