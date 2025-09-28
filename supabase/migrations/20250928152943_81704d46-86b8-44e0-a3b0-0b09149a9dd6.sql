-- Create table for direct affiliate links management
CREATE TABLE IF NOT EXISTS affiliate_direct_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  network_name TEXT,
  placement_type TEXT DEFAULT 'banner', -- banner, sidebar, inline, etc.
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  target_pages TEXT[] DEFAULT ARRAY['all'], -- which pages to show on
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the affiliate_direct_links table
ALTER TABLE affiliate_direct_links ENABLE ROW LEVEL SECURITY;

-- Allow public to view active affiliate links
CREATE POLICY "Public can view active affiliate links" 
ON affiliate_direct_links 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage affiliate links
CREATE POLICY "Only admins can manage affiliate links" 
ON affiliate_direct_links 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert your affiliate links
INSERT INTO affiliate_direct_links (name, url, description, network_name, placement_type, is_active, display_order, target_pages) VALUES 
('Pet Network Banner 1', 'https://uhtkc.com/g/vv0sleumno475461c4ad861831ace6/', 'Premium pet products affiliate network', 'Affiliate Network', 'banner', true, 1, ARRAY['shop', 'all']),
('Pet Network Sidebar', 'https://rzekl.com/g/1e8d114494475461c4ad16525dc3e8/', 'Pet supplies and accessories network', 'Affiliate Network', 'sidebar', true, 2, ARRAY['shop', 'blog', 'all']);

-- Create trigger for updated_at
CREATE TRIGGER update_affiliate_direct_links_updated_at
    BEFORE UPDATE ON affiliate_direct_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();