import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, MapPin } from 'lucide-react';
import AffiliateDisclosure from './AffiliateDisclosure';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  category: string;
  badge?: string;
}

const CanadaPetCareShowcase = () => {
  const canadianProducts: Product[] = [
    {
      id: "1",
      name: "Premium Canadian Salmon Dog Food",
      description: "Wild-caught Atlantic salmon with Canadian sweet potatoes",
      price: "$89.99",
      originalPrice: "$119.99",
      image: "/placeholder.svg",
      rating: 5,
      category: "Dog Food",
      badge: "Best Seller"
    },
    {
      id: "2", 
      name: "Natural Canadian Maple Cat Treats",
      description: "Made with real Canadian maple and organic ingredients",
      price: "$24.99",
      originalPrice: "$34.99",
      image: "/placeholder.svg",
      rating: 5,
      category: "Cat Treats",
      badge: "Limited Time"
    },
    {
      id: "3",
      name: "Canadian Winter Pet Coat",
      description: "Waterproof, insulated coat designed for harsh Canadian winters",
      price: "$59.99",
      originalPrice: "$79.99",
      image: "/placeholder.svg",
      rating: 4,
      category: "Pet Apparel",
      badge: "Seasonal"
    },
    {
      id: "4",
      name: "Eco-Friendly Canadian Hemp Toys",
      description: "Sustainable, durable toys made from Canadian hemp fibers",
      price: "$34.99",
      originalPrice: "$44.99",
      image: "/placeholder.svg",
      rating: 5,
      category: "Toys",
      badge: "Eco Choice"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const affiliateUrl = "https://rzekl.com/g/1e8d114494475461c4ad16525dc3e8/";

  return (
    <section className="py-8 bg-gradient-to-r from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <Card className="max-w-7xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-red-500" />
              <CardTitle className="text-2xl font-bold">🍁 Premium Canadian Pet Care Products</CardTitle>
              <MapPin className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-muted-foreground text-lg">
              Discover Canada's finest pet products - trusted by millions of Canadian pet owners
            </p>
            <AffiliateDisclosure variant="inline" />
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {canadianProducts.map((product) => (
                <div key={product.id} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-4">
                      {/* Badge */}
                      {product.badge && (
                        <Badge variant="secondary" className="mb-2 bg-red-100 text-red-800">
                          {product.badge}
                        </Badge>
                      )}
                      
                      {/* Product Image */}
                      <div className="relative mb-4">
                        <div className="w-full h-40 bg-gradient-to-br from-red-50 to-white rounded-lg border-2 border-dashed border-red-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl mb-1">🇨🇦</div>
                            <div className="text-xs text-muted-foreground">Premium Canadian Quality</div>
                          </div>
                        </div>
                        
                        {/* Discount Badge */}
                        {product.originalPrice && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                            Save {Math.round(((parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))) / parseFloat(product.originalPrice.replace('$', ''))) * 100)}%
                          </Badge>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm line-clamp-2">{product.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating)}
                          <span className="text-xs text-muted-foreground ml-1">({product.rating}/5)</span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
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
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <a 
                  href={affiliateUrl}
                  target="_blank" 
                  rel="nofollow sponsored"
                  className="inline-flex items-center gap-2"
                >
                  🛍️ Shop All Canadian Pet Products
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                ✨ Free shipping across Canada • 30-day satisfaction guarantee
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CanadaPetCareShowcase;