-- Fix Featured Discussions by updating forum topics moderation status
UPDATE forum_topics 
SET moderation_status = 'approved' 
WHERE moderation_status = 'flagged';

-- Ensure we have some sample forum topics for testing (without is_published column)
INSERT INTO forum_topics (title, content, user_id, category_id, moderation_status) 
SELECT 
  'Best Dog Training Tips for Cyprus Weather',
  'Living in Cyprus means dealing with hot summers and mild winters. Here are some specific training tips that work well in our Mediterranean climate...',
  (SELECT user_id FROM profiles LIMIT 1),
  (SELECT id FROM forum_categories WHERE name ILIKE '%dog%' OR name ILIKE '%training%' LIMIT 1),
  'approved'
WHERE NOT EXISTS (
  SELECT 1 FROM forum_topics WHERE moderation_status = 'approved' LIMIT 1
);

INSERT INTO forum_topics (title, content, user_id, category_id, moderation_status) 
SELECT 
  'Cat Care in Hot Cyprus Summers',
  'Cyprus summers can be challenging for our feline friends. Here are essential tips to keep your cats cool and comfortable during the hot months...',
  (SELECT user_id FROM profiles LIMIT 1),
  (SELECT id FROM forum_categories WHERE name ILIKE '%cat%' OR name ILIKE '%care%' LIMIT 1),
  'approved'
WHERE NOT EXISTS (
  SELECT 1 FROM forum_topics WHERE title = 'Cat Care in Hot Cyprus Summers'
);

-- Ensure affiliate products are marked as featured for display
UPDATE affiliate_products 
SET is_featured = true 
WHERE is_active = true 
AND is_featured = false 
AND id IN (
  SELECT id FROM affiliate_products 
  WHERE is_active = true 
  ORDER BY created_at DESC 
  LIMIT 6
);