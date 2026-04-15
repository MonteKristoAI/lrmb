import type { Database } from "@/integrations/supabase/types";

export type InspectionStatus = Database["public"]["Enums"]["inspection_status"];
export type InspectionType = Database["public"]["Enums"]["inspection_type"];
export type Inspection = Database["public"]["Tables"]["inspections"]["Row"];
export type InspectionTemplate = Database["public"]["Tables"]["inspection_templates"]["Row"];
export type InspectionTemplateItem = Database["public"]["Tables"]["inspection_template_items"]["Row"];
export type InspectionResponse = Database["public"]["Tables"]["inspection_responses"]["Row"];

export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, string> = {
  scheduled: "Scheduled",
  in_progress: "In Progress",
  completed: "Completed",
  verified: "Verified",
};

export const INSPECTION_STATUS_LABELS_ES: Record<InspectionStatus, string> = {
  scheduled: "Programado",
  in_progress: "En Progreso",
  completed: "Completado",
  verified: "Verificado",
};

export const INSPECTION_TYPE_LABELS: Record<InspectionType, string> = {
  after_final_clean: "After Final Clean",
  owner_arrival: "Owner Arrival",
  owner_departure: "Owner Departure",
  damage: "Damage Assessment",
  guest_ready: "Guest Ready",
};

export const INSPECTION_TYPE_LABELS_ES: Record<InspectionType, string> = {
  after_final_clean: "Despues de Limpieza Final",
  owner_arrival: "Llegada del Propietario",
  owner_departure: "Salida del Propietario",
  damage: "Evaluacion de Danos",
  guest_ready: "Listo para Huesped",
};
