
-- Drop existing tables to rebuild from scratch
DROP TABLE IF EXISTS public.booking_travelers CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.new_bookings CASCADE;
DROP TABLE IF EXISTS public.visa_applications CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.ok_to_board_bookings CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.promo_codes CASCADE;
DROP TABLE IF EXISTS public.new_promo_codes CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Create enhanced user profiles table
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
  is_admin BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  date_of_birth DATE,
  nationality TEXT,
  passport_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced tours table
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 50;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS min_age INTEGER DEFAULT 0;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS max_age INTEGER DEFAULT 100;

-- Enhanced packages table  
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0;
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 50;

-- Enhanced tickets table
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0;
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 100;

-- Enhanced visa services table
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0;
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS estimated_days INTEGER DEFAULT 7;

-- Create comprehensive bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  service_type TEXT NOT NULL CHECK (service_type IN ('tour', 'package', 'ticket', 'visa', 'transfer')),
  service_id UUID NOT NULL,
  service_title TEXT NOT NULL,
  
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  
  -- Booking details
  travel_date DATE,
  travel_time TEXT,
  adults_count INTEGER DEFAULT 1,
  children_count INTEGER DEFAULT 0,
  infants_count INTEGER DEFAULT 0,
  total_travelers INTEGER GENERATED ALWAYS AS (adults_count + children_count + infants_count) STORED,
  
  -- Pricing
  base_amount DECIMAL(10,2) NOT NULL,
  taxes_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  service_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_gateway TEXT,
  payment_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Booking status
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')),
  confirmation_code TEXT,
  
  -- Additional details
  special_requests TEXT,
  pickup_location TEXT,
  selected_language TEXT DEFAULT 'English',
  dietary_requirements TEXT,
  accessibility_needs TEXT,
  
  -- Admin fields
  admin_notes TEXT,
  assigned_guide TEXT,
  internal_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create travelers table for detailed passenger info
CREATE TABLE public.travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  traveler_type TEXT CHECK (traveler_type IN ('adult', 'child', 'infant')),
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  nationality TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  visa_number TEXT,
  special_requirements TEXT,
  meal_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comprehensive promo codes table
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'buy_one_get_one')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  
  -- Usage limits
  max_uses INTEGER,
  max_uses_per_user INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Applicability
  applicable_services TEXT[] DEFAULT '{}',
  applicable_categories TEXT[] DEFAULT '{}',
  min_travelers INTEGER DEFAULT 1,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Admin fields
  created_by UUID REFERENCES public.profiles(id),
  usage_analytics JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id),
  service_type TEXT NOT NULL,
  service_id UUID NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  
  -- Review content
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  pros TEXT,
  cons TEXT,
  
  -- Review details
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  travel_date DATE,
  traveler_type TEXT CHECK (traveler_type IN ('solo', 'couple', 'family', 'friends', 'business')),
  
  -- Status
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Admin fields
  admin_response TEXT,
  admin_notes TEXT,
  moderated_by UUID REFERENCES public.profiles(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  helpful_votes INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transfers table
CREATE TABLE public.transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  overview TEXT,
  
  -- Service details
  transfer_type TEXT CHECK (transfer_type IN ('airport', 'hotel', 'city', 'intercity', 'custom')),
  vehicle_type TEXT CHECK (vehicle_type IN ('sedan', 'suv', 'van', 'bus', 'luxury')),
  max_passengers INTEGER DEFAULT 4,
  luggage_capacity TEXT,
  
  -- Locations
  pickup_locations TEXT[],
  dropoff_locations TEXT[],
  route_description TEXT,
  distance_km DECIMAL(8,2),
  duration_minutes INTEGER,
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  price_per_km DECIMAL(10,2) DEFAULT 0,
  price_per_hour DECIMAL(10,2) DEFAULT 0,
  waiting_charge DECIMAL(10,2) DEFAULT 0,
  
  -- Availability
  available_hours TEXT[] DEFAULT ARRAY['00:00', '23:59'],
  advance_booking_hours INTEGER DEFAULT 2,
  
  -- Features
  features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  
  -- Media
  image_urls TEXT[],
  featured_image TEXT,
  
  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Stats
  rating DECIMAL(3,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travelers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Anyone can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- Create RLS policies for travelers
CREATE POLICY "Users can manage own travelers" ON public.travelers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = travelers.booking_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all travelers" ON public.travelers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for promo codes
CREATE POLICY "Public can view active promo codes" ON public.promo_codes FOR SELECT USING (is_active = true AND is_public = true);
CREATE POLICY "Admins can manage promo codes" ON public.promo_codes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for reviews
CREATE POLICY "Public can view published reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create RLS policies for transfers
CREATE POLICY "Public can view active transfers" ON public.transfers FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage transfers" ON public.transfers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create functions
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '^-+|-+$', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER generate_transfer_slug_trigger
  BEFORE INSERT OR UPDATE ON public.transfers
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

-- Insert admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@triphabibi.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Admin User"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = now();

-- Insert admin profile
INSERT INTO public.profiles (id, email, full_name, role, is_admin) 
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@triphabibi.com', 'Admin User', 'admin', true)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  is_admin = true;

-- Insert sample data
INSERT INTO public.transfers (title, description, transfer_type, vehicle_type, base_price, pickup_locations, dropoff_locations) VALUES
('Dubai Airport Transfer', 'Comfortable airport transfer service', 'airport', 'sedan', 150.00, ARRAY['Dubai International Airport'], ARRAY['Dubai Marina', 'Downtown Dubai', 'Jumeirah']),
('Abu Dhabi City Tour Transfer', 'Full day city tour with transfer', 'city', 'van', 300.00, ARRAY['Hotels in Abu Dhabi'], ARRAY['Sheikh Zayed Grand Mosque', 'Emirates Palace', 'Louvre Abu Dhabi']);

INSERT INTO public.promo_codes (code, title, discount_type, discount_value, max_uses, applicable_services, is_active) VALUES
('WELCOME10', 'Welcome Discount', 'percentage', 10, 100, ARRAY['tour', 'package', 'ticket'], true),
('SUMMER2024', 'Summer Special', 'fixed', 50, 50, ARRAY['tour', 'package'], true);
