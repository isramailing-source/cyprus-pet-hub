import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AffiliateDisclosure from './affiliates/AffiliateDisclosure';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  currency: string;
  image_url: string;
  rating: number;
  review_count: number;
  category: string;
  brand: string;
  affiliate_link: string;
  network: { name: string };
}

interface AffiliateProductGridProps {
  category?: string;
  limit?: number;
  showFeaturedOnly?: boolean;
  className?: string;
}

export default function AffiliateProductGrid({ 
  category, 
  limit = 8, 
  showFeaturedOnly = false,
  className = "" 
}: AffiliateProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category, limit, showFeaturedOnly]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from('affiliate_products')
        .select(`
          *,
          network:affiliate_networks!fk_affiliate_products_network_id(name)
        `)
        .eq('is_active', true)
        .eq('availability_status', 'in_stock')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (showFeaturedOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-muted-foreground'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">
          ({rating})
        </span>
      </div>
    );
  };

  const handleProductClick = async (product: Product) => {
    // Track click for analytics (first get current value, then increment)
    try {
      const { data: currentContent } = await supabase
        .from('affiliate_content')
        .select('clicks')
        .eq('product_id', product.id)
        .single();

      if (currentContent) {
        await supabase
          .from('affiliate_content')
          .update({ 
            clicks: (currentContent.clicks || 0) + 1
          })
          .eq('product_id', product.id);
      }
    } catch (error) {
      console.error('Error tracking click:', error);
    }
    
    // Open affiliate link
    window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-t-lg"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-muted-foreground">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Products Available</h3>
          <p>We're constantly adding new products. Check back soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400';
                }}
              />
              {product.original_price && product.price < product.original_price && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                  Sale
                </Badge>
              )}
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
              >
                {product.category}
              </Badge>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              {renderStars(product.rating)}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      {product.currency}{product.price}
                    </span>
                    {product.original_price && product.price < product.original_price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.currency}{product.original_price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    via {product.network?.name}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={() => handleProductClick(product)}
              >
                <ExternalLink className="h-3 w-3 mr-2" />
                View Product
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AffiliateDisclosure />
    </div>
  );
}