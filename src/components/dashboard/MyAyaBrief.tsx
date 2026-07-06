import { useMyAyaBrief } from "@/hooks/useMyAyaBrief";
import { AyaBriefCard } from "@/components/dashboard/AyaBriefCard";

// Staff-facing Aya: a compact "what to do first and why" over the field worker's
// own smart queue, at the top of MyTasks. Invisible until a brief exists.
export function MyAyaBrief() {
  const { data: brief, isLoading } = useMyAyaBrief();
  if (isLoading || !brief) return null;
  return <AyaBriefCard brief={brief} compact />;
}
