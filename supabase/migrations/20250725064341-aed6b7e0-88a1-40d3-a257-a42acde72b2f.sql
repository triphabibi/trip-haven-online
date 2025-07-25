-- CRITICAL SECURITY FIXES - PHASE 1: Database Security

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

-- 2. Fix CRITICAL privilege escalation vulnerability in profiles table
-- Users should NOT be able to update their own role or admin status
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (non-privileged fields only)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND OLD.role = NEW.role  -- Role cannot be changed
  AND OLD.is_admin = NEW.is_admin  -- Admin status cannot be changed
);

-- 3. Create secure admin management functions
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Only existing admins can promote others
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR is_admin = true)
  ) THEN
    RAISE EXCEPTION 'Access denied: Only admins can promote users';
  END IF;
  
  UPDATE public.profiles 
  SET role = 'admin', is_admin = true 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.revoke_admin_access(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Only existing admins can revoke admin access
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR is_admin = true)
  ) THEN
    RAISE EXCEPTION 'Access denied: Only admins can revoke admin access';
  END IF;
  
  -- Prevent self-demotion to avoid admin lockout
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND email = user_email
  ) THEN
    RAISE EXCEPTION 'Cannot revoke your own admin access';
  END IF;
  
  UPDATE public.profiles 
  SET role = 'user', is_admin = false 
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$function$;

-- 4. Harden RLS policies for new_bookings (remove overly permissive public update access)
DROP POLICY IF EXISTS "Public can update bookings" ON public.new_bookings;

CREATE POLICY "Restricted booking updates" 
ON public.new_bookings 
FOR UPDATE 
USING (
  -- Only allow updates by booking owner (via email match) or admins
  customer_email = auth.email() 
  OR get_current_user_role() = 'admin'
)
WITH CHECK (
  -- Prevent status manipulation by non-admins
  CASE 
    WHEN get_current_user_role() = 'admin' THEN true
    ELSE 
      OLD.booking_status = NEW.booking_status 
      AND OLD.payment_status = NEW.payment_status
      AND OLD.payment_reference = NEW.payment_reference
  END
);

-- 5. Secure umrah_packages access - remove overly broad access
DROP POLICY IF EXISTS "Only authenticated users can manage umrah packages" ON public.umrah_packages;

CREATE POLICY "Admins can manage umrah packages" 
ON public.umrah_packages 
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 6. Restrict site_settings access to admins only
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin full access site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Public can view non-sensitive site settings" 
ON public.site_settings 
FOR SELECT
USING (
  setting_key NOT IN (
    'smtp_password', 'api_secret', 'private_key', 
    'admin_email', 'webhook_secret'
  )
);

-- 7. Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT
USING (get_current_user_role() = 'admin');