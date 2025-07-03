-- Phase 1: Critical RLS Policy Fixes

-- First, drop the overly permissive policies on users table
DROP POLICY IF EXISTS "Authenticated users can delete from users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can insert into users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can select from users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON public.users;

-- Fix the broken is_user_verified function by replacing it properly
CREATE OR REPLACE FUNCTION public.is_user_verified(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND verification_status = 'approved'
  );
$function$;

-- Ensure proper admin check function exists
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_uuid AND role = 'admin'
  );
$function$;