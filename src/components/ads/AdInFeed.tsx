import { useAdSense } from '@/hooks/useAdSense';

interface AdInFeedProps {
  slot: string;
  className?: string;
}

const AdInFeed = ({ slot, className = '' }: AdInFeedProps) => {
  const { renderAd } = useAdSense({
    slot,
    format: 'autorelaxed',
    layoutKey: '-gw+3+1f-3t+ap',
    className: `adsense-infeed my-8 ${className}`,
    minHeight: 150,
    maxHeight: 400
  });

  return renderAd();
};

export default AdInFeed;