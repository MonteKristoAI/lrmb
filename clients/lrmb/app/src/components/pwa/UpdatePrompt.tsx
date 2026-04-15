import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Check for updates every 30 minutes
        setInterval(() => r.update(), 30 * 60 * 1000);
      }
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 rounded-lg border border-primary/30 bg-card p-3 shadow-lg flex items-center gap-3 animate-in slide-in-from-top-4">
      <RefreshCw className="h-5 w-5 text-primary shrink-0" />
      <p className="text-sm text-foreground flex-1">New version available</p>
      <Button size="sm" onClick={() => updateServiceWorker(true)}>Update</Button>
    </div>
  );
}
