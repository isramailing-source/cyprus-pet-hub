import { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Star, Waves, Sailboat, Sun, Mountain } from "lucide-react";
import AmazonWidget from "@/components/affiliates/AmazonWidget";
import AffiliateProductGrid from "@/components/AffiliateProductGrid";
import AffiliateDisclosure from "@/components/affiliates/AffiliateDisclosure";
import { AffiliateSpaceManager } from "@/components/ads/AffiliateSpaceManager";
import { AffiliateNetworkBanner } from "@/components/ads/AffiliateNetworkBanner";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Category definitions with better filtering
  const categories = [
    { id: "all", name: "All Products", description: "All pet supplies" },
    { id: "dog", name: "Dogs", description: "Dog food, toys & accessories" },
    { id: "cat", name: "Cats", description: "Cat essentials & toys" },
    { id: "bird", name: "Birds", description: "Bird cages, food & toys" },
    { id: "grooming", name: "Grooming", description: "Pet grooming essentials" },
    { id: "accessories", name: "Accessories", description: "Collars, leashes & more" }
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
          {/* Mediterranean Hero Section */}
          <section className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50 py-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
            <div className="absolute top-10 left-10 text-blue-200/30">
              <Sailboat size={80} />
            </div>
            <div className="absolute top-20 right-20 text-orange-200/30">
              <Sun size={60} />
            </div>
            <div className="absolute bottom-10 left-1/4 text-cyan-200/30">
              <Waves size={40} />
            </div>
            <div className="absolute bottom-20 right-1/3 text-blue-200/30">
              <Mountain size={50} />
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="text-blue-600">Cyprus</span> Pet Products
                  <span className="block text-3xl md:text-4xl mt-2 text-gray-700">Mediterranean Quality for Your Pets</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Discover premium pet supplies with Mediterranean charm. From sunny Cyprus to your doorstep - 
                  quality products for dogs, cats, birds, and all your beloved companions.
                </p>
                
                {/* Enhanced Search Bar */}
                <div className="max-w-lg mx-auto relative mb-8">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search Mediterranean pet treasures..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 text-lg bg-white/80 backdrop-blur-sm border-2 border-blue-200 focus:border-blue-400 rounded-full shadow-lg"
                  />
                </div>

                {/* Quick Stats */}
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
                    <span>Mediterranean Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Sections */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              {/* Featured Affiliate Banner - Strategic placement */}
              <AffiliateNetworkBanner 
                placementType="banner" 
                currentPage="shop"
                className="mb-12"
              />
              
              <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
              
              {/* Enhanced Category Tabs */}
              <Tabs 
                className="mb-12" 
                onValueChange={(value) => setActiveCategory(value)} 
                value={activeCategory}
              >
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="flex flex-col items-center p-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      <span className="font-semibold">{category.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{category.description}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category.id} className="mt-8" value={category.id}>
                    {/* Amazon Widget for specific categories */}
                    {category.id !== 'all' && (
                      <AmazonWidget 
                        searchPhrase={category.id === 'dog' ? 'dog supplies' : 
                                    category.id === 'cat' ? 'cat toys and supplies' :
                                    category.id === 'bird' ? 'bird supplies' :
                                    category.id === 'grooming' ? 'pet grooming supplies' :
                                    category.id === 'accessories' ? 'pet accessories collars leashes' : 
                                    'pet supplies'}
                        category="PetSupplies"
                        className="mb-8"
                      />
                    )}
                    
                    {/* Enhanced AffiliateProductGrid with improved layout */}
                    <AffiliateProductGrid 
                      category={category.id}
                      limit={category.id === 'all' ? 16 : 12}
                      showFeaturedOnly={false}
                      searchTerm={searchTerm}
                      className="mb-8"
                    />
                  </TabsContent>
                ))}
              </Tabs>
              
              {/* Additional affiliate promotion space */}
              <div className="mt-8">
                <AffiliateSpaceManager 
                  spaceType="affiliate-only"
                  placement="inline"
                  currentPage="shop"
                  className="justify-center"
                />
              </div>
            </div>
          </section>

          {/* Cyprus Delivery Highlight Section */}
          <section className="py-12 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🇨🇾 Delivering to Cyprus with Mediterranean Care
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  We understand the unique needs of pet owners in Cyprus. Our curated selection focuses on products 
                  that deliver reliably to the island, with special attention to climate-appropriate supplies.
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="text-2xl mb-2">🚚</div>
                    <h4 className="font-semibold mb-1">Cyprus Shipping</h4>
                    <p className="text-sm text-gray-600">Verified delivery options</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="text-2xl mb-2">🌡️</div>
                    <h4 className="font-semibold mb-1">Climate Ready</h4>
                    <p className="text-sm text-gray-600">Mediterranean climate tested</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-4">
                    <div className="text-2xl mb-2">⭐</div>
                    <h4 className="font-semibold mb-1">Local Approved</h4>
                    <p className="text-sm text-gray-600">Cyprus pet owner recommended</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Sidebar with affiliate links */}
        <aside className="fixed right-4 top-1/2 transform -translate-y-1/2 w-64 z-40 hidden xl:block">
          <AffiliateSpaceManager 
            spaceType="mixed"
            placement="sidebar"
            currentPage="shop"
            adSenseSlot="sidebar-shop"
          />
        </aside>
        
        <Footer>
          {/* Collapsible Affiliate Disclosure in Footer */}
          <AffiliateDisclosure 
            variant="collapsible"
            showInFooter={true}
            className="border-t pt-8 mt-8"
          />
        </Footer>
      </div>
    </>
  );
};

export default Shop;
