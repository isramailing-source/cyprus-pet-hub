-- Fix contact information security vulnerability
-- Create a view for public ad listings that excludes sensitive contact information

-- First, drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view basic ad information" ON public.ads;

-- Create a secure view for public listings without contact information
CREATE OR REPLACE VIEW public.ads_public AS 
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

-- Enable RLS on the view  
ALTER VIEW public.ads_public SET (security_invoker = true);

-- Create policies for the ads table - more restrictive
CREATE POLICY "Authenticated users can view all ad details"
ON public.ads
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Public can view ads through public view only"
ON public.ads  
FOR SELECT
TO anon
USING (false); -- Block direct table access for anonymous users

-- Grant access to the public view for anonymous users
GRANT SELECT ON public.ads_public TO anon;
GRANT SELECT ON public.ads_public TO authenticated;

-- Create a function to get full ad details for authenticated users
CREATE OR REPLACE FUNCTION public.get_ad_with_contact(ad_id UUID)
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
  SELECT 
    ads.id,
    ads.title,
    ads.description,
    ads.price,
    ads.currency,
    ads.location,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN ads.email 
      ELSE NULL 
    END as email,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN ads.phone 
      ELSE NULL 
    END as phone,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN ads.seller_name 
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