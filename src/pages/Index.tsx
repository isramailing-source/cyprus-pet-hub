import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  console.log('Index component rendering');
  return (
    <>
      <Helmet>
        <title>Cyprus Pets | Find Your Perfect Pet in Cyprus</title>
        <meta 
          name="description" 
          content="Cyprus's premier pet marketplace. Find dogs, cats, birds and exotic pets from trusted local sellers. Expert pet care advice and community." 
        />
        <meta name="keywords" content="pets cyprus, buy pets cyprus, pet marketplace, dogs cats cyprus, pet care advice" />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Cyprus Pets",
            "description": "Cyprus's premier pet marketplace and care resource",
            "url": "https://cyprus-pets.com"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <Categories />
          <FeaturedListings />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
