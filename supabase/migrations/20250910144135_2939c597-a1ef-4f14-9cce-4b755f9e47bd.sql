-- Fix the remaining security vulnerability: authenticated users can still access contact info directly
-- Implement proper column-level access control

-- Drop the overly permissive policy for authenticated users
DROP POLICY IF EXISTS "Authenticated users can view basic ad information" ON public.ads;

-- Create a secure view for authenticated users (without contact information)
CREATE OR REPLACE VIEW public.ads_authenticated AS 
SELECT 
  id,
  title,
  description,
  price,
  currency,
  location,
  images,
  category_id,
  age,
  breed,
  gender,
  source_name,
  source_url,
  scraped_at,
  is_active,
  created_at,
  updated_at
  -- Explicitly excluding: email, phone, seller_name
FROM public.ads
WHERE is_active = true;

-- Enable security invoker on the authenticated view
ALTER VIEW public.ads_authenticated SET (security_invoker = true);

-- Create very restrictive policies for direct ads table access
-- Only allow access through secure functions, not direct table queries
CREATE POLICY "Block direct access to ads table for authenticated users"
ON public.ads
FOR SELECT  
TO authenticated
USING (false); -- Completely block direct access

-- Grant access to the authenticated view
GRANT SELECT ON public.ads_authenticated TO authenticated;

-- Ensure our secure function still works by granting necessary permissions
-- The request_seller_contact function runs with SECURITY DEFINER so it can access the full table

-- Update the public view to ensure it still works for anonymous users
-- (this was already created but let's make sure permissions are correct)
GRANT SELECT ON public.ads_public TO anon;

-- Create a function for admins to access full ad details when needed
CREATE OR REPLACE FUNCTION public.get_full_ad_details(ad_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  price NUMERIC,
  currency TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  seller_name TEXT,
  images TEXT[],
  category_id UUID,
  age TEXT,
  breed TEXT,
  gender TEXT,
  source_name TEXT,
  source_url TEXT,
  scraped_at TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow admins to access full details
  SELECT 
    ads.id,
    ads.title,
    ads.description,
    ads.price,
    ads.currency,
    ads.location,
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN ads.email 
      ELSE NULL 
    END as email,
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN ads.phone 
      ELSE NULL 
    END as phone,
    CASE 
      WHEN public.has_role(auth.uid(), 'admin') THEN ads.seller_name 
      ELSE NULL 
    END as seller_name,
    ads.images,
    ads.category_id,
    ads.age,
    ads.breed,
    ads.gender,
    ads.source_name,
    ads.source_url,
    ads.scraped_at,
    ads.is_active,
    ads.created_at,
    ads.updated_at
  FROM public.ads 
  WHERE ads.id = ad_id AND ads.is_active = true;
$$;

-- Add additional security logging for contact requests
CREATE OR REPLACE FUNCTION public.log_security_event(event_type TEXT, details JSONB DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log security events for monitoring
  -- This could be extended to insert into a security_logs table
  -- For now, we'll just use database logging
  RAISE LOG 'Security Event - Type: %, User: %, Details: %', 
    event_type, 
    COALESCE(auth.uid()::text, 'anonymous'),
    details;
END;
$$;