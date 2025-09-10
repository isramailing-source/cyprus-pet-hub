-- Reactivate existing legitimate ads and add placeholder images
UPDATE public.ads 
SET is_active = true,
    images = CASE 
      WHEN title ILIKE '%kitten%' OR title ILIKE '%cat%' THEN ARRAY['/src/assets/british-shorthair-cyprus.jpg']
      WHEN title ILIKE '%dog%' OR title ILIKE '%puppy%' THEN ARRAY['/src/assets/golden-retriever-cyprus.jpg'] 
      WHEN title ILIKE '%bird%' OR title ILIKE '%cockatiel%' OR title ILIKE '%parakeet%' THEN ARRAY['/src/assets/birds-cyprus.jpg']
      ELSE ARRAY['/src/assets/hero-pets-cyprus.jpg']
    END,
    updated_at = now()
WHERE email NOT ILIKE '%test%' 
  AND email NOT ILIKE '%example%' 
  AND seller_name NOT ILIKE '%test%'
  AND phone NOT ILIKE '%000%'
  AND phone NOT ILIKE '%111%'
  AND phone NOT ILIKE '%123%';