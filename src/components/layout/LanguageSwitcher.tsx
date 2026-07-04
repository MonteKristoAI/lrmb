import { Globe, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Full language picker: Globe icon + short language code, opens a dropdown
// listing every locale with the active one checked. Compact enough to fit
// in the AppShell header and the DesktopSidebar footer, tall enough to be
// obviously interactive.
//
// Before this, the app auto-detected browser locale but had no in-app
// override, so a user whose browser reported en-US had no way to see the
// Spanish accent polish render. `useI18n` already exposed setLocale, this
// component just puts a visible entry point on it.

const LANGUAGES: Array<{ code: "en" | "es"; label: string; short: string }> = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

export function LanguageSwitcher({
  className,
  variant = "compact",
}: {
  className?: string;
  // "compact" = icon + short code (header/sidebar footer)
  // "full"    = icon + full language name (settings pages, wider surfaces)
  variant?: "compact" | "full";
}) {
  const { locale, setLocale, t } = useI18n();
  const current = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "compact" ? "icon" : "sm"}
          aria-label={t("Switch language")}
          title={t("Switch language")}
          className={
            (variant === "compact"
              ? "h-9 w-9 gap-1 px-0"
              : "h-9 gap-1.5 px-2.5") +
            " " +
            (className ?? "")
          }
          data-testid="language-switcher"
        >
          <Globe
            className="h-4 w-4 shrink-0"
            style={{ color: "#C4BAB1" }}
            aria-hidden="true"
          />
          {/* Sub-380px viewports (older iPhone SE, Android S8/S9) don't have
              room for the short code alongside the header's other icons - the
              page title truncates ("Work Order D..."). Hide the code on those
              widths; the dropdown itself is still the source of truth for the
              current locale. */}
          <span
            className={
              "text-[10px] font-semibold uppercase tracking-wider leading-none " +
              (variant === "compact" ? "hidden min-[380px]:inline" : "")
            }
            style={{ color: "#C4BAB1" }}
            aria-hidden="true"
          >
            {variant === "compact" ? current.short : current.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-[10rem]"
        style={{
          background: "#0f1524",
          border: "1px solid rgba(196,186,177,0.16)",
          color: "#C4BAB1",
        }}
      >
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === locale;
          return (
            <DropdownMenuItem
              key={lang.code}
              onSelect={() => setLocale(lang.code)}
              data-testid={`language-option-${lang.code}`}
              aria-current={isActive ? "true" : undefined}
              className="flex items-center justify-between gap-6 cursor-pointer focus:bg-white/5"
              style={{ color: "#C4BAB1" }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: isActive ? "#c9a84c" : "#7a7570" }}
                >
                  {lang.short}
                </span>
                <span
                  className="text-sm"
                  style={{ color: isActive ? "#C4BAB1" : "#a19a91" }}
                >
                  {lang.label}
                </span>
              </span>
              <Check
                className={"h-4 w-4 shrink-0 " + (isActive ? "opacity-100" : "opacity-0")}
                style={{ color: "#c9a84c" }}
                aria-hidden="true"
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
