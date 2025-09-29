-- Add Zooplus DE affiliate network
INSERT INTO public.affiliate_networks (
  name,
  affiliate_id,
  api_endpoint,
  commission_rate,
  is_active,
  settings
) VALUES (
  'Zooplus DE',
  'ut3qm7csve475461c4adce6fe7ba63',
  'https://www.zooplus.de',
  5.0,
  true,
  '{
    "base_url": "https://ad.admitad.com/g/ut3qm7csve475461c4adce6fe7ba63/",
    "scraping_enabled": true,
    "target_products": 10,
    "categories": ["dog", "cat", "bird", "fish", "small-pets"],
    "scraping_selectors": {
      "product_grid": "[data-testid=\"product-tile\"], .product-tile, .product-item",
      "title": "[data-testid=\"product-name\"], .product-name, h3",
      "price": "[data-testid=\"price\"], .price, .product-price",
      "image": "img[data-testid=\"product-image\"], .product-image img, img",
      "rating": "[data-testid=\"rating\"], .rating, .stars",
      "link": "a[data-testid=\"product-link\"], .product-link, a"
    }
  }'::jsonb
);