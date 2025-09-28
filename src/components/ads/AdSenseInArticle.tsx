import React, { useEffect, useRef } from 'react';

interface AdSenseInArticleProps {
  className?: string;
}

const AdSenseInArticle: React.FC<AdSenseInArticleProps> = ({ className = '' }) => {
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
    <div ref={adRef} className={`adsense-in-article my-8 ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-4659190065021043"
        data-ad-slot="8270322620"
      />
    </div>
  );
};

export default AdSenseInArticle;