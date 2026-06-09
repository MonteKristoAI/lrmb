import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const { session } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lrmb_install_dismissed");
    if (saved) setDismissed(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // L10 wave 14 (2026-06-10) a11y P1-8: don't show the banner over admin
  // forms (CreateTask, OperationsOverview, etc.) — it covers the inputs.
  // Field-staff routes (/tasks, /inspections) keep the prompt because
  // installation is the whole point on mobile.
  const isAdminRoute = location.pathname.startsWith("/admin") ||
                        location.pathname.startsWith("/supervisor");
  if (!session || !deferredPrompt || dismissed || isAdminRoute) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("lrmb_install_dismissed", "1");
  };

  return (
    // L10 wave 14: top-48 to stack below OfflineBanner (top-14) and
    // UpdatePrompt (top-32). All three stack cleanly without overlap
    // even when shown together.
    <div className="fixed top-48 left-4 right-4 z-50 rounded-lg border border-primary/30 bg-card p-4 shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4" role="dialog" aria-labelledby="install-prompt-title">
      <Download className="h-8 w-8 text-primary shrink-0" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p id="install-prompt-title" className="text-sm font-semibold text-foreground">{t("Install LRMB Ops")}</p>
        <p className="text-xs text-muted-foreground">{t("Add to home screen for quick access")}</p>
      </div>
      <Button size="sm" onClick={handleInstall} className="shrink-0">{t("Install")}</Button>
      <button onClick={handleDismiss} aria-label={t("Dismiss install prompt")} className="text-muted-foreground p-1">
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
