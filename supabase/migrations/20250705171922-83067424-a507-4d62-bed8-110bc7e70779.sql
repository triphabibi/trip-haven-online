
-- Update menu_items table to support dropdown menus
ALTER TABLE public.menu_items 
ADD COLUMN parent_id UUID REFERENCES menu_items(id),
ADD COLUMN menu_type TEXT DEFAULT 'header' CHECK (menu_type IN ('header', 'footer')),
ADD COLUMN target TEXT DEFAULT '_self' CHECK (target IN ('_self', '_blank'));

-- Create a comprehensive bookings table that matches all requirements
DROP TABLE IF EXISTS public.new_bookings CASCADE;

CREATE TABLE public.new_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT UNIQUE NOT NULL,
  
  -- Service details
  service_type TEXT NOT NULL CHECK (service_type IN ('tour', 'package', 'ticket', 'visa', 'transfer')),
  service_id UUID NOT NULL,
  service_title TEXT NOT NULL,
  
  -- Customer details
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Booking details
  travel_date DATE,
  adults_count INTEGER DEFAULT 1,
  children_count INTEGER DEFAULT 0,
  infants_count INTEGER DEFAULT 0,
  
  -- Pricing
  base_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  final_amount DECIMAL(10,2) NOT NULL,
  
  -- Payment details
  payment_method TEXT,
  payment_gateway TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_reference TEXT,
  gateway_response JSONB,
  
  -- Booking status
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Additional details
  special_requests TEXT,
  pickup_location TEXT,
  selected_language TEXT DEFAULT 'English',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Create trigger for booking reference generation
CREATE OR REPLACE FUNCTION generate_booking_reference_new()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_booking_reference_new
  BEFORE INSERT ON public.new_bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_reference_new();

-- Create traveler details table
CREATE TABLE public.booking_travelers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES new_bookings(id) ON DELETE CASCADE,
  traveler_type TEXT NOT NULL CHECK (traveler_type IN ('adult', 'child', 'infant')),
  title TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  nationality TEXT,
  passport_number TEXT,
  passport_expiry DATE,
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.new_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_travelers ENABLE ROW LEVEL SECURITY;

-- RLS policies for new_bookings
CREATE POLICY "Public can create bookings" ON public.new_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own bookings" ON public.new_bookings
  FOR SELECT USING (customer_email = auth.email() OR true);

CREATE POLICY "Admins can manage all bookings" ON public.new_bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS policies for booking_travelers
CREATE POLICY "Users can manage travelers for their bookings" ON public.booking_travelers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM new_bookings 
      WHERE new_bookings.id = booking_travelers.booking_id 
      AND (new_bookings.customer_email = auth.email() OR true)
    )
  );

CREATE POLICY "Admins can manage all travelers" ON public.booking_travelers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Update payment_gateways table to be more comprehensive
ALTER TABLE public.payment_gateways 
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS supported_currencies TEXT[] DEFAULT ARRAY['AED', 'USD', 'EUR'],
ADD COLUMN IF NOT EXISTS min_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS max_amount DECIMAL(10,2);

-- Insert default payment gateways if they don't exist
INSERT INTO public.payment_gateways (gateway_name, display_name, is_enabled, priority, description, supported_currencies)
VALUES 
  ('razorpay', 'Razorpay', true, 1, 'Credit/Debit Cards, UPI, Net Banking', ARRAY['AED', 'USD', 'INR']),
  ('stripe', 'Stripe', true, 2, 'International Credit/Debit Cards', ARRAY['AED', 'USD', 'EUR']),
  ('paypal', 'PayPal', false, 3, 'PayPal Wallet and Cards', ARRAY['USD', 'EUR']),
  ('bank_transfer', 'Bank Transfer', true, 4, 'Direct Bank Transfer', ARRAY['AED', 'USD']),
  ('cash_on_arrival', 'Pay Later', true, 5, 'Pay at pickup location', ARRAY['AED', 'USD'])
ON CONFLICT (gateway_name) DO UPDATE SET
  priority = EXCLUDED.priority,
  description = EXCLUDED.description,
  supported_currencies = EXCLUDED.supported_currencies;
