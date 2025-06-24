
-- Create enum types for better data integrity
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE service_type AS ENUM ('tour', 'ticket', 'visa');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table (tours, tickets, visas)
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  service_type service_type NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration TEXT,
  location TEXT,
  image_url TEXT,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promo codes table
CREATE TABLE public.promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discount_amount DECIMAL(10,2) CHECK (discount_amount >= 0),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  service_id UUID REFERENCES public.services ON DELETE CASCADE,
  promo_code_id UUID REFERENCES public.promo_codes ON DELETE SET NULL,
  booking_reference TEXT UNIQUE NOT NULL,
  traveler_count INTEGER NOT NULL DEFAULT 1,
  travel_date DATE,
  special_requests TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  booking_status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  payment_gateway TEXT,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_travelers table for traveler details
CREATE TABLE public.booking_travelers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  passport_number TEXT,
  nationality TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_travelers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for services (public read, admin write)
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for promo codes
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
  FOR SELECT USING (is_active = true AND valid_until > NOW());
CREATE POLICY "Admins can manage promo codes" ON public.promo_codes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for booking travelers
CREATE POLICY "Users can view own booking travelers" ON public.booking_travelers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create booking travelers" ON public.booking_travelers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can view all booking travelers" ON public.booking_travelers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = 'TB' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for booking reference generation
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_reference();

-- Insert sample data
INSERT INTO public.services (title, description, service_type, price, duration, location, features, image_url) VALUES
('Golden Triangle Tour', 'Explore Delhi, Agra, and Jaipur in this comprehensive 7-day tour covering India''s most iconic destinations.', 'tour', 299.99, '7 days', 'Delhi, Agra, Jaipur', ARRAY['Hotel accommodation', 'Transportation', 'Guide', 'Meals'], 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'),
('Goa Beach Package', 'Relax on pristine beaches with water sports, local cuisine, and vibrant nightlife.', 'tour', 199.99, '5 days', 'Goa', ARRAY['Beach resort', 'Water sports', 'Local tours', 'Breakfast'], 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'),
('Kerala Backwaters', 'Experience the serene backwaters of Kerala with houseboat stays and Ayurvedic treatments.', 'tour', 249.99, '6 days', 'Kerala', ARRAY['Houseboat stay', 'Ayurvedic spa', 'Local cuisine', 'Nature walks'], 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'),
('Flight Ticket Booking', 'Book domestic and international flights with competitive prices and flexible options.', 'ticket', 99.99, 'Variable', 'Worldwide', ARRAY['Flexible dates', '24/7 support', 'Seat selection', 'Meal preferences'], 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'),
('Train Ticket Booking', 'Convenient train ticket booking for all major routes across India.', 'ticket', 29.99, 'Variable', 'India', ARRAY['All classes', 'Instant confirmation', 'Cancellation support', 'Platform updates'], 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'),
('Tourist Visa Processing', 'Fast and reliable tourist visa processing for popular destinations.', 'visa', 79.99, '5-7 business days', 'Multiple countries', ARRAY['Document verification', 'Application tracking', 'Expert consultation', 'Fast processing'], 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800'),
('Business Visa Processing', 'Professional business visa services with priority processing.', 'visa', 129.99, '3-5 business days', 'Multiple countries', ARRAY['Priority processing', 'Document support', 'Business consultation', 'Tracking'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800');

INSERT INTO public.promo_codes (code, discount_percentage, max_uses, valid_until) VALUES
('WELCOME20', 20, 100, '2024-12-31'::timestamp),
('SUMMER15', 15, 50, '2024-08-31'::timestamp),
('FAMILY10', 10, 200, '2024-12-31'::timestamp);
