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
    className
  });

  return renderAd();
};

export default AdBanner;