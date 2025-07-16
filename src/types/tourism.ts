export interface Tour {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  highlights?: string[];
  whats_included?: string[];
  price_adult: number;
  price_child: number;
  price_infant: number;
  available_times?: string[];
  languages?: string[];
  instant_confirmation: boolean;
  free_cancellation: boolean;
  is_featured: boolean;
  status: 'active' | 'inactive';
  category?: string;
  rating?: number;
  total_reviews?: number;
  image_urls?: string[];
  video_url?: string;
  featured_image?: string;
  location?: string;
  overview?: string;
  exclusions?: string[];
  meeting_point?: string;
  max_capacity?: number;
  min_age?: number;
  max_age?: number;
  created_at: string;
  updated_at: string;
}

export interface TourPackage {
  id: string;
  title: string;
  description?: string;
  nights: number;
  days: number;
  itinerary?: any;
  highlights?: string[];
  whats_included?: string[];
  price_adult: number;
  price_child: number;
  price_infant: number;
  is_featured: boolean;
  status: 'active' | 'inactive';
  rating?: number;
  total_reviews?: number;
  image_urls?: string[];
  video_url?: string;
  featured_image?: string;
  location?: string;
  overview?: string;
  exclusions?: string[];
  instant_confirmation?: boolean;
  free_cancellation?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AttractionTicket {
  id: string;
  title: string;
  description?: string;
  location?: string;
  price_adult: number;
  price_child: number;
  price_infant: number;
  ticket_pdf_urls?: string[];
  instant_delivery: boolean;
  instant_confirmation?: boolean;
  featured_image?: string;
  is_featured: boolean;
  status: 'active' | 'inactive';
  rating?: number;
  total_reviews?: number;
  image_urls?: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VisaService {
  id: string;
  country: string;
  visa_type: string;
  price: number;
  processing_time?: string;
  requirements?: string[];
  description?: string;
  is_featured: boolean;
  status: 'active' | 'inactive';
  image_urls?: string[];
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_reference: string;
  booking_type: 'tour' | 'package' | 'ticket' | 'visa';
  service_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  pickup_location?: string;
  adults_count: number;
  children_count: number;
  infants_count: number;
  selected_time?: string;
  selected_language?: string;
  travel_date?: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_gateway?: string;
  payment_reference?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  applicable_to?: string[];
  created_at: string;
}

export interface PaymentGateway {
  id: string;
  gateway_name: string;
  display_name: string;
  api_key?: string;
  api_secret?: string;
  is_enabled: boolean;
  test_mode: boolean;
  configuration?: any;
  created_at: string;
  updated_at: string;
}

export interface HomepageSlider {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  link_url?: string;
  button_text: string;
  display_order: number;
  is_active: boolean;
  cta_button_color: string;
  background_overlay_opacity: number;
  created_at?: string;
}

export interface TrendingProduct {
  id: string;
  service_id: string;
  service_type: 'tour' | 'package' | 'visa' | 'ticket';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Additional fields from joined service data
  service_title?: string;
  service_price?: number;
  service_image?: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value?: string;
  setting_type: string;
  description?: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id?: string;
  service_type: string;
  service_id: string;
  customer_name: string;
  rating?: number;
  review_text?: string;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
}
