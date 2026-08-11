/**
 * Database types aligned with supabase/migrations/20260805150000_initial_cms_schema.sql
 * Prefer regenerating after apply:
 *   npx supabase gen types typescript --project-id jnvbsiydahnkfpkdhkps > src/types/database.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContentStatus = "draft" | "published" | "archived";
export type ConsultationStatus = "new" | "contacted" | "closed" | "spam";
export type ContactMethod = "phone" | "email" | "either";
export type SectionType =
  | "text"
  | "richtext"
  | "image"
  | "cta"
  | "list"
  | "custom";

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          label: string | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value?: Json;
          label?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          label?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          status: ContentStatus;
          seo_title: string | null;
          seo_description: string | null;
          og_image_path: string | null;
          sort_order: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          status?: ContentStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          og_image_path?: string | null;
          sort_order?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["pages"]["Insert"]>;
      };
      page_sections: {
        Row: {
          id: string;
          page_id: string;
          key: string;
          section_type: SectionType;
          content: Json;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          page_id: string;
          key: string;
          section_type?: SectionType;
          content?: Json;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["page_sections"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string | null;
          body: string | null;
          image_path: string | null;
          cta_label: string | null;
          cta_href: string | null;
          sort_order: number;
          status: ContentStatus;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary?: string | null;
          body?: string | null;
          image_path?: string | null;
          cta_label?: string | null;
          cta_href?: string | null;
          sort_order?: number;
          status?: ContentStatus;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_categories"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image_path: string | null;
          status: "draft" | "published";
          published_at: string | null;
          seo_title: string | null;
          seo_description: string | null;
          category_id: string | null;
          author_name: string | null;
          reading_time_minutes: number | null;
          is_featured: boolean;
          is_popular: boolean;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          featured_image_path?: string | null;
          status?: "draft" | "published";
          published_at?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          category_id?: string | null;
          author_name?: string | null;
          reading_time_minutes?: number | null;
          is_featured?: boolean;
          is_popular?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          quote: string;
          avatar_path: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string | null;
          quote: string;
          avatar_path?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      media_assets: {
        Row: {
          id: string;
          bucket: string;
          path: string;
          alt_text: string | null;
          caption: string | null;
          mime_type: string | null;
          width: number | null;
          height: number | null;
          size_bytes: number | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          bucket?: string;
          path: string;
          alt_text?: string | null;
          caption?: string | null;
          mime_type?: string | null;
          width?: number | null;
          height?: number | null;
          size_bytes?: number | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Insert"]>;
      };
      consultation_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          service_interest: string | null;
          preferred_contact_method: ContactMethod;
          message: string | null;
          consent: boolean;
          status: ConsultationStatus;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          service_interest?: string | null;
          preferred_contact_method?: ContactMethod;
          message?: string | null;
          consent: boolean;
          status?: ConsultationStatus;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["consultation_requests"]["Insert"]
        >;
      };
      maintenance_heartbeats: {
        Row: {
          id: string;
          last_seen_at: string;
          run_count: number;
          last_status: string | null;
          last_error: string | null;
        };
        Insert: {
          id: string;
          last_seen_at?: string;
          run_count?: number;
          last_status?: string | null;
          last_error?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["maintenance_heartbeats"]["Insert"]
        >;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      record_maintenance_heartbeat: {
        Args: Record<string, never>;
        Returns: Database["public"]["Tables"]["maintenance_heartbeats"]["Row"];
      };
    };
    Enums: Record<string, never>;
  };
};
