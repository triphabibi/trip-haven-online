
-- Create trending_products table
CREATE TABLE IF NOT EXISTS public.trending_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('tour', 'package', 'visa', 'ticket')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for trending_products
ALTER TABLE public.trending_products ENABLE ROW LEVEL SECURITY;

-- Admin can manage all trending products
CREATE POLICY "Admin full access trending products" 
  ON public.trending_products 
  FOR ALL 
  USING (true);

-- Public can view active trending products
CREATE POLICY "Public can view active trending products" 
  ON public.trending_products 
  FOR SELECT 
  USING (is_active = true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trending_products_service_type ON public.trending_products(service_type);
CREATE INDEX IF NOT EXISTS idx_trending_products_display_order ON public.trending_products(display_order);
CREATE INDEX IF NOT EXISTS idx_trending_products_is_active ON public.trending_products(is_active);
