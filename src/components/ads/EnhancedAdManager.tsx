import AdBanner from './AdBanner';
import AdInFeed from './AdInFeed';
import AdSidebar from './AdSidebar';
import AmazonBanner from '@/components/affiliates/AmazonBanner';
import { cn } from '@/lib/utils';

interface EnhancedAdManagerProps {
  placement: 'header' | 'sidebar' | 'footer' | 'inline' | 'between-sections';
  className?: string;
}

const EnhancedAdManager = ({ placement, className }: EnhancedAdManagerProps) => {
  const renderAdsByPlacement = () => {
    switch (placement) {
      case 'header':
        return (
          <div className="flex justify-center py-4 bg-muted/20">
            <AmazonBanner
              linkId="header_banner_desktop"
              width={728}
              height={90}
              className="hidden md:block"
            />
            <AmazonBanner
              linkId="header_banner_mobile"
              width={320}
              height={100}
              className="md:hidden"
            />
          </div>
        );
      
      case 'sidebar':
        return (
          <div className="space-y-4">
            <AdSidebar slot="sidebar-enhanced-001" />
            <AmazonBanner
              linkId="sidebar_banner"
              width={300}
              height={250}
            />
          </div>
        );
      
      case 'inline':
        return (
          <div className="my-6">
            <AdInFeed slot="infeed-enhanced-001" />
          </div>
        );
      
      case 'between-sections':
        return (
          <div className="py-6 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="container mx-auto px-4 flex justify-center">
              <AmazonBanner
                linkId="between_sections_banner"
                width={728}
                height={90}
                className="hidden md:block"
              />
              <AmazonBanner
                linkId="between_sections_mobile"
                width={320}
                height={100}
                className="md:hidden"
              />
            </div>
          </div>
        );
      
      case 'footer':
        return (
          <div className="py-4 border-t bg-muted/30">
            <div className="container mx-auto px-4 flex justify-center">
              <AmazonBanner
                linkId="footer_banner"
                width={728}
                height={90}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {renderAdsByPlacement()}
    </div>
  );
};

export default EnhancedAdManager;