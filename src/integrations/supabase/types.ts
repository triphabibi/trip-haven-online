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
      attraction_tickets: {
        Row: {
          available_times: string[] | null
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
          age: number | null
          booking_id: string | null
          created_at: string | null
          full_name: string
          id: string
          nationality: string | null
          passport_number: string | null
        }
        Insert: {
          age?: number | null
          booking_id?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          nationality?: string | null
          passport_number?: string | null
        }
        Update: {
          age?: number | null
          booking_id?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          nationality?: string | null
          passport_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_travelers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_reference: string
          booking_status: Database["public"]["Enums"]["booking_status"] | null
          created_at: string | null
          discount_amount: number | null
          final_amount: number
          id: string
          payment_gateway: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          promo_code_id: string | null
          service_id: string | null
          special_requests: string | null
          total_amount: number
          travel_date: string | null
          traveler_count: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_reference: string
          booking_status?: Database["public"]["Enums"]["booking_status"] | null
          created_at?: string | null
          discount_amount?: number | null
          final_amount: number
          id?: string
          payment_gateway?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          promo_code_id?: string | null
          service_id?: string | null
          special_requests?: string | null
          total_amount: number
          travel_date?: string | null
          traveler_count?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_reference?: string
          booking_status?: Database["public"]["Enums"]["booking_status"] | null
          created_at?: string | null
          discount_amount?: number | null
          final_amount?: number
          id?: string
          payment_gateway?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          promo_code_id?: string | null
          service_id?: string | null
          special_requests?: string | null
          total_amount?: number
          travel_date?: string | null
          traveler_count?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
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
          button_text: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          is_active: boolean | null
          link_url: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          button_text?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_active?: boolean | null
          link_url?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          button_text?: string | null
          created_at?: string | null
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
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          href: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          href?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      new_bookings: {
        Row: {
          adults_count: number | null
          booking_reference: string
          booking_status:
            | Database["public"]["Enums"]["booking_status_new"]
            | null
          booking_type: string
          children_count: number | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number | null
          final_amount: number
          id: string
          infants_count: number | null
          payment_gateway: Database["public"]["Enums"]["gateway_type"] | null
          payment_reference: string | null
          payment_status:
            | Database["public"]["Enums"]["payment_status_new"]
            | null
          pickup_location: string | null
          selected_language: string | null
          selected_time: string | null
          service_id: string
          special_requests: string | null
          total_amount: number
          travel_date: string | null
          updated_at: string | null
        }
        Insert: {
          adults_count?: number | null
          booking_reference: string
          booking_status?:
            | Database["public"]["Enums"]["booking_status_new"]
            | null
          booking_type: string
          children_count?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number | null
          final_amount: number
          id?: string
          infants_count?: number | null
          payment_gateway?: Database["public"]["Enums"]["gateway_type"] | null
          payment_reference?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_new"]
            | null
          pickup_location?: string | null
          selected_language?: string | null
          selected_time?: string | null
          service_id: string
          special_requests?: string | null
          total_amount: number
          travel_date?: string | null
          updated_at?: string | null
        }
        Update: {
          adults_count?: number | null
          booking_reference?: string
          booking_status?:
            | Database["public"]["Enums"]["booking_status_new"]
            | null
          booking_type?: string
          children_count?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number | null
          final_amount?: number
          id?: string
          infants_count?: number | null
          payment_gateway?: Database["public"]["Enums"]["gateway_type"] | null
          payment_reference?: string | null
          payment_status?:
            | Database["public"]["Enums"]["payment_status_new"]
            | null
          pickup_location?: string | null
          selected_language?: string | null
          selected_time?: string | null
          service_id?: string
          special_requests?: string | null
          total_amount?: number
          travel_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      new_promo_codes: {
        Row: {
          applicable_to: string[] | null
          code: string
          created_at: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_to?: string[] | null
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_to?: string[] | null
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      ok_to_board_bookings: {
        Row: {
          additional_docs_url: string | null
          airline: string
          arrival_airport: string
          booking_reference: string
          booking_status: string | null
          covid_certificate_url: string | null
          created_at: string | null
          date_of_birth: string
          departure_airport: string
          departure_date: string
          departure_time: string
          dietary_requirements: string | null
          email: string
          emergency_contact: string
          emergency_phone: string
          first_name: string
          flight_number: string
          gender: string
          id: string
          last_name: string
          medical_conditions: string | null
          nationality: string
          passport_copy_url: string | null
          passport_expiry: string
          passport_number: string
          payment_reference: string | null
          payment_status: string | null
          phone: string
          service_id: string | null
          special_assistance: string | null
          total_amount: number
          updated_at: string | null
          visa_copy_url: string | null
        }
        Insert: {
          additional_docs_url?: string | null
          airline: string
          arrival_airport: string
          booking_reference: string
          booking_status?: string | null
          covid_certificate_url?: string | null
          created_at?: string | null
          date_of_birth: string
          departure_airport: string
          departure_date: string
          departure_time: string
          dietary_requirements?: string | null
          email: string
          emergency_contact: string
          emergency_phone: string
          first_name: string
          flight_number: string
          gender: string
          id?: string
          last_name: string
          medical_conditions?: string | null
          nationality: string
          passport_copy_url?: string | null
          passport_expiry: string
          passport_number: string
          payment_reference?: string | null
          payment_status?: string | null
          phone: string
          service_id?: string | null
          special_assistance?: string | null
          total_amount: number
          updated_at?: string | null
          visa_copy_url?: string | null
        }
        Update: {
          additional_docs_url?: string | null
          airline?: string
          arrival_airport?: string
          booking_reference?: string
          booking_status?: string | null
          covid_certificate_url?: string | null
          created_at?: string | null
          date_of_birth?: string
          departure_airport?: string
          departure_date?: string
          departure_time?: string
          dietary_requirements?: string | null
          email?: string
          emergency_contact?: string
          emergency_phone?: string
          first_name?: string
          flight_number?: string
          gender?: string
          id?: string
          last_name?: string
          medical_conditions?: string | null
          nationality?: string
          passport_copy_url?: string | null
          passport_expiry?: string
          passport_number?: string
          payment_reference?: string | null
          payment_status?: string | null
          phone?: string
          service_id?: string | null
          special_assistance?: string | null
          total_amount?: number
          updated_at?: string | null
          visa_copy_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ok_to_board_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "ok_to_board_services"
            referencedColumns: ["id"]
          },
        ]
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
          configuration: Json | null
          created_at: string | null
          display_name: string
          gateway_name: Database["public"]["Enums"]["gateway_type"]
          id: string
          is_enabled: boolean | null
          test_mode: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          configuration?: Json | null
          created_at?: string | null
          display_name: string
          gateway_name: Database["public"]["Enums"]["gateway_type"]
          id?: string
          is_enabled?: boolean | null
          test_mode?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          configuration?: Json | null
          created_at?: string | null
          display_name?: string
          gateway_name?: Database["public"]["Enums"]["gateway_type"]
          id?: string
          is_enabled?: boolean | null
          test_mode?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          current_uses: number | null
          discount_amount: number | null
          discount_percentage: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_amount?: number | null
          discount_percentage?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          created_at: string | null
          customer_name: string
          id: string
          is_published: boolean | null
          is_verified: boolean | null
          rating: number | null
          review_text: string | null
          service_id: string
          service_type: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          customer_name: string
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          review_text?: string | null
          service_id: string
          service_type: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          customer_name?: string
          id?: string
          is_published?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          review_text?: string | null
          service_id?: string
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "new_bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          features: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          price: number
          service_type: Database["public"]["Enums"]["service_type"]
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          price: number
          service_type: Database["public"]["Enums"]["service_type"]
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          price?: number
          service_type?: Database["public"]["Enums"]["service_type"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
          title: string
          total_reviews: number | null
          updated_at: string | null
          whats_included: string[] | null
        }
        Insert: {
          available_times?: string[] | null
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
          title: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Update: {
          available_times?: string[] | null
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
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
          whats_included?: string[] | null
        }
        Relationships: []
      }
      visa_applications: {
        Row: {
          admin_notes: string | null
          applicant_name: string
          approval_documents: string[] | null
          booking_id: string | null
          created_at: string | null
          id: string
          nationality: string | null
          passport_number: string | null
          status: Database["public"]["Enums"]["visa_status"] | null
          updated_at: string | null
          uploaded_documents: string[] | null
          visa_service_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          applicant_name: string
          approval_documents?: string[] | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          nationality?: string | null
          passport_number?: string | null
          status?: Database["public"]["Enums"]["visa_status"] | null
          updated_at?: string | null
          uploaded_documents?: string[] | null
          visa_service_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          applicant_name?: string
          approval_documents?: string[] | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          nationality?: string | null
          passport_number?: string | null
          status?: Database["public"]["Enums"]["visa_status"] | null
          updated_at?: string | null
          uploaded_documents?: string[] | null
          visa_service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visa_applications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "new_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visa_applications_visa_service_id_fkey"
            columns: ["visa_service_id"]
            isOneToOne: false
            referencedRelation: "visa_services"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_services: {
        Row: {
          cancellation_policy: string | null
          country: string
          created_at: string | null
          description: string | null
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
          cancellation_policy?: string | null
          country: string
          created_at?: string | null
          description?: string | null
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
          cancellation_policy?: string | null
          country?: string
          created_at?: string | null
          description?: string | null
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
      wishlists: {
        Row: {
          created_at: string | null
          id: string
          service_id: string
          service_type: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id: string
          service_type: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string
          service_type?: string
          session_id?: string
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
