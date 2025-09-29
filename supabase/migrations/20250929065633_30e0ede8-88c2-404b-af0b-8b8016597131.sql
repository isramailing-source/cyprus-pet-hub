-- Update AliExpress network configuration with correct API settings
UPDATE affiliate_networks 
SET 
  api_endpoint = 'https://api-sg.aliexpress.com/sync',
  affiliate_id = 'Cyrus-pets',
  settings = jsonb_build_object(
    'max_products_per_sync', 50,
    'target_categories', ARRAY['pet supplies', 'dog supplies', 'cat supplies', 'pet toys', 'pet food', 'pet care'],
    'app_key', '519798',
    'app_status', 'Test',
    'sign_method', 'sha256',
    'api_version', '2.0',
    'tracking_id', 'Cyrus-pets'
  )
WHERE name = 'AliExpress';