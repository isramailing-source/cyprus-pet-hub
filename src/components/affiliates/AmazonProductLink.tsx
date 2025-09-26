import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AmazonProductLinkProps {
  productId: string;
  productName: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

const AmazonProductLink = ({ 
  productId, 
  productName, 
  className = "",
  variant = 'outline',
  size = 'default'
}: AmazonProductLinkProps) => {
  const amazonUrl = `https://www.amazon.com/dp/${productId}?tag=cypruspets20-20`;

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={`amazon-product-link ${className}`}
    >
      <a 
        href={amazonUrl}
        target="_blank"
        rel="nofollow sponsored"
        className="inline-flex items-center gap-2"
      >
        {productName}
        <ExternalLink className="w-4 h-4" />
      </a>
    </Button>
  );
};

export default AmazonProductLink;