
-- Fix RLS policies for user creation
-- Drop the conflicting service policy
DROP POLICY IF EXISTS "Allow user creation via service" ON public.users;

-- Update the main INSERT policy to be more permissive during signup
DROP POLICY IF EXISTS "Users can insert their own profile during signup" ON public.users;

CREATE POLICY "Users can insert their own profile during signup" ON public.users
  FOR INSERT WITH CHECK (
    -- Allow insert if the user ID matches the authenticated user
    auth.uid() = id
  );

-- Ensure the policies are in the correct order
-- Users can view their own row
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own row
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all users
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all users
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
