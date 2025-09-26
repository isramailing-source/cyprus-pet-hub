import Header from "@/components/Header";
import EnhancedPetHero from "@/components/EnhancedPetHero";
import CareGuidesHighlight from "@/components/CareGuidesHighlight";
import PetResourcesHub from "@/components/PetResourcesHub";
import FeaturedArticles from "@/components/FeaturedArticles";
import ForumHighlights from "@/components/ForumHighlights";
import FeaturedDiscussions from "@/components/FeaturedDiscussions";
import Footer from "@/components/Footer";
import AmazonBanner from "@/components/affiliates/AmazonBanner";
import FeaturedProductsSection from '@/components/affiliates/FeaturedProductsSection';
import AffiliateNetworkBanner from '@/components/affiliates/AffiliateNetworkBanner';
import EnhancedAffiliateSidebar from '@/components/affiliates/EnhancedAffiliateSidebar';
import CanadaPetCareShowcase from '@/components/affiliates/CanadaPetCareShowcase';
import EnhancedAdManager from '@/components/ads/EnhancedAdManager';
import TestAffiliateSync from '@/components/TestAffiliateSync';
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
        
        {/* Enhanced Ad Manager - Header */}
        <EnhancedAdManager placement="header" />
        
        <div className="flex">
          {/* Main Content */}
          <main className="flex-1">
            <EnhancedPetHero />
            
            {/* Enhanced Ad Manager - Between Sections */}
            <EnhancedAdManager placement="between-sections" />
            
            <CareGuidesHighlight />
            
            {/* Affiliate Network Rotating Banner */}
            <section className="py-8">
              <div className="container mx-auto px-4">
                <AffiliateNetworkBanner className="mb-8" />
              </div>
            </section>
            
            {/* Enhanced Ad Manager - Inline */}
            <EnhancedAdManager placement="inline" />
            
            {/* Canada Pet Care Products Showcase */}
            <CanadaPetCareShowcase />
            
            {/* Featured Products Section */}
            <FeaturedProductsSection 
              title="Recommended Products & Services for Cyprus Pet Owners"
              limit={8}
              className="mb-8"
            />
            
            {/* Enhanced Ad Manager - Between Sections */}
            <EnhancedAdManager placement="between-sections" />
            
            <PetResourcesHub />
            
            {/* Enhanced Ad Manager - Inline */}
            <EnhancedAdManager placement="inline" />
            
            <FeaturedArticles />
            
            {/* Enhanced Ad Manager - Between Sections */}
            <EnhancedAdManager placement="between-sections" />
            
            <ForumHighlights />
            <FeaturedDiscussions />
          </main>
          
          {/* Enhanced Affiliate Sidebar */}
          <aside className="hidden lg:block w-80 p-4">
            <div className="sticky top-4">
              <EnhancedAffiliateSidebar />
            </div>
          </aside>
        </div>
        
        {/* Enhanced Ad Manager - Footer */}
        <EnhancedAdManager placement="footer" />
        
        <Footer />
      </div>
    </>
  );
};

export default Index;