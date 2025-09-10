-- Fix Security Issue: User Email Addresses Exposed to All Visitors (Retry)

-- 1. Drop the existing public policy that allows everyone to view profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a new restricted policy that only allows authenticated users to view profiles
CREATE POLICY "profiles_authenticated_users_select" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- 2. Update the handle_new_user function to not use email as display_name fallback
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Create profile for new user without using email as fallback for display_name
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    new.id, 
    -- Only use display_name from metadata if provided, otherwise use 'User' as safe default
    COALESCE(
      NULLIF(TRIM(new.raw_user_meta_data->>'display_name'), ''), 
      'User'
    )
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- 3. Clean up existing profiles that may contain email addresses in display_name
-- This will update any display_name that contains @ symbol (likely emails) to 'User'
UPDATE public.profiles 
SET display_name = 'User', updated_at = now()
WHERE display_name LIKE '%@%';

-- Log the security fix
DO $$ BEGIN
  RAISE NOTICE 'Security fix applied: Restricted profile access to authenticated users only and cleaned email exposure';
END $$;