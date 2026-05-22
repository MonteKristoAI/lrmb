import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Vendor } from "@/types/task";
import type { Database } from "@/integrations/supabase/types";

type VendorInsert = Database["public"]["Tables"]["vendors"]["Insert"];
type VendorUpdate = Database["public"]["Tables"]["vendors"]["Update"];

// QA P2 Q-PERF-19..22: explicit columns.
const VENDOR_COLUMNS =
  "id, name, contact_name, phone, email, specialty, payment_method, address, active, notes, created_at, updated_at";

export function useVendors() {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select(VENDOR_COLUMNS)
        .order("name");
      if (error) throw error;
      return data as Vendor[];
    },
  });
}

export function useActiveVendors() {
  return useQuery({
    queryKey: ["vendors", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select(VENDOR_COLUMNS)
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data as Vendor[];
    },
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vendor: VendorInsert) => {
      const { data, error } = await supabase.from("vendors").insert(vendor).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: VendorUpdate & { id: string }) => {
      const { data, error } = await supabase.from("vendors").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
