import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, ShoppingCart, Truck, Shield, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AffiliateDisclosure from './AffiliateDisclosure';

interface Product {
  id: string;
  title: string;
  description: string;
  short_description: string;
  price: number;
  original_price?: number;
  currency: string;
  image_url: string;
  rating: number;
  review_count: number;
  category: string;
  subcategory?: string;
  brand: string;
  affiliate_link: string;
  network_name: string;
  is_featured: boolean;
}

interface RealPetProductShowcaseProps {
  title?: string;
  category?: string;
  limit?: number;
  showFeaturedOnly?: boolean;
  className?: string;
}

export function RealPetProductShowcase({
  title = 'Featured Pet Products',
  category = 'all',
  limit = 8,
  showFeaturedOnly = false,
  className = ''
}: RealPetProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // First get products
        let baseQuery = supabase
          .from('affiliate_products')
          .select(`
            id,
            title,
            description,
            short_description,
            price,
            original_price,
            currency,
            image_url,
            rating,
            review_count,
            category,
            subcategory,
            brand,
            affiliate_link,
            is_featured,
            network_id
          `)
          .eq('is_active', true)
          .eq('availability_status', 'in_stock')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (category && category !== 'all') {
          baseQuery = baseQuery.eq('category', category);
        }

        if (showFeaturedOnly) {
          baseQuery = baseQuery.eq('is_featured', true);
        }

        const { data: productsData, error: productsError } = await baseQuery;

        if (productsError) {
          console.error('Error fetching products:', productsError);
          return;
        }

        // Get network names separately
        const { data: networksData, error: networksError } = await supabase
          .from('affiliate_networks')
          .select('id, name');

        if (networksError) {
          console.error('Error fetching networks:', networksError);
          return;
        }

        // Create network lookup
        const networkLookup = new Map(networksData?.map(n => [n.id, n.name]) || []);

        const formattedProducts: Product[] = (productsData || []).map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || product.short_description || '',
          short_description: product.short_description || '',
          price: product.price || 0,
          original_price: product.original_price,
          currency: product.currency || 'EUR',
          image_url: product.image_url || '',
          rating: product.rating || 4.0,
          review_count: product.review_count || 0,
          category: product.category || 'pets',
          subcategory: product.subcategory,
          brand: product.brand || '',
          affiliate_link: product.affiliate_link,
          network_name: networkLookup.get(product.network_id) || 'Unknown',
          is_featured: product.is_featured || false
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit, showFeaturedOnly]);

  const calculateDiscount = (originalPrice?: number, currentPrice?: number) => {
    if (!originalPrice || !currentPrice) return null;
    if (originalPrice <= currentPrice) return null;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : 'USD'
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

  const handleProductClick = (affiliateLink: string) => {
    if (affiliateLink) {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
    return (
      <div className={`py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
            <p className="text-gray-400 text-sm mt-2">Please check back later for new arrivals.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const discount = calculateDiscount(product.original_price, product.price);
            const hasValidImage = product.image_url && !product.image_url.includes('/api/placeholder');
            
            return (
              <Card
                key={product.id}
                className="group transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 border border-gray-200 hover:border-blue-300 bg-white cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product.affiliate_link)}
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
                  {hasValidImage ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">🐾</div>
                        <div className="text-xs text-muted-foreground">Pet Product</div>
                      </div>
                    </div>
                  )}

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discount && discount > 0 && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 text-xs">
                        -{discount}%
                      </Badge>
                    )}
                    {product.is_featured && (
                      <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 py-1 text-xs">
                        Featured
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
                  
                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {product.short_description || product.description}
                  </p>
                  
                  {/* Rating */}
                  {product.rating > 0 && product.review_count > 0 && (
                    <div className="flex items-center justify-between">
                      {renderStarRating(product.rating, product.review_count)}
                    </div>
                  )}
                  
                  {/* Price Section */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price, product.currency)}
                      </span>
                      {product.original_price && product.original_price !== product.price && (
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
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.affiliate_link);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shop Now
                    </Button>

                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        {product.network_name} Partner • Secure Checkout
                      </span>
                    </div>
                  </div>
                  
                  {/* Network badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge className="text-xs text-gray-600" variant="outline">
                      {product.network_name}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <TrendingUp className="w-3 h-3" />
                      Popular
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

export default RealPetProductShowcase;