-- Create visa categories table
CREATE TABLE IF NOT EXISTS public.visa_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_emoji TEXT DEFAULT '🌍',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on visa categories
ALTER TABLE public.visa_categories ENABLE ROW LEVEL SECURITY;

-- Add category_id to visa_services table
ALTER TABLE public.visa_services 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.visa_categories(id) ON DELETE SET NULL;

-- Create RLS policies for visa categories
CREATE POLICY "Public can view active visa categories" 
ON public.visa_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin full access visa categories" 
ON public.visa_categories 
FOR ALL 
USING (true);

-- Insert default visa categories
INSERT INTO public.visa_categories (name, slug, description, icon_emoji, display_order) VALUES
('Asia', 'asia', 'Discover amazing destinations across Asia', '🌏', 1),
('Europe', 'europe', 'Explore historic and modern European countries', '🇪🇺', 2),
('Middle East', 'middle-east', 'Experience the rich culture of Middle Eastern nations', '🕌', 3),
('Americas', 'americas', 'Journey through North and South America', '🌎', 4),
('Africa', 'africa', 'Adventure across the diverse African continent', '🌍', 5),
('Oceania', 'oceania', 'Visit beautiful Pacific islands and Australia', '🏝️', 6)
ON CONFLICT (slug) DO NOTHING;

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_visa_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_visa_categories_updated_at
  BEFORE UPDATE ON public.visa_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_visa_categories_updated_at();