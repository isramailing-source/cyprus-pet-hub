import React, { useEffect, useRef, useState } from 'react';
import { useAdSense } from '@/hooks/useAdSense';

interface AdSenseAdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

const AdSenseAdUnit: React.FC<AdSenseAdUnitProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}) => {
  const { adRef, renderAd, isDemo } = useAdSense({
    slot,
    format,
    responsive
  });

  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Set up intersection observer for lazy loading
    if (adRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(adRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVisible]);

  return (
    <div className={`adsense-container ${className}`}>
      {isDemo && (
        <div className="text-xs text-muted-foreground mb-2 text-center">
          AdSense Demo - Slot: {slot}
        </div>
      )}
      {renderAd()}
    </div>
  );
};

export default AdSenseAdUnit;