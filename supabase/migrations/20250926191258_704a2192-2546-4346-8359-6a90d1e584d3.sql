-- Clear fake affiliate products with Unsplash images
DELETE FROM affiliate_products WHERE image_url LIKE '%unsplash%';

-- Also clear generic example products
DELETE FROM affiliate_products WHERE affiliate_link LIKE '%example.com%';