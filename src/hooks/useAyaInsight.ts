import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

// Aya insight = the precomputed operational narrative (Nemr vision 2026-07-04).
// A cron edge fn writes it daily; this hook reads the cached latest row through
// the role-guarded aya_latest_insight RPC. Returns null until Aya has generated
// its first insight (or if the caller lacks the role, the RPC raises and the
// query surfaces an error, which the UI treats as "no brief yet").
export interface AyaInsight {
  scope: "platform" | "property";
  property_id: string | null;
  generated_for: string;
  headline: string;
  narrative: string;
  bullets: Array<{ severity?: string; text: string; entity_link?: string }>;
  model: string;
  generated_at: string;
}

export function useAyaInsight(scope: "platform" | "property", propertyId?: string) {
  const { locale } = useI18n();
  return useQuery({
    queryKey: ["aya_insight", scope, propertyId ?? null, locale],
    enabled: scope === "platform" || !!propertyId,
    queryFn: async (): Promise<AyaInsight | null> => {
      const { data, error } = await supabase.rpc("aya_latest_insight", {
        p_scope: scope,
        p_property_id: propertyId ?? null,
        p_locale: locale,
      });
      // A role-guard rejection (field_staff) or any RPC error is not fatal here:
      // Aya is an enhancement, so we degrade to "no brief" rather than break the page.
      if (error) return null;
      return (data ?? null) as AyaInsight | null;
    },
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
    retry: false,
  });
}
