-- PHASE 4: TEST PERPLEXITY ARTICLE GENERATOR
-- Call the Perplexity function to generate a test article
SELECT net.http_post(
  url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/perplexity-article-generator',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFscWlic2FhdHVxcGJtZ21zY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MDkzNTIsImV4cCI6MjA3MzA4NTM1Mn0.fCD3ImzjrDvnV3lUimRWi_JVP6Dakewiw2sy0Pz5Ux8"}'::jsonb,
  body := '{"action": "generate_articles", "count": 1}'::jsonb
) as request_id;