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

export function useTaskUpdates(taskId: string | undefined) {
  return useQuery({
    queryKey: ["task_updates", taskId],
    enabled: !!taskId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_updates")
        .select("*")
        .eq("task_id", taskId!)
        .order("created_at", { ascending: false });
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
        .select("*")
        .eq("task_id", taskId!)
        .order("created_at", { ascending: false });
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

export function useUploadTaskPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, propertyId, file, userId }: { taskId: string; propertyId: string; file: File; userId: string }) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${propertyId}/${taskId}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("task-photos").upload(path, file);
      if (uploadErr) throw uploadErr;
      const { error: dbErr } = await supabase.from("task_photos").insert({ task_id: taskId, storage_path: path, uploaded_by: userId, photo_type: "proof" });
      if (dbErr) throw dbErr;
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
      await supabase.storage.from("task-photos").remove([storagePath]);
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

export function useAllTasks() {
  return useQuery({
    queryKey: ["all_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, properties(name, region, zone), units(unit_code, short_name, bedrooms)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as (Task & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null; bedrooms: number | null } | null })[];
    },
  });
}
