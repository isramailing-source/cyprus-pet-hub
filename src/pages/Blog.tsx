import { BlogSection } from "@/components/BlogSection";
import FeaturedPetTips from "@/components/FeaturedPetTips";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { AffiliateNetworkBanner } from "@/components/ads/AffiliateNetworkBanner";
import { AffiliateSpaceManager } from "@/components/ads/AffiliateSpaceManager";
import { AdSenseInArticle, AdSenseAutoRelaxed, AdBanner, AdSenseFluid } from "@/components/ads";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Pet Care Blog Cyprus | Cyprus Pets Expert Tips & Guides</title>
        <meta 
          name="description" 
          content="Expert pet care advice for Cyprus pet owners. Learn about pet hygiene, training, nutrition, and health care in the Mediterranean climate." 
        />
        <meta name="keywords" content="pet care cyprus, pet training tips, pet hygiene guide, animal care advice" />
        <link rel="canonical" href="/blog" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <BlogSection />
          
          <FeaturedPetTips />
          
          {/* Single strategic affiliate placement */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <AffiliateNetworkBanner 
                placementType="banner" 
                currentPage="blog"
                className="mb-8"
              />
            </div>
          </section>
        </main>
        
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;