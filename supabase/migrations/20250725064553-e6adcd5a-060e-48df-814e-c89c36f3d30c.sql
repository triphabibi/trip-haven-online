-- CRITICAL SECURITY FIXES - PHASE 2: RLS Policies & Admin Management

-- 1. Fix CRITICAL privilege escalation vulnerability in profiles table
-- Users should NOT be able to update their own role or admin status
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create a secure function to check if user can update role/admin fields
CREATE OR REPLACE FUNCTION public.can_modify_user_privileges()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR is_admin = true)
  );
$function$;

-- New restrictive policy for profile updates
CREATE POLICY "Users can update own profile (non-privileged fields only)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND (
    -- If user is admin, they can update anything
    can_modify_user_privileges()
    -- If user is not admin, they cannot change role or admin status
    OR (
      COALESCE(role, 'user') = COALESCE(OLD.role, 'user')
      AND COALESCE(is_admin, false) = COALESCE(OLD.is_admin, false)
    )
  )
);

-- 2. Create secure admin management functions
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- Only existing admins can promote others
  IF NOT can_modify_user_privileges() THEN
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
  IF NOT can_modify_user_privileges() THEN
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

-- 3. Harden RLS policies for new_bookings (remove overly permissive public update access)
DROP POLICY IF EXISTS "Public can update bookings" ON public.new_bookings;

CREATE POLICY "Restricted booking updates" 
ON public.new_bookings 
FOR UPDATE 
USING (
  -- Only allow updates by booking owner (via email match) or admins
  customer_email = auth.email() 
  OR get_current_user_role() = 'admin'
);

-- 4. Secure umrah_packages access - remove overly broad access
DROP POLICY IF EXISTS "Only authenticated users can manage umrah packages" ON public.umrah_packages;

CREATE POLICY "Admins can manage umrah packages" 
ON public.umrah_packages 
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 5. Restrict site_settings access to admins only for sensitive settings
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
    'admin_email', 'webhook_secret', 'smtp_host',
    'smtp_user', 'smtp_port'
  )
);