export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          address: string
          company_id: string
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          company_id: string
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string
          created_at: string
          email: string
          id: string
          location_lat: number
          location_lng: number
          logo_url: string | null
          manager: string | null
          name: string
          phone: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: string
          location_lat: number
          location_lng: number
          logo_url?: string | null
          manager?: string | null
          name: string
          phone: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: string
          location_lat?: number
          location_lng?: number
          logo_url?: string | null
          manager?: string | null
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      company_credentials: {
        Row: {
          created_at: string
          id: string
          temp_password: string
        }
        Insert: {
          created_at?: string
          id: string
          temp_password: string
        }
        Update: {
          created_at?: string
          id?: string
          temp_password?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_credentials_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          is_super_admin: boolean | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["company_member_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          is_super_admin?: boolean | null
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["company_member_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          is_super_admin?: boolean | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["company_member_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_credentials: {
        Row: {
          access_code: string
          company_id: string | null
          created_at: string
          id: string
          phone_number: string
          updated_at: string
        }
        Insert: {
          access_code: string
          company_id?: string | null
          created_at?: string
          id?: string
          phone_number: string
          updated_at?: string
        }
        Update: {
          access_code?: string
          company_id?: string | null
          created_at?: string
          id?: string
          phone_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_credentials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_requests: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          request_type: Database["public"]["Enums"]["inventory_request_type"]
          requested_by: string
          status: Database["public"]["Enums"]["inventory_request_status"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          request_type: Database["public"]["Enums"]["inventory_request_type"]
          requested_by: string
          status?: Database["public"]["Enums"]["inventory_request_status"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          request_type?: Database["public"]["Enums"]["inventory_request_type"]
          requested_by?: string
          status?: Database["public"]["Enums"]["inventory_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      product_codes: {
        Row: {
          created_at: string
          id: string
          is_used: boolean | null
          product_id: string | null
          qr_code: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_used?: boolean | null
          product_id?: string | null
          qr_code: string
        }
        Update: {
          created_at?: string
          id?: string
          is_used?: boolean | null
          product_id?: string | null
          qr_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_codes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_scans: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          qr_code: string
          scan_type: Database["public"]["Enums"]["scan_type"]
          scanned_by: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          qr_code: string
          scan_type: Database["public"]["Enums"]["scan_type"]
          scanned_by: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          qr_code?: string
          scan_type?: Database["public"]["Enums"]["scan_type"]
          scanned_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_scans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          company_id: string
          created_at: string
          expiry_date: string
          id: string
          image_url: string | null
          name: string
          production_date: string
          quantity: number
          status: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string
          expiry_date: string
          id?: string
          image_url?: string | null
          name: string
          production_date: string
          quantity: number
          status: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string
          expiry_date?: string
          id?: string
          image_url?: string | null
          name?: string
          production_date?: string
          quantity?: number
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_access: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password_hash: string
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password_hash: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password_hash?: string
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_access_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member_permissions: {
        Row: {
          created_at: string
          enabled: boolean
          id: string
          member_id: string
          permission_type: Database["public"]["Enums"]["team_permission_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          id?: string
          member_id: string
          permission_type: Database["public"]["Enums"]["team_permission_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          id?: string
          member_id?: string
          permission_type?: Database["public"]["Enums"]["team_permission_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_permissions_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "company_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_restaurant: {
        Args: { p_email: string; p_password: string }
        Returns: Json
      }
      check_company_member_access: {
        Args: { company_member_id: string }
        Returns: boolean
      }
      check_member_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_team_permission_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_company: {
        Args: {
          name: string
          email: string
          phone: string
          address: string
          location_lat: number
          location_lng: number
          logo_url: string
          user_id: string
        }
        Returns: Json
      }
      create_company_secure: {
        Args: {
          p_name: string
          p_email: string
          p_phone: string
          p_address: string
          p_logo_url?: string
          p_user_id?: string
        }
        Returns: Json
      }
      create_restaurant_access: {
        Args: { p_restaurant_id: string; p_email: string; p_password: string }
        Returns: Json
      }
      delete_all_branches: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_all_companies: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_all_company_credentials: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_all_company_members: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      ensure_admin_company: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      force_update_company: {
        Args: {
          p_company_id: string
          p_name: string
          p_phone: string
          p_address: string
          p_logo_url?: string
        }
        Returns: Json
      }
      force_update_company_with_manager: {
        Args: {
          p_company_id: string
          p_name: string
          p_phone: string
          p_address: string
          p_manager: string
          p_logo_url?: string
        }
        Returns: Json
      }
      insert_employee_credential: {
        Args: {
          p_company_id: string
          p_phone_number: string
          p_access_code: string
        }
        Returns: Json
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      company_member_role: "admin" | "staff"
      inventory_request_status: "pending" | "approved" | "rejected"
      inventory_request_type: "in" | "out"
      scan_type: "in" | "out" | "check"
      team_permission_type:
        | "stats"
        | "companies"
        | "team"
        | "inventory"
        | "subscriptions"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      company_member_role: ["admin", "staff"],
      inventory_request_status: ["pending", "approved", "rejected"],
      inventory_request_type: ["in", "out"],
      scan_type: ["in", "out", "check"],
      team_permission_type: [
        "stats",
        "companies",
        "team",
        "inventory",
        "subscriptions",
      ],
    },
  },
} as const
