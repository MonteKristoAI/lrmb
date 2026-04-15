export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string | null
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          id: string
          payload_json: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          id?: string
          payload_json?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          payload_json?: Json | null
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          client: string
          data: Json
          id: string
          submitted_at: string | null
          view_password: string | null
        }
        Insert: {
          client: string
          data: Json
          id?: string
          submitted_at?: string | null
          view_password?: string | null
        }
        Update: {
          client?: string
          data?: Json
          id?: string
          submitted_at?: string | null
          view_password?: string | null
        }
        Relationships: []
      }
      inspection_responses: {
        Row: {
          created_at: string
          flagged_issue: boolean
          id: string
          inspection_id: string
          note: string | null
          photos: Json | null
          response_value: string | null
          severity: string | null
          template_item_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          flagged_issue?: boolean
          id?: string
          inspection_id: string
          note?: string | null
          photos?: Json | null
          response_value?: string | null
          severity?: string | null
          template_item_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          flagged_issue?: boolean
          id?: string
          inspection_id?: string
          note?: string | null
          photos?: Json | null
          response_value?: string | null
          severity?: string | null
          template_item_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_responses_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspection_responses_template_item_id_fkey"
            columns: ["template_item_id"]
            isOneToOne: false
            referencedRelation: "inspection_template_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_template_items: {
        Row: {
          auto_create_task_on_flag: boolean | null
          auto_task_category:
            | Database["public"]["Enums"]["task_category"]
            | null
          created_at: string
          id: string
          item_type: string
          label: string
          min_photos: number | null
          photo_instructions: string | null
          required: boolean
          section_name: string
          sort_order: number
          template_id: string
          updated_at: string
        }
        Insert: {
          auto_create_task_on_flag?: boolean | null
          auto_task_category?:
            | Database["public"]["Enums"]["task_category"]
            | null
          created_at?: string
          id?: string
          item_type?: string
          label: string
          min_photos?: number | null
          photo_instructions?: string | null
          required?: boolean
          section_name: string
          sort_order?: number
          template_id: string
          updated_at?: string
        }
        Update: {
          auto_create_task_on_flag?: boolean | null
          auto_task_category?:
            | Database["public"]["Enums"]["task_category"]
            | null
          created_at?: string
          id?: string
          item_type?: string
          label?: string
          min_photos?: number | null
          photo_instructions?: string | null
          required?: boolean
          section_name?: string
          sort_order?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspection_template_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "inspection_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_templates: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      inspections: {
        Row: {
          completed_at: string | null
          created_at: string
          flagged_items: number | null
          id: string
          inspection_type: Database["public"]["Enums"]["inspection_type"] | null
          inspector_id: string
          photo_compliance_pct: number | null
          property_id: string
          score: number | null
          status: Database["public"]["Enums"]["inspection_status"]
          template_id: string
          total_items: number | null
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          flagged_items?: number | null
          id?: string
          inspection_type?:
            | Database["public"]["Enums"]["inspection_type"]
            | null
          inspector_id: string
          photo_compliance_pct?: number | null
          property_id: string
          score?: number | null
          status?: Database["public"]["Enums"]["inspection_status"]
          template_id: string
          total_items?: number | null
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          flagged_items?: number | null
          id?: string
          inspection_type?:
            | Database["public"]["Enums"]["inspection_type"]
            | null
          inspector_id?: string
          photo_compliance_pct?: number | null
          property_id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["inspection_status"]
          template_id?: string
          total_items?: number | null
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspections_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "inspection_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inspections_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_events: {
        Row: {
          body: string | null
          channel: string
          created_at: string
          delivery_status: string
          escalated_to: string | null
          escalation_level: number | null
          event_type: string
          id: string
          read: boolean
          recipient_id: string
          sent_at: string | null
          task_id: string | null
          title: string | null
        }
        Insert: {
          body?: string | null
          channel?: string
          created_at?: string
          delivery_status?: string
          escalated_to?: string | null
          escalation_level?: number | null
          event_type: string
          id?: string
          read?: boolean
          recipient_id: string
          sent_at?: string | null
          task_id?: string | null
          title?: string | null
        }
        Update: {
          body?: string | null
          channel?: string
          created_at?: string
          delivery_status?: string
          escalated_to?: string | null
          escalation_level?: number | null
          event_type?: string
          id?: string
          read?: boolean
          recipient_id?: string
          sent_at?: string | null
          task_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          active: boolean
          address: string | null
          created_at: string
          external_id: string | null
          external_source: string | null
          id: string
          local_office: string | null
          name: string
          region: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          created_at?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          local_office?: string | null
          name: string
          region?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          created_at?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          local_office?: string | null
          name?: string
          region?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      reservation_events: {
        Row: {
          created_at: string
          event_at: string | null
          event_type: string
          external_id: string | null
          external_source: string | null
          id: string
          payload_json: Json | null
          property_id: string | null
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          event_at?: string | null
          event_type: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          payload_json?: Json | null
          property_id?: string | null
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          event_at?: string | null
          event_type?: string
          external_id?: string | null
          external_source?: string | null
          id?: string
          payload_json?: Json | null
          property_id?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_events_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_events_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          active: boolean
          assignment_type: string
          created_at: string
          id: string
          profile_id: string
          property_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          assignment_type?: string
          created_at?: string
          id?: string
          profile_id: string
          property_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          assignment_type?: string
          created_at?: string
          id?: string
          profile_id?: string
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      task_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_subtype: string | null
          photo_type: string
          storage_path: string
          task_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          photo_type?: string
          storage_path: string
          task_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          photo_type?: string
          storage_path?: string
          task_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_updates: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          metadata_json: Json | null
          new_status: Database["public"]["Enums"]["task_status"] | null
          note: string | null
          old_status: Database["public"]["Enums"]["task_status"] | null
          task_id: string
          update_type: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata_json?: Json | null
          new_status?: Database["public"]["Enums"]["task_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["task_status"] | null
          task_id: string
          update_type: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata_json?: Json | null
          new_status?: Database["public"]["Enums"]["task_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["task_status"] | null
          task_id?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_updates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          assigned_vendor_name: string | null
          billing_notes: string | null
          billing_ready: boolean | null
          blocked_reason: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          damage_classification:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description: string | null
          due_at: string | null
          external_id: string | null
          external_source: string | null
          guest_name: string | null
          housekeeping_type:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id: string
          is_guest_facing: boolean | null
          owner_charges_amount: number | null
          priority: Database["public"]["Enums"]["task_priority"]
          processed_at: string | null
          processed_by: string | null
          property_id: string
          reopened_count: number
          requires_note: boolean
          requires_photo: boolean
          requires_timestamp: boolean
          reservation_id: string | null
          scheduled_for: string | null
          source_type: string
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"]
          task_category: Database["public"]["Enums"]["task_category"]
          task_type: string | null
          title: string
          unit_id: string | null
          updated_at: string
          vendor_id: string | null
          vendor_invoice_amount: number | null
          vendor_invoice_received: boolean | null
          special_instructions: string | null
          checkin_time: string | null
          checkout_time: string | null
          claim_id: string | null
          claim_provider: string | null
          claim_status: Database["public"]["Enums"]["claim_status"] | null
          expected_duration_minutes: number | null
          needs_review: boolean | null
          verified_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          assigned_vendor_name?: string | null
          billing_notes?: string | null
          billing_ready?: boolean | null
          blocked_reason?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          damage_classification?:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description?: string | null
          due_at?: string | null
          external_id?: string | null
          external_source?: string | null
          guest_name?: string | null
          housekeeping_type?:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id?: string
          is_guest_facing?: boolean | null
          owner_charges_amount?: number | null
          priority?: Database["public"]["Enums"]["task_priority"]
          processed_at?: string | null
          processed_by?: string | null
          property_id: string
          reopened_count?: number
          requires_note?: boolean
          requires_photo?: boolean
          requires_timestamp?: boolean
          reservation_id?: string | null
          scheduled_for?: string | null
          source_type?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_category?: Database["public"]["Enums"]["task_category"]
          task_type?: string | null
          title: string
          unit_id?: string | null
          updated_at?: string
          vendor_id?: string | null
          vendor_invoice_amount?: number | null
          vendor_invoice_received?: boolean | null
          verified_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          assigned_vendor_name?: string | null
          billing_notes?: string | null
          billing_ready?: boolean | null
          blocked_reason?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          damage_classification?:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description?: string | null
          due_at?: string | null
          external_id?: string | null
          external_source?: string | null
          guest_name?: string | null
          housekeeping_type?:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id?: string
          is_guest_facing?: boolean | null
          owner_charges_amount?: number | null
          priority?: Database["public"]["Enums"]["task_priority"]
          processed_at?: string | null
          processed_by?: string | null
          property_id?: string
          reopened_count?: number
          requires_note?: boolean
          requires_photo?: boolean
          requires_timestamp?: boolean
          reservation_id?: string | null
          scheduled_for?: string | null
          source_type?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_category?: Database["public"]["Enums"]["task_category"]
          task_type?: string | null
          title?: string
          unit_id?: string | null
          updated_at?: string
          vendor_id?: string | null
          vendor_invoice_amount?: number | null
          vendor_invoice_received?: boolean | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          active: boolean
          bedrooms: number | null
          created_at: string
          default_housekeeper: string | null
          external_id: string | null
          external_source: string | null
          id: string
          max_occupancy: number | null
          property_id: string
          short_name: string | null
          track_id: number | null
          unit_code: string
          unit_size: string | null
          unit_type: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          bedrooms?: number | null
          created_at?: string
          default_housekeeper?: string | null
          external_id?: string | null
          external_source?: string | null
          id?: string
          max_occupancy?: number | null
          property_id: string
          short_name?: string | null
          track_id?: number | null
          unit_code: string
          unit_size?: string | null
          unit_type?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          bedrooms?: number | null
          created_at?: string
          default_housekeeper?: string | null
          external_id?: string | null
          external_source?: string | null
          id?: string
          max_occupancy?: number | null
          property_id?: string
          short_name?: string | null
          track_id?: number | null
          unit_code?: string
          unit_size?: string | null
          unit_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          active: boolean | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_method: string | null
          phone: string | null
          specialty: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_method?: string | null
          phone?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_method?: string | null
          phone?: string | null
          specialty?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      avg_admin_touches_per_task: { Args: never; Returns: number }
      has_admin_access: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "field_staff" | "admin" | "supervisor" | "manager"
      claim_status: "pending" | "filed" | "approved" | "denied" | "closed"
      damage_classification: "wear_and_tear" | "guest_damage" | "unclassified"
      housekeeping_type:
        | "checkout_clean"
        | "mid_stay_clean"
        | "deep_clean"
        | "linen_change"
        | "intermittent_clean"
        | "owner_specific_clean"
      inspection_status: "scheduled" | "in_progress" | "completed" | "verified"
      inspection_type:
        | "after_final_clean"
        | "owner_arrival"
        | "owner_departure"
        | "damage"
        | "guest_ready"
      task_category:
        | "maintenance"
        | "housekeeping"
        | "inspection"
        | "general"
        | "property_management"
        | "concierge"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status:
        | "new"
        | "assigned"
        | "vendor_not_started"
        | "in_progress"
        | "waiting_parts"
        | "blocked"
        | "completed"
        | "verified"
        | "processed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["field_staff", "admin", "supervisor", "manager"],
      claim_status: ["pending", "filed", "approved", "denied", "closed"],
      damage_classification: ["wear_and_tear", "guest_damage", "unclassified"],
      housekeeping_type: [
        "checkout_clean",
        "mid_stay_clean",
        "deep_clean",
        "linen_change",
        "intermittent_clean",
        "owner_specific_clean",
      ],
      inspection_status: ["scheduled", "in_progress", "completed", "verified"],
      inspection_type: [
        "after_final_clean",
        "owner_arrival",
        "owner_departure",
        "damage",
        "guest_ready",
      ],
      task_category: [
        "maintenance",
        "housekeeping",
        "inspection",
        "general",
        "property_management",
        "concierge",
      ],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: [
        "new",
        "assigned",
        "vendor_not_started",
        "in_progress",
        "waiting_parts",
        "blocked",
        "completed",
        "verified",
        "processed",
      ],
    },
  },
} as const
