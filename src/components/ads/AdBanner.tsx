import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner = ({ slot, format = 'auto', responsive = true, className = '' }: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Wait for AdSense script to load before pushing ads
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
          // Only push if this ad hasn't been initialized yet
          const adIns = adRef.current.querySelector('.adsbygoogle') as HTMLElement;
          if (adIns && !adIns.dataset.adsbygoogleStatus) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          }
        }
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // For development/testing - show placeholder when using demo slot IDs
  const isDemoSlot = slot.length < 10 || slot.match(/^[0-9]+$/);
  
  if (isDemoSlot) {
    return (
      <div className={`ad-container ${className}`} ref={adRef}>
        <div style={{ 
          minHeight: '250px', 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '2px dashed #0284c7',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0284c7' }}>
            📢 AdSense Placeholder
          </div>
          <div style={{ fontSize: '14px', color: '#0369a1' }}>
            Replace with real AdSense slot ID: {slot}
          </div>
          <div style={{ fontSize: '12px', color: '#075985' }}>
            Get your slot IDs from Google AdSense dashboard
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4659190065021043"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdBanner;