-- Add admin notes and payment proof columns to new_bookings table
ALTER TABLE public.new_bookings 
ADD COLUMN admin_notes TEXT,
ADD COLUMN proof_of_payment TEXT,
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by UUID REFERENCES auth.users(id);

-- Add comment for clarity
COMMENT ON COLUMN public.new_bookings.admin_notes IS 'Internal notes for admin use only';
COMMENT ON COLUMN public.new_bookings.proof_of_payment IS 'URL/path to uploaded payment proof document';
COMMENT ON COLUMN public.new_bookings.verified_at IS 'Timestamp when bank transfer was verified by admin';
COMMENT ON COLUMN public.new_bookings.verified_by IS 'Admin user who verified the payment';

-- Create index for better performance
CREATE INDEX idx_new_bookings_payment_method ON public.new_bookings(payment_method);
CREATE INDEX idx_new_bookings_booking_status ON public.new_bookings(booking_status);
CREATE INDEX idx_new_bookings_verified_at ON public.new_bookings(verified_at);