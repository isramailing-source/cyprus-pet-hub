import React, { useEffect, useRef } from 'react';

interface AdSenseFluidProps {
  className?: string;
}

const AdSenseFluid: React.FC<AdSenseFluidProps> = ({ className = '' }) => {
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
    <div ref={adRef} className={`adsense-fluid my-8 ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
        data-ad-client="ca-pub-4659190065021043"
        data-ad-slot="3390542793"
      />
    </div>
  );
};

export default AdSenseFluid;