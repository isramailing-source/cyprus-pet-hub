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
        <meta name="keywords" content="pet care cyprus, pet advice, pet community cyprus, pet resources, pet guides" />
        <link rel="canonical" href="/" />
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
          
          <CareGuidesHighlight />
          <FeaturedArticles />
          <FeaturedDiscussions />
          <PetResourcesHub />
          <ForumHighlights />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;