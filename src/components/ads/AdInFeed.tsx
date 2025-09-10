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
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

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