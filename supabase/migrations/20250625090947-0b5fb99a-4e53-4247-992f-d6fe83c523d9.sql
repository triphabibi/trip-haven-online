
-- Create enum types for various modules
CREATE TYPE service_status AS ENUM ('active', 'inactive');
CREATE TYPE booking_status_new AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status_new AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE visa_status AS ENUM ('pending', 'approved', 'rejected', 'processing');
CREATE TYPE gateway_type AS ENUM ('razorpay', 'stripe', 'paypal', 'ccavenue', 'bank_transfer', 'cash_on_arrival');

-- Tours table for single-day, full-day, and multi-day tours
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT, -- e.g., "8 hours", "Full Day", "4 Days 3 Nights"
  highlights TEXT[],
  whats_included TEXT[],
  price_adult DECIMAL(10,2) NOT NULL,
  price_child DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_infant DECIMAL(10,2) NOT NULL DEFAULT 0,
  available_times TEXT[], -- e.g., ["9:00 AM", "2:00 PM", "6:00 PM"]
  languages TEXT[] DEFAULT ARRAY['English'],
  instant_confirmation BOOLEAN DEFAULT true,
  free_cancellation BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  status service_status DEFAULT 'active',
  category TEXT DEFAULT 'tour',
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour packages table for multi-day packages
CREATE TABLE tour_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  nights INTEGER NOT NULL,
  days INTEGER NOT NULL,
  itinerary JSONB, -- Day-wise itinerary
  highlights TEXT[],
  whats_included TEXT[],
  price_adult DECIMAL(10,2) NOT NULL,
  price_child DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_infant DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status service_status DEFAULT 'active',
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attraction tickets table
CREATE TABLE attraction_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price_adult DECIMAL(10,2) NOT NULL,
  price_child DECIMAL(10,2) NOT NULL DEFAULT 0,
  price_infant DECIMAL(10,2) NOT NULL DEFAULT 0,
  ticket_pdf_urls TEXT[], -- URLs to uploaded PDF tickets
  instant_delivery BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  status service_status DEFAULT 'active',
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visa services table
CREATE TABLE visa_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL, -- e.g., "30 Days Tourist Visa"
  price DECIMAL(10,2) NOT NULL,
  processing_time TEXT, -- e.g., "3-5 business days"
  requirements TEXT[],
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  status service_status DEFAULT 'active',
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced bookings table
CREATE TABLE new_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  booking_type TEXT NOT NULL, -- 'tour', 'package', 'ticket', 'visa'
  service_id UUID NOT NULL, -- References tours, packages, tickets, or visas
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  pickup_location TEXT,
  adults_count INTEGER DEFAULT 1,
  children_count INTEGER DEFAULT 0,
  infants_count INTEGER DEFAULT 0,
  selected_time TEXT, -- For tours with time slots
  selected_language TEXT DEFAULT 'English',
  travel_date DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  booking_status booking_status_new DEFAULT 'pending',
  payment_status payment_status_new DEFAULT 'pending',
  payment_gateway gateway_type,
  payment_reference TEXT,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo codes table
CREATE TABLE new_promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  applicable_to TEXT[], -- ['tours', 'packages', 'tickets', 'visas'] or specific IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment gateways configuration
CREATE TABLE payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name gateway_type NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  is_enabled BOOLEAN DEFAULT false,
  test_mode BOOLEAN DEFAULT true,
  configuration JSONB, -- Additional gateway-specific config
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMTP email configuration
CREATE TABLE email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host TEXT NOT NULL,
  smtp_port INTEGER NOT NULL DEFAULT 587,
  smtp_user TEXT NOT NULL,
  smtp_password TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL DEFAULT 'TripHabibi',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage sliders
