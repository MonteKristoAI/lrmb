import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property, Unit, Profile } from "@/types/task";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data as Property[];
    },
  });
}

export function usePropertiesByRegion() {
  return useQuery({
    queryKey: ["properties_by_region"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("active", true)
        .order("region")
        .order("zone")
        .order("name");
      if (error) throw error;
      const grouped: Record<string, Property[]> = {};
      for (const p of data as Property[]) {
        const key = `${p.region || "Unknown"} - ${p.zone || "Unknown"}`;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(p);
      }
      return grouped;
    },
  });
}

export function useUnits(propertyId: string | undefined) {
  return useQuery({
    queryKey: ["units", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("property_id", propertyId!)
        .eq("active", true)
        .order("unit_code");
      if (error) throw error;
      return data as Unit[];
    },
  });
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("active", true)
        .order("full_name");
      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useStaffForProperty(propertyId: string | undefined) {
  return useQuery({
    queryKey: ["staff_for_property", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_assignments")
        .select("profile_id")
        .eq("property_id", propertyId!)
        .eq("active", true);
      if (error) throw error;
      if (!data?.length) return [];
      const ids = data.map((d) => d.profile_id);
      const { data: profiles, error: pErr } = await supabase.from("profiles").select("*").in("id", ids);
      if (pErr) throw pErr;
      return profiles as Profile[];
    },
  });
}
