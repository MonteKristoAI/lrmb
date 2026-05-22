// Task hooks
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Task, TaskInsert, TaskUpdate, TaskUpdateRow, TaskPhoto, TaskStatus, TaskCategory } from "@/types/task";
import type { Database } from "@/integrations/supabase/types";

type TaskUpdateInsert = Database["public"]["Tables"]["task_updates"]["Insert"];

export function useTasks(filters?: { status?: TaskStatus[]; category?: TaskCategory; assigned_to?: string; property_id?: string }) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      let q = supabase.from("tasks").select("*, properties(name, region, zone), units(unit_code, short_name, bedrooms)");
      if (filters?.status?.length) q = q.in("status", filters.status);
      if (filters?.category) q = q.eq("task_category", filters.category);
      if (filters?.assigned_to) q = q.eq("assigned_to", filters.assigned_to);
      if (filters?.property_id) q = q.eq("property_id", filters.property_id);
      const { data, error } = await q.order("created_at", { ascending: false });
      if (error) throw error;
      return data as (Task & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null; bedrooms: number | null } | null })[];
    },
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ["task", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, properties(name, address, region, zone), units(unit_code, short_name, bedrooms)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Task & { properties: { name: string; address: string | null; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null; bedrooms: number | null } | null };
    },
  });
}

// QA P1 Q-PERF-5,6: explicit column lists + cap.
const TASK_UPDATE_COLUMNS =
  "id, task_id, actor_id, update_type, old_status, new_status, note, metadata_json, created_at";
const TASK_PHOTO_COLUMNS =
  "id, task_id, storage_path, photo_type, photo_subtype, caption, uploaded_by, created_at, " +
  "track_attachment_id, track_synced_at, track_sync_attempts, track_sync_error, track_next_attempt_at";

export function useTaskUpdates(taskId: string | undefined) {
  return useQuery({
    queryKey: ["task_updates", taskId],
    enabled: !!taskId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_updates")
        .select(TASK_UPDATE_COLUMNS)
        .eq("task_id", taskId!)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as TaskUpdateRow[];
    },
  });
}

export function useTaskPhotos(taskId: string | undefined) {
  return useQuery({
    queryKey: ["task_photos", taskId],
    enabled: !!taskId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_photos")
        .select(TASK_PHOTO_COLUMNS)
        .eq("task_id", taskId!)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as TaskPhoto[];
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TaskUpdate & { id: string }) => {
      const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", data.id] });
      qc.invalidateQueries({ queryKey: ["all_tasks"] });
    },
  });
}

// v33: guarded status transition. Use this when you know what status the task
// SHOULD be in before your change applies. Prevents lost updates if two devices
// race to verify/complete/reopen the same task — only the first one wins.
//
// Throws if the task is no longer in `expectedStatus` (likely because someone
// else changed it). Caller should refetch + show a "this task was updated by
// someone else" toast instead of silently overwriting.
export function useGuardedTaskTransition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id, expectedStatus, ...updates
    }: TaskUpdate & { id: string; expectedStatus: TaskStatus }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .eq("status", expectedStatus)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(`Task is no longer in '${expectedStatus}' state — refresh and try again. Someone else may have updated it.`);
      }
      return data[0];
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", data.id] });
      qc.invalidateQueries({ queryKey: ["all_tasks"] });
    },
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: TaskInsert) => {
      const { data, error } = await supabase.from("tasks").insert(task).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["all_tasks"] });
    },
  });
}

export function useAddTaskUpdate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (update: TaskUpdateInsert) => {
      const { error } = await supabase.from("task_updates").insert(update);
      if (error) throw error;
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["task_updates", v.task_id] });
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// QA P2 Q-SEC-28: MIME + extension allowlist on photo upload. SVG is banned
// because it can carry inline <script>; HTML is banned because the storage
// bucket isn't tagged Content-Disposition:attachment. Mobile cameras default
// to JPEG; HEIC is included for iOS native shots.
const ALLOWED_PHOTO_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const ALLOWED_PHOTO_EXT = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);

