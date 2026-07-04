import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Inspection, InspectionTemplateItem, InspectionResponse } from "@/types/inspection";
import type { Database } from "@/integrations/supabase/types";

type InspectionUpdate = Database["public"]["Tables"]["inspections"]["Update"];

// QA P1 Q-PERF-4: explicit column lists + page cap.
// L10 BUG-002 (2026-05-29): dropped `started_at` - column was never in
// public.inspections (verified via information_schema). Every list +
// detail load was throwing PostgREST 400. inspection_type / score /
// flagged_items / photo_compliance_pct are the real timestamps-adjacent
// columns; created_at is the only available start marker.
const INSPECTION_COLUMNS =
  "id, inspector_id, property_id, unit_id, template_id, status, completed_at, created_at, updated_at, inspection_type, score, total_items, flagged_items, photo_compliance_pct, " +
  "properties(name, region, zone), units(unit_code, short_name), inspection_templates(name)";

export function useInspections() {
  return useQuery({
    queryKey: ["inspections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspections")
        .select(INSPECTION_COLUMNS)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as (Inspection & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null } | null; inspection_templates: { name: string } | null })[];
    },
  });
}

export function useInspection(id: string | undefined) {
  return useQuery({
    queryKey: ["inspection", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspections")
        .select(INSPECTION_COLUMNS)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data as Inspection & { properties: { name: string; region: string | null; zone: string | null } | null; units: { unit_code: string; short_name: string | null } | null; inspection_templates: { name: string } | null };
    },
  });
}

export function useTemplateItems(templateId: string | undefined) {
  return useQuery({
    queryKey: ["template_items", templateId],
    enabled: !!templateId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspection_template_items")
        .select("*")
        .eq("template_id", templateId!)
        .order("sort_order");
      if (error) throw error;
      return data as InspectionTemplateItem[];
    },
  });
}

export function useInspectionResponses(inspectionId: string | undefined) {
  return useQuery({
    queryKey: ["inspection_responses", inspectionId],
    enabled: !!inspectionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspection_responses")
        .select("*")
        .eq("inspection_id", inspectionId!);
      if (error) throw error;
      return data as InspectionResponse[];
    },
  });
}

export function useSaveResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (resp: { inspection_id: string; template_item_id: string; response_value?: string; note?: string; flagged_issue?: boolean }) => {
      const { data: existing } = await supabase
        .from("inspection_responses")
        .select("id")
        .eq("inspection_id", resp.inspection_id)
        .eq("template_item_id", resp.template_item_id)
        .maybeSingle();
      if (existing) {
        const { error } = await supabase.from("inspection_responses").update(resp).eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("inspection_responses").insert(resp);
        if (error) throw error;
      }
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["inspection_responses", v.inspection_id] }),
  });
}

export function useUpdateInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: InspectionUpdate & { id: string }) => {
      const { error } = await supabase.from("inspections").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inspections"] });
      qc.invalidateQueries({ queryKey: ["inspection"] });
    },
  });
}
