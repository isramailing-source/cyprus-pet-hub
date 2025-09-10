-- Enable leaked password protection for enhanced security
-- This prevents users from using passwords that have been found in data breaches

-- Note: This requires enabling the setting in the Supabase Auth configuration
-- The SQL command alone won't fully enable this - it requires dashboard configuration

-- For now, let's ensure we have proper password validation in our signup process
-- We'll inform the user about the dashboard setting needed

-- Create a function to validate password strength (as a fallback)
CREATE OR REPLACE FUNCTION public.validate_password_strength(password_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
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