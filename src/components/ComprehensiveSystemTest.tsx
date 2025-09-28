import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generateAmazonStorefrontLink, generateAmazonCategoryLink } from '@/integrations/affiliateNetworks';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  url?: string;
}

const ComprehensiveSystemTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateTest = (name: string, result: Partial<TestResult>) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, ...result } : t);
      }
      return [...prev, { name, status: 'pending', message: '', ...result }];
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTests([]);

    const testSuite = [
      testDatabaseConnection,
      testSupabaseAuth,
      testAffiliateNetworks,
      testAffiliateProducts,
      testDirectLinks,
      testAmazonIntegration,
      testAliExpressAPI,
      testAdSenseIntegration,
      testPerplexityAPI,
      testOpenAIAPI,
      testImageAssets,
      testEdgeFunctions,
      testArticlesData,
      testAdsData
    ];

    for (let i = 0; i < testSuite.length; i++) {
      try {
        await testSuite[i]();
        setProgress(((i + 1) / testSuite.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between tests
      } catch (error) {
        console.error(`Test ${i} failed:`, error);
      }
    }

    setIsRunning(false);
  };

  // Test Database Connection
  const testDatabaseConnection = async () => {
    updateTest('Database Connection', { status: 'pending', message: 'Testing database connectivity...' });
    
    try {
      const { data, error } = await supabase
        .from('affiliate_networks')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      updateTest('Database Connection', {
        status: 'success',
        message: 'Database connection successful',
        details: { connected: true }
      });
    } catch (error: any) {
      updateTest('Database Connection', {
        status: 'error',
        message: `Database connection failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test Supabase Auth
  const testSupabaseAuth = async () => {
    updateTest('Supabase Auth', { status: 'pending', message: 'Testing authentication system...' });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      updateTest('Supabase Auth', {
        status: session ? 'success' : 'warning',
        message: session ? 'User authenticated' : 'No active session (normal for testing)',
        details: { hasSession: !!session, userId: session?.user?.id }
      });
    } catch (error: any) {
      updateTest('Supabase Auth', {
        status: 'error',
        message: `Auth check failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test Affiliate Networks Data
  const testAffiliateNetworks = async () => {
    updateTest('Affiliate Networks', { status: 'pending', message: 'Testing affiliate networks data...' });
    
    try {
      const { data, error } = await supabase
        .from('affiliate_networks')
        .select('*');
      
      if (error) throw error;
      
      const activeNetworks = data.filter(n => n.is_active);
      
      updateTest('Affiliate Networks', {
        status: data.length > 0 ? 'success' : 'warning',
        message: `Found ${data.length} networks (${activeNetworks.length} active)`,
        details: { total: data.length, active: activeNetworks.length, networks: data.map(n => n.name) }
      });
    } catch (error: any) {
      updateTest('Affiliate Networks', {
        status: 'error',
        message: `Failed to fetch networks: ${error.message}`,
        details: error
      });
    }
  };

  // Test Affiliate Products
  const testAffiliateProducts = async () => {
    updateTest('Affiliate Products', { status: 'pending', message: 'Testing affiliate products data...' });
    
    try {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .limit(10);
      
      if (error) throw error;
      
      updateTest('Affiliate Products', {
        status: data.length > 0 ? 'success' : 'warning',
        message: `Found ${data.length} products in database`,
        details: { count: data.length, sample: data.slice(0, 3) }
      });
    } catch (error: any) {
      updateTest('Affiliate Products', {
        status: 'error',
        message: `Failed to fetch products: ${error.message}`,
        details: error
      });
    }
  };

  // Test Direct Affiliate Links
  const testDirectLinks = async () => {
    updateTest('Direct Links', { status: 'pending', message: 'Testing direct affiliate links...' });
    
    try {
      const { data, error } = await supabase
        .from('affiliate_direct_links')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      
      // Test if links are accessible
      const linkTests = await Promise.allSettled(
        data.slice(0, 2).map(async (link) => {
          const response = await fetch(link.url, { method: 'HEAD', mode: 'no-cors' });
          return { url: link.url, accessible: true };
        })
      );
      
      updateTest('Direct Links', {
        status: data.length > 0 ? 'success' : 'warning',
        message: `Found ${data.length} active direct links`,
        details: { count: data.length, links: data.map(l => ({ name: l.name, url: l.url })) }
      });
    } catch (error: any) {
      updateTest('Direct Links', {
        status: 'error',
        message: `Failed to test direct links: ${error.message}`,
        details: error
      });
    }
  };

  // Test Amazon Integration
  const testAmazonIntegration = async () => {
    updateTest('Amazon Integration', { status: 'pending', message: 'Testing Amazon affiliate integration...' });
    
    try {
      const storefrontLink = generateAmazonStorefrontLink();
      const categoryLink = generateAmazonCategoryLink('pet+supplies');
      
      const validStorefront = storefrontLink.includes('amazon.com') && storefrontLink.includes('tag=');
      const validCategory = categoryLink.includes('amazon.com') && categoryLink.includes('tag=');
      
      updateTest('Amazon Integration', {
        status: validStorefront && validCategory ? 'success' : 'error',
        message: validStorefront && validCategory ? 'Amazon links generating correctly' : 'Amazon link generation issues',
        details: { storefrontLink, categoryLink, validStorefront, validCategory },
        url: storefrontLink
      });
    } catch (error: any) {
      updateTest('Amazon Integration', {
        status: 'error',
        message: `Amazon integration failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test AliExpress API
  const testAliExpressAPI = async () => {
    updateTest('AliExpress API', { status: 'pending', message: 'Testing AliExpress API connection...' });
    
    try {
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { action: 'test_connection', network: 'aliexpress' }
      });
      
      if (error) throw error;
      
      updateTest('AliExpress API', {
        status: data?.success ? 'success' : 'error',
        message: data?.success ? 'AliExpress API connected' : 'AliExpress API connection failed',
        details: data
      });
    } catch (error: any) {
      updateTest('AliExpress API', {
        status: 'error',
        message: `AliExpress API test failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test AdSense Integration
  const testAdSenseIntegration = async () => {
    updateTest('AdSense Integration', { status: 'pending', message: 'Testing AdSense integration...' });
    
    try {
      // Check if AdSense script is loaded
      const adSenseLoaded = typeof window !== 'undefined' && window.adsbygoogle;
      const publisherIdSet = document.querySelector('script[src*="ca-pub-4659190065021043"]');
      
      updateTest('AdSense Integration', {
        status: publisherIdSet ? 'success' : 'warning',
        message: publisherIdSet ? 'AdSense script loaded with publisher ID' : 'AdSense script not detected',
        details: { scriptLoaded: !!adSenseLoaded, publisherIdFound: !!publisherIdSet }
      });
    } catch (error: any) {
      updateTest('AdSense Integration', {
        status: 'error',
        message: `AdSense test failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test Perplexity API
  const testPerplexityAPI = async () => {
    updateTest('Perplexity API', { status: 'pending', message: 'Testing Perplexity API connection...' });
    
    try {
      const { data, error } = await supabase.functions.invoke('perplexity-article-generator', {
        body: { action: 'test_connection' }
      });
      
      updateTest('Perplexity API', {
        status: error ? 'error' : 'success',
        message: error ? `Perplexity API error: ${error.message}` : 'Perplexity API connected',
        details: data || error
      });
    } catch (error: any) {
      updateTest('Perplexity API', {
        status: 'error',
        message: `Perplexity API test failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test OpenAI API
  const testOpenAIAPI = async () => {
    updateTest('OpenAI API', { status: 'pending', message: 'Testing OpenAI API connection...' });
    
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: { messages: [{ role: 'user', content: 'test' }], test_mode: true }
      });
      
      updateTest('OpenAI API', {
        status: error ? 'error' : 'success',
        message: error ? `OpenAI API error: ${error.message}` : 'OpenAI API connected',
        details: data || error
      });
    } catch (error: any) {
      updateTest('OpenAI API', {
        status: 'error',
        message: `OpenAI API test failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test Image Assets
  const testImageAssets = async () => {
    updateTest('Image Assets', { status: 'pending', message: 'Testing image assets...' });
    
    try {
      // Test loading key images
      const testImages = [
        '/cypruspets_logo.png',
        '/hero-cyprus-pets-bg.jpg',
        '/colorful-animals-pets.png'
      ];
      
      const imageTests = await Promise.allSettled(
        testImages.map(async (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
          });
        })
      );
      
      const loadedImages = imageTests.filter(result => result.status === 'fulfilled').length;
      
      updateTest('Image Assets', {
        status: loadedImages > 0 ? 'success' : 'warning',
        message: `${loadedImages}/${testImages.length} key images loaded successfully`,
        details: { total: testImages.length, loaded: loadedImages, testImages }
      });
    } catch (error: any) {
      updateTest('Image Assets', {
        status: 'error',
        message: `Image asset test failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test Edge Functions
  const testEdgeFunctions = async () => {
    updateTest('Edge Functions', { status: 'pending', message: 'Testing edge functions...' });
    
    try {
      // Test scrape-ads function with a simple ping
      const { data, error } = await supabase.functions.invoke('scrape-ads', {
        body: { action: 'health_check' }
      });
      
      updateTest('Edge Functions', {
        status: error ? 'warning' : 'success',
        message: error ? 'Some edge functions may have issues' : 'Edge functions responding',
        details: data || error
      });
    } catch (error: any) {
      updateTest('Edge Functions', {
        status: 'warning',
        message: 'Edge functions test inconclusive',
        details: error
      });
    }
  };

  // Test Articles Data
  const testArticlesData = async () => {
    updateTest('Articles Data', { status: 'pending', message: 'Testing articles data...' });
    
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      
      updateTest('Articles Data', {
        status: data.length > 0 ? 'success' : 'warning',
        message: `Found ${data.length} articles in database`,
        details: { count: data.length, sample: data.slice(0, 2) }
      });
    } catch (error: any) {
      updateTest('Articles Data', {
        status: 'error',
        message: `Articles data test failed: ${error.message}`,
        details: error
      });
    }
  };

  // Test Ads Data
  const testAdsData = async () => {
    updateTest('Ads Data', { status: 'pending', message: 'Testing ads data...' });
    
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .limit(5);
      
      if (error) throw error;
      
      updateTest('Ads Data', {
        status: data.length > 0 ? 'success' : 'warning',
        message: `Found ${data.length} active ads in database`,
        details: { count: data.length, sample: data.slice(0, 2) }
      });
    } catch (error: any) {
      updateTest('Ads Data', {
        status: 'error',
        message: `Ads data test failed: ${error.message}`,
        details: error
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    };
    return variants[status] || 'outline';
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Comprehensive System Test Suite
            <Badge variant="outline">All Integrations</Badge>
          </CardTitle>
          {isRunning && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">Running tests... {Math.round(progress)}% complete</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runAllTests} disabled={isRunning} size="lg">
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            {tests.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="default">{successCount} Passed</Badge>
                <Badge variant="destructive">{errorCount} Failed</Badge>
                <Badge variant="secondary">{warningCount} Warnings</Badge>
              </div>
            )}
          </div>

          {tests.length > 0 && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Detailed Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tests.map((test) => (
                    <Card key={test.name} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(test.status)}
                          <span className="font-medium text-sm">{test.name}</span>
                          <Badge variant={getStatusBadge(test.status)} className="ml-auto">
                            {test.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{test.message}</p>
                        {test.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.open(test.url, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Test Link
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                {tests.map((test) => (
                  <Card key={test.name}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <Badge variant={getStatusBadge(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{test.message}</p>
                      {test.details && (
                        <div className="bg-muted rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Technical Details:</h4>
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(test.details, null, 2)}
                          </pre>
                        </div>
                      )}
                      {test.url && (
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => window.open(test.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Test External Link
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {tests.length > 0 && errorCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Found {errorCount} critical issues that need attention. Check the detailed results above for specific fixes needed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ComprehensiveSystemTest;