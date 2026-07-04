import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

// Small toggle button that flips locale between EN and ES.
// Before 2026-07-04 the app auto-detected browser locale but had no UI
// override, so a user whose browser language did not match their working
// language had no way to switch. Adding the toggle here surfaces the
// setLocale that useI18n already exposes.
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const next = locale === "en" ? "es" : "en";
  const label = locale === "en" ? "ES" : "EN";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLocale(next)}
      aria-label={t("Switch language")}
      title={t("Switch language")}
      className={"relative h-9 w-9 " + (className ?? "")}
      data-testid="language-switcher"
    >
      <Globe className="h-4 w-4" style={{ color: "#5A5550" }} aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 -right-0.5 rounded px-0.5 text-[8px] font-bold leading-none"
        style={{ color: "#C4BAB1", background: "rgba(8,14,26,0.85)" }}
      >
        {label}
      </span>
    </Button>
  );
}
