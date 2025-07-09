
-- Add bank transfer details to payment_gateways table
ALTER TABLE payment_gateways ADD COLUMN IF NOT EXISTS bank_details JSONB DEFAULT NULL;

-- Insert default payment gateways if they don't exist
INSERT INTO payment_gateways (gateway_name, display_name, description, is_enabled, test_mode, priority, supported_currencies, bank_details)
VALUES 
  ('razorpay', 'Razorpay', 'Pay securely with credit/debit cards, UPI, wallets', false, true, 1, ARRAY['AED', 'USD', 'INR'], NULL),
  ('stripe', 'Stripe', 'International payment processing', false, true, 2, ARRAY['AED', 'USD', 'EUR'], NULL),
  ('bank_transfer', 'Bank Transfer', 'Direct bank transfer', false, false, 3, ARRAY['AED', 'USD'], '{"bank_name": "Emirates NBD", "account_number": "1234567890", "iban": "AE123456789012345678901", "swift": "EBILAEAD", "account_holder": "TripHabibi Tourism LLC"}'),
  ('cash_on_arrival', 'Pay Later', 'Pay when you arrive or meet our representative', true, false, 4, ARRAY['AED', 'USD'], NULL)
ON CONFLICT (gateway_name) DO NOTHING;

-- Create homepage_sliders table if it doesn't exist (it already exists based on schema)
-- Update homepage_sliders table structure if needed
ALTER TABLE homepage_sliders ADD COLUMN IF NOT EXISTS cta_button_color TEXT DEFAULT '#3B82F6';
ALTER TABLE homepage_sliders ADD COLUMN IF NOT EXISTS background_overlay_opacity DECIMAL(3,2) DEFAULT 0.5;

-- Add email validation trigger for bookings
CREATE OR REPLACE FUNCTION validate_booking_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_email IS NULL OR NEW.customer_email = '' THEN
    RAISE EXCEPTION 'Customer email is required for booking';
  END IF;
  
  IF NEW.customer_email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email validation
DROP TRIGGER IF EXISTS validate_booking_email_trigger ON new_bookings;
CREATE TRIGGER validate_booking_email_trigger
  BEFORE INSERT OR UPDATE ON new_bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_email();

-- Add travel_time column to new_bookings if missing
ALTER TABLE new_bookings ADD COLUMN IF NOT EXISTS travel_time TEXT;

-- Update booking reference generation to be more unique
CREATE OR REPLACE FUNCTION generate_booking_reference_new()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
    NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for booking reference generation
DROP TRIGGER IF EXISTS generate_booking_reference_trigger ON new_bookings;
CREATE TRIGGER generate_booking_reference_trigger
  BEFORE INSERT ON new_bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_reference_new();
