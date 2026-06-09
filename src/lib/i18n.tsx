import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getTranslation } from "./translations";

type Locale = "en" | "es";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    // L10 wave 5 (2026-06-09) — i18n P0-2: auto-detect browser language for
    // first-time visitors. Maria-the-HK-lead with es-MX browser used to land
    // on English splash because the only locale signal was localStorage.
    // Explicit user toggle still wins (saved value takes priority).
    const saved = localStorage.getItem("lrmb_locale");
    if (saved === "es" || saved === "en") return saved;
    const browserEs = (navigator.language ?? "").toLowerCase().startsWith("es");
    return browserEs ? "es" : "en";
  });

  const handleSetLocale = (l: Locale) => {
    setLocale(l);
    localStorage.setItem("lrmb_locale", l);
  };

  const t = useCallback((key: string) => getTranslation(key, locale), [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
