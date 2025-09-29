import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function TestZooplusSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('Syncing Zooplus DE products...');
      
      // Sync products from Zooplus DE via Admitad affiliate link
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { 
          action: 'sync_products',
          network: 'zooplus_de',
          categories: ['hund', 'katze'],
          limit: 10,
          update_existing: true
        }
      });

      if (error) {
        console.error('Zooplus sync error:', error);
        toast.error('Failed to sync Zooplus products: ' + error.message);
        setResult({ error: error.message });
      } else {
        console.log('Zooplus sync result:', data);
        setResult(data);
        toast.success('Zooplus DE products synced successfully! Check the shop page.');
      }
    } catch (error: any) {
      console.error('Sync error:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      toast.error('Failed to sync Zooplus products: ' + errorMessage);
      setResult({ error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Zooplus DE Sync</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>This will fetch the top 10 products from Zooplus.de using the Admitad affiliate link:</p>
          <p className="font-mono text-xs mt-2">https://ad.admitad.com/g/ut3qm7csve475461c4adce6fe7ba63/</p>
        </div>
        
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing Zooplus Products...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Top 10 Zooplus DE Products
            </>
          )}
        </Button>
        
        {result && (
          <div className="text-sm bg-muted p-3 rounded">
            <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}