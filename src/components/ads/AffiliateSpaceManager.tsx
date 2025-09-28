import React from 'react';
import { AffiliateNetworkBanner } from './AffiliateNetworkBanner';
import AdBanner from './AdBanner';
import AdInFeed from './AdInFeed';
import AdSidebar from './AdSidebar';

interface AffiliateSpaceManagerProps {
  spaceType: 'mixed' | 'affiliate-only' | 'adsense-only';
  placement: 'banner' | 'sidebar' | 'inline' | 'in-feed';
  currentPage?: string;
  className?: string;
  adSenseSlot?: string;
  showDisclosure?: boolean;
}

export const AffiliateSpaceManager: React.FC<AffiliateSpaceManagerProps> = ({
  spaceType,
  placement,
  currentPage = 'all',
  className = '',
  adSenseSlot = '1234567890',
  showDisclosure = true
}) => {
  const renderAffiliateContent = () => {
    switch (placement) {
      case 'banner':
        return (
          <AffiliateNetworkBanner 
            placementType="banner" 
            currentPage={currentPage}
            className={className}
          />
        );
      case 'sidebar':
        return (
          <AffiliateNetworkBanner 
            placementType="sidebar" 
            currentPage={currentPage}
            className={className}
            maxLinks={1}
          />
        );
      case 'inline':
        return (
          <AffiliateNetworkBanner 
            placementType="inline" 
            currentPage={currentPage}
            className={className}
            maxLinks={3}
          />
        );
      default:
        return null;
    }
  };

  const renderAdSenseContent = () => {
    switch (placement) {
      case 'banner':
        return <AdBanner slot={adSenseSlot} format="auto" className={className} />;
      case 'sidebar':
        return <AdSidebar slot={adSenseSlot} className={className} />;
      case 'in-feed':
        return <AdInFeed slot={adSenseSlot} className={className} />;
      default:
        return <AdBanner slot={adSenseSlot} format="auto" className={className} />;
    }
  };

  if (spaceType === 'affiliate-only') {
    return (
      <div className="affiliate-space">
        {renderAffiliateContent()}
        {showDisclosure && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This contains affiliate links. We may earn a commission at no extra cost to you.
          </p>
        )}
      </div>
    );
  }

  if (spaceType === 'adsense-only') {
    return renderAdSenseContent();
  }

  // Mixed content - show both with proper spacing
  return (
    <div className="mixed-ad-space space-y-6">
      {renderAffiliateContent()}
      {renderAdSenseContent()}
      {showDisclosure && (
        <p className="text-xs text-muted-foreground text-center">
          This page contains affiliate links and advertisements.
        </p>
      )}
    </div>
  );
};

export default AffiliateSpaceManager;