
-- Fix the infinite recursion in RLS policies
-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert their own profile during signup" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Create non-recursive policies
-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile during signup" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile (non-recursive)
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile (non-recursive)
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create a helper function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Admin policies using the helper function
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (public.is_admin_user(auth.uid()));
