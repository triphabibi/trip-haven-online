export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attraction_tickets: {
        Row: {
          available_times: string[] | null
          booking_count: number | null
          cancellation_policy: string | null
          created_at: string | null
          description: string | null
          exclusions: string[] | null
          featured_image: string | null
          free_cancellation: boolean | null
          gallery_images: string[] | null
          highlights: string[] | null
          id: string
          image_urls: string[] | null
          instant_confirmation: boolean | null
          instant_delivery: boolean | null
          is_featured: boolean | null
          languages: string[] | null
          location: string | null
          map_location: string | null
          max_capacity: number | null
          meeting_point: string | null
          overview: string | null
          price_adult: number
          price_child: number
          price_infant: number
          rating: number | null
          refund_policy: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          status: Database["public"]["Enums"]["service_status"] | null
          terms_conditions: string | null
          ticket_pdf_urls: string[] | null
          title: string
          total_reviews: number | null
          updated_at: string | null
          whats_included: string[] | null
        }
        Insert: {
          available_times?: string[] | null
          booking_count?: number | null
          cancellation_policy?: string | null
          created_at?: string | null
          description?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          free_cancellation?: boolean | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          instant_confirmation?: boolean | null
          instant_delivery?: boolean | null
          is_featured?: boolean | null
          languages?: string[] | null
          location?: string | null
          map_location?: string | null
          max_capacity?: number | null
          meeting_point?: string | null
          overview?: string | null
          price_adult: number
          price_child?: number
          price_infant?: number
          rating?: number | null
          refund_policy?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          ticket_pdf_urls?: string[] | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Update: {
          available_times?: string[] | null
          booking_count?: number | null
          cancellation_policy?: string | null
          created_at?: string | null
          description?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          free_cancellation?: boolean | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          instant_confirmation?: boolean | null
          instant_delivery?: boolean | null
          is_featured?: boolean | null
          languages?: string[] | null
          location?: string | null
          map_location?: string | null
          max_capacity?: number | null
          meeting_point?: string | null
          overview?: string | null
          price_adult?: number
          price_child?: number
          price_infant?: number
          rating?: number | null
          refund_policy?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          ticket_pdf_urls?: string[] | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Relationships: []
      }
      booking_travelers: {
        Row: {
          booking_id: string
          created_at: string | null
          date_of_birth: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          nationality: string | null
          passport_expiry: string | null
          passport_number: string | null
          special_requirements: string | null
          title: string | null
          traveler_type: string
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          special_requirements?: string | null
          title?: string | null
          traveler_type: string
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          special_requirements?: string | null
          title?: string | null
          traveler_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_travelers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "new_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          accessibility_needs: string | null
          admin_notes: string | null
          adults_count: number | null
          assigned_guide: string | null
          base_amount: number
          booking_reference: string
          booking_status: string | null
          cancelled_at: string | null
          children_count: number | null
          completed_at: string | null
          confirmation_code: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          dietary_requirements: string | null
          discount_amount: number | null
          emergency_contact: string | null
          emergency_phone: string | null
          id: string
          infants_count: number | null
          internal_notes: string | null
          payment_date: string | null
          payment_gateway: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          pickup_location: string | null
          selected_language: string | null
          service_fee: number | null
          service_id: string
          service_title: string
          service_type: string
          special_requests: string | null
          taxes_amount: number | null
          total_amount: number
          total_travelers: number | null
          travel_date: string | null
          travel_time: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accessibility_needs?: string | null
          admin_notes?: string | null
          adults_count?: number | null
          assigned_guide?: string | null
          base_amount: number
          booking_reference: string
          booking_status?: string | null
          cancelled_at?: string | null
          children_count?: number | null
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          dietary_requirements?: string | null
          discount_amount?: number | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          infants_count?: number | null
          internal_notes?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          pickup_location?: string | null
          selected_language?: string | null
          service_fee?: number | null
          service_id: string
          service_title: string
          service_type: string
          special_requests?: string | null
          taxes_amount?: number | null
          total_amount: number
          total_travelers?: number | null
          travel_date?: string | null
          travel_time?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accessibility_needs?: string | null
          admin_notes?: string | null
          adults_count?: number | null
          assigned_guide?: string | null
          base_amount?: number
          booking_reference?: string
          booking_status?: string | null
          cancelled_at?: string | null
          children_count?: number | null
          completed_at?: string | null
          confirmation_code?: string | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          dietary_requirements?: string | null
          discount_amount?: number | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          id?: string
          infants_count?: number | null
          internal_notes?: string | null
          payment_date?: string | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          pickup_location?: string | null
          selected_language?: string | null
          service_fee?: number | null
          service_id?: string
          service_title?: string
          service_type?: string
          special_requests?: string | null
          taxes_amount?: number | null
          total_amount?: number
          total_travelers?: number | null
          travel_date?: string | null
          travel_time?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_settings: {
        Row: {
          created_at: string | null
          from_email: string
          from_name: string
          id: string
          is_enabled: boolean | null
          smtp_host: string
          smtp_password: string
          smtp_port: number
          smtp_user: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          from_email: string
          from_name?: string
          id?: string
          is_enabled?: boolean | null
          smtp_host: string
          smtp_password: string
          smtp_port?: number
          smtp_user: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          from_email?: string
          from_name?: string
          id?: string
          is_enabled?: boolean | null
          smtp_host?: string
          smtp_password?: string
          smtp_port?: number
          smtp_user?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      homepage_sliders: {
        Row: {
          background_overlay_opacity: number | null
          button_text: string | null
          created_at: string | null
          cta_button_color: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          background_overlay_opacity?: number | null
          button_text?: string | null
          created_at?: string | null
          cta_button_color?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          background_overlay_opacity?: number | null
          button_text?: string | null
          created_at?: string | null
          cta_button_color?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string | null
          href: string
          icon: string | null
          id: string
          is_active: boolean | null
          menu_type: string | null
          name: string
          order_index: number | null
          parent_id: string | null
          target: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_type?: string | null
          name: string
          order_index?: number | null
          parent_id?: string | null
          target?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_type?: string | null
          name?: string
          order_index?: number | null
          parent_id?: string | null
          target?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      new_bookings: {
        Row: {
          adults_count: number | null
          base_amount: number
          booking_reference: string
          booking_status: string | null
          cancelled_at: string | null
          children_count: number | null
          confirmed_at: string | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          final_amount: number
          gateway_response: Json | null
          id: string
          infants_count: number | null
          payment_gateway: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          pickup_location: string | null
          selected_language: string | null
          service_id: string
          service_title: string
          service_type: string
          special_requests: string | null
          tax_amount: number | null
          total_amount: number
          travel_date: string | null
          travel_time: string | null
          updated_at: string | null
        }
        Insert: {
          adults_count?: number | null
          base_amount?: number
          booking_reference?: string
          booking_status?: string | null
          cancelled_at?: string | null
          children_count?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          final_amount: number
          gateway_response?: Json | null
          id?: string
          infants_count?: number | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          pickup_location?: string | null
          selected_language?: string | null
          service_id: string
          service_title: string
          service_type: string
          special_requests?: string | null
          tax_amount?: number | null
          total_amount: number
          travel_date?: string | null
          travel_time?: string | null
          updated_at?: string | null
        }
        Update: {
          adults_count?: number | null
          base_amount?: number
          booking_reference?: string
          booking_status?: string | null
          cancelled_at?: string | null
          children_count?: number | null
          confirmed_at?: string | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          final_amount?: number
          gateway_response?: Json | null
          id?: string
          infants_count?: number | null
          payment_gateway?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          pickup_location?: string | null
          selected_language?: string | null
          service_id?: string
          service_title?: string
          service_type?: string
          special_requests?: string | null
          tax_amount?: number | null
          total_amount?: number
          travel_date?: string | null
          travel_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ok_to_board_services: {
        Row: {
          base_price: number
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          processing_fee: number
          processing_time: string
          requirements: string[] | null
          tax_rate: number
          title: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          processing_fee?: number
          processing_time?: string
          requirements?: string[] | null
          tax_rate?: number
          title?: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          processing_fee?: number
          processing_time?: string
          requirements?: string[] | null
          tax_rate?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          api_key: string | null
          api_secret: string | null
          bank_details: Json | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          display_name: string
          gateway_name: Database["public"]["Enums"]["gateway_type"]
          id: string
          is_enabled: boolean | null
          max_amount: number | null
          min_amount: number | null
          priority: number | null
          supported_currencies: string[] | null
          test_mode: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          bank_details?: Json | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          display_name: string
          gateway_name: Database["public"]["Enums"]["gateway_type"]
          id?: string
          is_enabled?: boolean | null
          max_amount?: number | null
          min_amount?: number | null
          priority?: number | null
          supported_currencies?: string[] | null
          test_mode?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          bank_details?: Json | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          gateway_name?: Database["public"]["Enums"]["gateway_type"]
          id?: string
          is_enabled?: boolean | null
          max_amount?: number | null
          min_amount?: number | null
          priority?: number | null
          supported_currencies?: string[] | null
          test_mode?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          nationality: string | null
          passport_number: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          nationality?: string | null
          passport_number?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          nationality?: string | null
          passport_number?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          applicable_categories: string[] | null
          applicable_services: string[] | null
          code: string
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_type: string | null
          discount_value: number
          id: string
          is_active: boolean | null
          is_public: boolean | null
          max_discount: number | null
          max_uses: number | null
          max_uses_per_user: number | null
          min_amount: number | null
          min_travelers: number | null
          title: string
          updated_at: string | null
          usage_analytics: Json | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_categories?: string[] | null
          applicable_services?: string[] | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_discount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_amount?: number | null
          min_travelers?: number | null
          title: string
          updated_at?: string | null
          usage_analytics?: Json | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_categories?: string[] | null
          applicable_services?: string[] | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          is_active?: boolean | null
          is_public?: boolean | null
          max_discount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_amount?: number | null
          min_travelers?: number | null
          title?: string
          updated_at?: string | null
          usage_analytics?: Json | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          admin_notes: string | null
          admin_response: string | null
          booking_id: string | null
          cons: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          is_verified: boolean | null
          moderated_at: string | null
          moderated_by: string | null
          pros: string | null
          rating: number | null
          reported_count: number | null
          review_text: string | null
          reviewer_email: string | null
          reviewer_name: string
          service_id: string
          service_type: string
          title: string | null
          travel_date: string | null
          traveler_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_response?: string | null
          booking_id?: string | null
          cons?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_verified?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          pros?: string | null
          rating?: number | null
          reported_count?: number | null
          review_text?: string | null
          reviewer_email?: string | null
          reviewer_name: string
          service_id: string
          service_type: string
          title?: string | null
          travel_date?: string | null
          traveler_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_response?: string | null
          booking_id?: string | null
          cons?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          is_verified?: boolean | null
          moderated_at?: string | null
          moderated_by?: string | null
          pros?: string | null
          rating?: number | null
          reported_count?: number | null
          review_text?: string | null
          reviewer_email?: string | null
          reviewer_name?: string
          service_id?: string
          service_type?: string
          title?: string | null
          travel_date?: string | null
          traveler_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_moderated_by_fkey"
            columns: ["moderated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tour_packages: {
        Row: {
          available_times: string[] | null
          booking_count: number | null
          cancellation_policy: string | null
          created_at: string | null
          days: number
          description: string | null
          exclusions: string[] | null
          featured_image: string | null
          free_cancellation: boolean | null
          gallery_images: string[] | null
          highlights: string[] | null
          id: string
          image_urls: string[] | null
          instant_confirmation: boolean | null
          is_featured: boolean | null
          itinerary: Json | null
          languages: string[] | null
          location: string | null
          map_location: string | null
          max_capacity: number | null
          meeting_point: string | null
          nights: number
          overview: string | null
          price_adult: number
          price_child: number
          price_infant: number
          rating: number | null
          refund_policy: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          status: Database["public"]["Enums"]["service_status"] | null
          terms_conditions: string | null
          title: string
          total_reviews: number | null
          updated_at: string | null
          whats_included: string[] | null
        }
        Insert: {
          available_times?: string[] | null
          booking_count?: number | null
          cancellation_policy?: string | null
          created_at?: string | null
          days: number
          description?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          free_cancellation?: boolean | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          instant_confirmation?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          location?: string | null
          map_location?: string | null
          max_capacity?: number | null
          meeting_point?: string | null
          nights: number
          overview?: string | null
          price_adult: number
          price_child?: number
          price_infant?: number
          rating?: number | null
          refund_policy?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Update: {
          available_times?: string[] | null
          booking_count?: number | null
          cancellation_policy?: string | null
          created_at?: string | null
          days?: number
          description?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          free_cancellation?: boolean | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          instant_confirmation?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          location?: string | null
          map_location?: string | null
          max_capacity?: number | null
          meeting_point?: string | null
          nights?: number
          overview?: string | null
          price_adult?: number
          price_child?: number
          price_infant?: number
          rating?: number | null
          refund_policy?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Relationships: []
      }
      tours: {
        Row: {
          available_times: string[] | null
          booking_count: number | null
          cancellation_policy: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          exclusions: string[] | null
          featured_image: string | null
          free_cancellation: boolean | null
          gallery_images: string[] | null
          highlights: string[] | null
          id: string
          image_urls: string[] | null
          instant_confirmation: boolean | null
          is_featured: boolean | null
          itinerary: Json | null
          languages: string[] | null
          location: string | null
          map_location: string | null
          max_age: number | null
          max_capacity: number | null
          meeting_point: string | null
          min_age: number | null
          overview: string | null
          price_adult: number
          price_child: number
          price_infant: number
          rating: number | null
          refund_policy: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          status: Database["public"]["Enums"]["service_status"] | null
          terms_conditions: string | null
          title: string
          total_reviews: number | null
          updated_at: string | null
          whats_included: string[] | null
        }
        Insert: {
          available_times?: string[] | null
          booking_count?: number | null
          cancellation_policy?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          free_cancellation?: boolean | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          instant_confirmation?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          location?: string | null
          map_location?: string | null
          max_age?: number | null
          max_capacity?: number | null
          meeting_point?: string | null
          min_age?: number | null
          overview?: string | null
          price_adult: number
          price_child?: number
          price_infant?: number
          rating?: number | null
          refund_policy?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Update: {
          available_times?: string[] | null
          booking_count?: number | null
          cancellation_policy?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          free_cancellation?: boolean | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          instant_confirmation?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          languages?: string[] | null
          location?: string | null
          map_location?: string | null
          max_age?: number | null
          max_capacity?: number | null
          meeting_point?: string | null
          min_age?: number | null
          overview?: string | null
          price_adult?: number
          price_child?: number
          price_infant?: number
          rating?: number | null
          refund_policy?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Relationships: []
      }
      transfers: {
        Row: {
          advance_booking_hours: number | null
          amenities: string[] | null
          available_hours: string[] | null
          base_price: number
          created_at: string | null
          description: string | null
          distance_km: number | null
          dropoff_locations: string[] | null
          duration_minutes: number | null
          featured_image: string | null
          features: string[] | null
          id: string
          image_urls: string[] | null
          is_featured: boolean | null
          luggage_capacity: string | null
          max_passengers: number | null
          overview: string | null
          pickup_locations: string[] | null
          price_per_hour: number | null
          price_per_km: number | null
          rating: number | null
          route_description: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          status: string | null
          title: string
          total_bookings: number | null
          total_reviews: number | null
          transfer_type: string | null
          updated_at: string | null
          vehicle_type: string | null
          waiting_charge: number | null
        }
        Insert: {
          advance_booking_hours?: number | null
          amenities?: string[] | null
          available_hours?: string[] | null
          base_price: number
          created_at?: string | null
          description?: string | null
          distance_km?: number | null
          dropoff_locations?: string[] | null
          duration_minutes?: number | null
          featured_image?: string | null
          features?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          luggage_capacity?: string | null
          max_passengers?: number | null
          overview?: string | null
          pickup_locations?: string[] | null
          price_per_hour?: number | null
          price_per_km?: number | null
          rating?: number | null
          route_description?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: string | null
          title: string
          total_bookings?: number | null
          total_reviews?: number | null
          transfer_type?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          waiting_charge?: number | null
        }
        Update: {
          advance_booking_hours?: number | null
          amenities?: string[] | null
          available_hours?: string[] | null
          base_price?: number
          created_at?: string | null
          description?: string | null
          distance_km?: number | null
          dropoff_locations?: string[] | null
          duration_minutes?: number | null
          featured_image?: string | null
          features?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          luggage_capacity?: string | null
          max_passengers?: number | null
          overview?: string | null
          pickup_locations?: string[] | null
          price_per_hour?: number | null
          price_per_km?: number | null
          rating?: number | null
          route_description?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: string | null
          title?: string
          total_bookings?: number | null
          total_reviews?: number | null
          transfer_type?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
          waiting_charge?: number | null
        }
        Relationships: []
      }
      travelers: {
        Row: {
          booking_id: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          meal_preference: string | null
          nationality: string | null
          passport_expiry: string | null
          passport_number: string | null
          special_requirements: string | null
          title: string | null
          traveler_type: string | null
          visa_number: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          meal_preference?: string | null
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          special_requirements?: string | null
          title?: string | null
          traveler_type?: string | null
          visa_number?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          meal_preference?: string | null
          nationality?: string | null
          passport_expiry?: string | null
          passport_number?: string | null
          special_requirements?: string | null
          title?: string | null
          traveler_type?: string | null
          visa_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travelers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_services: {
        Row: {
          booking_count: number | null
          cancellation_policy: string | null
          country: string
          created_at: string | null
          description: string | null
          estimated_days: number | null
          exclusions: string[] | null
          featured_image: string | null
          gallery_images: string[] | null
          highlights: string[] | null
          id: string
          image_urls: string[] | null
          is_featured: boolean | null
          overview: string | null
          price: number
          processing_time: string | null
          refund_policy: string | null
          requirements: string[] | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string | null
          status: Database["public"]["Enums"]["service_status"] | null
          terms_conditions: string | null
          updated_at: string | null
          visa_type: string
          whats_included: string[] | null
        }
        Insert: {
          booking_count?: number | null
          cancellation_policy?: string | null
          country: string
          created_at?: string | null
          description?: string | null
          estimated_days?: number | null
          exclusions?: string[] | null
          featured_image?: string | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          overview?: string | null
          price: number
          processing_time?: string | null
          refund_policy?: string | null
          requirements?: string[] | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          updated_at?: string | null
          visa_type: string
          whats_included?: string[] | null
        }
        Update: {
          booking_count?: number | null
          cancellation_policy?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
          estimated_days?: number | null
          exclusions?: string[] | null
          featured_image?: string | null
          gallery_images?: string[] | null
          highlights?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          overview?: string | null
          price?: number
          processing_time?: string | null
          refund_policy?: string | null
          requirements?: string[] | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["service_status"] | null
          terms_conditions?: string | null
          updated_at?: string | null
          visa_type?: string
          whats_included?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      booking_status_new: "pending" | "confirmed" | "cancelled" | "completed"
      gateway_type:
        | "razorpay"
        | "stripe"
        | "paypal"
        | "ccavenue"
        | "bank_transfer"
        | "cash_on_arrival"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      payment_status_new: "pending" | "completed" | "failed" | "refunded"
      service_status: "active" | "inactive"
      service_type: "tour" | "ticket" | "visa"
      user_role: "user" | "admin"
      visa_status: "pending" | "approved" | "rejected" | "processing"
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
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      booking_status_new: ["pending", "confirmed", "cancelled", "completed"],
      gateway_type: [
        "razorpay",
        "stripe",
        "paypal",
        "ccavenue",
        "bank_transfer",
        "cash_on_arrival",
      ],
      payment_status: ["pending", "completed", "failed", "refunded"],
      payment_status_new: ["pending", "completed", "failed", "refunded"],
      service_status: ["active", "inactive"],
      service_type: ["tour", "ticket", "visa"],
      user_role: ["user", "admin"],
      visa_status: ["pending", "approved", "rejected", "processing"],
    },
  },
} as const
