import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CareGuidesHighlight from "@/components/CareGuidesHighlight";
import PetResourcesHub from "@/components/PetResourcesHub";
import FeaturedArticles from "@/components/FeaturedArticles";
import ForumHighlights from "@/components/ForumHighlights";
import FeaturedDiscussions from "@/components/FeaturedDiscussions";
import Footer from "@/components/Footer";
import AmazonBanner from "@/components/affiliates/AmazonBanner";
import { Helmet } from "react-helmet-async";

const Index = () => {
  console.log('Index component rendering');
  
  return (
    <>
      <Helmet>
        <title>Cyprus Pets | Expert Pet Care Advice & Community</title>
        <meta
          name="description" 
          content="Cyprus's premier pet care resource hub. Expert articles, trusted local services, and vibrant community for pet owners across the island." 
        />
        <meta content="pet care cyprus, pet advice, pet community cyprus, pet resources, pet guides" name="keywords" />
        <link href="/" rel="canonical" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Cyprus Pets",
            "description": "Cyprus's premier pet care resource hub and community",
            "url": "https://cyprus-pets.com"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <CareGuidesHighlight />
          
          {/* Amazon Affiliate Banner - Hero Section */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4 flex justify-center">
              <AmazonBanner
                linkId="homepage_hero_banner"
                width={728}
                height={90}
                className="hidden md:block"
              />
              <AmazonBanner
                linkId="homepage_hero_banner_mobile"
                width={320}
                height={100}
                className="md:hidden"
              />
            </div>
          </section>
          
          {/* Affiliate Link Section */}
          <section className="py-6 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-primary">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">🌟 Recommended Pet Products & Services</h3>
                    <p className="text-gray-600 mb-4">Discover premium pet care products and services recommended by our community experts.</p>
                  </div>
                  <div className="flex-shrink-0">
                    <a 
                      href="https://rzekl.com/g/1e8d114494475461c4ad16525dc3e8/" 
                      target="_blank" 
                      rel="nofollow sponsored"
                      className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      🛍️ Shop Premium Pet Products
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <PetResourcesHub />
          <FeaturedArticles />
          <ForumHighlights />
          <FeaturedDiscussions />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;