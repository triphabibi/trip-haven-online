
-- Add missing columns to new_bookings table if they don't exist
ALTER TABLE public.new_bookings 
ADD COLUMN IF NOT EXISTS gateway_response jsonb,
ADD COLUMN IF NOT EXISTS confirmed_at timestamp with time zone;

-- Create a trigger to automatically generate booking reference if not provided
CREATE OR REPLACE FUNCTION generate_booking_reference_new()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
    NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS set_booking_reference_new ON public.new_bookings;
CREATE TRIGGER set_booking_reference_new
  BEFORE INSERT ON public.new_bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_reference_new();

-- Ensure RLS policies allow booking creation and updates
DROP POLICY IF EXISTS "Public can create bookings" ON public.new_bookings;
CREATE POLICY "Public can create bookings" 
ON public.new_bookings 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update bookings" ON public.new_bookings;
CREATE POLICY "Public can update bookings" 
ON public.new_bookings 
FOR UPDATE 
USING (true);

-- Ensure payment gateways table has proper structure
ALTER TABLE public.payment_gateways 
ADD COLUMN IF NOT EXISTS webhook_secret text,
ADD COLUMN IF NOT EXISTS webhook_url text;

-- Insert default payment gateways if they don't exist
INSERT INTO public.payment_gateways (gateway_name, display_name, description, is_enabled, priority) 
VALUES 
  ('razorpay', 'Razorpay', 'Pay with Cards, UPI, Wallets & More', true, 1),
  ('stripe', 'Stripe', 'Credit & Debit Cards', true, 2),
  ('cash_on_arrival', 'Cash on Arrival', 'Pay cash at pickup location', true, 3),
  ('bank_transfer', 'Bank Transfer', 'Direct bank transfer', true, 4)
ON CONFLICT (gateway_name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  updated_at = now();
