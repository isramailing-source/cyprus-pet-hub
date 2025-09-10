-- Update scraping sources to show they've been used
UPDATE public.scraping_sources 
SET last_scraped = now(), 
    updated_at = now() 
WHERE is_active = true;