CREATE TABLE homepage_sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  button_text TEXT DEFAULT 'Learn More',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visa applications (for tracking visa requests)
CREATE TABLE visa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES new_bookings(id),
  visa_service_id UUID REFERENCES visa_services(id),
  applicant_name TEXT NOT NULL,
  passport_number TEXT,
  nationality TEXT,
  uploaded_documents TEXT[], -- URLs to uploaded documents
  status visa_status DEFAULT 'pending',
  admin_notes TEXT,
  approval_documents TEXT[], -- URLs to approval documents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES new_bookings(id),
  service_type TEXT NOT NULL, -- 'tour', 'package', 'ticket', 'visa'
  service_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist (for local storage reference)
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL, -- Browser session ID
  service_type TEXT NOT NULL,
  service_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- 'text', 'number', 'boolean', 'json'
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'TripHabibi', 'text', 'Website name'),
('default_currency', 'INR', 'text', 'Default currency code'),
('contact_email', 'info@triphabibi.in', 'text', 'Contact email'),
('contact_phone', '+91-9876543210', 'text', 'Contact phone'),
('whatsapp_number', '+91-9876543210', 'text', 'WhatsApp number'),
('address', 'Mumbai, India', 'text', 'Business address'),
('google_analytics_id', '', 'text', 'Google Analytics tracking ID'),
('exchange_rate_usd', '83.50', 'number', 'USD to INR exchange rate'),
('exchange_rate_aed', '22.75', 'number', 'AED to INR exchange rate');

-- Insert default payment gateways
INSERT INTO payment_gateways (gateway_name, display_name, is_enabled) VALUES
('razorpay', 'Razorpay', false),
('stripe', 'Stripe', false),
('paypal', 'PayPal', false),
('ccavenue', 'CCAvenue', false),
('bank_transfer', 'Bank Transfer', true),
('cash_on_arrival', 'Cash on Arrival', true);

-- Enable RLS on all tables
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attraction_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (frontend)
CREATE POLICY "Public can view active tours" ON tours FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view active packages" ON tour_packages FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view active tickets" ON attraction_tickets FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view active visas" ON visa_services FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view active sliders" ON homepage_sliders FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view enabled gateways" ON payment_gateways FOR SELECT USING (is_enabled = true);

-- Create policies for bookings
CREATE POLICY "Anyone can create bookings" ON new_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view published reviews" ON reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can create reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Admin policies (will be handled by service role key in edge functions)
CREATE POLICY "Admin full access tours" ON tours FOR ALL USING (true);
CREATE POLICY "Admin full access packages" ON tour_packages FOR ALL USING (true);
CREATE POLICY "Admin full access tickets" ON attraction_tickets FOR ALL USING (true);
CREATE POLICY "Admin full access visas" ON visa_services FOR ALL USING (true);
CREATE POLICY "Admin full access bookings" ON new_bookings FOR ALL USING (true);
CREATE POLICY "Admin full access promo codes" ON new_promo_codes FOR ALL USING (true);
CREATE POLICY "Admin full access payment gateways" ON payment_gateways FOR ALL USING (true);
CREATE POLICY "Admin full access email settings" ON email_settings FOR ALL USING (true);
CREATE POLICY "Admin full access sliders" ON homepage_sliders FOR ALL USING (true);
CREATE POLICY "Admin full access visa applications" ON visa_applications FOR ALL USING (true);
CREATE POLICY "Admin full access reviews" ON reviews FOR ALL USING (true);
CREATE POLICY "Admin full access site settings" ON site_settings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_featured ON tours(is_featured);
CREATE INDEX idx_packages_status ON tour_packages(status);
CREATE INDEX idx_tickets_status ON attraction_tickets(status);
CREATE INDEX idx_visas_status ON visa_services(status);
CREATE INDEX idx_bookings_reference ON new_bookings(booking_reference);
CREATE INDEX idx_bookings_status ON new_bookings(booking_status);
CREATE INDEX idx_bookings_service ON new_bookings(service_id, booking_type);
CREATE INDEX idx_promo_codes_code ON new_promo_codes(code);
CREATE INDEX idx_reviews_service ON reviews(service_id, service_type);

-- Function to auto-generate booking reference
CREATE OR REPLACE FUNCTION generate_new_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking reference generation
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON new_bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_new_booking_reference();

-- Function to update tour ratings
CREATE OR REPLACE FUNCTION update_tour_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.service_type = 'tour' AND NEW.is_published = true THEN
    UPDATE tours 
    SET rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM reviews 
      WHERE service_id = NEW.service_id 
      AND service_type = 'tour' 
      AND is_published = true
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE service_id = NEW.service_id 
      AND service_type = 'tour' 
      AND is_published = true
    )
    WHERE id = NEW.service_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for rating updates
CREATE TRIGGER update_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_tour_rating();
