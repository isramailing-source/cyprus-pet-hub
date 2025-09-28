-- PHASE 5: TEST AFFILIATE CONTENT MANAGER SYSTEM
-- Call the affiliate content manager to run a full sync
SELECT net.http_post(
  url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/affiliate-content-manager',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
  body := '{"action": "sync_products"}'::jsonb
) as request_id;