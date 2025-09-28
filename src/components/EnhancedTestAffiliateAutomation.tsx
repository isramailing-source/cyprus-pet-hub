import React, { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, StopCircle, Clock } from 'lucide-react';

interface SyncResult {
  products_synced?: number;
  errors?: string[];
  network?: string;
  status?: 'running' | 'completed' | 'failed' | 'cancelled';
  duration?: number;
}

interface NetworkStatus {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  result?: SyncResult;
  startTime?: number;
}

const EnhancedTestAffiliateAutomation: React.FC = () => {
  const [networks, setNetworks] = useState<Record<string, NetworkStatus>>({
    'Amazon Associates': { name: 'Amazon Associates', status: 'idle' },
    'AliExpress': { name: 'AliExpress', status: 'idle' },
    'Rakuten': { name: 'Rakuten', status: 'idle' },
    'Admitad': { name: 'Admitad', status: 'idle' }
  });
  const [isFullSyncRunning, setIsFullSyncRunning] = useState(false);
  const [fullSyncProgress, setFullSyncProgress] = useState(0);
  const abortControllers = useRef<Record<string, AbortController>>({});

  const updateNetworkStatus = (networkName: string, updates: Partial<NetworkStatus>) => {
    setNetworks(prev => ({
      ...prev,
      [networkName]: { ...prev[networkName], ...updates }
    }));
  };

  const cancelSync = (networkName: string) => {
    const controller = abortControllers.current[networkName];
    if (controller) {
      controller.abort();
      updateNetworkStatus(networkName, { 
        status: 'cancelled',
        progress: 0 
      });
      toast.info(`${networkName} sync cancelled`);
    }
  };

  const testNetworkSync = async (networkName: string, action: string) => {
    const controller = new AbortController();
    abortControllers.current[networkName] = controller;
    
    updateNetworkStatus(networkName, { 
      status: 'running', 
      progress: 0,
      startTime: Date.now()
    });

    try {
      console.log(`Testing ${networkName} sync...`);
      
      // Start progress animation
      const progressInterval = setInterval(() => {
        setNetworks(prev => ({
          ...prev,
          [networkName]: {
            ...prev[networkName],
            progress: Math.min((prev[networkName].progress || 0) + 2, 90)
          }
        }));
      }, 500);

      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action, network: networkName.toLowerCase().replace(' ', '_') }
      });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      const duration = Date.now() - (networks[networkName].startTime || 0);
      const result: SyncResult = {
        ...data,
        network: networkName,
        status: 'completed',
        duration
      };

      updateNetworkStatus(networkName, { 
        status: 'completed',
        progress: 100,
        result
      });

      const productsCount = data?.products_synced || 0;
      toast.success(`${networkName}: ${productsCount} products synced in ${(duration/1000).toFixed(1)}s`);
      
    } catch (error) {
      const duration = Date.now() - (networks[networkName].startTime || 0);
      
      if (controller.signal.aborted) {
        // Already handled in cancelSync
        return;
      }

      console.error(`Error testing ${networkName}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const result: SyncResult = {
        errors: [errorMessage],
        network: networkName,
        status: 'failed',
        duration
      };

      updateNetworkStatus(networkName, { 
        status: 'failed',
        progress: 0,
        result
      });

      toast.error(`${networkName} sync failed: ${errorMessage}`);
    } finally {
      delete abortControllers.current[networkName];
    }
  };

  const testFullSync = async () => {
    setIsFullSyncRunning(true);
    setFullSyncProgress(0);
    
    // Reset all network statuses
    Object.keys(networks).forEach(networkName => {
      updateNetworkStatus(networkName, { 
        status: 'idle', 
        progress: 0,
        result: undefined 
      });
    });

    const controller = new AbortController();
    abortControllers.current['full_sync'] = controller;
    
    try {
      console.log('Testing full affiliate sync...');
      
      // Start progress animation
      const progressInterval = setInterval(() => {
        setFullSyncProgress(prev => Math.min(prev + 1, 90));
      }, 1000);

      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action: 'full_sync' }
      });

      clearInterval(progressInterval);
      setFullSyncProgress(100);

      if (error) {
        throw error;
      }

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
      toast.error(`Full sync failed: ${errorMessage}`);
    } finally {
      setIsFullSyncRunning(false);
      setFullSyncProgress(0);
      delete abortControllers.current['full_sync'];
    }
  };

  const cancelFullSync = () => {
    const controller = abortControllers.current['full_sync'];
    if (controller) {
      controller.abort();
      setIsFullSyncRunning(false);
      setFullSyncProgress(0);
      toast.info('Full sync cancelled');
    }
  };

  const NetworkCard: React.FC<{ networkName: string; networkStatus: NetworkStatus }> = ({ networkName, networkStatus }) => (
    <Card className="relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {networkStatus.status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
            {networkStatus.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {networkStatus.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-600" />}
            {networkStatus.status === 'cancelled' && <StopCircle className="h-4 w-4 text-gray-600" />}
            {networkStatus.status === 'idle' && <Clock className="h-4 w-4 text-gray-400" />}
            {networkName}
          </div>
          {networkStatus.status === 'running' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => cancelSync(networkName)}
              className="h-6 px-2"
            >
              Cancel
            </Button>
          )}
        </CardTitle>
        {networkStatus.status === 'running' && (
          <Progress value={networkStatus.progress || 0} className="mt-2" />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Button
            onClick={() => testNetworkSync(networkName, 'sync_products')}
            disabled={networkStatus.status === 'running' || isFullSyncRunning}
            variant="outline"
            size="sm"
          >
            {networkStatus.status === 'running' ? 'Running...' : 'Test Sync'}
          </Button>
        </div>
        
        {networkStatus.result && (
          <div className="space-y-2">
            {networkStatus.result.products_synced !== undefined && (
              <Badge variant="secondary">
                Products: {networkStatus.result.products_synced}
              </Badge>
            )}
            {networkStatus.result.duration && (
              <Badge variant="outline">
                Duration: {(networkStatus.result.duration / 1000).toFixed(1)}s
              </Badge>
            )}
            {networkStatus.result.errors && networkStatus.result.errors.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">Errors:</p>
                {networkStatus.result.errors.slice(0, 2).map((error, index) => (
                  <p key={index} className="text-xs text-muted-foreground bg-destructive/10 p-2 rounded">
                    {error.substring(0, 100)}{error.length > 100 ? '...' : ''}
                  </p>
                ))}
                {networkStatus.result.errors.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{networkStatus.result.errors.length - 2} more errors
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Affiliate Automation Testing</CardTitle>
        <CardDescription>
          Test automated product importing with timeout controls and real-time progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Sync Controls */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Full Network Sync</h3>
                <p className="text-sm text-muted-foreground">Run all networks in sequence</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={testFullSync}
                  disabled={isFullSyncRunning}
                  size="lg"
                >
                  {isFullSyncRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  {isFullSyncRunning ? 'Running...' : 'Run Full Sync'}
                </Button>
                {isFullSyncRunning && (
                  <Button
                    onClick={cancelFullSync}
                    variant="outline"
                    size="lg"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            {isFullSyncRunning && (
              <div>
                <Progress value={fullSyncProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">Progress: {fullSyncProgress}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Individual Network Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(networks).map(([networkName, networkStatus]) => (
            <NetworkCard key={networkName} networkName={networkName} networkStatus={networkStatus} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTestAffiliateAutomation;