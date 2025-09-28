-- Standardize affiliate product categories to match shop page filters
UPDATE affiliate_products 
SET category = CASE 
    WHEN category IN ('food', 'feeding') THEN 'Food & Treats'
    WHEN category = 'feeding' THEN 'Feeding & Watering'
    WHEN category = 'hygiene' THEN 'Grooming'
    WHEN category = 'toys' THEN 'Toys'
    ELSE category
END
WHERE category IN ('food', 'feeding', 'hygiene', 'toys');