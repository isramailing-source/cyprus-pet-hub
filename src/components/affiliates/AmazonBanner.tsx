import bannerDesktop from "@/assets/banner-pet-products-desktop.jpg";
import bannerMobile from "@/assets/banner-pet-mobile.jpg";

interface AmazonBannerProps {
  linkId: string;
  width?: number;
  height?: number;
  className?: string;
}

const AmazonBanner = ({ 
  linkId, 
  width = 300, 
  height = 250, 
  className = "" 
}: AmazonBannerProps) => {
  const isLargeFormat = width > 500;
  const bannerImage = isLargeFormat ? bannerDesktop : bannerMobile;
  
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-primary/10 to-secondary/10 ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 text-center pt-2">
        Recommended Products
      </div>
      <a 
        href="https://amzn.to/3YourAffiliateLink" 
        target="_blank" 
        rel="nofollow sponsored"
        className="block hover:opacity-90 transition-opacity"
      >
        <img 
          src={bannerImage}
          alt="Premium Pet Products - Cyprus Pets Recommended"
          className="w-full h-auto object-cover"
          style={{ maxWidth: `${width}px`, maxHeight: `${height}px` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-medium shadow-text">
            Premium Pet Care Products
          </p>
        </div>
      </a>
    </div>
  );
};

export default AmazonBanner;