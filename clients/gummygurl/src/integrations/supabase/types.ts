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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      custom_products: {
        Row: {
          brand: string
          category: string
          compare_price: number | null
          created_at: string
          description: string | null
          effects: string[] | null
          gallery_images: string[] | null
          gram_amount: string | null
          handle: string
          highlights: string[] | null
          id: string
          image_url: string | null
          ingredients: string | null
          is_featured: boolean
          price: number
          product_image_url: string | null
          status: string
          subcategory: string | null
          subscription_eligible: boolean
          title: string
          updated_at: string
          weight: string | null
        }
        Insert: {
          brand?: string
          category?: string
          compare_price?: number | null
          created_at?: string
          description?: string | null
          effects?: string[] | null
          gallery_images?: string[] | null
          gram_amount?: string | null
          handle: string
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_featured?: boolean
          price: number
          product_image_url?: string | null
          status?: string
          subcategory?: string | null
          subscription_eligible?: boolean
          title: string
          updated_at?: string
          weight?: string | null
        }
        Update: {
          brand?: string
          category?: string
          compare_price?: number | null
          created_at?: string
          description?: string | null
          effects?: string[] | null
          gallery_images?: string[] | null
          gram_amount?: string | null
          handle?: string
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_featured?: boolean
          price?: number
          product_image_url?: string | null
          status?: string
          subcategory?: string | null
          subscription_eligible?: boolean
          title?: string
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          email: string
          id: string
          items: Json
          shipping: number
          shipping_address: Json | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
          woo_order_id: number | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          items?: Json
          shipping?: number
          shipping_address?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
          woo_order_id?: number | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          items?: Json
          shipping?: number
          shipping_address?: Json | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
          woo_order_id?: number | null
        }
        Relationships: []
      }
      product_overrides: {
        Row: {
          handle: string
          is_available: boolean
          is_featured: boolean
          status: string
          subscription_eligible: boolean
          updated_at: string
        }
        Insert: {
          handle: string
          is_available?: boolean
          is_featured?: boolean
          status?: string
          subscription_eligible?: boolean
          updated_at?: string
        }
        Update: {
          handle?: string
          is_available?: boolean
          is_featured?: boolean
          status?: string
          subscription_eligible?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          discount_percent: number
          frequency: string
          id: string
          product_handle: string
          status: string
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          discount_percent?: number
          frequency?: string
          id?: string
          product_handle: string
          status?: string
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          discount_percent?: number
          frequency?: string
          id?: string
          product_handle?: string
          status?: string
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      woo_products: {
        Row: {
          brand: string
          category: string
          coa_pdf: string | null
          compare_price: number | null
          created_at: string
          description: string | null
          effects: string[] | null
          flavors: Json | null
          gallery_images: string[] | null
          handle: string
          highlights: string[] | null
          id: string
          image_url: string | null
          price: number
          product_image_url: string | null
          short_description: string | null
          stock_status: string | null
          subcategory: string | null
          synced_at: string
          thc_restricted: boolean
          title: string
          updated_at: string
          variants: Json | null
          whats_included: string[] | null
          woo_categories: Json | null
          woo_id: number
          woo_meta: Json | null
          woo_status: string | null
        }
        Insert: {
          brand?: string
          category?: string
          coa_pdf?: string | null
          compare_price?: number | null
          created_at?: string
          description?: string | null
          effects?: string[] | null
          flavors?: Json | null
          gallery_images?: string[] | null
          handle: string
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          price: number
          product_image_url?: string | null
          short_description?: string | null
          stock_status?: string | null
          subcategory?: string | null
          synced_at?: string
          thc_restricted?: boolean
          title: string
          updated_at?: string
          variants?: Json | null
          whats_included?: string[] | null
          woo_categories?: Json | null
          woo_id: number
          woo_meta?: Json | null
          woo_status?: string | null
        }
        Update: {
          brand?: string
          category?: string
          coa_pdf?: string | null
          compare_price?: number | null
          created_at?: string
          description?: string | null
          effects?: string[] | null
          flavors?: Json | null
          gallery_images?: string[] | null
          handle?: string
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          price?: number
          product_image_url?: string | null
          short_description?: string | null
          stock_status?: string | null
          subcategory?: string | null
          synced_at?: string
          thc_restricted?: boolean
          title?: string
          updated_at?: string
          variants?: Json | null
          whats_included?: string[] | null
          woo_categories?: Json | null
          woo_id?: number
          woo_meta?: Json | null
          woo_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
