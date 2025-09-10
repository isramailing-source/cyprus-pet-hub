import { useEffect, useRef } from 'react';

interface AdSidebarProps {
  slot: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSidebar = ({ slot, className = '' }: AdSidebarProps) => {
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
      <div className={`ad-container sticky top-4 ${className}`} ref={adRef}>
        <div style={{ 
          minHeight: '300px', 
          width: '250px',
          background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
          border: '2px dashed #9333ea',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#9333ea' }}>
            📊 Sidebar Ad
          </div>
          <div style={{ fontSize: '14px', color: '#7c3aed' }}>
            Vertical ad: {slot}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container sticky top-4 ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4659190065021043"
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSidebar;