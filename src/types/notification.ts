import type { Database } from "@/integrations/supabase/types";

export type NotificationEvent = Database["public"]["Tables"]["notification_events"]["Row"];
