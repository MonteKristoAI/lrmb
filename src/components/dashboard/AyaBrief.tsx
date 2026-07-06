import { useAyaInsight, type AyaInsight } from "@/hooks/useAyaInsight";
import { AyaBriefCard } from "@/components/dashboard/AyaBriefCard";

// Aya brief: the operational-awareness narrative at the top of the leadership
// views. "What needs attention today and why", so an operator decides in
// seconds instead of reading tiles. Renders nothing until Aya has produced its
// first insight (so the page is unchanged until the layer is live).
export function AyaBrief({
  scope,
  propertyId,
  compact = false,
}: {
  scope: "platform" | "property" | "housekeeping" | "maintenance";
  propertyId?: string;
  compact?: boolean;
}) {
  const { data: insight, isLoading } = useAyaInsight(scope, propertyId) as { data: AyaInsight | null | undefined; isLoading: boolean };

  // Invisible until Aya is live. No skeleton clutter on first paint.
  if (isLoading || !insight) return null;

  return <AyaBriefCard brief={insight} compact={compact} />;
}
