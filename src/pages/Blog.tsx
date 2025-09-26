import { BlogSection } from "@/components/BlogSection";
import FeaturedPetTips from "@/components/FeaturedPetTips";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

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
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;