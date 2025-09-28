import React from 'react';
import { ExternalLink, ShoppingBag, Star, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateAmazonStorefrontLink, generateAmazonCategoryLink } from '@/integrations/affiliateNetworks';
import { supabase } from '@/integrations/supabase/client';

interface AmazonStorefrontProps {
  className?: string;
  title?: string;
  showCategories?: boolean;
}

const AmazonStorefront: React.FC<AmazonStorefrontProps> = ({ 
  className = "",
  title = "Our Pet Store on Amazon",
  showCategories = true 
}) => {
  const petCategories = [
    { name: 'Dog Food & Treats', category: 'dog+food+treats', icon: '🐕' },
    { name: 'Cat Food & Treats', category: 'cat+food+treats', icon: '🐱' },
    { name: 'Pet Toys', category: 'pet+toys', icon: '🎾' },
    { name: 'Pet Beds & Furniture', category: 'pet+beds', icon: '🛏️' },
    { name: 'Pet Grooming', category: 'pet+grooming', icon: '✂️' },
    { name: 'Pet Health & Wellness', category: 'pet+health', icon: '💊' },
  ];

  const handleAmazonClick = async (link: string, category?: string) => {
    // Track the click
    try {
      await supabase.from('affiliate_clicks').insert({
        network_id: null, // We'll create a proper network record later
        referrer: window.location.href,
        user_agent: navigator.userAgent,
        click_time: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
    }

    // Open the Amazon link
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <ShoppingBag className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">Curated pet products on Amazon</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Main storefront button */}
          <Button
            onClick={() => handleAmazonClick(generateAmazonStorefrontLink())}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            size="lg"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Visit Our Amazon Store
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          {/* Category links */}
          {showCategories && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Shop by Category</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {petCategories.map((cat) => (
                  <Button
                    key={cat.category}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAmazonClick(generateAmazonCategoryLink(cat.category), cat.category)}
                    className="justify-start text-left h-auto py-2"
                  >
                    <span className="mr-2">{cat.icon}</span>
                    <span className="text-xs">{cat.name}</span>
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>Prime Eligible</span>
            </div>
            <div className="flex items-center gap-1">
              <Gift className="h-3 w-3" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🛡️</span>
              <span>Amazon Guarantee</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmazonStorefront;