import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AmazonBanner from './AmazonBanner';
import AffiliateDisclosure from './AffiliateDisclosure';

interface AffiliateNetwork {
  id: string;
  name: string;
  affiliate_id: string | null;
  commission_rate: number | null;
  is_active: boolean;
}

interface AffiliateProduct {
  id: string;
  title: string;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  affiliate_link: string;
  rating: number | null;
  network_id: string;
  brand: string | null;
}

interface EnhancedAffiliateSidebarProps {
  className?: string;
}

const EnhancedAffiliateSidebar = ({ className = "" }: EnhancedAffiliateSidebarProps) => {
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch active networks
      const { data: networksData } = await supabase
        .from('affiliate_networks')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      // Fetch featured products
      const { data: productsData } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(6);

      if (networksData) setNetworks(networksData);
      if (productsData) setFeaturedProducts(productsData);
    } catch (error) {
      console.error('Error fetching affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-4"></div>
          <div className="h-48 bg-muted rounded-lg mb-4"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Amazon Banner */}
      <AmazonBanner 
        linkId="sidebar_main_banner"
        width={300}
        height={250}
        className="mb-6"
      />

      {/* Featured Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Featured Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex gap-3">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">
                    {product.title}
                  </h4>
                  {product.brand && (
                    <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  )}
                  {renderStars(product.rating)}
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-primary">
                      {product.price ? `${product.currency || '€'}${product.price}` : 'Check Price'}
                    </span>
                    <Button size="sm" variant="outline" asChild>
                      <a 
                        href={product.affiliate_link}
                        target="_blank"
                        rel="nofollow sponsored"
                        className="text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <AffiliateDisclosure variant="inline" className="mt-4" />
        </CardContent>
      </Card>

      {/* Active Networks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Trusted Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {networks.map((network) => (
              <div key={network.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div>
                  <h4 className="font-medium text-sm">{network.name}</h4>
                  {network.commission_rate && (
                    <p className="text-xs text-muted-foreground">
                      Up to {network.commission_rate}% commission
                    </p>
                  )}
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Banner */}
      <AmazonBanner 
        linkId="sidebar_secondary_banner"
        width={300}
        height={200}
      />
    </div>
  );
};

export default EnhancedAffiliateSidebar;