import { useAdSense } from '@/hooks/useAdSense';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

const AdBanner = ({ slot, format = 'auto', responsive = true, className = '' }: AdBannerProps) => {
  const { renderAd } = useAdSense({
    slot,
    format,
    responsive,
    className: `adsense-banner ${className}`,
    minWidth: 300,
    maxWidth: 970,
    minHeight: 90,
    maxHeight: 280
  });

  return renderAd();
};

export default AdBanner;