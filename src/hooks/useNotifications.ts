import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { NotificationEvent } from "@/types/notification";

// QA P1 Q-FE-2: explicit column lists; longer polling interval to ease mobile
// radio; refetchIntervalInBackground:false so a backgrounded tab doesn't keep
// the radio awake.
const NOTIFICATION_COLUMNS =
  "id, recipient_id, event_type, title, body, task_id, read, created_at";

export function useNotifications(userId: string | undefined) {
  return useQuery({
    queryKey: ["notifications", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_events")
        .select(NOTIFICATION_COLUMNS)
        .eq("recipient_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as NotificationEvent[];
    },
    refetchInterval: 120_000,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  });
}

export function useUnreadCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["unread_count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notification_events")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", userId!)
        .eq("read", false);
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    staleTime: 30_000,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notification_events").update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread_count"] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.from("notification_events").update({ read: true }).eq("recipient_id", userId).eq("read", false);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
      qc.invalidateQueries({ queryKey: ["unread_count"] });
    },
  });
}
