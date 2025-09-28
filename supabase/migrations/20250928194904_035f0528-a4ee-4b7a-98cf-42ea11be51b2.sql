-- Enable pg_cron extension for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create scheduled job to run affiliate sync daily at 2 AM UTC
SELECT cron.schedule(
  'daily-affiliate-sync',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/affiliate-content-manager',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
    body := '{"action": "full_sync"}'::jsonb
  ) as request_id;
  $$
);

-- Create scheduled job to run affiliate sync every 6 hours  
SELECT cron.schedule(
  'affiliate-sync-6h',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/affiliate-content-manager',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
    body := '{"action": "sync_products"}'::jsonb
  ) as request_id;
  $$
);