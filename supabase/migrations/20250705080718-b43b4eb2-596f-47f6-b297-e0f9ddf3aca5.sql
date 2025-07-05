
-- Create admin user with specific UUID and role
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  '993f2a1d-7c48-48b5-ae5d-86fafaff5377',
  'admin@triphabibi.in',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Admin User"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = now();

-- Create user roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Insert admin role for the admin user
INSERT INTO public.user_roles (user_id, role) 
VALUES ('993f2a1d-7c48-48b5-ae5d-86fafaff5377', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- Add slug columns to existing tables
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Add enhanced content fields to tours
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS inclusions TEXT[];
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS exclusions TEXT[];
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS itinerary JSONB;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS map_embed TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add enhanced content fields to visa_services
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS documents_required TEXT[];
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.visa_services ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Add enhanced content fields to tour_packages
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS detailed_itinerary JSONB;
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS inclusions TEXT[];
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS exclusions TEXT[];
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.tour_packages ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Add enhanced content fields to attraction_tickets
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS inclusions TEXT[];
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS available_dates TEXT[];
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.attraction_tickets ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Create function to generate slugs
CREATE OR REPLACE FUNCTION public.slugify(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate slug on insert/update
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = public.slugify(NEW.title);
    
    -- Ensure uniqueness by adding number suffix if needed
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
    BEGIN
      WHILE EXISTS (
        SELECT 1 FROM public.tours WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())
        UNION ALL
        SELECT 1 FROM public.visa_services WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())
        UNION ALL
        SELECT 1 FROM public.tour_packages WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())
        UNION ALL
        SELECT 1 FROM public.attraction_tickets WHERE slug = NEW.slug AND id != COALESCE(NEW.id, gen_random_uuid())
      ) LOOP
        NEW.slug = base_slug || '-' || counter;
        counter = counter + 1;
      END LOOP;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for slug generation
DROP TRIGGER IF EXISTS generate_tour_slug ON public.tours;
CREATE TRIGGER generate_tour_slug
  BEFORE INSERT OR UPDATE ON public.tours
  FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

DROP TRIGGER IF EXISTS generate_visa_slug ON public.visa_services;
CREATE TRIGGER generate_visa_slug
  BEFORE INSERT OR UPDATE ON public.visa_services
  FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

DROP TRIGGER IF EXISTS generate_package_slug ON public.tour_packages;
CREATE TRIGGER generate_package_slug
  BEFORE INSERT OR UPDATE ON public.tour_packages
  FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

DROP TRIGGER IF EXISTS generate_ticket_slug ON public.attraction_tickets;
CREATE TRIGGER generate_ticket_slug
  BEFORE INSERT OR UPDATE ON public.attraction_tickets
  FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

-- Update existing records with slugs if they don't have them
UPDATE public.tours SET slug = public.slugify(title) WHERE slug IS NULL;
UPDATE public.visa_services SET slug = public.slugify(country || '-' || visa_type) WHERE slug IS NULL;
UPDATE public.tour_packages SET slug = public.slugify(title) WHERE slug IS NULL;
UPDATE public.attraction_tickets SET slug = public.slugify(title) WHERE slug IS NULL;

-- Create CMS content management table
CREATE TABLE IF NOT EXISTS public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'slider', 'menu', 'footer', etc.
  content_key TEXT NOT NULL,
  content_value JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(content_type, content_key)
);

-- Enable RLS on cms_content
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Create policy for cms_content (public read, admin write)
CREATE POLICY "Anyone can view cms content" ON public.cms_content
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage cms content" ON public.cms_content
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create promo codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  applicable_services TEXT[] DEFAULT '{}', -- empty array means all services
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on promo_codes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for promo_codes
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Admins can manage promo codes" ON public.promo_codes
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
