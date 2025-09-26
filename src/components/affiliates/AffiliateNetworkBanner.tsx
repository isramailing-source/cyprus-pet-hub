import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AffiliateDisclosure from './AffiliateDisclosure';

interface AffiliateNetwork {
  id: string;
  name: string;
  affiliate_id: string | null;
  commission_rate: number | null;
  is_active: boolean;
  settings: any;
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
  short_description: string | null;
}

interface AffiliateNetworkBannerProps {
  className?: string;
  autoRotate?: boolean;
  interval?: number;
}

const AffiliateNetworkBanner = ({ 
  className = "", 
  autoRotate = true, 
  interval = 5000 
}: AffiliateNetworkBannerProps) => {
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoRotate && networks.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % networks.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoRotate, interval, networks.length]);

  const fetchData = async () => {
    try {
      // Fetch active networks
      const { data: networksData } = await supabase
        .from('affiliate_networks')
        .select('*')
        .eq('is_active', true);

      // Fetch featured products for display
      const { data: productsData } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(12);

      if (networksData) setNetworks(networksData);
      if (productsData) setProducts(productsData);
    } catch (error) {
      console.error('Error fetching network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentNetwork = networks[currentIndex];
  const networkProducts = products.filter(p => p.network_id === currentNetwork?.id).slice(0, 4);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % networks.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + networks.length) % networks.length);
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
      </div>
    );
  };

  if (loading || !networks.length) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-48 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {currentNetwork?.name} Products
              </h3>
              <p className="text-muted-foreground">
                Discover premium products from our trusted partner
                {currentNetwork?.commission_rate && (
                  <span className="ml-2 text-primary font-medium">
                    • Up to {currentNetwork.commission_rate}% off
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {networks.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={networks.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={networks.length <= 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {networkProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
              {networkProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-lg border p-4 hover:shadow-lg transition-shadow">
                  {product.image_url && (
                    <div className="aspect-square mb-3 overflow-hidden rounded">
                      <img 
                        src={product.image_url} 
                        alt={product.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
                      {product.title}
                    </h4>
                    
                    {product.brand && (
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    )}
                    
                    {product.short_description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                    
                    {renderStars(product.rating)}
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="font-bold text-primary">
                        {product.price ? `${product.currency || '€'}${product.price}` : 'Check Price'}
                      </span>
                      <Button size="sm" asChild>
                        <a 
                          href={product.affiliate_link}
                          target="_blank"
                          rel="nofollow sponsored"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Shop
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Products coming soon from {currentNetwork?.name}</p>
            </div>
          )}

          {/* Network indicator dots */}
          <div className="flex justify-center gap-2 mt-6">
            {networks.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>

          <AffiliateDisclosure variant="inline" className="mt-4" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateNetworkBanner;