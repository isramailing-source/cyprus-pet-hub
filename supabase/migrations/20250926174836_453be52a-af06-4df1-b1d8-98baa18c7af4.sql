-- Only add missing foreign key constraints (check which ones don't exist yet)

-- Add forum_topics to profiles constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_forum_topics_user_id' 
        AND table_name = 'forum_topics'
    ) THEN
        ALTER TABLE public.forum_topics 
        ADD CONSTRAINT fk_forum_topics_user_id 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);
    END IF;
END $$;

-- Add forum_topics to forum_categories constraint if it doesn't exist  
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_forum_topics_category_id' 
        AND table_name = 'forum_topics'
    ) THEN
        ALTER TABLE public.forum_topics 
        ADD CONSTRAINT fk_forum_topics_category_id 
        FOREIGN KEY (category_id) REFERENCES public.forum_categories(id);
    END IF;
END $$;

-- Add forum_posts to profiles constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_forum_posts_user_id' 
        AND table_name = 'forum_posts'
    ) THEN
        ALTER TABLE public.forum_posts 
        ADD CONSTRAINT fk_forum_posts_user_id 
        FOREIGN KEY (user_id) REFERENCES public.profiles(user_id);
    END IF;
END $$;

-- Add forum_posts to forum_topics constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_forum_posts_topic_id' 
        AND table_name = 'forum_posts'
    ) THEN
        ALTER TABLE public.forum_posts 
        ADD CONSTRAINT fk_forum_posts_topic_id 
        FOREIGN KEY (topic_id) REFERENCES public.forum_topics(id);
    END IF;
END $$;

-- Insert sample affiliate products for networks that don't have any products
INSERT INTO public.affiliate_products (
  external_product_id, title, description, short_description, price, currency, 
  image_url, category, brand, affiliate_link, network_id, is_featured, is_active
) 
SELECT 
  'sample-' || n.name || '-' || substr(gen_random_uuid()::text, 1, 8),
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
  'https://example.com/affiliate/' || COALESCE(n.affiliate_id, 'default') || '?product=sample',
  n.id,
  random() < 0.3,
  true
FROM public.affiliate_networks n
WHERE n.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM public.affiliate_products p 
    WHERE p.network_id = n.id
  );

-- Add a second product for each network that needs products
INSERT INTO public.affiliate_products (
  external_product_id, title, description, short_description, price, currency,
  image_url, category, brand, affiliate_link, network_id, is_featured, is_active
)
SELECT 
  'sample2-' || n.name || '-' || substr(gen_random_uuid()::text, 1, 8),
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
  'https://example.com/affiliate/' || COALESCE(n.affiliate_id, 'default') || '?product=sample2',
  n.id,
  random() < 0.4,
  true
FROM public.affiliate_networks n
WHERE n.is_active = true
  AND (SELECT COUNT(*) FROM public.affiliate_products p WHERE p.network_id = n.id) < 2;