-- Add foreign key constraint between affiliate_products and affiliate_networks
ALTER TABLE public.affiliate_products 
ADD CONSTRAINT fk_affiliate_products_network_id 
FOREIGN KEY (network_id) REFERENCES public.affiliate_networks(id);

-- Add foreign key constraint between forum_topics and profiles
ALTER TABLE public.forum_topics 
ADD CONSTRAINT fk_forum_topics_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add foreign key constraint between forum_topics and forum_categories  
ALTER TABLE public.forum_topics 
ADD CONSTRAINT fk_forum_topics_category_id 
FOREIGN KEY (category_id) REFERENCES public.forum_categories(id);

-- Add foreign key constraint between forum_posts and profiles
ALTER TABLE public.forum_posts 
ADD CONSTRAINT fk_forum_posts_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);

-- Add foreign key constraint between forum_posts and forum_topics
ALTER TABLE public.forum_posts 
ADD CONSTRAINT fk_forum_posts_topic_id 
FOREIGN KEY (topic_id) REFERENCES public.forum_topics(id);

-- Insert sample affiliate products for the new networks
INSERT INTO public.affiliate_products (
  external_product_id, title, description, short_description, price, currency, 
  image_url, category, brand, affiliate_link, network_id, is_featured, is_active
) 
SELECT 
  'sample-' || n.name || '-' || gen_random_uuid(),
  'Premium Pet Product from ' || n.name,
  'High-quality pet supplies and accessories for your beloved pets. Made with premium materials and designed for comfort and durability.',
  'Premium pet supplies and accessories',
  CASE 
    WHEN random() < 0.3 THEN 29.99
    WHEN random() < 0.6 THEN 49.99
    ELSE 79.99
  END,
  'EUR',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
  CASE 
    WHEN random() < 0.33 THEN 'Dogs'
    WHEN random() < 0.66 THEN 'Cats'
    ELSE 'Birds'
  END,
  n.name,
  'https://example.com/affiliate/' || n.affiliate_id || '?product=sample',
  n.id,
  random() < 0.3, -- 30% chance of being featured
  true
FROM public.affiliate_networks n
WHERE n.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM public.affiliate_products p 
    WHERE p.network_id = n.id
  );

-- Add a second product for each network
INSERT INTO public.affiliate_products (
  external_product_id, title, description, short_description, price, currency,
  image_url, category, brand, affiliate_link, network_id, is_featured, is_active
)
SELECT 
  'sample2-' || n.name || '-' || gen_random_uuid(),
  'Professional Pet Care Kit - ' || n.name,
  'Complete pet care solution with everything your pet needs. Includes grooming tools, toys, and health supplements.',
  'Complete pet care solution',
  CASE 
    WHEN random() < 0.3 THEN 19.99
    WHEN random() < 0.6 THEN 39.99
    ELSE 59.99
  END,
  'EUR',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
  CASE 
    WHEN random() < 0.33 THEN 'Dogs'
    WHEN random() < 0.66 THEN 'Cats'
    ELSE 'Accessories'
  END,
  n.name,
  'https://example.com/affiliate/' || n.affiliate_id || '?product=sample2',
  n.id,
  random() < 0.4, -- 40% chance of being featured
  true
FROM public.affiliate_networks n
WHERE n.is_active = true;