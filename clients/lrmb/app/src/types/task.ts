import type { Database } from "@/integrations/supabase/types";

export type TaskStatus = Database["public"]["Enums"]["task_status"];
export type TaskPriority = Database["public"]["Enums"]["task_priority"];
export type TaskCategory = Database["public"]["Enums"]["task_category"];
export type AppRole = Database["public"]["Enums"]["app_role"];
export type DamageClassification = Database["public"]["Enums"]["damage_classification"];
export type HousekeepingType = Database["public"]["Enums"]["housekeeping_type"];

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];
export type TaskUpdateRow = Database["public"]["Tables"]["task_updates"]["Row"];
export type TaskPhoto = Database["public"]["Tables"]["task_photos"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Unit = Database["public"]["Tables"]["units"]["Row"];
export type StaffAssignment = Database["public"]["Tables"]["staff_assignments"]["Row"];
export type Vendor = Database["public"]["Tables"]["vendors"]["Row"];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  new: "New",
  assigned: "Assigned",
  vendor_not_started: "Vendor Pending",
  in_progress: "In Progress",
  waiting_parts: "Waiting Parts",
  blocked: "Blocked",
  completed: "Completed",
  verified: "Verified",
  processed: "Processed",
};

export const TASK_STATUS_LABELS_ES: Record<TaskStatus, string> = {
  new: "Nuevo",
  assigned: "Asignado",
  vendor_not_started: "Proveedor Pendiente",
  in_progress: "En Progreso",
  waiting_parts: "Esperando Piezas",
  blocked: "Bloqueado",
  completed: "Completado",
  verified: "Verificado",
  processed: "Procesado",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const TASK_PRIORITY_LABELS_ES: Record<TaskPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
  urgent: "Urgente",
};

export type ClaimStatus = Database["public"]["Enums"]["claim_status"];

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
  maintenance: "Maintenance",
  housekeeping: "Housekeeping",
  inspection: "Inspection",
  general: "General",
  property_management: "Property Management",
  concierge: "Concierge",
};

export const TASK_CATEGORY_LABELS_ES: Record<TaskCategory, string> = {
  maintenance: "Mantenimiento",
  housekeeping: "Limpieza",
  inspection: "Inspección",
  general: "General",
  property_management: "Gestión de Propiedad",
  concierge: "Conserjería",
};

export const HOUSEKEEPING_TYPE_LABELS: Record<HousekeepingType, string> = {
  checkout_clean: "Checkout Clean",
  mid_stay_clean: "Mid-Stay Clean",
  deep_clean: "Deep Clean",
  linen_change: "Linen Change",
  intermittent_clean: "Intermittent Clean",
  owner_specific_clean: "Owner-Specific Clean",
};

export const HOUSEKEEPING_TYPE_LABELS_ES: Record<HousekeepingType, string> = {
  checkout_clean: "Limpieza de Salida",
  mid_stay_clean: "Limpieza Media Estadía",
  deep_clean: "Limpieza Profunda",
  linen_change: "Cambio de Sábanas",
  intermittent_clean: "Limpieza Intermitente",
  owner_specific_clean: "Limpieza Específica del Dueño",
};

export const DAMAGE_CLASSIFICATION_LABELS: Record<DamageClassification, string> = {
  wear_and_tear: "Wear & Tear",
  guest_damage: "Guest Damage",
  unclassified: "Unclassified",
};

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const STATUS_ORDER: Record<TaskStatus, number> = {
  new: 0,
  assigned: 1,
  vendor_not_started: 2,
  in_progress: 3,
  waiting_parts: 4,
  blocked: 5,
  completed: 6,
  verified: 7,
  processed: 8,
};
