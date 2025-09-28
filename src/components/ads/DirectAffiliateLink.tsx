import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface DirectAffiliateLinkProps {
  id: string;
  name: string;
  url: string;
  description?: string;
  networkName?: string;
  className?: string;
  variant?: 'button' | 'banner' | 'text';
}

export const DirectAffiliateLink: React.FC<DirectAffiliateLinkProps> = ({
  id,
  name,
  url,
  description,
  networkName,
  className = '',
  variant = 'button'
}) => {
  const handleClick = async () => {
    try {
      // First get current click count, then increment
      const { data, error: fetchError } = await supabase
        .from('affiliate_direct_links')
        .select('click_count')
        .eq('id', id)
        .single();
      
      if (!fetchError && data) {
        // Update with incremented count
        await supabase
          .from('affiliate_direct_links')
          .update({ 
            click_count: (data.click_count || 0) + 1
          })
          .eq('id', id);
      }
      
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      // Still open the link even if tracking fails
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105 ${className}`} onClick={handleClick}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            {description && <p className="text-blue-100 text-sm mb-2">{description}</p>}
            {networkName && <span className="text-xs bg-white/20 px-2 py-1 rounded">{networkName}</span>}
          </div>
          <ExternalLink className="w-6 h-6" />
        </div>
        <div className="mt-4 text-right">
          <span className="text-sm bg-white/10 px-3 py-1 rounded-full">Shop Now →</span>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <a 
        href={url}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className={`inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors ${className}`}
        onClick={handleClick}
      >
        {name}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  return (
    <Button 
      onClick={handleClick}
      variant="outline" 
      className={`group ${className}`}
    >
      <span>{name}</span>
      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </Button>
  );
};

export default DirectAffiliateLink;