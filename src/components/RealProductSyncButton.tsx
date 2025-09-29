import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

const RealProductSyncButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const syncRealProducts = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('Syncing real affiliate products...');
      
      // First, try AliExpress sync
      const { data: aliData, error: aliError } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { 
          action: 'sync_products',
          network: 'aliexpress',
          categories: ['pet supplies', 'dog supplies', 'cat supplies', 'pet toys', 'pet food', 'pet care'],
          limit: 50
        }
      });
      
      if (aliError) {
        console.error('AliExpress sync error:', aliError);
      } else {
        console.log('AliExpress sync result:', aliData);
      }
      
      // Update result with sync information
      setResult({
        aliexpress: aliData || { error: aliError?.message },
        message: 'Product sync completed. Check the shop page to see new products.'
      });
      
      toast.success('Real product sync completed! Check the shop page for new products.');
    } catch (error: any) {
      console.error('Product sync error:', error);
      setResult({ error: error.message });
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Sync Real Products
        </CardTitle>
        <CardDescription>
          Replace demo products with real affiliate products from AliExpress and other networks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={syncRealProducts}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Syncing Products...' : 'Sync Real Products Now'}
        </Button>
        
        {result && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Sync Results:</h4>
            <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-60">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p><strong>What this does:</strong></p>
          <ul className="list-disc ml-4 mt-1">
            <li>Fetches real pet products from AliExpress API</li>
            <li>Updates database with current prices and availability</li>
            <li>Generates proper affiliate links with your tracking IDs</li>
            <li>Replaces demo/fake products with real inventory</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealProductSyncButton;