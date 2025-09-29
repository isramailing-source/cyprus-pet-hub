import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingBag, Star, Waves } from "lucide-react";
import AffiliateProductGrid from "@/components/AffiliateProductGrid";
import AffiliateDisclosure from "@/components/affiliates/AffiliateDisclosure";
import ErrorBoundary from "@/components/ErrorBoundary";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Category definitions matching database categories
  const categories = [
    { id: "all", name: "All Products" },
    { id: "Food & Treats", name: "Food & Treats" },
    { id: "Feeding & Watering", name: "Feeding" },
    { id: "Grooming", name: "Grooming" },
    { id: "Doors & Gates", name: "Doors & Gates" },
    { id: "Toys", name: "Toys" }
  ];

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
          <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 py-16 mb-8">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">Cyprus</span> Pet Products
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Quality pet supplies for your beloved companions
              </p>
              
              {/* Search Bar */}
              <div className="max-w-lg mx-auto relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search pet products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-3 text-lg bg-white border-2 border-blue-200 focus:border-blue-400 rounded-full"
                />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>Top Rated Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-blue-500" />
                  <span>Cyprus Delivery Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Waves className="w-4 h-4 text-cyan-500" />
                  <span>Quality Products</span>
                </div>
              </div>
            </div>
          </section>

          {/* Product Sections */}
          <section className="pb-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Shop Pet Products</h2>
              
              {/* Category Tabs */}
              <Tabs 
                className="mb-8" 
                onValueChange={(value) => setActiveCategory(value)} 
                value={activeCategory}
              >
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex items-center justify-center p-3 text-sm"
                    >
                      <span className="font-semibold">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category.id} className="mt-6" value={category.id}>
                    <ErrorBoundary>
                      <AffiliateProductGrid 
                        category={category.id === 'all' ? undefined : category.id}
                        limit={16}
                        showFeaturedOnly={false}
                        searchTerm={searchTerm}
                        layout="grid"
                      />
                    </ErrorBoundary>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </section>

          {/* Affiliate Disclosure */}
          <div className="container mx-auto px-4 pb-8">
            <AffiliateDisclosure />
          </div>
        </main>
    
    <Footer />
      </div>
    </>
  );
};

export default Shop;
