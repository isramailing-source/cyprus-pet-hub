import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, ExternalLink } from "lucide-react";
import AmazonWidget from "@/components/affiliates/AmazonWidget";
import AmazonProductLink from "@/components/affiliates/AmazonProductLink";
import AffiliateDisclosure from "@/components/affiliates/AffiliateDisclosure";

interface FeaturedProduct {
  id: string;
  name: string;
  description: string;
  rating: number;
  price: string;
  amazonId: string;
  image: string;
  category: string;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: "1",
    name: "Furhaven Orthopedic Dog Bed",
    description: "Memory foam support for senior dogs and large breeds with removable washable cover",
    rating: 4.8,
    price: "$79.99",
    amazonId: "B01NCKR5TE",
    image: "/api/placeholder/300/200",
    category: "dog"
  },
  {
    id: "2", 
    name: "Wahl Bravura Pet Clipper Kit",
    description: "Quiet motor, ceramic blades, perfect for dogs and cats of all coat types",
    rating: 4.6,
    price: "$45.99",
    amazonId: "B0002RJW4G",
    image: "/api/placeholder/300/200",
    category: "grooming"
  },
  {
    id: "3",
    name: "Vittles Vault Stackable Pet Food Storage",
    description: "BPA-free, pest-proof storage with measuring cup and wheels for easy transport",
    rating: 4.7,
    price: "$34.99",
    amazonId: "B0002DK2D6",
    image: "/api/placeholder/300/200",
    category: "dog"
  },
  {
    id: "4",
    name: "Nina Ottosson by Outward Hound Puzzle Feeder",
    description: "Slow feeding puzzle toy that stimulates hunting instincts and prevents overeating",
    rating: 4.5,
    price: "$24.99",
    amazonId: "B0711Y9XTF",
    image: "/api/placeholder/300/200",
    category: "cat"
  }
];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = featuredProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Pet Products Shop | Cyprus Pets - Best Deals on Pet Supplies</title>
        <meta 
          name="description" 
          content="Discover the best pet products and deals for dogs, cats, and other pets. Quality supplies, toys, food, and accessories with expert recommendations." 
        />
        <meta name="keywords" content="pet supplies cyprus, dog products, cat toys, pet food storage, grooming tools" />
        <link rel="canonical" href="/shop" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Pet Products Shop - Cyprus Pets",
            "description": "Quality pet products and supplies with expert recommendations",
            "url": "https://cyprus-pets.com/shop"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Pet Products & Deals
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Discover quality pet supplies, toys, and accessories with our expert recommendations
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for pet products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Dog Bed Spotlight */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        🛏️ Premium Dog Beds
                      </CardTitle>
                      <CardDescription>
                        Orthopedic support for your best friend's comfort and health
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Memory foam technology provides joint support for senior dogs and large breeds
                        </p>
                        <AmazonProductLink
                          productId="B01NCKR5TE"
                          productName="Shop Premium Dog Beds"
                          variant="default"
                          size="lg"
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </div>
                </Card>

                {/* Grooming Clippers Spotlight */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        ✂️ Professional Grooming
                      </CardTitle>
                      <CardDescription>
                        Professional-grade clippers for home grooming
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Quiet motor and ceramic blades for stress-free grooming at home
                        </p>
                        <AmazonProductLink
                          productId="B0002RJW4G"
                          productName="Shop Grooming Clippers"
                          variant="default"
                          size="lg"
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Category Tabs */}
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="dog">Dog Supplies</TabsTrigger>
                  <TabsTrigger value="cat">Cat Supplies</TabsTrigger>
                  <TabsTrigger value="grooming">Grooming</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="dog" className="mt-8">
                  <AmazonWidget 
                    searchPhrase="dog supplies"
                    category="PetSupplies"
                    className="mb-8"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="cat" className="mt-8">
                  <AmazonWidget 
                    searchPhrase="cat toys and supplies"
                    category="PetSupplies"
                    className="mb-8"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="grooming" className="mt-8">
                  <AmazonWidget 
                    searchPhrase="pet grooming supplies"
                    category="PetSupplies"
                    className="mb-8"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Affiliate Disclosure */}
              <AffiliateDisclosure variant="full" className="mt-12" />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

interface ProductCardProps {
  product: FeaturedProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center border-b">
        <div className="text-center">
          <div className="text-6xl mb-2">🛍️</div>
          <div className="text-xs text-muted-foreground">Premium Pet Product</div>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.rating})</span>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-3">
          {product.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">{product.price}</span>
          <AmazonProductLink
            productId={product.amazonId}
            productName="View on Amazon"
            variant="outline"
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Shop;