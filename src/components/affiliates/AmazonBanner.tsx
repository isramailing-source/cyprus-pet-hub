interface AmazonBannerProps {
  linkId: string;
  width?: number;
  height?: number;
  className?: string;
}

const AmazonBanner = ({ 
  linkId, 
  width = 300, 
  height = 250, 
  className = "" 
}: AmazonBannerProps) => {
  return (
    <div className={`amazon-affiliate-banner ${className}`}>
      <div className="text-xs text-muted-foreground mb-2 text-center">
        Sponsored
      </div>
      <iframe 
        src={`//rcm-na.amazon-adsystem.com/e/cm?o=1&p=12&l=ez&f=ifr&linkID=${linkId}&t=cypruspets20-20&tracking_id=cypruspets20-20`}
        width={width}
        height={height}
        scrolling="no"
        style={{ border: 'none' }}
        className="w-full max-w-full h-auto rounded-lg shadow-sm"
        title="Amazon Affiliate Banner"
      />
    </div>
  );
};

export default AmazonBanner;