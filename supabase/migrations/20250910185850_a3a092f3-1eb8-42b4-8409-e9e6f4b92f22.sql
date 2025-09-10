-- Fix extension in public schema by moving pg_cron to extensions schema
-- First drop the existing cron job
SELECT cron.unschedule('cypress-pets-automation');

-- Drop extensions from public schema
DROP EXTENSION IF EXISTS pg_cron;
DROP EXTENSION IF EXISTS pg_net;

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Install extensions in the extensions schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Recreate the cron job using the extensions schema
SELECT extensions.cron.schedule(
  'cyprus-pets-automation',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT extensions.net.http_post(
    url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/schedule-tasks',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
    body := '{"source": "cron_automation"}'::jsonb
  );
  $$
);