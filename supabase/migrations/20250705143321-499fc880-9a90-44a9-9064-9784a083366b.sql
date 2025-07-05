
-- Create menu_items table for site navigation management
CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  href text NOT NULL,
  icon text DEFAULT 'Link'::text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for menu_items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Admin full access policy
CREATE POLICY "Admin full access menu items" 
  ON public.menu_items 
  FOR ALL 
  USING (true);

-- Public can view active menu items
CREATE POLICY "Public can view active menu items" 
  ON public.menu_items 
  FOR SELECT 
  USING (is_active = true);
