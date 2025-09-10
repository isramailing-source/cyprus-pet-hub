-- Enable automatic extensions needed for scheduled scraping
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Update scraping sources to focus on Facebook Marketplace and Bazaraki
DELETE FROM scraping_sources;

INSERT INTO scraping_sources (name, base_url, scraping_url, selectors, scrape_frequency_hours, is_active) VALUES 
(
  'Bazaraki Pets Cyprus',
  'https://www.bazaraki.com',
  'https://www.bazaraki.com/en/search/?category=animals-pets&type=all&location=all',
  '{
    "container": ".announcement-container",
    "title": ".announcement-title, .title-link",
    "price": ".price-eur, .price",
    "location": ".announcement-location, .location",
    "image": ".announcement-image img, .carousel-inner img",
    "link": "a[href*=\"/view/\"]",
    "description": ".announcement-description, .description"
  }'::jsonb,
  4,
  true
),
(
  'Facebook Marketplace Cyprus Pets',
  'https://www.facebook.com',
  'https://www.facebook.com/marketplace/limassol/search/?query=pets%20cyprus&sortBy=creation_time_descend&exact=false',
  '{
    "container": "[data-testid=\"marketplace-item\"], .x1dr59a3",
    "title": "[aria-label*=\"item\"] span, .x1lliihq",
    "price": "[aria-label*=\"price\"], .x193iq5w",
    "location": "[aria-label*=\"location\"], .x1i10hfl",
    "image": "img[src*=\"scontent\"]",
    "link": "a[href*=\"/marketplace/item/\"]"
  }'::jsonb,
  3,
  true
);

-- Create automated scraping function that doesn't require admin auth
CREATE OR REPLACE FUNCTION public.run_automated_scraping()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will be called by cron, so it bypasses authentication
  PERFORM net.http_post(
    url := 'https://alqibsaatuqpbmgmscll.supabase.co/functions/v1/scrape-ads-auto',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"source": "automated_cron"}'::jsonb
  );
END;
$$;

-- Schedule automatic scraping every 4 hours
SELECT cron.schedule(
  'auto-scrape-cyprus-pets',
  '0 */4 * * *', -- Every 4 hours
  'SELECT public.run_automated_scraping();'
);