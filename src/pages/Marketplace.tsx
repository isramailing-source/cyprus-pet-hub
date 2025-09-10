import { AdsList } from "@/components/AdsList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Marketplace = () => {
  return (
    <>
      <Helmet>
        <title>Pet Marketplace Cyprus | Cyprus Pets Buy & Sell Online</title>
        <meta 
          name="description" 
          content="Find pets for sale in Cyprus from trusted local marketplaces. Dogs, cats, birds, and more from verified sellers across the island." 
        />
        <meta name="keywords" content="pets for sale cyprus, buy pets cyprus, pet marketplace, dogs cats cyprus" />
        <link rel="canonical" href="/marketplace" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <AdsList />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Marketplace;