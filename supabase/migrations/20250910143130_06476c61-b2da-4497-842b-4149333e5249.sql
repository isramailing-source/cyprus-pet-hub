-- Fix function search path security issue
-- Update the validate_password_strength function to have proper search path

DROP FUNCTION IF EXISTS public.validate_password_strength(TEXT);

CREATE OR REPLACE FUNCTION public.validate_password_strength(password_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Password must be at least 8 characters
  IF length(password_text) < 8 THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain at least one number
  IF password_text !~ '[0-9]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain at least one letter
  IF password_text !~ '[a-zA-Z]' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;