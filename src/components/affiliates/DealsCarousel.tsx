import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Clock, ExternalLink, Percent } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  originalPrice: string;
  salePrice: string;
  network: string;
  category: string;
  image: string;
  url: string;
  expiresIn: string;
  badge?: string;
}

const featuredDeals: Deal[] = [
  {
    id: '1',
    title: 'Premium Dog Food Bundle',
    description: 'High-quality nutrition for all dog breeds',
    discount: '25% OFF',
    originalPrice: '$89.99',
    salePrice: '$67.49',
    network: 'Amazon',
    category: 'Dog Food',
    image: '/src/assets/banner-pet-food-products.jpg',
    url: 'https://amazon.com',
    expiresIn: '2 days',
    badge: 'Hot Deal'
  },
  {
    id: '2',
    title: 'Interactive Cat Toy Set',
    description: 'Keep your cats entertained for hours',
    discount: '30% OFF',
    originalPrice: '$45.99',
    salePrice: '$32.19',
    network: 'Chewy',
    category: 'Cat Toys',
    image: '/src/assets/banner-interactive-toys.jpg',
    url: 'https://chewy.com',
    expiresIn: '1 day',
    badge: 'Flash Sale'
  },
  {
    id: '3',
    title: 'Professional Grooming Kit',
    description: 'Complete grooming solution for home use',
    discount: '40% OFF',
    originalPrice: '$129.99',
    salePrice: '$77.99',
    network: 'PetSmart',
    category: 'Grooming',
    image: '/src/assets/banner-grooming-tools.jpg',
    url: 'https://petsmart.com',
    expiresIn: '3 days',
    badge: 'Best Value'
  },
  {
    id: '4',
    title: 'Orthopedic Pet Bed',
    description: 'Ultimate comfort for senior pets',
    discount: '35% OFF',
    originalPrice: '$79.99',
    salePrice: '$51.99',
    network: 'Petco',
    category: 'Pet Beds',
    image: '/src/assets/banner-comfort-beds.jpg',
    url: 'https://petco.com',
    expiresIn: '5 days',
    badge: 'Comfort Plus'
  }
];

export default function DealsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDeals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredDeals.length) % featuredDeals.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredDeals.length);
  };

  const currentDeal = featuredDeals[currentIndex];

  return (
    <div className="relative mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Percent className="h-6 w-6 text-primary" />
          Today's Best Deals
        </h2>
        <p className="text-muted-foreground">
          Limited time offers from our trusted partners
        </p>
      </div>

      <Card 
        className="relative overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
            {/* Deal Image */}
            <div className="relative">
              <img
                src={currentDeal.image}
                alt={currentDeal.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/banner-pet-products-desktop.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:hidden" />
              
              {/* Discount Badge */}
              <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                {currentDeal.discount}
              </Badge>
              
              {/* Special Badge */}
              {currentDeal.badge && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white">
                  {currentDeal.badge}
                </Badge>
              )}
            </div>

            {/* Deal Content */}
            <div className="p-8 flex flex-col justify-center space-y-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {currentDeal.category}
                </Badge>
                <h3 className="text-2xl font-bold mb-2">{currentDeal.title}</h3>
                <p className="text-muted-foreground mb-4">{currentDeal.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">{currentDeal.salePrice}</span>
                  <span className="text-lg text-muted-foreground line-through">{currentDeal.originalPrice}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Available at {currentDeal.network}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-orange-600">
                <Clock className="h-4 w-4" />
                <span>Expires in {currentDeal.expiresIn}</span>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                onClick={() => window.open(currentDeal.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Shop This Deal
              </Button>
            </div>
          </div>

          {/* Navigation Arrows */}
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
        </CardContent>
      </Card>

      {/* Carousel Indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {featuredDeals.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Mini Deals Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {featuredDeals.map((deal, index) => (
          <Card 
            key={deal.id}
            className={`cursor-pointer transition-all duration-300 ${
              index === currentIndex ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
            }`}
            onClick={() => setCurrentIndex(index)}
          >
            <CardContent className="p-3">
              <div className="text-center">
                <Badge className="bg-red-500 text-white text-xs mb-2">
                  {deal.discount}
                </Badge>
                <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                  {deal.title}
                </h4>
                <p className="text-primary font-bold text-sm">{deal.salePrice}</p>
                <p className="text-xs text-muted-foreground">{deal.network}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}