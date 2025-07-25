-- CRITICAL SECURITY FIXES - PHASE 2: RLS Policies (Fixed Syntax)

-- 1. Fix CRITICAL privilege escalation vulnerability in profiles table
-- Remove the problematic policy first
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

-- Create separate policies for admin and regular users
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (can_modify_user_privileges())
WITH CHECK (can_modify_user_privileges());

CREATE POLICY "Users can update own non-privileged profile fields" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id AND NOT can_modify_user_privileges())
WITH CHECK (auth.uid() = id AND NOT can_modify_user_privileges());

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