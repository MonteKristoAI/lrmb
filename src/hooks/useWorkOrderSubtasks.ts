// Emma feedback 2026-05-29: surface TRACK per-WO sub-tasks (checklist).
// The DB cache is populated lazily via the track-wo-subtasks edge fn on
// first detail view. Subsequent toggles UPDATE the cached row directly
// via PostgREST; field staff RLS policy gates the update.

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WorkOrderSubtask {
  track_id: number;
  task_id: string;
  name: string;
  sort_order: number | null;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  synced_at: string;
}

async function callSyncEdgeFn(externalId: string, force = false): Promise<WorkOrderSubtask[]> {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;
  if (!accessToken) throw new Error("Not signed in.");
  const supabaseUrl = (import.meta as ImportMeta & { env: { VITE_SUPABASE_URL?: string } }).env.VITE_SUPABASE_URL
    ?? "https://hfpvnsbiewudpqbtlvte.supabase.co";
  const res = await fetch(`${supabaseUrl}/functions/v1/track-wo-subtasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ external_id: externalId, force }),
  });
  if (!res.ok) throw new Error(`subtasks fetch failed (${res.status})`);
  const payload = await res.json() as { items: WorkOrderSubtask[] };
  return payload.items ?? [];
}

export function useWorkOrderSubtasks(
  taskId: string | undefined,
  externalSource: string | null | undefined,
  externalId: string | null | undefined,
) {
  // First read from local cache.
  const enabled = !!taskId && externalSource === "track" && !!externalId;
  const [didLazyFetch, setDidLazyFetch] = useState(false);

  const query = useQuery({
    queryKey: ["wo_subtasks", taskId],
    enabled,
    queryFn: async (): Promise<WorkOrderSubtask[]> => {
      const { data, error } = await supabase
        .from("track_wo_subtasks")
        .select("*")
        .eq("task_id", taskId!)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("track_id", { ascending: true });
      if (error) throw error;
      return (data ?? []) as WorkOrderSubtask[];
    },
    staleTime: 30_000,
  });

  // If the cache is empty AND we haven't tried yet AND this is a TRACK
  // HK WO, kick off the edge fn to populate then refetch.
  useEffect(() => {
    if (!enabled || didLazyFetch || query.isLoading) return;
    if (query.data && query.data.length > 0) return;
    setDidLazyFetch(true);
    callSyncEdgeFn(externalId!, false).catch(() => { /* ignore */ }).finally(() => {
      query.refetch();
    });
  }, [enabled, didLazyFetch, query.data, query.isLoading, externalId, query]);

  return query;
}

export function useToggleSubtask(taskId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ trackId, isCompleted }: { trackId: number; isCompleted: boolean }) => {
      const { error } = await supabase
        .from("track_wo_subtasks")
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq("track_id", trackId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wo_subtasks", taskId] }),
  });
}
