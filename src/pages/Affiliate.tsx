import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Settings, Star, TrendingUp } from 'lucide-react';
import AffiliateProductGrid from '@/components/AffiliateProductGrid';
import AffiliateManager from '@/components/AffiliateManager';
import { useAuth } from '@/hooks/useAuth';

export default function Affiliate() {
  const { user, userRole } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingBag },
    { id: 'feeding', name: 'Feeding', icon: ShoppingBag },
    { id: 'toys', name: 'Toys & Entertainment', icon: Star },
    { id: 'hygiene', name: 'Hygiene & Care', icon: TrendingUp },
    { id: 'health', name: 'Health & Wellness', icon: TrendingUp },
    { id: 'accessories', name: 'Accessories', icon: ShoppingBag }
  ];

  return (
    <>
      <Helmet>
        <title>Pet Products - Cyprus Pets</title>
        <meta name="description" content="Discover the best pet products for your furry friends in Cyprus. From premium food to toys and accessories, find everything your pet needs." />
        <meta name="keywords" content="pet products, dog food, cat toys, pet accessories, Cyprus pets, pet supplies" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium Pet Products
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Carefully curated products for your beloved pets. Quality, safety, and value guaranteed for Cyprus pet owners.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="px-3 py-1">
                  ✅ Cyprus Delivery Available
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  ⭐ Top Rated Products
                </Badge>
                <Badge variant="secondary" className="px-3 py-1">
                  💰 Best Prices Guaranteed
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Admin Panel */}
          {user && userRole === 'admin' && (
            <Tabs defaultValue="products" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Product Showcase
                </TabsTrigger>
                <TabsTrigger value="management" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Affiliate Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <ProductShowcase 
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                />
              </TabsContent>

              <TabsContent value="management">
                <AffiliateManager />
              </TabsContent>
            </Tabs>
          )}

          {/* Public Product Showcase */}
          {(!user || userRole !== 'admin') && (
            <ProductShowcase 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
        </div>
      </div>
    </>
  );
}

interface ProductShowcaseProps {
  categories: Array<{
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function ProductShowcase({ categories, selectedCategory, onCategoryChange }: ProductShowcaseProps) {
  return (
    <div className="space-y-8">
      {/* Featured Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">
              Hand-picked products that Cyprus pet owners love most
            </p>
          </div>
        </div>
        
        <AffiliateProductGrid 
          showFeaturedOnly={true}
          limit={4}
          className="mb-12"
        />
      </section>

      {/* Category Filter */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => onCategoryChange(category.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        <AffiliateProductGrid 
          category={selectedCategory}
          limit={12}
        />
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Recommended Products?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every product is carefully selected based on quality, customer reviews, and suitability for Cyprus pet owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Quality Assured</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Only top-rated products from trusted brands make it to our recommendations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Cyprus Focused</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Products selected specifically for Cyprus climate and pet owner needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Best Value</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Competitive prices and regular deals to give you the best value for money.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}