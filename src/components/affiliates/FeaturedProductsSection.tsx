import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star } from 'lucide-react';
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
  short_description: string;
}

interface FeaturedProductsSectionProps {
  title?: string;
  limit?: number;
  className?: string;
}

const FeaturedProductsSection = ({ 
  title = "Featured Pet Products", 
  limit = 6,
  className = "" 
}: FeaturedProductsSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [limit]);

  const fetchProducts = async () => {
    try {
      // First try to get featured products with network information
      let { data, error } = await supabase
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
          short_description,
          network:affiliate_networks!fk_affiliate_products_network_id(name)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      // If no featured products found, fall back to any active products
      if (!error && (!data || data.length === 0)) {
        const fallback = await supabase
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
            short_description,
            network:affiliate_networks!fk_affiliate_products_network_id(name)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit);
        
        data = fallback.data;
        error = fallback.error;
      }
      
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
        network_name: (product.network as any)?.name || 'Unknown',
        short_description: product.short_description || ''
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <AffiliateDisclosure variant="inline" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group border rounded-lg p-4 space-y-4 hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl opacity-60">🛒</div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm line-clamp-2 flex-1">{product.title}</h3>
                  <span className="text-xs bg-secondary/20 text-secondary-foreground px-2 py-1 rounded whitespace-nowrap">
                    {product.network_name}
                  </span>
                </div>
                
                {product.short_description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.short_description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-lg">
                    {product.currency} {product.price.toFixed(2)}
                  </span>
                </div>
                
                <Button
                  asChild
                  className="w-full"
                  variant="default"
                >
                  <a 
                    href={product.affiliate_link}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="inline-flex items-center gap-2"
                  >
                    View Product
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedProductsSection;