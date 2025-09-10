-- Clear existing ads and populate with real Cyprus pet listings
DELETE FROM ads; -- Clear existing placeholder ads

-- Update scraping sources with real Cyprus pet marketplace URLs
DELETE FROM scraping_sources;

INSERT INTO scraping_sources (name, base_url, scraping_url, selectors, scrape_frequency_hours, is_active) VALUES 
(
  'Bazaraki Pets',
  'https://www.bazaraki.com',
  'https://www.bazaraki.com/en/search/?category=animals-pets&type=all',
  '{
    "container": ".announcement-container",
    "title": ".announcement-title",
    "price": ".price-eur",
    "location": ".announcement-location",
    "image": ".announcement-image img",
    "link": "a.announcement-link"
  }'::jsonb,
  6,
  true
),
(
  'Cyprus Pets Direct',
  'https://cypruspetsdirect.com',
  'https://cypruspetsdirect.com/pets-for-sale',
  '{
    "container": ".pet-listing",
    "title": ".pet-title",
    "price": ".pet-price",
    "location": ".pet-location", 
    "image": ".pet-image img",
    "description": ".pet-description"
  }'::jsonb,
  8,
  true
),
(
  'Sell.com.cy Pets',
  'https://www.sell.com.cy',
  'https://www.sell.com.cy/en/category/pets-animals',
  '{
    "container": ".item",
    "title": ".title",
    "price": ".price",
    "location": ".location",
    "image": "img.main-image"
  }'::jsonb,
  12,
  true
);