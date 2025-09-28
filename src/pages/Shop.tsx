import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import AmazonWidget from "@/components/affiliates/AmazonWidget";
import AffiliateProductGrid from "@/components/AffiliateProductGrid";
import AffiliateDisclosure from "@/components/affiliates/AffiliateDisclosure";
import { AffiliateSpaceManager } from "@/components/ads/AffiliateSpaceManager";
import { AffiliateNetworkBanner } from "@/components/ads/AffiliateNetworkBanner";

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

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
              
              {/* Category Tabs */}
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-12">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="dog">Dog Supplies</TabsTrigger>
                  <TabsTrigger value="cat">Cat Supplies</TabsTrigger>
                  <TabsTrigger value="grooming">Grooming</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-8">
                  <AffiliateProductGrid
                    category="all"
                    limit={12}
                    showFeaturedOnly={false}
                    className="mb-8"
                  />
                </TabsContent>

                <TabsContent value="dog" className="mt-8">
                  <AmazonWidget 
                    searchPhrase="dog supplies"
                    category="PetSupplies"
                    className="mb-8"
                  />
                  <AffiliateProductGrid
                    category="dog"
                    limit={12}
                    showFeaturedOnly={false}
                    className="mb-8"
                  />
                </TabsContent>

                <TabsContent value="cat" className="mt-8">
                  <AmazonWidget 
                    searchPhrase="cat toys and supplies"
                    category="PetSupplies"
                    className="mb-8"
                  />
                  <AffiliateProductGrid
                    category="cat"
                    limit={12}
                    showFeaturedOnly={false}
                    className="mb-8"
                  />
                </TabsContent>

                <TabsContent value="grooming" className="mt-8">
                  <AmazonWidget 
                    searchPhrase="pet grooming supplies"
                    category="PetSupplies"
                    className="mb-8"
                  />
                  <AffiliateProductGrid
                    category="grooming"
                    limit={12}
                    showFeaturedOnly={false}
                    className="mb-8"
                  />
                </TabsContent>
              </Tabs>

              {/* Affiliate Disclosure */}
              <AffiliateDisclosure className="mt-12" variant="full" />
              
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
        
        <Footer />
      </div>
    </>
  );
};

export default Shop;
