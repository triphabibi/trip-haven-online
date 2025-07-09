
-- First, let's ensure the admin user exists and has proper permissions
DO $$
BEGIN
  -- Update profiles table to ensure admin user has admin role
  INSERT INTO profiles (id, email, full_name, role, is_admin)
  SELECT 
    auth.users.id,
    auth.users.email,
    COALESCE(auth.users.raw_user_meta_data->>'full_name', 'Admin'),
    'admin',
    true
  FROM auth.users 
  WHERE auth.users.email = 'admin@triphabibi.in'
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    is_admin = true;
END $$;

-- Ensure booking reference generation works properly
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
END;
$$;

-- Update new_bookings table to use the function
ALTER TABLE new_bookings 
ALTER COLUMN booking_reference SET DEFAULT generate_booking_reference();

-- Add missing columns to new_bookings if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'new_bookings' AND column_name = 'travel_time') THEN
    ALTER TABLE new_bookings ADD COLUMN travel_time text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'new_bookings' AND column_name = 'lead_guest_name') THEN
    ALTER TABLE new_bookings ADD COLUMN lead_guest_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'new_bookings' AND column_name = 'lead_guest_email') THEN
    ALTER TABLE new_bookings ADD COLUMN lead_guest_email text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'new_bookings' AND column_name = 'lead_guest_mobile') THEN
    ALTER TABLE new_bookings ADD COLUMN lead_guest_mobile text;
  END IF;
END $$;

-- Ensure RLS policies allow booking creation
DROP POLICY IF EXISTS "Public can create bookings" ON new_bookings;
CREATE POLICY "Public can create bookings" 
  ON new_bookings 
  FOR INSERT 
  WITH CHECK (true);

-- Ensure admin can access everything
DROP POLICY IF EXISTS "Admins can manage all bookings" ON new_bookings;
CREATE POLICY "Admins can manage all bookings" 
  ON new_bookings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'admin' OR profiles.is_admin = true)
    )
  );
