import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import AffiliateDisclosure from './AffiliateDisclosure';

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  affiliate_link: string;
  rating: number;
  category: string;
  network_name: string;
}

interface DynamicAffiliateWidgetProps {
  category?: string;
  limit?: number;
  showNetworkBadge?: boolean;
  className?: string;
}

const DynamicAffiliateWidget = ({ 
  category, 
  limit = 3, 
  showNetworkBadge = true,
  className = "" 
}: DynamicAffiliateWidgetProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category, limit]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('affiliate_products')
        .select(`
          id,
          title,
          price,
          currency,
          image_url,
          affiliate_link,
          rating,
          category,
          network_id,
          affiliate_networks!inner(name)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(limit);

      if (category) {
        query = query.ilike('category', `%${category}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const formattedProducts = data?.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price || 0,
        currency: product.currency || 'EUR',
        image_url: product.image_url || '',
        affiliate_link: product.affiliate_link,
        rating: product.rating || 0,
        category: product.category || '',
        network_name: (product.affiliate_networks as any)?.name || 'Unknown'
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-3 text-center">
          Featured Products
        </div>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex-shrink-0 flex items-center justify-center border">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-2xl">🛒</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-primary">
                      {product.currency} {product.price.toFixed(2)}
                    </span>
                    {showNetworkBadge && (
                      <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded">
                        {product.network_name}
                      </span>
                    )}
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-xs"
                  >
                    <a 
                      href={product.affiliate_link}
                      target="_blank"
                      rel="nofollow sponsored"
                      className="inline-flex items-center gap-1"
                    >
                      View Product
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <AffiliateDisclosure variant="inline" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicAffiliateWidget;