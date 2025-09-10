-- Update ads with proper category_id based on their breed
UPDATE ads SET category_id = 'ffd8cf35-ccde-49a6-8cfa-85118148cf71' -- Cats
WHERE breed IN ('British Shorthair', 'Persian', 'Bengal', 'Mixed') AND category_id IS NULL;

UPDATE ads SET category_id = 'f328101e-d09b-4885-ad4a-dde1c3ea8a81' -- Dogs  
WHERE breed IN ('German Shepherd', 'Labrador Mix', 'French Bulldog', 'Pomeranian', 'Husky Mix', 'Golden Retriever') AND category_id IS NULL;

UPDATE ads SET category_id = '4c9bd6db-b89e-4b3e-bcb7-cc7e6fc979c4' -- Birds
WHERE breed IN ('Cockatiel', 'Parakeet', 'Canary') AND category_id IS NULL;