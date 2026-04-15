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
    const saved = localStorage.getItem("lrmb_locale");
    return (saved === "es" ? "es" : "en") as Locale;
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
