
-- Fix the INSERT policy for users table to allow signup
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create a more permissive INSERT policy that allows user creation during signup
CREATE POLICY "Users can insert their own profile during signup" ON public.users
  FOR INSERT WITH CHECK (
    -- Allow insert if the user ID matches the authenticated user
    auth.uid() = id OR
    -- Or if this is a new user being created (no existing row)
    NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid())
  );

-- Also add a policy to allow system/service operations for user creation
CREATE POLICY "Allow user creation via service" ON public.users
  FOR INSERT WITH CHECK (true);

-- Temporarily disable and re-enable RLS to refresh policies
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
