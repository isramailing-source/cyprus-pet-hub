import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function TestAliExpressIntegration() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAliExpressSync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing AliExpress integration...');
      
      // Call the affiliate content manager to sync AliExpress products
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { 
          action: 'sync_products'
        }
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        setResult({ error: error.message });
      } else {
        toast.success('AliExpress sync completed successfully!');
        setResult(data);
      }
    } catch (error) {
      console.error('AliExpress test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Test failed: ${errorMessage}`);
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const checkAliExpressProducts = async () => {
    setLoading(true);
    
    try {
      console.log('Checking AliExpress products in database...');
      
      // Get AliExpress network
      const { data: networks, error: networkError } = await supabase
        .from('affiliate_networks')
        .select('*')
        .eq('name', 'AliExpress')
        .single();

      if (networkError) {
        toast.error(`Network error: ${networkError.message}`);
        setResult({ error: networkError.message });
        return;
      }

      // Get products for AliExpress network
      const { data: products, error: productsError } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('network_id', networks.id)
        .limit(10);

      if (productsError) {
        toast.error(`Products error: ${productsError.message}`);
        setResult({ error: productsError.message });
      } else {
        toast.success(`Found ${products.length} AliExpress products`);
        setResult({ 
          network: networks,
          products: products,
          productCount: products.length 
        });
      }
    } catch (error) {
      console.error('Check products error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Check failed: ${errorMessage}`);
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🛍️ AliExpress API Integration Test
          <Badge variant="outline">Live API</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button 
            onClick={testAliExpressSync} 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Syncing...' : 'Test AliExpress Sync'}
          </Button>
          <Button 
            onClick={checkAliExpressProducts} 
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            {loading ? 'Checking...' : 'Check Products in DB'}
          </Button>
        </div>

        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
            <Card>
              <CardContent className="p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>

            {result.products && result.products.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Sample Products:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.products.slice(0, 6).map((product: any) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium text-sm line-clamp-2">
                            {product.title}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">
                              €{product.price}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {product.category}
                            </Badge>
                          </div>
                          {product.image_url && (
                            <img 
                              src={product.image_url} 
                              alt={product.title}
                              className="w-full h-32 object-cover rounded"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Integration Status:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ API credentials stored securely in Supabase</li>
            <li>✅ AliExpress network configured in database</li>
            <li>✅ Edge function updated with real API integration</li>
            <li>✅ Frontend test component ready</li>
          </ul>
          <p className="mt-2">
            <strong>App Key:</strong> 519798<br/>
            <strong>Tracking ID:</strong> Cyrus-pets
          </p>
        </div>
      </CardContent>
    </Card>
  );
}