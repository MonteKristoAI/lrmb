import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function OfflineBanner() {
  const { t } = useI18n();
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed top-14 left-4 right-4 z-50 rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-top-4" style={{ background: "rgba(180,80,20,0.95)", border: "1px solid rgba(255,150,50,0.3)" }} role="status" aria-live="polite">
      <WifiOff className="h-4 w-4 text-white shrink-0" aria-hidden="true" />
      <div className="flex-1 text-white">
        <p className="text-sm font-medium">{t("You are offline.")}</p>
        <p className="text-xs opacity-90">{t("Your changes will sync when you reconnect.")}</p>
      </div>
    </div>
  );
}
