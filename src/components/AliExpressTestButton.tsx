import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AliExpressTestButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAliExpressAPI = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing AliExpress API with corrected signature...');
      
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { 
          action: 'search_products',
          keywords: 'pet supplies',
          options: {
            pageSize: 5
          }
        }
      });

      if (error) {
        toast.error(`Error: ${error.message}`);
        setResult({ error: error.message });
      } else {
        toast.success('AliExpress API test completed!');
        setResult(data);
      }
    } catch (error) {
      console.error('AliExpress API test error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Test failed: ${errorMessage}`);
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 AliExpress API Test (Fixed)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testAliExpressAPI} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing API...' : 'Test AliExpress API'}
        </Button>

        {result && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Test Results:</h3>
            <Card>
              <CardContent className="p-4">
                <pre className="text-sm overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Recent Fixes Applied:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>✅ Fixed timestamp format (now using Asia/Shanghai timezone)</li>
            <li>✅ Corrected signature generation algorithm</li>
            <li>✅ Changed to POST method with correct endpoint</li>
            <li>✅ Fixed parameter concatenation format</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}