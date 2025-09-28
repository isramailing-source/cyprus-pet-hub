import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import DirectAffiliateLink from './DirectAffiliateLink';
import { Card } from '@/components/ui/card';

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  description: string;
  network_name: string;
  placement_type: string;
}

interface AffiliateNetworkBannerProps {
  placementType?: 'banner' | 'sidebar' | 'inline';
  currentPage?: string;
  className?: string;
  maxLinks?: number;
}

export const AffiliateNetworkBanner: React.FC<AffiliateNetworkBannerProps> = ({
  placementType = 'banner',
  currentPage = 'all',
  className = '',
  maxLinks = 2
}) => {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAffiliateLinks = async () => {
      try {
        const { data, error } = await supabase
          .from('affiliate_direct_links')
          .select('*')
          .eq('is_active', true)
          .eq('placement_type', placementType)
          .order('display_order')
          .limit(maxLinks);

        if (error) {
          console.error('Error fetching affiliate links:', error);
          return;
        }

        // Filter by target pages
        const filteredLinks = data.filter(link => 
          link.target_pages.includes('all') || 
          link.target_pages.includes(currentPage)
        );

        setAffiliateLinks(filteredLinks);
      } catch (error) {
        console.error('Error loading affiliate links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateLinks();
  }, [placementType, currentPage, maxLinks]);

  if (loading || affiliateLinks.length === 0) {
    return null;
  }

  if (placementType === 'sidebar') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-center mb-4">Recommended Partners</h3>
        {affiliateLinks.map((link) => (
          <Card key={link.id} className="p-4">
            <DirectAffiliateLink
              id={link.id}
              name={link.name}
              url={link.url}
              description={link.description}
              networkName={link.network_name}
              variant="banner"
              className="border-0 bg-gradient-to-br from-green-500 to-teal-600"
            />
          </Card>
        ))}
      </div>
    );
  }

  if (placementType === 'inline') {
    return (
      <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
        {affiliateLinks.map((link) => (
          <DirectAffiliateLink
            key={link.id}
            id={link.id}
            name={link.name}
            url={link.url}
            description={link.description}
            networkName={link.network_name}
            variant="button"
            className="flex-shrink-0"
          />
        ))}
      </div>
    );
  }

  // Default banner style
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {affiliateLinks.map((link) => (
        <DirectAffiliateLink
          key={link.id}
          id={link.id}
          name={link.name}
          url={link.url}
          description={link.description}
          networkName={link.network_name}
          variant="banner"
        />
      ))}
    </div>
  );
};

export default AffiliateNetworkBanner;