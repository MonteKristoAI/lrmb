import { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { MobileNav } from "./MobileNav";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogOut, Globe, BellRing, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { profile, signOut } = useAuth();
  const { locale, setLocale } = useI18n();
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-primary truncate">{title || "LRMB Ops"}</h1>
          <p className="text-xs text-muted-foreground truncate">{profile?.full_name || ""}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "en" ? "es" : "en")}
            className="tap-target text-xs px-2"
            title={locale === "en" ? "Switch to Spanish" : "Cambiar a Ingles"}
          >
            <Globe className="h-4 w-4 mr-1" />
            {locale.toUpperCase()}
          </Button>
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
