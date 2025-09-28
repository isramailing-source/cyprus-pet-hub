import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, TrendingUp, ShoppingCart, Truck, Shield, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AffiliateDisclosure from './AffiliateDisclosure';

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

interface FeaturedProductsSectionProps {
  title?: string;
  limit?: number;
  className?: string;
}

export default function FeaturedProductsSection({
  title = "Featured Pet Products",
  limit = 8,
  className = ""
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [limit]);

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

      // First try to get featured products
      const { data: featuredData, error: featuredError } = await query.eq('is_featured', true);
      
      let data = featuredData;
      let error = featuredError;
      
      // If no featured products found, fall back to any active products
      if (!error && (!data || data.length === 0)) {
        const fallback = await supabase
          .from('affiliate_products')
          .select(`
            *,
            network:affiliate_networks!fk_affiliate_products_network_id(name)
          `)
          .eq('is_active', true)
          .eq('availability_status', 'in_stock')
          .order('created_at', { ascending: false })
          .limit(limit);
        
        data = fallback.data;
        error = fallback.error;
      }

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
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
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" key={`full-${i}`} />
          ))}
          {hasHalfStar && (
            <div className="relative">
              <Star className="w-4 h-4 text-gray-300" />
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0" style={{
                clipPath: 'inset(0 50% 0 0)'
              }} />
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star className="w-4 h-4 text-gray-300" key={`empty-${i}`} />
          ))}
        </div>
        <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
          ({reviewCount.toLocaleString()})
        </span>
      </div>
    );
  };

  const handleProductClick = (affiliateLink: string, productId: string) => {
    // Track click analytics here if needed
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className={`${className} py-8`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card className="animate-pulse" key={i}>
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={`${className} py-8`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = calculateDiscount(product.original_price, product.price);
            const isPrime = product.network.name.toLowerCase().includes('amazon');

            return (
              <Card
                key={product.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 border border-gray-200 hover:border-blue-300 bg-white"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product.affiliate_link, product.id)}
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
                      <Button className="bg-white text-black hover:bg-gray-100 font-semibold" size="sm">
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
                        handleProductClick(product.affiliate_link, product.id);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shop Now
                    </Button>
                    
                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        Amazon Partner • Secure Checkout
                      </span>
                    </div>
                  </div>

                  {/* Network badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge className="text-xs text-gray-600" variant="outline">
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
    </div>
  );
}
