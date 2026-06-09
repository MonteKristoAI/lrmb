import { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function UpdatePrompt() {
  const { t } = useI18n();
  // QA P2 Q-PERF-24: keep a ref to the active registration so we can clear
  // the interval on unmount. Previously the setInterval captured by
  // onRegistered could outlive the component if it ever remounted (HMR
  // during dev, future route restructure, etc.) and leak.
  const intervalRef = useRef<number | null>(null);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (!r || intervalRef.current !== null) return;
      intervalRef.current = window.setInterval(() => r.update(), 30 * 60 * 1000);
    },
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  if (!needRefresh) return null;

  return (
    // L10 wave 14: top-32 to stack below OfflineBanner (top-14) without
    // overlap. InstallPrompt (when shown) sits at top-48 below this one.
    <div className="fixed top-32 left-4 right-4 z-50 rounded-lg border border-primary/30 bg-card p-3 shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4" role="status" aria-live="polite">
      <RefreshCw className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
      <p className="text-sm text-foreground flex-1">{t("New version available")}</p>
      <Button size="sm" onClick={() => updateServiceWorker(true)}>{t("Update")}</Button>
    </div>
  );
}
