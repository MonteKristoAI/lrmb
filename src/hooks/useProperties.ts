import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Property, Unit, Profile } from "@/types/task";

// QA P2 Q-PERF-15..18: explicit column lists. Avoids returning sensitive or
// large columns the UI never reads, and lets PostgREST pick a narrower plan.
const PROPERTY_COLUMNS =
  "id, name, address, region, zone, local_office, external_source, external_id, active, created_at, updated_at";
const UNIT_COLUMNS =
  "id, property_id, unit_code, short_name, unit_type, bedrooms, max_occupancy, unit_size, " +
  "track_id, default_housekeeper_id, external_source, external_id, active, created_at, updated_at";
const PROFILE_COLUMNS =
  "id, full_name, email, phone, avatar_url, active, department, created_at, updated_at";

export function useProperties() {
  return useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select(PROPERTY_COLUMNS)
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
        .select(PROPERTY_COLUMNS)
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
        .select(UNIT_COLUMNS)
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
        .select(PROFILE_COLUMNS)
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
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .in("id", ids);
      if (pErr) throw pErr;
      return profiles as Profile[];
    },
  });
}
