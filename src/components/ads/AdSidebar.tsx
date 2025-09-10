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
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

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