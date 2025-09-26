import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AffiliateDisclosureProps {
  className?: string;
  variant?: 'inline' | 'full';
}

const AffiliateDisclosure = ({ 
  className = "", 
  variant = 'inline' 
}: AffiliateDisclosureProps) => {
  const shortText = "As an Amazon Associate, Cyprus Pets earns from qualifying purchases.";
  const fullText = "Cyprus Pets is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.";
  
  if (variant === 'inline') {
    return (
      <div className={`text-xs text-muted-foreground bg-muted/30 p-2 rounded border ${className}`}>
        <div className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          <span>{shortText}</span>
        </div>
      </div>
    );
  }

  return (
    <Alert className={`${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {fullText}
      </AlertDescription>
    </Alert>
  );
};

export default AffiliateDisclosure;