-- Create affiliate networks table to manage multiple affiliate programs
CREATE TABLE public.affiliate_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  api_endpoint TEXT,
  affiliate_id TEXT,
  api_key_secret_name TEXT, -- Reference to Supabase secret
  commission_rate DECIMAL(5,2),
  update_frequency_hours INTEGER DEFAULT 24,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate products table to store pulled product data
CREATE TABLE public.affiliate_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  network_id UUID NOT NULL REFERENCES public.affiliate_networks(id) ON DELETE CASCADE,
  external_product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  image_url TEXT,
  additional_images TEXT[],
  category TEXT,
  subcategory TEXT,
  brand TEXT,
  affiliate_link TEXT NOT NULL,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'in_stock',
  last_price_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliate content table for auto-generated content
CREATE TABLE public.affiliate_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'review', 'comparison', 'guide', 'showcase'
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  publish_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content templates table for automated generation
CREATE TABLE public.affiliate_content_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  template_content TEXT NOT NULL, -- Template with placeholders like {{product_name}}
  seo_title_template TEXT,
  seo_description_template TEXT,
  target_categories TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price history table for tracking price changes
CREATE TABLE public.affiliate_price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.affiliate_products(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  availability_status TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.affiliate_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_price_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for affiliate networks
CREATE POLICY "Only admins can manage affiliate networks"
ON public.affiliate_networks
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active affiliate networks"
ON public.affiliate_networks
FOR SELECT
USING (is_active = true);

-- Create RLS policies for affiliate products
CREATE POLICY "Only admins can manage affiliate products"
ON public.affiliate_products
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active affiliate products"
ON public.affiliate_products
FOR SELECT
USING (is_active = true AND availability_status != 'out_of_stock');

-- Create RLS policies for affiliate content
CREATE POLICY "Only admins can manage affiliate content"
ON public.affiliate_content
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view published affiliate content"
ON public.affiliate_content
FOR SELECT
USING (is_published = true AND (publish_at IS NULL OR publish_at <= now()));

-- Create RLS policies for content templates
CREATE POLICY "Only admins can manage content templates"
ON public.affiliate_content_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create RLS policies for price history
CREATE POLICY "Only admins can manage price history"
ON public.affiliate_price_history
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view price history"
ON public.affiliate_price_history
FOR SELECT
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_affiliate_products_network ON public.affiliate_products(network_id);
CREATE INDEX idx_affiliate_products_category ON public.affiliate_products(category);
CREATE INDEX idx_affiliate_products_active ON public.affiliate_products(is_active);
CREATE INDEX idx_affiliate_products_featured ON public.affiliate_products(is_featured);
CREATE INDEX idx_affiliate_content_product ON public.affiliate_content(product_id);
CREATE INDEX idx_affiliate_content_published ON public.affiliate_content(is_published, publish_at);
CREATE INDEX idx_affiliate_content_slug ON public.affiliate_content(slug);
CREATE INDEX idx_price_history_product ON public.affiliate_price_history(product_id, recorded_at);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_affiliate_networks_updated_at
BEFORE UPDATE ON public.affiliate_networks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_products_updated_at
BEFORE UPDATE ON public.affiliate_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_content_updated_at
BEFORE UPDATE ON public.affiliate_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default affiliate networks
INSERT INTO public.affiliate_networks (name, affiliate_id, commission_rate, settings) VALUES
('Amazon Associates', 'cypruspets20-20', 8.00, '{"base_url": "https://www.amazon.com", "api_version": "paapi5"}'),
('Chewy', '', 3.00, '{"base_url": "https://www.chewy.com"}'),
('PetSmart', '', 4.00, '{"base_url": "https://www.petsmart.com"}'),
('Petco', '', 3.50, '{"base_url": "https://www.petco.com"}');

-- Insert default content templates
INSERT INTO public.affiliate_content_templates (name, content_type, template_content, seo_title_template, seo_description_template, target_categories) VALUES
(
  'Product Review Template',
  'review',
  '# {{product_name}} Review - Cyprus Pets

{{product_name}} is a {{category}} product that offers excellent value for pet owners in Cyprus. 

## Key Features
- High-quality construction
- Perfect for {{pet_type}}
- Excellent customer reviews ({{rating}}/5 stars)

## Product Details
{{description}}

## Why We Recommend This Product
Based on our research and customer feedback, {{product_name}} stands out as a top choice for Cyprus pet owners looking for {{category}} products.

## Price and Availability
Current price: {{currency}}{{price}}
{{#if original_price}}
~~Original price: {{currency}}{{original_price}}~~
{{/if}}

[View on {{network_name}} →]({{affiliate_link}})',
  '{{product_name}} Review 2025 - Best {{category}} in Cyprus',
  'Read our detailed review of {{product_name}}. Find out why this {{category}} is perfect for Cyprus pet owners. Price: {{currency}}{{price}}',
  ARRAY['dogs', 'cats', 'birds', 'all']
),
(
  'Buying Guide Template',
  'guide',
  '# Best {{category}} for {{pet_type}} in Cyprus - 2025 Guide

Choosing the right {{category}} for your {{pet_type}} can be challenging. This comprehensive guide will help Cyprus pet owners make the best decision.

## Top Recommendations

### 1. {{product_name}}
{{description}}

**Price:** {{currency}}{{price}}
**Rating:** {{rating}}/5 stars
**Best for:** {{target_audience}}

[View Product →]({{affiliate_link}})

## What to Look For
- Quality and durability
- Size appropriate for your pet
- Safety certifications
- Value for money

## Cyprus-Specific Considerations
- Local climate conditions
- Shipping and availability
- Local veterinary recommendations',
  'Best {{category}} for {{pet_type}} in Cyprus 2025 - Complete Guide',
  'Discover the best {{category}} options for {{pet_type}} in Cyprus. Expert reviews, prices, and buying advice for pet owners.',
  ARRAY['dogs', 'cats', 'birds', 'all']
);