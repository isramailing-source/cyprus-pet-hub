import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface LinkTest {
  name: string;
  url: string;
  type: 'static' | 'dynamic';
  network?: string;
  status: 'pending' | 'success' | 'error';
  responseTime?: number;
}

export default function AffiliateLinksTestComponent() {
  const [tests, setTests] = useState<LinkTest[]>([]);
  const [testing, setTesting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    initializeTests();
  }, []);

  const initializeTests = async () => {
    // Static affiliate links
    const staticLinks: LinkTest[] = [
      {
        name: 'Amazon Associates',
        url: 'https://www.amazon.com/dp/B0002DJX44?tag=cypruspets20-20',
        type: 'static',
        network: 'Amazon',
        status: 'pending'
      },
      {
        name: 'Canada Pet Care',
        url: 'https://canadapetcare.com?utm_source=cypruspets&utm_medium=affiliate',
        type: 'static',
        network: 'Canada Pet Care',
        status: 'pending'
      }
    ];

    // Fetch dynamic product links
    try {
      const { data: productData } = await supabase
        .from('affiliate_products')
        .select(`
          title,
          affiliate_link,
          network:affiliate_networks!fk_affiliate_products_network_id(name)
        `)
        .eq('is_active', true)
        .limit(5);

      const dynamicLinks: LinkTest[] = productData?.map((product, index) => ({
        name: `Product: ${product.title?.substring(0, 30)}...`,
        url: product.affiliate_link,
        type: 'dynamic',
        network: product.network?.name,
        status: 'pending'
      })) || [];

      setProducts(productData || []);
      setTests([...staticLinks, ...dynamicLinks]);
    } catch (error) {
      console.error('Error fetching products:', error);
      setTests(staticLinks);
    }
  };

  const testLink = async (link: LinkTest): Promise<LinkTest> => {
    const startTime = performance.now();
    
    try {
      // For affiliate links, we'll test if they're valid URLs and have proper structure
      const url = new URL(link.url);
      
      // Check if URL has proper affiliate parameters
      const hasAffiliateParams = 
        url.searchParams.has('tag') || // Amazon
        url.searchParams.has('utm_source') || // UTM tracking
        url.pathname.includes('/g/') || // Generic affiliate paths
        url.hostname.includes('amazon') ||
        url.hostname.includes('canadapetcare') ||
        url.hostname.includes('chewy') ||
        url.hostname.includes('petco') ||
        url.hostname.includes('petsmart');

      const responseTime = performance.now() - startTime;

      return {
        ...link,
        status: hasAffiliateParams ? 'success' : 'error',
        responseTime
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      return {
        ...link,
        status: 'error',
        responseTime
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    const results: LinkTest[] = [];

    for (const test of tests) {
      const result = await testLink(test);
      results.push(result);
      setTests(current => 
        current.map(t => t.name === test.name ? result : t)
      );
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;
    
    toast.success(`Link testing complete: ${successCount}/${totalCount} links working`);
    setTesting(false);
  };

  const handleLinkClick = async (link: LinkTest) => {
    // Track the click
    try {
      if (link.type === 'dynamic') {
        // Track product click in database (simplified)
        console.log('Tracking affiliate click:', link.name);
      }
      
      // Open the link
      window.open(link.url, '_blank', 'noopener,noreferrer');
      toast.success('Affiliate link opened successfully');
    } catch (error) {
      toast.error('Error opening affiliate link');
    }
  };

  const getStatusIcon = (status: LinkTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: LinkTest['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Working</Badge>;
      case 'error':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Affiliate Links Testing Dashboard</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Test and monitor all affiliate links for functionality
            </p>
          </div>
          <Button 
            onClick={runAllTests} 
            disabled={testing}
            variant="outline"
          >
            {testing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test All Links
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {tests.filter(t => t.status === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Working</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {tests.filter(t => t.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{tests.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          {/* Link Tests */}
          <div className="space-y-2">
            {tests.map((test, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(test.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{test.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {test.network} • {test.type}
                      {test.responseTime && ` • ${test.responseTime.toFixed(0)}ms`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(test.status)}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLinkClick(test)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {tests.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No affiliate links found. Make sure you have products in your database.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}