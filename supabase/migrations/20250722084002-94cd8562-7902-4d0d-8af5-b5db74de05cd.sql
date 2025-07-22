-- Create Umrah packages table
CREATE TABLE public.umrah_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  duration_days INTEGER NOT NULL,
  duration_nights INTEGER NOT NULL,
  departure_city VARCHAR(100),
  hotel_category VARCHAR(50) DEFAULT 'Standard',
  transportation_type VARCHAR(50) DEFAULT 'Bus',
  group_size_min INTEGER DEFAULT 1,
  group_size_max INTEGER DEFAULT 50,
  includes TEXT[],
  excludes TEXT[],
  itinerary JSONB,
  images TEXT[],
  featured_image VARCHAR(500),
  video_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  availability_start DATE,
  availability_end DATE,
  booking_deadline_days INTEGER DEFAULT 7,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  location VARCHAR(255),
  pickup_points TEXT[],
  special_notes TEXT,
  cancellation_policy TEXT,
  terms_conditions TEXT,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.umrah_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for umrah packages
CREATE POLICY "Umrah packages are viewable by everyone" 
ON public.umrah_packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage umrah packages" 
ON public.umrah_packages 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create umrah bookings table
CREATE TABLE public.umrah_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  umrah_package_id UUID NOT NULL REFERENCES public.umrah_packages(id) ON DELETE CASCADE,
  user_id UUID,
  booking_reference VARCHAR(50) NOT NULL UNIQUE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(20) NOT NULL,
  guest_whatsapp VARCHAR(20),
  guest_country VARCHAR(100),
  guest_city VARCHAR(100),
  guest_address TEXT,
  travelers JSONB NOT NULL,
  total_travelers INTEGER NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  special_requests TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency_code VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_gateway_reference VARCHAR(255),
  booking_status VARCHAR(20) NOT NULL DEFAULT 'confirmed',
  confirmation_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for umrah bookings
ALTER TABLE public.umrah_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for umrah bookings
CREATE POLICY "Users can view their own umrah bookings" 
ON public.umrah_bookings 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.role() = 'service_role'
);

CREATE POLICY "Users can create umrah bookings" 
ON public.umrah_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update umrah bookings" 
ON public.umrah_bookings 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.role() = 'service_role'
);

-- Create indexes for better performance
CREATE INDEX idx_umrah_packages_active ON public.umrah_packages(is_active);
CREATE INDEX idx_umrah_packages_featured ON public.umrah_packages(is_featured);
CREATE INDEX idx_umrah_packages_slug ON public.umrah_packages(slug);
CREATE INDEX idx_umrah_bookings_reference ON public.umrah_bookings(booking_reference);
CREATE INDEX idx_umrah_bookings_user ON public.umrah_bookings(user_id);
CREATE INDEX idx_umrah_bookings_package ON public.umrah_bookings(umrah_package_id);
CREATE INDEX idx_umrah_bookings_status ON public.umrah_bookings(booking_status);

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION generate_umrah_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = 'UMR' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(CAST(EXTRACT(EPOCH FROM NOW()) AS TEXT), 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking reference generation
CREATE TRIGGER generate_umrah_booking_reference_trigger
  BEFORE INSERT ON public.umrah_bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_umrah_booking_reference();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_umrah_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_umrah_packages_updated_at
  BEFORE UPDATE ON public.umrah_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_umrah_updated_at_column();

CREATE TRIGGER update_umrah_bookings_updated_at
  BEFORE UPDATE ON public.umrah_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_umrah_updated_at_column();

-- Insert sample data
INSERT INTO public.umrah_packages (
  title,
  description,
  short_description,
  price,
  discount_price,
  duration_days,
  duration_nights,
  departure_city,
  hotel_category,
  transportation_type,
  group_size_max,
  includes,
  excludes,
  itinerary,
  images,
  featured_image,
  is_featured,
  location,
  pickup_points,
  special_notes,
  cancellation_policy,
  slug
) VALUES 
(
  'Premium Umrah Package - 14 Days',
  'Experience the spiritual journey of Umrah with our premium 14-day package. Includes 5-star accommodations, guided tours, and all essential services for a comfortable and meaningful pilgrimage.',
  'Premium 14-day Umrah package with 5-star hotels and guided spiritual tours',
  3500.00,
  2999.00,
  14,
  13,
  'Dubai',
  '5-Star',
  'Private Bus',
  25,
  ARRAY['5-star hotel accommodation', 'Daily breakfast and dinner', 'Round-trip flights', 'Visa processing', 'Guided Ziyarat tours', '24/7 support', 'Group leader assistance', 'Airport transfers'],
  ARRAY['Personal expenses', 'Shopping', 'Additional meals', 'Laundry services', 'Optional tours'],
  '{"day1": {"title": "Arrival in Madinah", "activities": ["Airport pickup", "Hotel check-in", "Rest and orientation"]}, "day2": {"title": "Madinah Ziyarat", "activities": ["Visit to Prophet''s Mosque", "Guided historical tours", "Evening prayers"]}}',
  ARRAY['/api/placeholder/800/600', '/api/placeholder/800/400'],
  '/api/placeholder/1200/800',
  true,
  'Makkah & Madinah',
  ARRAY['Dubai International Airport', 'Dubai Mall', 'Burj Khalifa'],
  'Please bring your passport and ensure all documents are valid for at least 6 months.',
  'Free cancellation up to 30 days before departure. 50% refund for cancellations 15-30 days before. No refund for cancellations less than 15 days.',
  'premium-umrah-package-14-days'
),
(
  'Economy Umrah Package - 10 Days',
  'Affordable Umrah package perfect for families and budget-conscious pilgrims. Includes comfortable accommodations and essential services.',
  'Budget-friendly 10-day Umrah package with comfortable hotels',
  1800.00,
  1599.00,
  10,
  9,
  'Mumbai',
  '3-Star',
  'Shared Bus',
  40,
  ARRAY['3-star hotel accommodation', 'Daily breakfast', 'Round-trip flights', 'Visa processing', 'Group Ziyarat tours', 'Airport transfers'],
  ARRAY['Lunch and dinner', 'Personal expenses', 'Shopping', 'Laundry services'],
  '{"day1": {"title": "Arrival in Madinah", "activities": ["Airport pickup", "Hotel check-in", "Orientation meeting"]}}',
  ARRAY['/api/placeholder/800/600'],
  '/api/placeholder/1200/800',
  false,
  'Makkah & Madinah',
  ARRAY['Mumbai International Airport', 'Andheri Station'],
  'Budget package with shared accommodations and group activities.',
  'Free cancellation up to 21 days before departure. 25% refund for cancellations 7-21 days before.',
  'economy-umrah-package-10-days'
);