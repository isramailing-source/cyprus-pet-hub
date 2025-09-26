-- Complete cleanup of fake affiliate products (correct syntax)
DELETE FROM affiliate_products WHERE image_url LIKE '%unsplash%';
DELETE FROM affiliate_products WHERE affiliate_link LIKE '%example.com%'; 
DELETE FROM affiliate_products WHERE affiliate_link LIKE '%rzekl.com%';

-- Set specific real Amazon products as featured (no LIMIT needed)
UPDATE affiliate_products 
SET is_featured = true 
WHERE external_product_id IN ('B089SR47PH', 'B08VDC6GCX', 'B0002DJX44', 'B07XLBQZPX')
AND affiliate_link LIKE '%amazon.com%';