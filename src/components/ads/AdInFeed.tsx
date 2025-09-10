import { useEffect, useRef } from 'react';

interface AdInFeedProps {
  slot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdInFeed = ({ slot, className = '' }: AdInFeedProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
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

  const isDemoSlot = slot.length < 10 || slot.match(/^[0-9]+$/);
  
  if (isDemoSlot) {
    return (
      <div className={`ad-container my-8 ${className}`} ref={adRef}>
        <div style={{ 
          minHeight: '200px', 
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          border: '2px dashed #d97706',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#d97706' }}>
            📱 In-Feed Ad Placeholder
          </div>
          <div style={{ fontSize: '14px', color: '#b45309' }}>
            Native ads will appear here: {slot}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container my-8 ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-gw+3+1f-3t+ap"
        data-ad-client="ca-pub-4659190065021043"
        data-ad-slot={slot}
      />
    </div>
  );
};

export default AdInFeed;