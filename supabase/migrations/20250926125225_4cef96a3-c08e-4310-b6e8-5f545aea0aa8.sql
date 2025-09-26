-- Enable pg_cron extension for scheduling
SELECT cron.schedule(
  'daily-article-generation',
  '0 2 * * *', -- Daily at 2 AM UTC (5 AM in Cyprus)
  $$
  SELECT
    net.http_post(
        url:='https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/schedule-tasks',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
        body:='{"source": "cron"}'::jsonb
    ) as request_id;
  $$
);