import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface SyncResult {
  products_synced?: number;
  errors?: string[];
  network?: string;
}

const TestAffiliateAutomation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, SyncResult>>({});

  const testNetworkSync = async (networkName: string, action: string) => {
    setIsLoading(true);
    try {
      console.log(`Testing ${networkName} sync...`);
      
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action }
      });

      if (error) {
        throw error;
      }

      setResults(prev => ({
        ...prev,
        [networkName]: {
          ...data,
          network: networkName
        }
      }));

      const productsCount = data?.products_synced || 0;
      toast.success(`${networkName}: ${productsCount} products synced successfully`);
      
    } catch (error) {
      console.error(`Error testing ${networkName}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setResults(prev => ({
        ...prev,
        [networkName]: {
          errors: [errorMessage],
          network: networkName
        }
      }));

      toast.error(`${networkName} sync failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullSync = async () => {
    setIsLoading(true);
    setResults({});
    
    try {
      console.log('Testing full affiliate sync...');
      
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action: 'full_sync' }
      });

      if (error) {
        throw error;
      }

      setResults({
        'Full Sync': {
          products_synced: data?.products_synced || 0,
          errors: data?.errors || [],
          network: 'All Networks'
        }
      });

      const productsCount = data?.products_synced || 0;
      const errorCount = data?.errors?.length || 0;
      
      if (errorCount > 0) {
        toast.error(`Full sync completed with ${errorCount} errors. ${productsCount} products synced.`);
      } else {
        toast.success(`Full sync completed successfully! ${productsCount} products synced.`);
      }
      
    } catch (error) {
      console.error('Error testing full sync:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setResults({
        'Full Sync': {
          errors: [errorMessage],
          network: 'All Networks'
        }
      });

      toast.error(`Full sync failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const ResultCard: React.FC<{ title: string; result: SyncResult }> = ({ title, result }) => (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {result.errors && result.errors.length > 0 ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {title}
        </CardTitle>
        <CardDescription>{result.network}</CardDescription>
      </CardHeader>
      <CardContent>
        {result.products_synced !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">
              Products Synced: {result.products_synced}
            </Badge>
          </div>
        )}
        
        {result.errors && result.errors.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">Errors:</p>
            {result.errors.map((error, index) => (
              <p key={index} className="text-sm text-muted-foreground bg-destructive/10 p-2 rounded">
                {error}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Automation Testing</CardTitle>
        <CardDescription>
          Test automated product importing from all connected affiliate networks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => testNetworkSync('Amazon Associates', 'sync_products')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Test Amazon Sync
          </Button>
          
          <Button
            onClick={() => testNetworkSync('AliExpress', 'sync_products')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Test AliExpress Sync
          </Button>
          
          <Button
            onClick={() => testNetworkSync('Rakuten', 'sync_products')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Test Rakuten Sync
          </Button>
          
          <Button
            onClick={() => testNetworkSync('Admitad', 'sync_products')}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Test Admitad Sync
          </Button>
        </div>

        <Button
          onClick={testFullSync}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Run Full Sync Test
        </Button>

        {Object.entries(results).map(([title, result]) => (
          <ResultCard key={title} title={title} result={result} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TestAffiliateAutomation;