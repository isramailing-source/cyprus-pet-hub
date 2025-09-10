-- Update broken example.com image URLs to use local assets

-- Update cat/british related ads to use british shorthair image
UPDATE ads 
SET images = ARRAY['/src/assets/british-shorthair-cyprus.jpg']
WHERE images::text LIKE '%example.com%' 
  AND (images::text ILIKE '%british%' OR images::text ILIKE '%cat%');

-- Update dog/golden/puppy related ads to use golden retriever image  
UPDATE ads 
SET images = ARRAY['/src/assets/golden-retriever-cyprus.jpg']
WHERE images::text LIKE '%example.com%' 
  AND (images::text ILIKE '%golden%' OR images::text ILIKE '%dog%' OR images::text ILIKE '%puppy%');

-- Update bird related ads to use birds image
UPDATE ads 
SET images = ARRAY['/src/assets/birds-cyprus.jpg'] 
WHERE images::text LIKE '%example.com%'
  AND (images::text ILIKE '%bird%' OR images::text ILIKE '%canary%' OR images::text ILIKE '%parakeet%');

-- Update any remaining example.com URLs to use golden retriever as default
UPDATE ads 
SET images = ARRAY['/src/assets/golden-retriever-cyprus.jpg']
WHERE images::text LIKE '%example.com%';