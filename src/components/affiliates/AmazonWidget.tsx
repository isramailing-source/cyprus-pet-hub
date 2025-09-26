import { useEffect, useRef } from 'react';

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
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load Amazon widget script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US';
    
    // Set Amazon variables before loading script
    (window as any).amzn_assoc_placement = "adunit0";
    (window as any).amzn_assoc_search_bar = "false";
    (window as any).amzn_assoc_tracking_id = "cypruspets20-20";
    (window as any).amzn_assoc_ad_mode = "search";
    (window as any).amzn_assoc_ad_type = "smart";
    (window as any).amzn_assoc_marketplace = "amazon";
    (window as any).amzn_assoc_region = "US";
    (window as any).amzn_assoc_default_search_phrase = searchPhrase;
    (window as any).amzn_assoc_default_category = category;

    if (widgetRef.current) {
      widgetRef.current.appendChild(script);
    }

    return () => {
      // Cleanup
      if (widgetRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [searchPhrase, category]);

  return (
    <div className={`amazon-widget ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 text-center">
        Recommended Products
      </div>
      <div 
        ref={widgetRef}
        className="rounded-lg border bg-card p-4 shadow-sm"
        style={{ minHeight: '200px' }}
      />
    </div>
  );
};

export default AmazonWidget;