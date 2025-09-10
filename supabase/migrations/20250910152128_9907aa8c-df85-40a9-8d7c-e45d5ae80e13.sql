-- Create forum system with AI moderation
CREATE TABLE public.forum_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  last_reply_at TIMESTAMP WITH TIME ZONE,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  moderation_status TEXT CHECK (moderation_status IN ('approved', 'pending', 'rejected', 'flagged')) DEFAULT 'pending',
  moderation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  moderation_status TEXT CHECK (moderation_status IN ('approved', 'pending', 'rejected', 'flagged')) DEFAULT 'pending',
  moderation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_bans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_by UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_permanent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forum_categories
CREATE POLICY "Categories are viewable by everyone"
ON public.forum_categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can manage categories"
ON public.forum_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for forum_topics
CREATE POLICY "Approved topics are viewable by everyone"
ON public.forum_topics FOR SELECT
USING (moderation_status = 'approved');

CREATE POLICY "Users can create topics if not banned"
ON public.forum_topics FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  NOT EXISTS (
    SELECT 1 FROM public.user_bans 
    WHERE user_id = auth.uid() 
    AND (expires_at > now() OR is_permanent = true)
  )
);

CREATE POLICY "Users can update their own topics"
ON public.forum_topics FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all topics"
ON public.forum_topics FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for forum_posts
CREATE POLICY "Approved posts are viewable by everyone"
ON public.forum_posts FOR SELECT
USING (moderation_status = 'approved');

CREATE POLICY "Users can create posts if not banned"
ON public.forum_posts FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  NOT EXISTS (
    SELECT 1 FROM public.user_bans 
    WHERE user_id = auth.uid() 
    AND (expires_at > now() OR is_permanent = true)
  )
);

CREATE POLICY "Users can update their own posts"
ON public.forum_posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all posts"
ON public.forum_posts FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_bans
CREATE POLICY "Users can view their own bans"
ON public.user_bans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage bans"
ON public.user_bans FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_forum_topics_category_id ON public.forum_topics(category_id);
CREATE INDEX idx_forum_topics_user_id ON public.forum_topics(user_id);
CREATE INDEX idx_forum_topics_moderation_status ON public.forum_topics(moderation_status);
CREATE INDEX idx_forum_posts_topic_id ON public.forum_posts(topic_id);
CREATE INDEX idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_moderation_status ON public.forum_posts(moderation_status);
CREATE INDEX idx_user_bans_user_id ON public.user_bans(user_id);
CREATE INDEX idx_user_bans_expires_at ON public.user_bans(expires_at);

-- Create triggers for updated_at
CREATE TRIGGER update_forum_categories_updated_at
BEFORE UPDATE ON public.forum_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_topics_updated_at
BEFORE UPDATE ON public.forum_topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
BEFORE UPDATE ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default forum categories
INSERT INTO public.forum_categories (name, description, icon) VALUES
('General Discussion', 'General chat about pets in Cyprus', '💬'),
('Pet Care Tips', 'Share and discuss pet care advice', '🐾'),
('Lost & Found', 'Help find lost pets or report found ones', '🔍'),
('Vet Recommendations', 'Recommend and discuss veterinarians', '🏥'),
('Pet Events', 'Upcoming pet events and meetups', '📅');

-- Clean up existing ads - remove obviously fake/test data
DELETE FROM public.ads WHERE 
  title ILIKE '%test%' OR
  title ILIKE '%fake%' OR
  title ILIKE '%sample%' OR
  description ILIKE '%lorem ipsum%' OR
  description ILIKE '%test%' OR
  seller_name ILIKE '%test%' OR
  email ILIKE '%test%' OR
  email ILIKE '%example%' OR
  phone ILIKE '%000%' OR
  phone ILIKE '%111%' OR
  phone ILIKE '%123%';

-- Update ads with placeholder images to be inactive
UPDATE public.ads SET is_active = false 
WHERE images IS NULL OR 
      array_length(images, 1) = 0 OR
      EXISTS (
        SELECT 1 FROM unnest(images) AS img 
        WHERE img ILIKE '%placeholder%' OR 
              img ILIKE '%example%' OR
              img ILIKE '%test%'
      );