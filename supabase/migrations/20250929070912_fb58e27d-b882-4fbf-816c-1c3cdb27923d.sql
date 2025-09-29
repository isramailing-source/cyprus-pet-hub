-- Update all Amazon products to use proper affiliate links with the cypruspets20-20 tag
UPDATE affiliate_products 
SET affiliate_link = CONCAT('https://www.amazon.com/dp/', external_product_id, '?tag=cypruspets20-20')
WHERE network_id = '0feee4b5-ca31-45f4-86e2-8587876d824e' 
AND external_product_id IS NOT NULL 
AND external_product_id != 'placeholder';