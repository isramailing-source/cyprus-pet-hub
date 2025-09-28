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
    className: `adsense-sidebar sticky top-4 ${className}`,
    minWidth: 160,
    maxWidth: 300,
    minHeight: 250,
    maxHeight: 600
  });

  return renderAd();
};

export default AdSidebar;