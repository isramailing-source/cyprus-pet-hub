-- Clean up fake affiliate networks and add real ones
DELETE FROM affiliate_networks WHERE name IN ('Ad Network', 'Bywiola', 'Dorinebeaumont', 'Plrvq', 'Uhtkc', 'Xmknb', 'Yyczo');

-- Add Rakuten Advertising network with user's widget key
INSERT INTO affiliate_networks (name, affiliate_id, commission_rate, is_active, api_endpoint, settings) VALUES
('Rakuten Advertising', 'YYRTH55h9KSt9edQPnKzvyCayG90UHuN', 8.5, true, 'https://automate.linksynergy.com', '{"widget_key": "YYRTH55h9KSt9edQPnKzvyCayG90UHuN", "snippetURL": "https://automate-frontend.linksynergy.com/minified_logic.js"}');

-- Add Admitad network with user's credentials  
INSERT INTO affiliate_networks (name, affiliate_id, commission_rate, is_active, api_endpoint, settings) VALUES
('Admitad', 'Da3R4IYVMtYBoCcGb7UmxnZDP289bo', 7.0, true, 'https://api.admitad.com', '{"client_id": "Da3R4IYVMtYBoCcGb7UmxnZDP289bo", "client_secret": "KKc4EaSa6QhXUdhariHWuj9c6odOFA", "base64_header": "RGEzUjRJWVZNdFlCb0NjR2I3VW14blpEUDI4OWJvOktLYzRFYVNhNlFoWFVkaGFyaUhXdWo5YzZvZE9GQT09"}');

-- Update Amazon Associates to use user's tracking ID
UPDATE affiliate_networks SET affiliate_id = 'cypruspets20-20', settings = '{"tracking_id": "cypruspets20-20"}' WHERE name = 'Amazon Associates';

-- Update AliExpress to use user's tracking ID  
UPDATE affiliate_networks SET affiliate_id = 'Cyrus-pets', settings = '{"tracking_id": "Cyrus-pets"}' WHERE name = 'AliExpress';

-- Set up automation for daily article generation and product sync
INSERT INTO automation_logs (task_type, status, details) VALUES
('perplexity-article-generation', 'scheduled', '{"frequency": "daily", "target_count": "3-4", "topics": ["cyprus_pet_care", "mediterranean_climate_pets", "local_vet_services", "pet_regulations_cyprus"]}'),
('affiliate-product-sync', 'scheduled', '{"frequency": "daily", "networks": ["Amazon Associates", "AliExpress", "Rakuten Advertising", "Admitad"]}');