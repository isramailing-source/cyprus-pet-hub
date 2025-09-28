import React, { useState, useEffect } from 'react';
import { ExternalLink, ShoppingBag, Star, Package, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { generateAmazonStorefrontLink } from '@/integrations/affiliateNetworks';

interface AmazonProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url?: string;
  affiliate_link: string;
  rating?: number;
  review_count?: number;
  category: string;
}

interface RealAmazonShowcaseProps {
  className?: string;
  title?: string;
  maxProducts?: number;
}

const RealAmazonShowcase: React.FC<RealAmazonShowcaseProps> = ({ 
  className = "",
  title = "Amazon Pet Essentials",
  maxProducts = 3
}) => {
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmazonProducts();
  }, []);

  const fetchAmazonProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select(`
          id,
          title,
          price,
          currency,
          image_url,
          affiliate_link,
          rating,
          review_count,
          category,
          affiliate_networks!inner(name)
        `)
        .eq('is_active', true)
        .eq('availability_status', 'in_stock')
        .eq('affiliate_networks.name', 'Amazon')
        .limit(maxProducts);

      if (error) throw error;

      const formattedProducts: AmazonProduct[] = data?.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price || 0,
        currency: product.currency || 'EUR',
        image_url: product.image_url,
        affiliate_link: product.affiliate_link,
        rating: product.rating,
        review_count: product.review_count || 0,
        category: product.category || ''
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching Amazon products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = async (product: AmazonProduct) => {
    try {
      await supabase.from('affiliate_clicks').insert({
        product_id: product.id,
        referrer: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
  };

  const handleStorefrontClick = async () => {
    try {
      await supabase.from('affiliate_clicks').insert({
        referrer: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    window.open(generateAmazonStorefrontLink(), '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: maxProducts }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Quality products with fast shipping</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="space-y-4">
            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-muted mb-2">
                    <img
                      src={product.image_url || '/src/assets/banner-pet-products-desktop.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.currentTarget.src = '/src/assets/banner-pet-products-desktop.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  </div>
                  <div className="space-y-1">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {product.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-600">
                        {product.price.toFixed(2)} {product.currency}
                      </span>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-muted-foreground">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Amazon Button */}
            <Button
              onClick={handleStorefrontClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Visit Our Amazon Store
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No Amazon products available at the moment</p>
            <Button
              onClick={handleStorefrontClick}
              variant="outline"
              size="lg"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Amazon Store
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 pt-4 mt-4 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>Prime Eligible</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            <span>Fast Shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🛡️</span>
            <span>Amazon Guarantee</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealAmazonShowcase;