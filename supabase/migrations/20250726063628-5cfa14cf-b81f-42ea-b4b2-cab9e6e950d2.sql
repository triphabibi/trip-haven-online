-- CRITICAL SECURITY FIXES - PHASE 3: Remaining RLS Policy Hardening

-- 1. Harden RLS policies for new_bookings (remove overly permissive public update access)
DROP POLICY IF EXISTS "Public can update bookings" ON public.new_bookings;

CREATE POLICY "Restricted booking updates" 
ON public.new_bookings 
FOR UPDATE 
USING (
  -- Only allow updates by booking owner (via email match) or admins
  customer_email = auth.email() 
  OR get_current_user_role() = 'admin'
);

-- 2. Secure umrah_packages access - remove overly broad access
DROP POLICY IF EXISTS "Only authenticated users can manage umrah packages" ON public.umrah_packages;

CREATE POLICY "Admins can manage umrah packages" 
ON public.umrah_packages 
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- 3. Restrict site_settings access to admins only for sensitive settings
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

-- 4. Add audit logging for sensitive operations
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

-- 5. Create trigger to prevent role/admin field updates by non-admins
CREATE OR REPLACE FUNCTION public.prevent_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  -- If this is not an admin user trying to update role/admin fields
  IF NOT can_modify_user_privileges() AND (
    NEW.role IS DISTINCT FROM OLD.role OR 
    NEW.is_admin IS DISTINCT FROM OLD.is_admin
  ) THEN
    RAISE EXCEPTION 'Access denied: Cannot modify role or admin status';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Apply the trigger to profiles table
DROP TRIGGER IF EXISTS prevent_privilege_escalation_trigger ON public.profiles;
CREATE TRIGGER prevent_privilege_escalation_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_privilege_escalation();