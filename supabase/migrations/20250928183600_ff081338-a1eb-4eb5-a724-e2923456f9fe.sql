-- Fix AliExpress API Integration Issues (Corrected)

-- Step 1: Clean up duplicate products by keeping only the first created ones
WITH duplicate_products AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY network_id, external_product_id 
           ORDER BY created_at ASC
         ) as rn
  FROM affiliate_products
)
DELETE FROM affiliate_products 
WHERE id IN (
  SELECT id FROM duplicate_products WHERE rn > 1
);

-- Step 2: Add unique constraint to prevent future duplicates
ALTER TABLE affiliate_products 
ADD CONSTRAINT affiliate_products_network_external_id_unique 
UNIQUE (network_id, external_product_id);

-- Step 3: Add index for better performance on lookups
CREATE INDEX IF NOT EXISTS idx_affiliate_products_network_external 
ON affiliate_products (network_id, external_product_id);

-- Step 4: Add index for price checking queries
CREATE INDEX IF NOT EXISTS idx_affiliate_products_last_price_check 
ON affiliate_products (last_price_check) 
WHERE is_active = true;

-- Step 5: Clean up any orphaned price history records
DELETE FROM affiliate_price_history 
WHERE product_id NOT IN (SELECT id FROM affiliate_products);