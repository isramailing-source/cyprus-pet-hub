-- Update affiliate networks with proper affiliate URLs
UPDATE affiliate_networks 
SET settings = settings || jsonb_build_object(
  'affiliate_url', 'https://www.chewy.com/?utm_source=cypruspets&utm_medium=affiliate&utm_campaign=cyprus_pets',
  'tracking_params', jsonb_build_object('utm_source', 'cypruspets', 'utm_medium', 'affiliate')
)
WHERE name = 'Chewy';

UPDATE affiliate_networks 
SET settings = settings || jsonb_build_object(
  'affiliate_url', 'https://www.petsmart.com/?utm_source=cypruspets&utm_medium=affiliate&utm_campaign=cyprus_pets',
  'tracking_params', jsonb_build_object('utm_source', 'cypruspets', 'utm_medium', 'affiliate')
)
WHERE name = 'PetSmart';

UPDATE affiliate_networks 
SET settings = settings || jsonb_build_object(
  'affiliate_url', 'https://www.petco.com/?utm_source=cypruspets&utm_medium=affiliate&utm_campaign=cyprus_pets',
  'tracking_params', jsonb_build_object('utm_source', 'cypruspets', 'utm_medium', 'affiliate')
)
WHERE name = 'Petco';

-- Add click tracking table for affiliate links
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES affiliate_products(id),
  network_id UUID REFERENCES affiliate_networks(id),
  user_id UUID,
  click_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  conversion_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on affiliate_clicks
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Create policy for affiliate clicks
CREATE POLICY "Anyone can create affiliate click records" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all affiliate clicks" ON affiliate_clicks
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));