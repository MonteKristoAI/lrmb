import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// v34: safe date formatters — null/undefined/empty string/Invalid Date all
// return the fallback instead of throwing "RangeError: Invalid time value".
// Use everywhere we render a possibly-null date column from Supabase.
export function safeFormat(value: string | null | undefined, pattern: string, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  try { return format(d, pattern); } catch { return fallback; }
}

export function safeDistance(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  try { return formatDistanceToNow(d, { addSuffix: true }); } catch { return fallback; }
}
