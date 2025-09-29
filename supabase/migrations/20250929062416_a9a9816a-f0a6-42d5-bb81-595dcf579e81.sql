-- Fix duplicate foreign key constraints
-- Remove the duplicate constraint (keeping the standard one)
ALTER TABLE public.affiliate_products 
DROP CONSTRAINT IF EXISTS fk_affiliate_products_network_id;

-- The standard constraint affiliate_products_network_id_fkey should remain