-- Create comprehensive database schema for pet marketplace automation

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scraping_sources table
CREATE TABLE public.scraping_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  scraping_url TEXT NOT NULL,
  selectors JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_scraped TIMESTAMP WITH TIME ZONE,
  scrape_frequency_hours INTEGER NOT NULL DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ads table (enhanced)
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  location TEXT,
  breed TEXT,
  age TEXT,
  gender TEXT,
  category_id UUID REFERENCES public.categories(id),
  images TEXT[],
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL UNIQUE,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  phone TEXT,
  email TEXT,
  seller_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create articles table (enhanced)
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_title TEXT,
  meta_description TEXT,
  author TEXT DEFAULT 'Cyprus Pets Team',
  category_id UUID REFERENCES public.categories(id),
  tags UUID[] DEFAULT '{}',
  featured_image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create article_tags junction table
CREATE TABLE public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

-- Create policies (public read access for marketplace data)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Scraping sources are viewable by everyone" ON public.scraping_sources FOR SELECT USING (true);
CREATE POLICY "Ads are viewable by everyone" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Articles are viewable by everyone" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Article tags are viewable by everyone" ON public.article_tags FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_ads_category ON public.ads(category_id);
CREATE INDEX idx_ads_location ON public.ads(location);
CREATE INDEX idx_ads_price ON public.ads(price);
CREATE INDEX idx_ads_scraped_at ON public.ads(scraped_at);
CREATE INDEX idx_ads_is_active ON public.ads(is_active);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_published_at ON public.articles(published_at);
CREATE INDEX idx_articles_is_published ON public.articles(is_published);
CREATE INDEX idx_articles_slug ON public.articles(slug);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_scraping_sources_updated_at BEFORE UPDATE ON public.scraping_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial categories
INSERT INTO public.categories (name, slug, description, icon) VALUES 
('Dogs', 'dogs', 'Dogs of all breeds and ages', 'Dog'),
('Cats', 'cats', 'Cats and kittens for adoption', 'Cat'),
('Birds', 'birds', 'Various bird species', 'Bird'),
('Fish', 'fish', 'Aquarium fish and marine life', 'Fish'),
('Small Pets', 'small-pets', 'Rabbits, hamsters, guinea pigs', 'Rabbit'),
('Reptiles', 'reptiles', 'Snakes, lizards, and other reptiles', 'Bug'),
('Farm Animals', 'farm-animals', 'Horses, goats, chickens', 'Cow');

-- Insert initial tags
INSERT INTO public.tags (name, slug) VALUES 
('puppy', 'puppy'),
('kitten', 'kitten'),
('adopted', 'adopted'),
('purebred', 'purebred'),
('vaccinated', 'vaccinated'),
('trained', 'trained'),
('friendly', 'friendly'),
('cyprus', 'cyprus'),
('limassol', 'limassol'),
('nicosia', 'nicosia'),
('paphos', 'paphos'),
('larnaca', 'larnaca'),
('famagusta', 'famagusta');

-- Insert Cyprus marketplace scraping sources
INSERT INTO public.scraping_sources (name, base_url, scraping_url, selectors, scrape_frequency_hours) VALUES 
('BazarAki Pets', 'https://www.bazaraki.com', 'https://www.bazaraki.com/real-estate-for-rent/pets/', 
 '{"title": ".announcement-title", "price": ".price-tag", "location": ".ad-location", "link": ".announcement-container a", "image": ".announcement-image img"}', 4),
('Sell.com.cy Pets', 'https://www.sell.com.cy', 'https://www.sell.com.cy/en/pets/', 
 '{"title": ".item-title", "price": ".item-price", "location": ".item-location", "link": ".item-link", "image": ".item-image img"}', 6),
('Cyprus Mail Classifieds', 'https://cyprus-mail.com', 'https://cyprus-mail.com/classifieds/pets/', 
 '{"title": ".classified-title", "price": ".classified-price", "location": ".classified-location", "link": ".classified-link", "image": ".classified-image img"}', 8);