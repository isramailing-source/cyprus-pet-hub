import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, TrendingUp, ShoppingCart, Truck, Shield, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AffiliateDisclosure from './affiliates/AffiliateDisclosure';
// Import dynamic affiliate link functions from affiliateNetworks.ts
import { 
  generateAmazonLink, 
  generateAliExpressLink,
  getNetworkById,
  amazonConfig,
  aliExpressConfig
} from '@/integrations/affiliateNetworks';

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
  // Add fields to support dynamic link generation
  amazon_asin?: string;
  aliexpress_product_url?: string;
  network_id: string;
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
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

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
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate dynamic affiliate link based on network configuration
  const generateDynamicAffiliateLink = (product: Product): string => {
    const network = getNetworkById(product.network_id);
    
    if (!network || !network.enabled) {
      return product.affiliate_link; // Fallback to stored link
    }

    switch (network.id) {
      case 'amazon':
        if (product.amazon_asin) {
          return generateAmazonLink(product.amazon_asin) || product.affiliate_link;
        }
        break;
      case 'aliexpress':
        if (product.aliexpress_product_url) {
          return generateAliExpressLink(product.aliexpress_product_url) || product.affiliate_link;
        }
        break;
      default:
        // For other networks, use stored affiliate_link
        return product.affiliate_link;
    }
    
    return product.affiliate_link;
  };

  const calculateDiscount = (originalPrice: number | null, currentPrice: number) => {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-CY', {
      style: 'currency',
      currency: currency || 'EUR'
    }).format(price);
  };

  const renderStarRating = (rating: number, reviewCount: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1 text-sm">
        <div className="flex items-center">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
          {hasHalfStar && (
            <div className="relative">
              <Star className="w-4 h-4 text-gray-300" />
              <Star 
                className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" 
                style={{
                  clipPath: 'inset(0 50% 0 0)'
                }} 
              />
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
          ))}
        </div>
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
          ({reviewCount.toLocaleString()})
        </span>
      </div>
    );
  };

  const handleProductClick = (product: Product) => {
    const dynamicLink = generateDynamicAffiliateLink(product);
    // Track click analytics here if needed
    window.open(dynamicLink, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const discount = calculateDiscount(product.original_price, product.price);
          const isPrime = product.network.name.toLowerCase().includes('amazon');
          const dynamicLink = generateDynamicAffiliateLink(product);
          
          return (
            <Card
              key={product.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 border border-gray-200 hover:border-blue-300 bg-white"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleProductClick(product)}
            >
              {/* Image Container with Badges */}
              <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
                <img
                  src={product.image_url} 
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                  loading="lazy"
                />
                
                {/* Top badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {discount && discount > 0 && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 text-xs">
                      -{discount}%
                    </Badge>
                  )}
                  {isPrime && (
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 py-1 text-xs">
                      Prime
                    </Badge>
                  )}
                </div>

                {/* Quick view overlay */}
                {hoveredProduct === product.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300">
                    <Button size="sm" className="bg-white text-black hover:bg-gray-100 font-semibold">
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>
                )}

                {/* Trust signals */}
                <div className="absolute top-2 right-2">
                  <div className="flex flex-col gap-1">
                    <div className="bg-white rounded-full p-1 shadow-sm">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                {/* Brand */}
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  {product.brand}
                </div>

                {/* Title */}
                <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  {renderStarRating(product.rating, product.review_count)}
                </div>

                {/* Price Section */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.original_price, product.currency)}
                      </span>
                    )}
                  </div>
                  
                  {/* Shipping info */}
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Truck className="w-3 h-3" />
                    Ships to Cyprus
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shop Now
                  </Button>
                  
                  <div className="text-center">
                    <span className="text-xs text-gray-500">
                      {product.network.name} Partner • Secure Checkout
                    </span>
                  </div>
                </div>

                {/* Network badge */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Badge variant="outline" className="text-xs text-gray-600">
                    {product.network.name}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Affiliate Disclosure */}
      <div className="mt-8">
        <AffiliateDisclosure />
      </div>

      {/* Additional trust signals */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-center gap-8 text-sm text-blue-700">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Secure Shopping
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Fast Cyprus Delivery
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            Verified Reviews
          </div>
        </div>
      </div>
    </div>
  );
}
