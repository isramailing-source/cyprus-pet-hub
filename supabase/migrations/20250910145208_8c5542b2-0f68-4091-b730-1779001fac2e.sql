-- Set up scheduled scraping to automatically fetch new ads daily
-- This will run the scraping function every 6 hours to keep ads fresh

SELECT cron.schedule(
  'scrape-pet-ads-schedule', 
  '0 */6 * * *', -- Every 6 hours
  $$
  SELECT
    net.http_post(
      url:='https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/scrape-ads',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
      body:='{"automated": true}'::jsonb
    ) as request_id;
  $$
);