import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import type { AyaBriefData } from "@/components/dashboard/AyaBriefCard";

// Per-user staff Aya (Nemr vision: "every role a landing page around decisions").
// Calls the aya-my-brief edge fn, which reads the caller's own smart queue and
// returns a short "what to do first and why" over their work orders (cached
// server-side per user/day/locale). Returns null until there is a brief, so the
// card is invisible for staff with no queue or before Aya is live.
export function useMyAyaBrief() {
  const { locale } = useI18n();
  const { user } = useAuth();
  return useQuery({
    queryKey: ["aya_my_brief", user?.id ?? null, locale],
    enabled: !!user,
    queryFn: async (): Promise<AyaBriefData | null> => {
      const { data, error } = await supabase.functions.invoke("aya-my-brief", { body: { locale } });
      // Aya is an enhancement: any failure degrades to "no brief" rather than
      // breaking the staff landing page.
      if (error) return null;
      const brief = (data as { brief?: AyaBriefData | null } | null)?.brief;
      return brief && brief.headline ? brief : null;
    },
    // Track the queue it summarizes: the smart queue refetches every 60s, so the
    // brief refetches a beat later. The edge fn returns its cached brief (no LLM)
    // unless the queue signature changed, so this is cheap; it only regenerates
    // when the worker's queue actually changes (e.g. they finish a task).
    staleTime: 60_000,
    refetchInterval: 90_000,
    retry: false,
  });
}
