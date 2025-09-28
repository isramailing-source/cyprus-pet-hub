import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AffiliateDisclosureProps {
  className?: string;
  variant?: 'inline' | 'full' | 'collapsible';
  showInFooter?: boolean;
}

const AffiliateDisclosure = ({ 
  className = "", 
  variant = 'inline',
  showInFooter = false 
}: AffiliateDisclosureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const shortText = "Cyprus Pets earns from qualifying purchases through affiliate partnerships.";
  const fullText = "Cyprus Pets is a participant in various affiliate advertising programs, including Amazon Services LLC Associates Program, designed to provide a means for sites to earn advertising fees by advertising and linking to partner merchants. We may receive compensation when you click on links to products and services.";
  
  if (variant === 'collapsible' || showInFooter) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={`${className} ${showInFooter ? 'mt-8' : ''}`}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between p-2 text-xs text-muted-foreground hover:bg-muted/30"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              <span>Affiliate Disclosure</span>
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-2 pb-2">
          <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-md mt-2">
            {fullText}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
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
