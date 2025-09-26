import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, RefreshCw, TrendingUp, ShoppingBag, FileText, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface AffiliateStats {
  totalProducts: number;
  totalContent: number;
  totalRevenue: number;
  lastSync: string | null;
}

interface AffiliateNetwork {
  id: string;
  name: string;
  affiliate_id: string;
  commission_rate: number;
  is_active: boolean;
  update_frequency_hours: number;
  created_at: string;
}

interface AffiliateProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  rating: number;
  is_featured: boolean;
  last_price_check: string;
  network: { name: string };
}

export default function AffiliateManager() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AffiliateStats>({
    totalProducts: 0,
    totalContent: 0,
    totalRevenue: 0,
    lastSync: null
  });
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch affiliate networks
      const { data: networksData, error: networksError } = await supabase
        .from('affiliate_networks')
        .select('*')
        .order('created_at', { ascending: false });

      if (networksError) throw networksError;
      setNetworks(networksData || []);

      // Fetch affiliate products with network info
      const { data: productsData, error: productsError } = await supabase
        .from('affiliate_products')
        .select(`
          *,
          network:affiliate_networks(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch stats
      const { data: contentStats } = await supabase
        .from('affiliate_content')
        .select('id, revenue')
        .eq('is_published', true);

      const { data: lastSyncData } = await supabase
        .from('automation_logs')
        .select('last_run')
        .eq('task_type', 'affiliate_sync')
        .order('last_run', { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalProducts: productsData?.length || 0,
        totalContent: contentStats?.length || 0,
        totalRevenue: contentStats?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0,
        lastSync: lastSyncData?.last_run || null
      });

    } catch (error) {
      console.error('Error fetching affiliate data:', error);
      toast.error('Failed to load affiliate data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      setSyncProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action: 'full_sync' }
      });

      clearInterval(progressInterval);
      setSyncProgress(100);

      if (error) throw error;

      toast.success('Affiliate content sync completed successfully');
      
      // Refresh data
      await fetchData();

    } catch (error) {
      console.error('Error syncing affiliate content:', error);
      toast.error('Failed to sync affiliate content');
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const toggleNetworkStatus = async (networkId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('affiliate_networks')
        .update({ is_active: isActive })
        .eq('id', networkId);

      if (error) throw error;

      toast.success(`Network ${isActive ? 'activated' : 'deactivated'} successfully`);
      await fetchData();

    } catch (error) {
      console.error('Error updating network status:', error);
      toast.error('Failed to update network status');
    }
  };

  const toggleProductFeatured = async (productId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('affiliate_products')
        .update({ is_featured: isFeatured })
        .eq('id', productId);

      if (error) throw error;

      toast.success(`Product ${isFeatured ? 'featured' : 'unfeatured'} successfully`);
      await fetchData();

    } catch (error) {
      console.error('Error updating product featured status:', error);
      toast.error('Failed to update product status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Generated Content</p>
                <p className="text-2xl font-bold">{stats.totalContent}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">€{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Sync</p>
                <p className="text-sm font-medium">
                  {stats.lastSync ? new Date(stats.lastSync).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Affiliate Content Sync</CardTitle>
            <Button 
              onClick={handleManualSync} 
              disabled={isSyncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Syncing affiliate content...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Next Scheduled Sync</p>
              <p className="font-semibold">Every 12 hours</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Active Networks</p>
              <p className="font-semibold">{networks.filter(n => n.is_active).length}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Auto Generation</p>
              <p className="font-semibold">Enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="networks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="networks">Affiliate Networks</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="content">Generated Content</TabsTrigger>
        </TabsList>

        <TabsContent value="networks">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Networks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networks.map((network) => (
                  <div key={network.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{network.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Commission: {network.commission_rate}% • 
                        Update Frequency: {network.update_frequency_hours}h
                      </p>
                      {network.affiliate_id && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {network.affiliate_id}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={network.is_active ? "default" : "secondary"}>
                        {network.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Switch
                        checked={network.is_active}
                        onCheckedChange={(checked) => toggleNetworkStatus(network.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.currency}{product.price} • {product.category} • 
                        Rating: {product.rating}/5 • {product.network?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {new Date(product.last_price_check).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.is_featured ? "default" : "secondary"}>
                        {product.is_featured ? "Featured" : "Regular"}
                      </Badge>
                      <Switch
                        checked={product.is_featured}
                        onCheckedChange={(checked) => toggleProductFeatured(product.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Content management interface coming soon...</p>
                <p className="text-sm mt-2">Generated content will be displayed and manageable here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}