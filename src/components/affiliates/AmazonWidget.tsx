import bannerAffiliate from "@/assets/banner-sidebar-affiliate.jpg";
import bannerGrooming from "@/assets/banner-grooming-tools.jpg";
import bannerPetFood from "@/assets/banner-pet-food-products.jpg";
import bannerPetCare from "@/assets/banner-pet-care-essentials.jpg";
import bannerInteractiveToys from "@/assets/banner-interactive-toys.jpg";
import bannerComfortBeds from "@/assets/banner-comfort-beds.jpg";

interface AmazonWidgetProps {
  searchPhrase?: string;
  category?: string;
  className?: string;
}

const AmazonWidget = ({ 
  searchPhrase = "pet supplies", 
  category = "PetSupplies",
  className = ""
}: AmazonWidgetProps) => {
  // Choose banner based on search phrase
  const getBannerImage = () => {
    if (searchPhrase?.toLowerCase().includes('grooming') || searchPhrase?.toLowerCase().includes('clippers')) {
      return bannerGrooming;
    }
    if (searchPhrase?.toLowerCase().includes('bed') || searchPhrase?.toLowerCase().includes('orthopedic')) {
      return bannerComfortBeds;
    }
    if (searchPhrase?.toLowerCase().includes('interactive') || searchPhrase?.toLowerCase().includes('toys')) {
      return bannerInteractiveToys;
    }
    if (searchPhrase?.toLowerCase().includes('food') || searchPhrase?.toLowerCase().includes('treats')) {
      return bannerPetFood;
    }
    if (searchPhrase?.toLowerCase().includes('health') || searchPhrase?.toLowerCase().includes('care')) {
      return bannerPetCare;
    }
    return bannerAffiliate;
  };

  const getAffiliateUrl = () => {
    const encodedSearch = encodeURIComponent(searchPhrase || 'pet supplies');
    return `https://www.amazon.com/s?k=${encodedSearch}&tag=cypruspets20-20`;
  };

  const getDisplayText = () => {
    if (searchPhrase?.includes('grooming')) return 'Professional Grooming Tools';
    if (searchPhrase?.includes('health')) return 'Pet Health Essentials';
    if (searchPhrase?.includes('premium')) return 'Premium Pet Products';
    return 'Quality Pet Supplies';
  };

  return (
    <div className={`relative overflow-hidden rounded-lg border bg-card shadow-sm ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 text-center pt-2">
        Recommended Products
      </div>
      <a 
        href={getAffiliateUrl()}
        target="_blank" 
        rel="nofollow sponsored"
        className="block hover:opacity-90 transition-opacity"
      >
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={getBannerImage()}
            alt={`${searchPhrase} - Premium Pet Products`}
            className="w-full h-full object-contain transition-transform hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-sm font-medium shadow-text">
            {getDisplayText()}
          </p>
          <p className="text-white/80 text-xs">
            Shop on Amazon →
          </p>
        </div>
      </a>
    </div>
  );
};

export default AmazonWidget;