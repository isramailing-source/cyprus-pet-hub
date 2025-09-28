import { BlogSection } from "@/components/BlogSection";
import FeaturedPetTips from "@/components/FeaturedPetTips";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { AffiliateNetworkBanner } from "@/components/ads/AffiliateNetworkBanner";
import { AffiliateSpaceManager } from "@/components/ads/AffiliateSpaceManager";
import { AdSenseInArticle } from "@/components/ads";

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
          
          {/* AdSense In-Article Ad */}
          <section className="py-4">
            <div className="container mx-auto px-4">
              <AdSenseInArticle />
            </div>
          </section>
          
          {/* Strategic affiliate placement in blog */}
          <section className="py-8 bg-muted/30">
            <div className="container mx-auto px-4">
              <AffiliateNetworkBanner 
                placementType="banner" 
                currentPage="blog"
                className="mb-8"
              />
            </div>
          </section>
          
          <FeaturedPetTips />
          
          {/* Additional affiliate space at bottom */}
          <section className="py-6">
            <div className="container mx-auto px-4">
              <AffiliateSpaceManager 
                spaceType="mixed"
                placement="inline"
                currentPage="blog"
                adSenseSlot="blog-bottom"
                className="justify-center"
              />
            </div>
          </section>
        </main>
        
        {/* Blog sidebar with affiliate links */}
        <aside className="fixed right-4 top-1/3 w-64 z-40 hidden xl:block">
          <AffiliateSpaceManager 
            spaceType="affiliate-only"
            placement="sidebar"
            currentPage="blog"
            showDisclosure={false}
          />
        </aside>
        
        <Footer />
      </div>
    </>
  );
};

export default Blog;