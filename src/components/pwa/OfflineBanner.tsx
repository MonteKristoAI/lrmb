import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
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
    <div className="fixed top-14 left-4 right-4 z-50 rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-top-4" style={{ background: "rgba(180,80,20,0.95)", border: "1px solid rgba(255,150,50,0.3)" }}>
      <WifiOff className="h-4 w-4 text-white shrink-0" />
      <p className="text-sm text-white">You are offline. Data may be outdated.</p>
    </div>
  );
}
