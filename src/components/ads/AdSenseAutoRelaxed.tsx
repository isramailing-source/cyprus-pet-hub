import React, { useEffect, useRef } from 'react';

interface AdSenseAutoRelaxedProps {
  className?: string;
}

const AdSenseAutoRelaxed: React.FC<AdSenseAutoRelaxedProps> = ({ className = '' }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize AdSense ad when component mounts
    if (adRef.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    }
  }, []);

  return (
    <div ref={adRef} className={`adsense-autorelaxed my-8 ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-4659190065021043"
        data-ad-slot="2532756694"
      />
    </div>
  );
};

export default AdSenseAutoRelaxed;