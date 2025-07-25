-- CRITICAL SECURITY FIXES - PHASE 1: Database Security (Fixed)

-- 1. Fix all database functions to use secure search paths
CREATE OR REPLACE FUNCTION public.generate_new_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.update_tour_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF NEW.service_type = 'tour' AND NEW.is_published = true THEN
    UPDATE public.tours 
    SET rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM public.reviews 
      WHERE service_id = NEW.service_id 
      AND service_type = 'tour' 
      AND is_published = true
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE service_id = NEW.service_id 
      AND service_type = 'tour' 
      AND is_published = true
    )
    WHERE id = NEW.service_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_booking_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF NEW.customer_email IS NULL OR NEW.customer_email = '' THEN
    RAISE EXCEPTION 'Customer email is required for booking';
  END IF;
  
  IF NEW.customer_email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_visa_categories_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_umrah_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.booking_reference = 'UMR' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(CAST(EXTRACT(EPOCH FROM NOW()) AS TEXT), 6, '0');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_umrah_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_youtube_url(url text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN TRUE;
  END IF;
  
  RETURN (
    url ~* 'youtube\.com/watch\?v=' OR 
    url ~* 'youtu\.be/' OR
    url ~* 'youtube\.com/embed/'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference_new()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF NEW.booking_reference IS NULL OR NEW.booking_reference = '' THEN
    NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.extract_youtube_id(url text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  video_id TEXT;
BEGIN
  IF url IS NULL OR url = '' THEN
    RETURN NULL;
  END IF;
  
  IF url ~* 'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)' THEN
    SELECT substring(url from 'v=([a-zA-Z0-9_-]+)') INTO video_id;
  ELSIF url ~* 'youtu\.be/([a-zA-Z0-9_-]+)' THEN
    SELECT substring(url from 'youtu\.be/([a-zA-Z0-9_-]+)') INTO video_id;
  ELSIF url ~* 'youtube\.com/embed/([a-zA-Z0-9_-]+)' THEN
    SELECT substring(url from 'embed/([a-zA-Z0-9_-]+)') INTO video_id;
  END IF;
  
  RETURN video_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_slug_from_title()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '^-+|-+$', '', 'g');
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  NEW.booking_reference = 'TH' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0') || LPAD(floor(random() * 1000)::TEXT, 3, '0');
  RETURN NEW;
END;
$function$;