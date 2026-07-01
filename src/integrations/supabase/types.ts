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
    PostgrestVersion: "14.5"
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
          {
            foreignKeyName: "notification_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_operations_damage_claims"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "notification_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tasks_ranked"
            referencedColumns: ["id"]
          },
        ]
      }
      ops_health_snapshots: {
        Row: {
          band: string
          captured_at: string
          components: Json | null
          id: string
          property_id: string | null
          score: number
        }
        Insert: {
          band: string
          captured_at?: string
          components?: Json | null
          id?: string
          property_id?: string | null
          score: number
        }
        Update: {
          band?: string
          captured_at?: string
          components?: Json | null
          id?: string
          property_id?: string | null
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ops_health_snapshots_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
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
          vendor_id: string | null
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "mv_vendor_performance_30d"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "profiles_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
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
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
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
      revoked_share_tokens: {
        Row: {
          jti: string
          reason: string | null
          revoked_at: string
          revoked_by: string | null
        }
        Insert: {
          jti: string
          reason?: string | null
          revoked_at?: string
          revoked_by?: string | null
        }
        Update: {
          jti?: string
          reason?: string | null
          revoked_at?: string
          revoked_by?: string | null
        }
        Relationships: []
      }
      sla_targets: {
        Row: {
          active: boolean
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          row_version: number
          target_hours: number
          task_category: Database["public"]["Enums"]["task_category"]
          task_type: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          row_version?: number
          target_hours: number
          task_category: Database["public"]["Enums"]["task_category"]
          task_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          row_version?: number
          target_hours?: number
          task_category?: Database["public"]["Enums"]["task_category"]
          task_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
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
          track_attachment_id: string | null
          track_next_attempt_at: string | null
          track_sync_attempts: number
          track_sync_error: string | null
          track_synced_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_subtype?: string | null
          photo_type?: string
          storage_path: string
          task_id: string
          track_attachment_id?: string | null
          track_next_attempt_at?: string | null
          track_sync_attempts?: number
          track_sync_error?: string | null
          track_synced_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_subtype?: string | null
          photo_type?: string
          storage_path?: string
          task_id?: string
          track_attachment_id?: string | null
          track_next_attempt_at?: string | null
          track_sync_attempts?: number
          track_sync_error?: string | null
          track_synced_at?: string | null
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
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_operations_damage_claims"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tasks_ranked"
            referencedColumns: ["id"]
          },
        ]
      }
      task_priority_scores: {
        Row: {
          computed_at: string
          reason: string | null
          score: number
          task_id: string
        }
        Insert: {
          computed_at?: string
          reason?: string | null
          score: number
          task_id: string
        }
        Update: {
          computed_at?: string
          reason?: string | null
          score?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_priority_scores_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_priority_scores_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "v_operations_damage_claims"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "task_priority_scores_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "v_tasks_ranked"
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
          {
            foreignKeyName: "task_updates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_operations_damage_claims"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "task_updates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tasks_ranked"
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
          checkin_time: string | null
          checkout_time: string | null
          claim_approved_amount: number | null
          claim_deadline_at: string | null
          claim_decided_at: string | null
          claim_filed_amount: number | null
          claim_filed_at: string | null
          claim_id: string | null
          claim_provider: string | null
          claim_status: Database["public"]["Enums"]["claim_status"] | null
          clean_type_name: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          damage_classification:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description: string | null
          due_at: string | null
          expected_duration_minutes: number | null
          external_id: string | null
          external_source: string | null
          guest_name: string | null
          housekeeping_type:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id: string
          is_guest_facing: boolean | null
          needs_review: boolean | null
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
          special_instructions: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"]
          task_category: Database["public"]["Enums"]["task_category"]
          task_type: string | null
          time_estimate_minutes: number | null
          title: string
          track_clean_type_id: number | null
          unit_id: string | null
          updated_at: string
          vendor_id: string | null
          vendor_invoice_amount: number | null
          vendor_invoice_received: boolean | null
          verified_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          assigned_vendor_name?: string | null
          billing_notes?: string | null
          billing_ready?: boolean | null
          blocked_reason?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          claim_approved_amount?: number | null
          claim_deadline_at?: string | null
          claim_decided_at?: string | null
          claim_filed_amount?: number | null
          claim_filed_at?: string | null
          claim_id?: string | null
          claim_provider?: string | null
          claim_status?: Database["public"]["Enums"]["claim_status"] | null
          clean_type_name?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          damage_classification?:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description?: string | null
          due_at?: string | null
          expected_duration_minutes?: number | null
          external_id?: string | null
          external_source?: string | null
          guest_name?: string | null
          housekeeping_type?:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id?: string
          is_guest_facing?: boolean | null
          needs_review?: boolean | null
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
          special_instructions?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_category?: Database["public"]["Enums"]["task_category"]
          task_type?: string | null
          time_estimate_minutes?: number | null
          title: string
          track_clean_type_id?: number | null
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
          checkin_time?: string | null
          checkout_time?: string | null
          claim_approved_amount?: number | null
          claim_deadline_at?: string | null
          claim_decided_at?: string | null
          claim_filed_amount?: number | null
          claim_filed_at?: string | null
          claim_id?: string | null
          claim_provider?: string | null
          claim_status?: Database["public"]["Enums"]["claim_status"] | null
          clean_type_name?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          damage_classification?:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description?: string | null
          due_at?: string | null
          expected_duration_minutes?: number | null
          external_id?: string | null
          external_source?: string | null
          guest_name?: string | null
          housekeeping_type?:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id?: string
          is_guest_facing?: boolean | null
          needs_review?: boolean | null
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
          special_instructions?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          task_category?: Database["public"]["Enums"]["task_category"]
          task_type?: string | null
          time_estimate_minutes?: number | null
          title?: string
          track_clean_type_id?: number | null
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
            foreignKeyName: "tasks_track_clean_type_id_fkey"
            columns: ["track_clean_type_id"]
            isOneToOne: false
            referencedRelation: "track_clean_types"
            referencedColumns: ["track_id"]
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
            referencedRelation: "mv_vendor_performance_30d"
            referencedColumns: ["vendor_id"]
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
      track_clean_types: {
        Row: {
          active: boolean
          code: string | null
          name: string
          synced_at: string
          track_id: number
          type: string
        }
        Insert: {
          active?: boolean
          code?: string | null
          name: string
          synced_at?: string
          track_id: number
          type: string
        }
        Update: {
          active?: boolean
          code?: string | null
          name?: string
          synced_at?: string
          track_id?: number
          type?: string
        }
        Relationships: []
      }
      track_poll_state: {
        Row: {
          collection_name: string
          last_run_at: string | null
          last_run_outcome: string | null
          last_seen_external_id: number | null
          last_seen_updated_at: string | null
          records_errored: number
          records_processed: number
        }
        Insert: {
          collection_name: string
          last_run_at?: string | null
          last_run_outcome?: string | null
          last_seen_external_id?: number | null
          last_seen_updated_at?: string | null
          records_errored?: number
          records_processed?: number
        }
        Update: {
          collection_name?: string
          last_run_at?: string | null
          last_run_outcome?: string | null
          last_seen_external_id?: number | null
          last_seen_updated_at?: string | null
          records_errored?: number
          records_processed?: number
        }
        Relationships: []
      }
      track_wo_subtasks: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          is_completed: boolean
          name: string
          sort_order: number | null
          synced_at: string
          task_id: string
          track_id: number
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          is_completed?: boolean
          name: string
          sort_order?: number | null
          synced_at?: string
          task_id: string
          track_id: number
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          is_completed?: boolean
          name?: string
          sort_order?: number | null
          synced_at?: string
          task_id?: string
          track_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "track_wo_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_wo_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_operations_damage_claims"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "track_wo_subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tasks_ranked"
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
          default_housekeeper_id: string | null
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
          default_housekeeper_id?: string | null
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
          default_housekeeper_id?: string | null
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
            foreignKeyName: "units_default_housekeeper_id_fkey"
            columns: ["default_housekeeper_id"]
            isOneToOne: false
            referencedRelation: "mv_vendor_performance_30d"
            referencedColumns: ["vendor_id"]
          },
          {
            foreignKeyName: "units_default_housekeeper_id_fkey"
            columns: ["default_housekeeper_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
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
          address: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_method: string | null
          phone: string | null
          specialty: string | null
          track_vendor_id: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_method?: string | null
          phone?: string | null
          specialty?: string | null
          track_vendor_id?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_method?: string | null
          phone?: string | null
          specialty?: string | null
          track_vendor_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      webhook_nonces: {
        Row: {
          expires_at: string
          nonce: string
          received_at: string
          source: string
        }
        Insert: {
          expires_at?: string
          nonce: string
          received_at?: string
          source: string
        }
        Update: {
          expires_at?: string
          nonce?: string
          received_at?: string
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      mv_operational_exceptions: {
        Row: {
          created_at: string | null
          dedupe_key: string | null
          entity_id: string | null
          entity_link: string | null
          entity_type: string | null
          severity: string | null
          subtitle: string | null
          title: string | null
        }
        Relationships: []
      }
      mv_ops_dashboard_kpis: {
        Row: {
          hk_completed_last_week: number | null
          hk_completed_this_week: number | null
          hk_in_progress: number | null
          maint_completed_last_week: number | null
          maint_completed_this_week: number | null
          maint_in_progress: number | null
          maint_overdue: number | null
          refreshed_at: string | null
          track_mirrored_tasks: number | null
        }
        Relationships: []
      }
      mv_ops_dashboard_kpis_by_property: {
        Row: {
          hk_completed_last_week: number | null
          hk_completed_this_week: number | null
          hk_in_progress: number | null
          maint_completed_last_week: number | null
          maint_completed_this_week: number | null
          maint_in_progress: number | null
          maint_overdue: number | null
          property_name: string | null
          refreshed_at: string | null
        }
        Relationships: []
      }
      mv_properties_at_risk: {
        Row: {
          arrivals_next_24h: number | null
          arrivals_next_48h: number | null
          blocked_wo_count: number | null
          computed_at: string | null
          health_band: string | null
          health_score: number | null
          overdue_wo_count: number | null
          property_id: string | null
          property_name: string | null
          risk_band: string | null
          top_arrivals: Json | null
          turnovers_today: number | null
          vendor_delayed_count: number | null
          vip_arrivals_next_48h: number | null
        }
        Relationships: []
      }
      mv_track_reservations_latest: {
        Row: {
          adr: number | null
          arrival_date: string | null
          arrival_time: string | null
          departure_date: string | null
          departure_time: string | null
          event_at: string | null
          event_type: string | null
          external_id: string | null
          folio_balance: number | null
          folio_id: number | null
          folio_status: string | null
          grand_total: number | null
          gross_rent: number | null
          guest_email: string | null
          guest_name: string | null
          is_blacklist: boolean | null
          is_dnr: boolean | null
          is_vip: boolean | null
          nights: number | null
          occupants: Json | null
          promo_code: string | null
          source: string | null
          status: string | null
          total_fees: number | null
          total_taxes: number | null
          unit_area: string | null
          unit_code: string | null
          unit_id: number | null
          unit_short_name: string | null
        }
        Relationships: []
      }
      mv_vendor_performance_30d: {
        Row: {
          cancel_pct: number | null
          cancelled_count: number | null
          completed_count: number | null
          computed_at: string | null
          cycle_hours_avg: number | null
          no_show_count: number | null
          no_show_pct: number | null
          on_time_count: number | null
          on_time_pct: number | null
          overdue_open_count: number | null
          overdue_pct: number | null
          score: number | null
          task_count: number | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: []
      }
      v_operations_damage_claims: {
        Row: {
          claim_approved_amount: number | null
          claim_deadline_at: string | null
          claim_decided_at: string | null
          claim_filed_amount: number | null
          claim_filed_at: string | null
          claim_id: string | null
          claim_provider: string | null
          claim_status: Database["public"]["Enums"]["claim_status"] | null
          damage_classification:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          deadline_status: string | null
          hours_to_deadline: number | null
          property: string | null
          task_created_at: string | null
          task_id: string | null
          title: string | null
          track_wo: string | null
          unit_code: string | null
        }
        Relationships: []
      }
      v_operations_recent_activity: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          created_at: string | null
          id: string | null
          new_status: string | null
          note: string | null
          old_status: string | null
          photo_count: number | null
          task_category: Database["public"]["Enums"]["task_category"] | null
          task_id: string | null
          task_title: string | null
          update_type: string | null
        }
        Relationships: []
      }
      v_operations_recent_photos: {
        Row: {
          caption: string | null
          photo_id: string | null
          photo_subtype: string | null
          storage_path: string | null
          task_category: Database["public"]["Enums"]["task_category"] | null
          task_id: string | null
          task_status: Database["public"]["Enums"]["task_status"] | null
          task_title: string | null
          uploaded_at: string | null
          uploaded_by_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_operations_damage_claims"
            referencedColumns: ["task_id"]
          },
          {
            foreignKeyName: "task_photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tasks_ranked"
            referencedColumns: ["id"]
          },
        ]
      }
      v_tasks_ranked: {
        Row: {
          assigned_to: string | null
          assigned_vendor_name: string | null
          billing_notes: string | null
          billing_ready: boolean | null
          blocked_reason: string | null
          checkin_time: string | null
          checkout_time: string | null
          claim_approved_amount: number | null
          claim_deadline_at: string | null
          claim_decided_at: string | null
          claim_filed_amount: number | null
          claim_filed_at: string | null
          claim_id: string | null
          claim_provider: string | null
          claim_status: Database["public"]["Enums"]["claim_status"] | null
          clean_type_name: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          damage_classification:
            | Database["public"]["Enums"]["damage_classification"]
            | null
          description: string | null
          due_at: string | null
          expected_duration_minutes: number | null
          external_id: string | null
          external_source: string | null
          guest_name: string | null
          housekeeping_type:
            | Database["public"]["Enums"]["housekeeping_type"]
            | null
          id: string | null
          is_guest_facing: boolean | null
          needs_review: boolean | null
          owner_charges_amount: number | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          processed_at: string | null
          processed_by: string | null
          property_id: string | null
          reopened_count: number | null
          requires_note: boolean | null
          requires_photo: boolean | null
          requires_timestamp: boolean | null
          reservation_id: string | null
          scheduled_for: string | null
          score_computed_at: string | null
          smart_queue_reason: string | null
          smart_queue_score: number | null
          source_type: string | null
          special_instructions: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          task_category: Database["public"]["Enums"]["task_category"] | null
          task_type: string | null
          time_estimate_minutes: number | null
          title: string | null
          track_clean_type_id: number | null
          unit_id: string | null
          updated_at: string | null
          vendor_id: string | null
          vendor_invoice_amount: number | null
          vendor_invoice_received: boolean | null
          verified_at: string | null
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
            foreignKeyName: "tasks_track_clean_type_id_fkey"
            columns: ["track_clean_type_id"]
            isOneToOne: false
            referencedRelation: "track_clean_types"
            referencedColumns: ["track_id"]
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
            referencedRelation: "mv_vendor_performance_30d"
            referencedColumns: ["vendor_id"]
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
      v_track_attachment_queue: {
        Row: {
          backoff_pending: number | null
          dead_letter: number | null
          due_now: number | null
          next_pending_at: string | null
          synced_total: number | null
        }
        Relationships: []
      }
      v_track_poll_latest: {
        Row: {
          collection_name: string | null
          health: string | null
          last_run_at: string | null
          last_run_outcome: string | null
          last_seen_updated_at: string | null
          records_errored: number | null
          records_processed: number | null
          seconds_since_last_run: number | null
        }
        Insert: {
          collection_name?: string | null
          health?: never
          last_run_at?: string | null
          last_run_outcome?: string | null
          last_seen_updated_at?: string | null
          records_errored?: number | null
          records_processed?: number | null
          seconds_since_last_run?: never
        }
        Update: {
          collection_name?: string | null
          health?: never
          last_run_at?: string | null
          last_run_outcome?: string | null
          last_seen_updated_at?: string | null
          records_errored?: number | null
          records_processed?: number | null
          seconds_since_last_run?: never
        }
        Relationships: []
      }
      v_track_sync_health: {
        Row: {
          description: string | null
          metric: string | null
          observed: string | null
          status: string | null
          threshold: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_dashboard_bundle: { Args: never; Returns: Json }
      analytics_dashboard_summary: { Args: never; Returns: Json }
      analytics_staff_workload: {
        Args: never
        Returns: {
          active: number
          assigned: number
          done: number
          full_name: string
          profile_id: string
        }[]
      }
      analytics_trends_daily: {
        Args: { p_days?: number }
        Returns: {
          completed: number
          created: number
          day: string
          overdue: number
        }[]
      }
      avg_admin_touches_per_task: { Args: never; Returns: number }
      avg_cycle_time_hours: { Args: never; Returns: number }
      can_write_task_photo: { Args: { p_path: string }; Returns: boolean }
      create_missing_final_cleans: {
        Args: { p_grace_hours?: number; p_lookback_days?: number }
        Returns: {
          created_count: number
          skipped_existing: number
          skipped_no_unit: number
        }[]
      }
      current_user_vendor_id: { Args: never; Returns: string }
      diagnose_wo_visibility: {
        Args: { p_external_id: string; p_user_email: string }
        Returns: Json
      }
      escalate_overdue_tasks: { Args: never; Returns: undefined }
      escalate_unaccepted_tasks: { Args: never; Returns: undefined }
      exception_feed: { Args: { p_limit?: number }; Returns: Json }
      exec_command_center_bundle: { Args: never; Returns: Json }
      find_similar_tasks: {
        Args: { p_property_id: string; p_title?: string; p_unit_id?: string }
        Returns: {
          created_at: string
          id: string
          status: Database["public"]["Enums"]["task_status"]
          title: string
        }[]
      }
      get_cron_secret: { Args: never; Returns: string }
      get_dashboard_kpis: {
        Args: never
        Returns: {
          hk_completed_last_week: number | null
          hk_completed_this_week: number | null
          hk_in_progress: number | null
          maint_completed_last_week: number | null
          maint_completed_this_week: number | null
          maint_in_progress: number | null
          maint_overdue: number | null
          refreshed_at: string | null
          track_mirrored_tasks: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "mv_ops_dashboard_kpis"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_dashboard_kpis_by_property: {
        Args: never
        Returns: {
          hk_completed_last_week: number | null
          hk_completed_this_week: number | null
          hk_in_progress: number | null
          maint_completed_last_week: number | null
          maint_completed_this_week: number | null
          maint_in_progress: number | null
          maint_overdue: number | null
          property_name: string | null
          refreshed_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "mv_ops_dashboard_kpis_by_property"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_service_role_jwt: { Args: never; Returns: string }
      handle_akia_guest_request: {
        Args: {
          p_category?: string
          p_guest_name: string
          p_is_urgent?: boolean
          p_message: string
          p_priority?: string
          p_reservation_id?: string
          p_unit_track_id: string
        }
        Returns: Json
      }
      handle_travelnet_checkout: {
        Args: {
          p_checkin_time?: string
          p_checkout_time?: string
          p_external_id: string
          p_guest_name?: string
          p_property_track_id: string
          p_special_instructions?: string
          p_unit_track_id: string
        }
        Returns: Json
      }
      has_admin_access: { Args: { _user_id: string }; Returns: boolean }
      has_constraint: {
        Args: { p_constraint: string; p_table: string }
        Returns: boolean
      }
      has_revoked_share_token: { Args: { p_jti: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      health_score_history: {
        Args: { p_hours?: number }
        Returns: {
          band: string
          captured_at: string
          score: number
        }[]
      }
      janitor_task_photos_orphans: {
        Args: { hours_to_keep?: number; max_batch?: number }
        Returns: Json
      }
      my_smart_queue: { Args: { p_limit?: number }; Returns: Json }
      operational_health_score: {
        Args: never
        Returns: {
          band: string
          components: Json
          computed_at: string
          score: number
        }[]
      }
      operational_health_score_by_property: {
        Args: never
        Returns: {
          band: string
          components: Json
          property_id: string
          property_name: string
          score: number
        }[]
      }
      properties_overview_bundle: { Args: never; Returns: Json }
      property_kpis: { Args: { p_property_id: string }; Returns: Json }
      prune_audit_logs: { Args: { p_keep_days?: number }; Returns: number }
      prune_noisy_heartbeats: {
        Args: { days_to_keep?: number }
        Returns: number
      }
      prune_webhook_nonces: { Args: never; Returns: number }
      refresh_task_priority_scores: { Args: never; Returns: number }
      reopen_task: {
        Args: { p_expected_status: string; p_task_id: string }
        Returns: {
          id: string
          reopened_count: number
          status: string
        }[]
      }
      sla_deadline: { Args: { p_task_id: string }; Returns: string }
      sla_target_hours: {
        Args: {
          p_category: Database["public"]["Enums"]["task_category"]
          p_priority: Database["public"]["Enums"]["task_priority"]
          p_task_type: string
        }
        Returns: number
      }
      smart_queue_open: { Args: { p_limit?: number }; Returns: Json }
      smart_queue_reason: { Args: { p_task_id: string }; Returns: string }
      smart_queue_score: { Args: { p_task_id: string }; Returns: number }
      supervisor_brief_bundle: { Args: never; Returns: Json }
      upsert_track_vendor: {
        Args: {
          p_contact_name?: string
          p_email?: string
          p_is_active?: boolean
          p_name: string
          p_phone?: string
          p_track_vendor_id: number
        }
        Returns: {
          created: boolean
          vendor_id: string
        }[]
      }
      vendor_performance_detail: {
        Args: { p_days?: number; p_vendor_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "field_staff"
        | "admin"
        | "supervisor"
        | "manager"
        | "executive"
        | "vendor"
      claim_status: "pending" | "filed" | "approved" | "denied" | "closed"
      damage_classification:
        | "wear_and_tear"
        | "guest_damage"
        | "unclassified"
        | "owner_damage"
        | "management_damage"
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
        | "cancelled"
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
      app_role: [
        "field_staff",
        "admin",
        "supervisor",
        "manager",
        "executive",
        "vendor",
      ],
      claim_status: ["pending", "filed", "approved", "denied", "closed"],
      damage_classification: [
        "wear_and_tear",
        "guest_damage",
        "unclassified",
        "owner_damage",
        "management_damage",
      ],
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
        "cancelled",
        "completed",
        "verified",
        "processed",
      ],
    },
  },
} as const
