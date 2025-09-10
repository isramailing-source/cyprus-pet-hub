import PetCard from "./PetCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdInFeed from "@/components/ads/AdInFeed";
import AdSidebar from "@/components/ads/AdSidebar";
import AdBanner from "@/components/ads/AdBanner";
import { Skeleton } from "@/components/ui/skeleton";
import goldenRetrieverImage from "@/assets/golden-retriever-cyprus.jpg";
import britishShorthairImage from "@/assets/british-shorthair-cyprus.jpg";
import birdsImage from "@/assets/birds-cyprus.jpg";

// Helper function to get image source with comprehensive fallback handling
const getImageSrc = (images: string[] | null): string => {
  console.log('🖼️ Processing images:', images);
  
  if (!images || images.length === 0) {
    console.log('🖼️ No images found, using default:', goldenRetrieverImage);
    return goldenRetrieverImage; // Default fallback image
  }
  
  const imagePath = images[0];
  console.log('🖼️ Processing image path:', imagePath);
  
  // Handle broken example.com URLs by mapping them to local assets
  if (imagePath.includes('example.com')) {
    console.log('🖼️ Found example.com URL, mapping to local asset');
    if (imagePath.includes('british') || imagePath.includes('cat')) return britishShorthairImage;
    if (imagePath.includes('golden') || imagePath.includes('dog') || imagePath.includes('puppy')) return goldenRetrieverImage;
    if (imagePath.includes('bird') || imagePath.includes('canary') || imagePath.includes('parakeet')) return birdsImage;
    return goldenRetrieverImage; // Default fallback for other example.com URLs
  }
  
  // Handle working external URLs
  if (imagePath.startsWith('http')) {
    console.log('🖼️ Found external URL:', imagePath);
    return imagePath;
  }
  
  // Map database asset paths to imported assets
  if (imagePath.includes('/src/assets/golden-retriever-cyprus.jpg')) {
    console.log('🖼️ Mapping to golden retriever image');
    return goldenRetrieverImage;
  }
  if (imagePath.includes('/src/assets/british-shorthair-cyprus.jpg')) {
    console.log('🖼️ Mapping to british shorthair image');
    return britishShorthairImage;
  }
  if (imagePath.includes('/src/assets/birds-cyprus.jpg')) {
    console.log('🖼️ Mapping to birds image');
    return birdsImage;
  }
  
  // Handle any local asset reference
  if (imagePath.includes('golden-retriever-cyprus.jpg')) return goldenRetrieverImage;
  if (imagePath.includes('british-shorthair-cyprus.jpg')) return britishShorthairImage;
  if (imagePath.includes('birds-cyprus.jpg')) return birdsImage;
  
  console.log('🖼️ Using fallback image for:', imagePath);
  return goldenRetrieverImage; // Final fallback
};

const FeaturedListings = () => {
  const { t } = useTranslation();
  
  // Fetch real pet data from database
  const { data: featuredPets = [], isLoading, error } = useQuery({
    queryKey: ['featured-pets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ads_public')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      // Transform data to match PetCard props
      return data.map((ad) => ({
        id: ad.id,
        name: ad.title || 'Pet',
        price: ad.price ? parseFloat(ad.price.toString()).toFixed(0) : 'Contact for price',
        location: ad.location || 'Cyprus',
        timePosted: new Date(ad.created_at || '').toLocaleDateString(),
        image: getImageSrc(ad.images),
        category: 'Pet', // Default category since we don't have category names in view
        age: ad.age || 'Unknown',
        breed: ad.breed || 'Mixed',
        isFavorited: false
      }));
    }
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredPets')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featuredPetsDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-lg border p-4">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <AdSidebar slot="4567890123" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('❌ Error fetching featured pets:', error);
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredPets')}
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">Failed to load pet listings</p>
              <p className="text-red-500 text-sm mt-2">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no pets found
  if (featuredPets.length === 0 && !isLoading) {
    console.log('⚠️ No pets to display');
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('featuredPets')}
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-yellow-600 font-medium">No pet listings found</p>
              <p className="text-yellow-500 text-sm mt-2">Check back later for new listings</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log('🎨 Rendering FeaturedListings with', featuredPets.length, 'pets');
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('featuredPets')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('featuredPetsDescription')}
          </p>
        </div>
        
        {/* Main content with sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPets.slice(0, 2).map((pet) => (
                <PetCard key={pet.id} {...pet} />
              ))}
            </div>
            
            {/* In-feed ad after 2 listings */}
            <AdInFeed slot="2345678901" className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPets.slice(2, 4).map((pet) => (
                <PetCard key={pet.id} {...pet} />
              ))}
            </div>
            
            {/* Another in-feed ad */}
            <AdInFeed slot="3456789012" className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPets.slice(4).map((pet) => (
                <PetCard key={pet.id} {...pet} />
              ))}
            </div>
          </div>
          
          {/* Sidebar with ads */}
          <div className="lg:col-span-1 space-y-8">
            <AdSidebar slot="4567890123" />
            <AdSidebar slot="5678901234" />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/forum">
            <Button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium">
              {t('viewAllListings')}
            </Button>
          </Link>
        </div>
        
        {/* Bottom banner ad */}
        <div className="ad-spacing-large">
          <AdBanner 
            slot="6789012345" 
            format="horizontal"
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;