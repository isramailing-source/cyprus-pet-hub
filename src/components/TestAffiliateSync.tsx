import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function TestAffiliateSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action: 'sync_products' }
      });

      if (error) {
        console.error('Sync error:', error);
        toast.error('Failed to sync products: ' + error.message);
      } else {
        console.log('Sync result:', data);
        setResult(data);
        toast.success('Products synced successfully!');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Real Amazon Product Sync</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Syncing Real Products...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Real Amazon Products
            </>
          )}
        </Button>
        
        {result && (
          <div className="text-sm bg-muted p-3 rounded">
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}