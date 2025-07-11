
-- Fix infinite recursion in profiles RLS policy by creating a security definer function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create new policy using the security definer function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin' OR auth.uid() = id);

-- Also fix any other policies that might have recursion issues
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.new_bookings;
CREATE POLICY "Admins can manage all bookings" 
ON public.new_bookings 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

-- Make sure profiles table allows inserts for new users
CREATE POLICY "Allow profile creation on signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);
