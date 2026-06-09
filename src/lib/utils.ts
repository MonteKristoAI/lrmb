import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// L10 wave 7 (2026-06-10): i18n awareness. Reads the live locale at format
// time from localStorage so date strings match the user's selected language
// without threading locale through every component prop. Locale = 'es' →
// Spanish month names + relative-distance phrases ("hace 2 horas").
function currentDateLocale() {
  if (typeof window === "undefined") return undefined;
  try {
    const saved = localStorage.getItem("lrmb_locale");
    return saved === "es" ? es : undefined;
  } catch {
    return undefined;
  }
}

// v34: safe date formatters — null/undefined/empty string/Invalid Date all
// return the fallback instead of throwing "RangeError: Invalid time value".
// Use everywhere we render a possibly-null date column from Supabase.
export function safeFormat(value: string | null | undefined, pattern: string, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  try { return format(d, pattern, { locale: currentDateLocale() }); } catch { return fallback; }
}

export function safeDistance(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  try { return formatDistanceToNow(d, { addSuffix: true, locale: currentDateLocale() }); } catch { return fallback; }
}
