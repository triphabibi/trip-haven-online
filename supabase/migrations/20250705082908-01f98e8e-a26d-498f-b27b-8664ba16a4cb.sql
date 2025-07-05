
-- Add missing columns to tours table to match frontend requirements
ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS overview text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS exclusions text[],
ADD COLUMN IF NOT EXISTS itinerary jsonb,
ADD COLUMN IF NOT EXISTS cancellation_policy text,
ADD COLUMN IF NOT EXISTS refund_policy text,
ADD COLUMN IF NOT EXISTS terms_conditions text,
ADD COLUMN IF NOT EXISTS meeting_point text,
ADD COLUMN IF NOT EXISTS map_location text,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS gallery_images text[];

-- Add missing columns to tour_packages table
ALTER TABLE public.tour_packages 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS overview text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS exclusions text[],
ADD COLUMN IF NOT EXISTS cancellation_policy text,
ADD COLUMN IF NOT EXISTS refund_policy text,
ADD COLUMN IF NOT EXISTS terms_conditions text,
ADD COLUMN IF NOT EXISTS meeting_point text,
ADD COLUMN IF NOT EXISTS map_location text,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS gallery_images text[],
ADD COLUMN IF NOT EXISTS available_times text[],
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS instant_confirmation boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS free_cancellation boolean DEFAULT true;

-- Add missing columns to attraction_tickets table
ALTER TABLE public.attraction_tickets 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS overview text,
ADD COLUMN IF NOT EXISTS highlights text[],
ADD COLUMN IF NOT EXISTS whats_included text[],
ADD COLUMN IF NOT EXISTS exclusions text[],
ADD COLUMN IF NOT EXISTS available_times text[],
ADD COLUMN IF NOT EXISTS languages text[],
ADD COLUMN IF NOT EXISTS cancellation_policy text,
ADD COLUMN IF NOT EXISTS refund_policy text,
ADD COLUMN IF NOT EXISTS terms_conditions text,
ADD COLUMN IF NOT EXISTS meeting_point text,
ADD COLUMN IF NOT EXISTS map_location text,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS gallery_images text[],
ADD COLUMN IF NOT EXISTS instant_confirmation boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS free_cancellation boolean DEFAULT true;

-- Add missing columns to visa_services table
ALTER TABLE public.visa_services 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS overview text,
ADD COLUMN IF NOT EXISTS highlights text[],
ADD COLUMN IF NOT EXISTS whats_included text[],
ADD COLUMN IF NOT EXISTS exclusions text[],
ADD COLUMN IF NOT EXISTS cancellation_policy text,
ADD COLUMN IF NOT EXISTS refund_policy text,
ADD COLUMN IF NOT EXISTS terms_conditions text,
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS featured_image text,
ADD COLUMN IF NOT EXISTS gallery_images text[];

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tours_slug ON public.tours(slug);
CREATE INDEX IF NOT EXISTS idx_tour_packages_slug ON public.tour_packages(slug);
CREATE INDEX IF NOT EXISTS idx_attraction_tickets_slug ON public.attraction_tickets(slug);
CREATE INDEX IF NOT EXISTS idx_visa_services_slug ON public.visa_services(slug);

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '^-+|-+$', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-generate slugs
DROP TRIGGER IF EXISTS tours_generate_slug ON public.tours;
CREATE TRIGGER tours_generate_slug
  BEFORE INSERT OR UPDATE ON public.tours
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

DROP TRIGGER IF EXISTS packages_generate_slug ON public.tour_packages;
CREATE TRIGGER packages_generate_slug
  BEFORE INSERT OR UPDATE ON public.tour_packages
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

DROP TRIGGER IF EXISTS tickets_generate_slug ON public.attraction_tickets;
CREATE TRIGGER tickets_generate_slug
  BEFORE INSERT OR UPDATE ON public.attraction_tickets
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();

DROP TRIGGER IF EXISTS visas_generate_slug ON public.visa_services;
CREATE TRIGGER visas_generate_slug
  BEFORE INSERT OR UPDATE ON public.visa_services
  FOR EACH ROW EXECUTE FUNCTION generate_slug_from_title();
