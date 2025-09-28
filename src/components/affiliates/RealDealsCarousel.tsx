import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, Percent, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  currency: string;
  category: string;
  image_url?: string;
  affiliate_link: string;
  brand?: string;
  rating?: number;
  review_count?: number;
  network_name?: string;
}

export default function RealDealsCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select(`
          id,
          title,
          description,
          short_description,
          price,
          original_price,
          currency,
          category,
          image_url,
          affiliate_link,
          brand,
          rating,
          review_count,
          network_id,
          affiliate_networks!inner(name)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .eq('availability_status', 'in_stock')
        .limit(6);

      if (error) throw error;

      const formattedProducts: Product[] = data?.map(product => ({
        id: product.id,
        title: product.title,
        description: product.short_description || product.description || '',
        price: product.price || 0,
        original_price: product.original_price,
        currency: product.currency || 'EUR',
        category: product.category || '',
        image_url: product.image_url,
        affiliate_link: product.affiliate_link,
        brand: product.brand,
        rating: product.rating,
        review_count: product.review_count || 0,
        network_name: (product.affiliate_networks as any)?.name || 'Partner'
      })) || [];

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, products.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  const handleProductClick = async (product: Product) => {
    try {
      // Track click
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

  if (loading) {
    return (
      <div className="animate-pulse">
        <Card className="h-[300px] bg-muted"></Card>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No featured deals available at the moment.</p>
      </Card>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Percent className="h-6 w-6 text-primary" />
          Featured Deals
        </h2>
        <p className="text-muted-foreground">
          Handpicked products from our trusted partners
        </p>
      </div>

      <Card 
        className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
            {/* Product Image */}
            <div className="relative">
              <img
                src={currentProduct.image_url || '/src/assets/banner-pet-products-desktop.jpg'}
                alt={currentProduct.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/banner-pet-products-desktop.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:hidden" />
              
              {/* Discount Badge */}
              {currentProduct.original_price && currentProduct.original_price > currentProduct.price && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                  {calculateDiscount(currentProduct.original_price, currentProduct.price)}% OFF
                </Badge>
              )}
              
              {/* Network Badge */}
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white">
                {currentProduct.network_name}
              </Badge>
            </div>

            {/* Product Content */}
            <div className="p-8 flex flex-col justify-center space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {currentProduct.category}
                </Badge>
                <h3 className="text-2xl font-bold mb-2">{currentProduct.title}</h3>
                <p className="text-muted-foreground mb-4">{currentProduct.description}</p>
                
                {currentProduct.brand && (
                  <p className="text-sm text-muted-foreground">by {currentProduct.brand}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {currentProduct.price.toFixed(2)} {currentProduct.currency}
                  </span>
                  {currentProduct.original_price && currentProduct.original_price > currentProduct.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {currentProduct.original_price.toFixed(2)} {currentProduct.currency}
                    </span>
                  )}
                </div>
                
                {currentProduct.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(currentProduct.rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({currentProduct.review_count} reviews)
                    </span>
                  </div>
                )}
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => handleProductClick(currentProduct)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {products.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Carousel Indicators */}
      {products.length > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Mini Products Preview */}
      {products.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {products.slice(0, 4).map((product, index) => (
            <Card 
              key={product.id}
              className={`cursor-pointer transition-all duration-300 ${
                index === currentIndex ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <CardContent className="p-3">
                <div className="text-center">
                  {product.original_price && product.original_price > product.price && (
                    <Badge className="bg-red-500 text-white text-xs mb-2">
                      {calculateDiscount(product.original_price, product.price)}% OFF
                    </Badge>
                  )}
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                    {product.title}
                  </h4>
                  <p className="text-primary font-bold text-sm">
                    {product.price.toFixed(2)} {product.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.network_name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}