export function useUploadTaskPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, propertyId, file, userId }: { taskId: string; propertyId: string; file: File; userId: string }) => {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const mime = (file.type || "").toLowerCase();
      if (!ALLOWED_PHOTO_EXT.has(ext) || !ALLOWED_PHOTO_MIME.has(mime)) {
        throw new Error(`Unsupported photo format: ${mime || ext}. Use JPEG, PNG, WebP, or HEIC.`);
      }
      const path = `${propertyId}/${taskId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("task-photos").upload(path, file, {
        contentType: mime,
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadErr) throw uploadErr;
      const { error: dbErr } = await supabase.from("task_photos").insert({ task_id: taskId, storage_path: path, uploaded_by: userId, photo_type: "proof" });
      if (dbErr) {
        try { await supabase.storage.from("task-photos").remove([path]); } catch { /* swallow rollback error */ }
        throw dbErr;
      }
      return path;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["task_photos", v.taskId] }),
  });
}

export function useDeleteTaskPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      const { error: dbErr } = await supabase.from("task_photos").delete().eq("id", id);
      if (dbErr) throw dbErr;
      // v33: check storage delete result. If the row is gone but the blob remains,
      // we surface the partial-success so caller can retry or alert.
      const { error: storageErr } = await supabase.storage.from("task-photos").remove([storagePath]);
      if (storageErr) {
        console.warn("photo row deleted but storage blob remains", { storagePath, storageErr });
        throw new Error("Photo metadata removed but file blob delete failed. Retry to clean up.");
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["task_photos"] });
    },
  });
}

export function useSimilarTasks(propertyId: string | undefined, unitId: string | undefined, title: string | undefined) {
  return useQuery({
    queryKey: ["similar_tasks", propertyId, unitId, title],
    enabled: !!propertyId && !!title && title.length >= 3,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("find_similar_tasks", {
        p_property_id: propertyId!,
        p_unit_id: unitId || null,
        p_title: title || null,
      });
      if (error) throw error;
      return data as { id: string; title: string; status: string; created_at: string }[];
    },
    staleTime: 5000,
  });
}

// DEPRECATED for KPI aggregation. v32: this hook returns the 500 newest
// tasks by created_at — useful for "recent activity" lists but MUST NOT be
// used to compute counts like "Open Tasks" or "Overdue" because the database
// has 30K+ rows and the slice produces lies.
// For KPI numbers, use `useDashboardKpis()`. For status-filtered queue pages,
// use `useTasksByStatus(...)`.
export function useAllTasks() {
  return useQuery({
    queryKey: ["all_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, status, priority, task_category, housekeeping_type, due_at, scheduled_for, started_at, completed_at, created_at, updated_at, external_id, unit_id, property_id, assigned_to, blocked_reason, properties(name, region, zone), units(unit_code, short_name, bedrooms)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as (Task & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null; bedrooms: number | null } | null })[];
    },
  });
}

// v32: real dashboard KPI counts from materialized view (refreshed every minute).
// Replaces local-filter aggregates that were lying because they only saw 500 rows.
export interface DashboardKpis {
  hk_in_progress: number;
  maint_in_progress: number;
  maint_overdue: number;
  hk_completed_this_week: number;
  hk_completed_last_week: number;
  maint_completed_this_week: number;
  maint_completed_last_week: number;
  track_mirrored_tasks: number;
  refreshed_at: string | null;
}

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard_kpis"],
    queryFn: async (): Promise<DashboardKpis> => {
      const { data, error } = await supabase
        .from("mv_ops_dashboard_kpis")
        .select("*")
        .maybeSingle();
      if (error) throw error;
      return (data ?? {
        hk_in_progress: 0, maint_in_progress: 0, maint_overdue: 0,
        hk_completed_this_week: 0, hk_completed_last_week: 0,
        maint_completed_this_week: 0, maint_completed_last_week: 0,
        track_mirrored_tasks: 0, refreshed_at: null,
      }) as DashboardKpis;
    },
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

// v32: paged + filtered task list for queue pages. No hidden 500-row cap;
// callers pass an explicit limit (default 200, raisable for export).
export function useTasksByStatus(
  statuses: TaskStatus[],
  opts?: {
    category?: TaskCategory;
    propertyId?: string;
    assignedTo?: string;
    orderBy?: "due_at" | "created_at" | "updated_at" | "completed_at";
    ascending?: boolean;
    limit?: number;
  },
) {
  return useQuery({
    queryKey: ["tasks_by_status", statuses, opts],
    queryFn: async () => {
      let q = supabase
        .from("tasks")
        .select("id, title, status, priority, task_category, housekeeping_type, due_at, scheduled_for, started_at, completed_at, created_at, updated_at, external_id, unit_id, property_id, assigned_to, blocked_reason, properties(name, region, zone), units(unit_code, short_name, bedrooms)")
        .in("status", statuses);
      if (opts?.category) q = q.eq("task_category", opts.category);
      if (opts?.propertyId) q = q.eq("property_id", opts.propertyId);
      if (opts?.assignedTo) q = q.eq("assigned_to", opts.assignedTo);
      q = q.order(opts?.orderBy ?? "due_at", { ascending: opts?.ascending ?? true, nullsFirst: false });
      q = q.limit(opts?.limit ?? 200);
      const { data, error } = await q;
      if (error) throw error;
      return data as (Task & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null; bedrooms: number | null } | null })[];
    },
  });
}

// v32: overdue tasks specifically (due_at < now, not in done states).
// Done as a direct query so the page renders ALL overdue, not just from a slice.
export function useOverdueTasks() {
  return useQuery({
    queryKey: ["overdue_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, status, priority, task_category, housekeeping_type, due_at, scheduled_for, started_at, completed_at, created_at, updated_at, external_id, unit_id, property_id, assigned_to, blocked_reason, properties(name, region, zone), units(unit_code, short_name, bedrooms)")
        .lt("due_at", new Date().toISOString())
        .not("status", "in", "(completed,verified,processed)")
        .order("due_at", { ascending: true })
        .limit(500);
      if (error) throw error;
      return data as (Task & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null; bedrooms: number | null } | null })[];
    },
  });
}

// v32: total counts (no row data, just count) for hard truth metrics.
export function useTaskCount(filter: {
  statuses?: TaskStatus[];
  category?: TaskCategory;
  overdue?: boolean;
  dueToday?: boolean;
}) {
  return useQuery({
    queryKey: ["task_count", filter],
    queryFn: async (): Promise<number> => {
      let q = supabase.from("tasks").select("*", { count: "exact", head: true });
      if (filter.statuses?.length) q = q.in("status", filter.statuses);
      if (filter.category) q = q.eq("task_category", filter.category);
      if (filter.overdue) {
        q = q.lt("due_at", new Date().toISOString())
             .not("status", "in", "(completed,verified,processed)");
      }
      if (filter.dueToday) {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        const end = new Date(start); end.setDate(end.getDate() + 1);
        q = q.gte("due_at", start.toISOString())
             .lt("due_at", end.toISOString())
             .not("status", "in", "(completed,verified,processed)");
      }
      const { count, error } = await q;
      if (error) throw error;
      return count ?? 0;
    },
    refetchInterval: 60_000,
  });
}

// v35: analytics hook — fetches up to 50K tasks with minimal columns for client-side
// aggregation. Used by SupervisorDashboard, StaffWorkload, KPIOverview, TrendCharts.
// 50K rows × ~200 bytes = ~10MB transfer; with 5-min cache this is OK for desktop
// admin analytics. NOT for mobile or high-frequency refresh.
export function useTasksForAnalytics() {
  return useQuery({
    queryKey: ["tasks_for_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, status, priority, task_category, assigned_to, due_at, completed_at, created_at, property_id")
        .order("created_at", { ascending: false })
        .limit(50000);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

// v32: active distinct staff (anyone with at least one non-terminal assigned task).
// Currently 0 because TRACK polling creates tasks with assigned_to=NULL.
// Once Emma's staff roster lands and assignments are seeded, this turns on automatically.
export function useActiveStaffCount() {
  return useQuery({
    queryKey: ["active_staff_count"],
    queryFn: async (): Promise<number> => {
      // PostgREST doesn't have count(distinct) directly. We fetch the assigned_to
      // values of non-terminal tasks and dedupe in JS. Bounded to <2K rows so OK.
      const { data, error } = await supabase
        .from("tasks")
        .select("assigned_to")
        .not("assigned_to", "is", null)
        .in("status", ["new", "assigned", "in_progress", "vendor_not_started", "waiting_parts"])
        .limit(2000);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.assigned_to as string)).size;
    },
    refetchInterval: 60_000,
  });
}
