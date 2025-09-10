-- Create or update scraping sources with better URLs for Cyprus pet marketplaces
DELETE FROM scraping_sources;

INSERT INTO scraping_sources (name, base_url, scraping_url, selectors, is_active, scrape_frequency_hours) VALUES 
(
  'Bazaraki Pets Cyprus',
  'https://www.bazaraki.com',
  'https://www.bazaraki.com/en/pets/',
  '{
    "container": ".announcement-container, .item-announcement, .listing-item",
    "title": ".announcement-title, .title, h3",
    "price": ".announcement-price, .price",
    "location": ".announcement-location, .location",
    "description": ".announcement-description, .description",
    "link": "a[href*=\"/ad/\"]"
  }',
  true,
  3
),
(
  'Facebook Marketplace Cyprus Pets',
  'https://www.facebook.com',
  'https://www.facebook.com/marketplace/cyprus/search/?category=pets',
  '{
    "container": ".marketplace-listing, .feed-story",
    "title": ".marketplace-listing-title, .story-body-text",
    "price": ".marketplace-listing-price",
    "location": ".marketplace-listing-location",
    "description": ".marketplace-listing-description",
    "link": "a"
  }',
  true,
  3
),
(
  'Cyprus Pet Classifieds',
  'https://www.sell.com.cy',
  'https://www.sell.com.cy/en/listings/pets',
  '{
    "container": ".listing, .ad-item, .classified-item",
    "title": ".listing-title, .title",
    "price": ".price, .listing-price", 
    "location": ".location",
    "description": ".description",
    "link": "a"
  }',
  true,
  4
);