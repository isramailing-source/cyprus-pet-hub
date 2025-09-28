import { useAdSense } from '@/hooks/useAdSense';

interface AdSidebarProps {
  slot: string;
  className?: string;
}

const AdSidebar = ({ slot, className = '' }: AdSidebarProps) => {
  const { renderAd } = useAdSense({
    slot,
    format: 'vertical',
    responsive: true,
    className: `sticky top-4 ${className}`
  });

  return renderAd();
};

export default AdSidebar;