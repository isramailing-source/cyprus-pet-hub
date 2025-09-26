-- Mark some existing affiliate products as featured so they appear on homepage
UPDATE affiliate_products 
SET is_featured = true 
WHERE id IN (
  SELECT id 
  FROM affiliate_products 
  WHERE is_active = true 
  ORDER BY created_at DESC 
  LIMIT 4
);

-- Update the FeaturedProductsSection fallback behavior in case no featured products exist
-- This is handled in the component code, not the database