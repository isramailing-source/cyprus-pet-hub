import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AffiliateDisclosure from './AffiliateDisclosure';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  currency: string;
  image_url: string;
  rating: number;
  review_count: number;
  category: string;
  brand: string;
  affiliate_link: string;
  network_name: string;
  is_featured: boolean;
}

const RealCanadaPetCareShowcase = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch real products from database
        const { data: productsData, error: productsError } = await supabase
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
            brand,
            affiliate_link,
            is_featured,
            network_id
          `)
          .eq('is_active', true)
          .eq('availability_status', 'in_stock')
          .order('rating', { ascending: false })
          .limit(4);

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

        if (productsData && productsData.length > 0) {
          const formattedProducts: Product[] = productsData.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description || product.short_description || '',
            price: product.price || 0,
            original_price: product.original_price,
            currency: product.currency || 'EUR',
            image_url: product.image_url || '',
            rating: product.rating || 4.0,
            review_count: product.review_count || 0,
            category: product.category || 'pets',
            brand: product.brand || '',
            affiliate_link: product.affiliate_link,
            network_name: networkLookup.get(product.network_id) || 'Unknown',
            is_featured: product.is_featured || false
          }));

          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'EUR' ? 'EUR' : 'USD'
    }).format(price);
  };

  const calculateDiscount = (originalPrice?: number, currentPrice?: number) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice) return null;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-r from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-7xl mx-auto">
            <CardContent className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-gray-200 h-64 rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-r from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-7xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">🍁 Premium Pet Care Products</CardTitle>
              <p className="text-muted-foreground text-lg">
                No products available at the moment - check back soon!
              </p>
            </CardHeader>
          </Card>
        </div>
      </section>
    );
  }

  // Use the first product's affiliate link as the main CTA
  const mainAffiliateUrl = products[0]?.affiliate_link || "#";

  return (
    <section className="py-8 bg-gradient-to-r from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <Card className="max-w-7xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-red-500" />
              <CardTitle className="text-2xl font-bold">🍁 Premium Pet Care Products</CardTitle>
              <MapPin className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-muted-foreground text-lg">
              Discover high-quality pet products - trusted by pet owners worldwide
            </p>
            <AffiliateDisclosure variant="inline" />
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.map((product) => {
                const discount = calculateDiscount(product.original_price, product.price);
                const hasValidImage = product.image_url && !product.image_url.includes('/api/placeholder') && !product.image_url.includes('/placeholder.svg');

                return (
                  <div key={product.id} className="group">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                      <CardContent className="p-4">
                        {/* Badge */}
                        {product.is_featured && (
                          <Badge variant="secondary" className="mb-2 bg-red-100 text-red-800">
                            Featured
                          </Badge>
                        )}
                        
                        {/* Product Image */}
                        <div className="relative mb-4">
                          {hasValidImage ? (
                            <div className="w-full h-40 rounded-lg overflow-hidden bg-white border border-gray-200">
                              <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-full h-full object-contain p-2"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentNode as HTMLElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="w-full h-40 bg-gradient-to-br from-red-50 to-white rounded-lg border-2 border-dashed border-red-200 flex items-center justify-center">
                                        <div class="text-center">
                                          <div class="text-3xl mb-1">🐾</div>
                                          <div class="text-xs text-muted-foreground">Quality Pet Product</div>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-40 bg-gradient-to-br from-red-50 to-white rounded-lg border-2 border-dashed border-red-200 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-3xl mb-1">🐾</div>
                                <div className="text-xs text-muted-foreground">Quality Pet Product</div>
                              </div>
                            </div>
                          )}
                          
                          {/* Discount Badge */}
                          {discount && discount > 0 && (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                              Save {discount}%
                            </Badge>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm line-clamp-2">{product.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          
                          {/* Rating */}
                          {product.rating > 0 && (
                            <div className="flex items-center gap-1">
                              {renderStars(Math.round(product.rating))}
                              <span className="text-xs text-muted-foreground ml-1">
                                ({product.rating}/5)
                              </span>
                            </div>
                          )}
                          
                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-green-600">
                              {formatPrice(product.price, product.currency)}
                            </span>
                            {product.original_price && product.original_price !== product.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.original_price, product.currency)}
                              </span>
                            )}
                          </div>
                          
                          {/* Category */}
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <a 
                  href={mainAffiliateUrl}
                  target="_blank" 
                  rel="nofollow sponsored"
                  className="inline-flex items-center gap-2"
                >
                  🛍️ Shop All Pet Products
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                ✨ Fast delivery • Secure checkout • Quality guaranteed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RealCanadaPetCareShowcase;