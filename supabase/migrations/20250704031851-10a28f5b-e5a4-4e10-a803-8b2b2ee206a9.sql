-- Create Ok to Board services table
CREATE TABLE public.ok_to_board_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Ok to Board Service',
  description TEXT,
  base_price NUMERIC NOT NULL DEFAULT 2999,
  processing_fee NUMERIC NOT NULL DEFAULT 199,
  tax_rate NUMERIC NOT NULL DEFAULT 0.18,
  processing_time TEXT NOT NULL DEFAULT '48 hours',
  features TEXT[] DEFAULT ARRAY[
    'Complete Ok to Board verification',
    'Document validation and processing', 
    'Airline coordination and confirmation',
    '24/7 support until boarding',
    'SMS/Email updates on status'
  ],
  requirements TEXT[] DEFAULT ARRAY[
    'Passport copy (first & last page)',
    'Valid visa (if applicable)',
    'Flight booking confirmation',
    'Submit 48 hours before flight'
  ],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Ok to Board bookings table
CREATE TABLE public.ok_to_board_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT NOT NULL,
  
  -- Passenger Details
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL,
  nationality TEXT NOT NULL,
  passport_number TEXT NOT NULL,
  passport_expiry DATE NOT NULL,
  
  -- Flight Details
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  departure_airport TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  
  -- Contact Information
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  
  -- Optional Details
  special_assistance TEXT,
  medical_conditions TEXT,
  dietary_requirements TEXT,
  
  -- Documents
  passport_copy_url TEXT,
  visa_copy_url TEXT,
  covid_certificate_url TEXT,
  additional_docs_url TEXT,
  
  -- Booking Details
  service_id UUID REFERENCES ok_to_board_services(id),
  total_amount NUMERIC NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  booking_status TEXT DEFAULT 'pending',
  payment_reference TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ok_to_board_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ok_to_board_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Ok to Board services
CREATE POLICY "Public can view active ok to board services" 
ON public.ok_to_board_services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin full access ok to board services" 
ON public.ok_to_board_services 
FOR ALL 
USING (true);

-- Create RLS policies for Ok to Board bookings
CREATE POLICY "Anyone can create ok to board bookings" 
ON public.ok_to_board_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin full access ok to board bookings" 
ON public.ok_to_board_bookings 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_ok_to_board_bookings_booking_reference ON public.ok_to_board_bookings(booking_reference);
CREATE INDEX idx_ok_to_board_bookings_departure_date ON public.ok_to_board_bookings(departure_date);
CREATE INDEX idx_ok_to_board_bookings_email ON public.ok_to_board_bookings(email);
CREATE INDEX idx_ok_to_board_bookings_flight_number ON public.ok_to_board_bookings(flight_number);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ok_to_board_services_updated_at
  BEFORE UPDATE ON public.ok_to_board_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ok_to_board_bookings_updated_at
  BEFORE UPDATE ON public.ok_to_board_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Ok to Board service
INSERT INTO public.ok_to_board_services (
  title,
  description,
  base_price,
  processing_fee,
  tax_rate,
  processing_time
) VALUES (
  'Ok to Board Service',
  'Complete airline clearance verification and document processing for hassle-free international travel. Our expert team ensures all your travel documents are verified and you receive proper clearance before your departure.',
  2999,
  199,
  0.18,
  '48 hours'
);