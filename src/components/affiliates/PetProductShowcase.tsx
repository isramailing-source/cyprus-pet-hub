import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, ShoppingCart, Truck, Shield, Eye } from 'lucide-react';
import AffiliateDisclosure from './AffiliateDisclosure';
import AmazonProductLink from './AmazonProductLink';

interface Product {
  id: string;
  name: string;
  description: string;
  category: 'all' | 'dogs' | 'cats' | 'birds';
  amazonId: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  imageUrl?: string;
}

interface PetProductShowcaseProps {
  title?: string;
  category?: 'all' | 'dogs' | 'cats' | 'birds';
  className?: string;
}

export function PetProductShowcase({
  title = 'Featured Pet Products',
  category = 'all',
  className = ''
}: PetProductShowcaseProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const petProducts: Product[] = [
    {
      id: "1",
      name: "YETI Boomer 8 Dog Bowl",
      description: "Stainless steel, non-slip base, perfect for daily feeding",
      category: "dogs",
      amazonId: "B074Q7P389",
      price: "$49.99",
      originalPrice: "$59.99",
      rating: 4.7,
      reviewCount: 2847,
      brand: "YETI",
      imageUrl: "/api/placeholder/300/300"
    },
    {
      id: "2", 
      name: "SmartyKat Hot Pursuit Cat Toy",
      description: "Motion-activated, hours of entertainment for indoor cats",
      category: "cats",
      amazonId: "B06XKZX9VB",
      price: "$24.99",
      rating: 4.3,
      reviewCount: 1653,
      brand: "SmartyKat",
      imageUrl: "/api/placeholder/300/300"
    },
    {
      id: "3",
      name: "Prevue Pet Products Cage Kit",
      description: "Complete set for maintaining a clean, healthy bird environment",
      category: "birds", 
      amazonId: "B00176F5L0",
      price: "$89.99",
      originalPrice: "$109.99",
      rating: 4.5,
      reviewCount: 892,
      brand: "Prevue Pet",
      imageUrl: "/api/placeholder/300/300"
    },
    {
      id: "4",
      name: "Kong Classic Dog Toy",
      description: "Durable rubber toy for aggressive chewers, stuffable with treats",
      category: "dogs",
      amazonId: "B0002AR0I8",
      price: "$12.99",
      rating: 4.6,
      reviewCount: 5234,
      brand: "KONG",
      imageUrl: "/api/placeholder/300/300"
    }
  ];

  const filteredProducts = category === 'all' 
    ? petProducts 
    : petProducts.filter(product => product.category === category);

  const calculateDiscount = (originalPrice?: string, currentPrice?: string) => {
    if (!originalPrice || !currentPrice) return null;
    const original = parseFloat(originalPrice.replace('$', ''));
    const current = parseFloat(currentPrice.replace('$', ''));
    if (original <= current) return null;
    return Math.round(((original - current) / original) * 100);
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

  const handleProductClick = (amazonId: string) => {
    window.open(`https://amazon.com/dp/${amazonId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const discount = calculateDiscount(product.originalPrice, product.price);
            const isPrime = true; // Assume Amazon products have Prime

            return (
              <Card
                key={product.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-1 border border-gray-200 hover:border-blue-300 bg-white"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product.amazonId)}
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
                  <img
                    src={product.imageUrl || '/api/placeholder/300/300'} 
                    alt={product.name}
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
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  {product.rating && product.reviewCount && (
                    <div className="flex items-center justify-between">
                      {renderStarRating(product.rating, product.reviewCount)}
                    </div>
                  )}

                  {/* Price Section */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {product.price}
                      </span>
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
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
                    <AmazonProductLink
                      productId={product.amazonId}
                      productName="Shop Now"
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.amazonId);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Shop Now
                    </AmazonProductLink>
                    
                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        Amazon Partner • Secure Checkout
                      </span>
                    </div>
                  </div>

                  {/* Network badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge className="text-xs text-gray-600" variant="outline">
                      Amazon
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

export default PetProductShowcase;
