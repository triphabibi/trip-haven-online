-- Drop existing payment_gateways table if it exists
DROP TABLE IF EXISTS public.payment_gateways CASCADE;

-- Create new payment_gateways table with the requested structure
CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('api', 'manual')),
  api_key TEXT,
  api_secret TEXT,
  manual_instructions TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admin full access payment gateways" 
ON public.payment_gateways 
FOR ALL 
USING (true);

-- Create policy for public to view enabled gateways
CREATE POLICY "Public can view enabled gateways" 
ON public.payment_gateways 
FOR SELECT 
USING (enabled = true);

-- Insert the 6 default payment gateways
INSERT INTO public.payment_gateways (name, type, enabled) VALUES
('razorpay', 'api', false),
('stripe', 'api', false),
('paypal', 'api', false),
('bank_transfer', 'manual', false),
('cash_on_arrival', 'manual', false),
('ccavenue', 'api', false);

-- Create trigger for updated_at
CREATE TRIGGER update_payment_gateways_updated_at
BEFORE UPDATE ON public.payment_gateways
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();