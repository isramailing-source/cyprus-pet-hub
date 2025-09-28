import { useAdSense } from '@/hooks/useAdSense';

interface AdInFeedProps {
  slot: string;
  className?: string;
}

const AdInFeed = ({ slot, className = '' }: AdInFeedProps) => {
  const { renderAd } = useAdSense({
    slot,
    format: 'fluid',
    layoutKey: '-gw+3+1f-3t+ap',
    className: `my-8 ${className}`
  });

  return renderAd();
};

export default AdInFeed;