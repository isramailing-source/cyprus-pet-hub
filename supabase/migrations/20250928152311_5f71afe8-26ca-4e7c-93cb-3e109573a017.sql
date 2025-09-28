-- Update or insert AliExpress affiliate network with proper API configuration
INSERT INTO affiliate_networks (
  id,
  name,
  affiliate_id,
  api_endpoint,
  api_key_secret_name,
  commission_rate,
  is_active,
  settings,
  update_frequency_hours
) VALUES (
  gen_random_uuid(),
  'AliExpress',
  'Cyrus-pets',
  'https://api-sg.aliexpress.com/sync',
  'ALIEXPRESS_APP_KEY',
  0.08, -- 8% commission rate
  true,
  '{"api_secret_name": "ALIEXPRESS_SECRET", "target_categories": ["pet supplies", "pet accessories", "pet food", "pet toys"], "max_products_per_sync": 50}'::jsonb,
  24
) ON CONFLICT (name) DO UPDATE SET
  affiliate_id = EXCLUDED.affiliate_id,
  api_endpoint = EXCLUDED.api_endpoint,
  api_key_secret_name = EXCLUDED.api_key_secret_name,
  commission_rate = EXCLUDED.commission_rate,
  settings = EXCLUDED.settings,
  updated_at = now();