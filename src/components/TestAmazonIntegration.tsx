import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Check, AlertCircle } from 'lucide-react';
import { generateAmazonStorefrontLink, generateAmazonCategoryLink } from '@/integrations/affiliateNetworks';

const TestAmazonIntegration: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results: Record<string, boolean> = {};

    try {
      // Test 1: Amazon storefront link generation
      const storefrontLink = generateAmazonStorefrontLink();
      results['storefront_link'] = storefrontLink.includes('amazon.com') && storefrontLink.includes('tag=');

      // Test 2: Category link generation
      const categoryLink = generateAmazonCategoryLink('dog+food');
      results['category_link'] = categoryLink.includes('amazon.com') && categoryLink.includes('tag=');

      // Test 3: Test opening links (without actually opening)
      results['link_format'] = storefrontLink.startsWith('https://') && categoryLink.startsWith('https://');

      setTestResults(results);
    } catch (error) {
      console.error('Amazon integration test failed:', error);
      setTestResults({ error: false });
    } finally {
      setIsLoading(false);
    }
  };

  const testStorefrontLink = () => {
    const link = generateAmazonStorefrontLink();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const testCategoryLink = () => {
    const link = generateAmazonCategoryLink('pet+toys');
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🛍️</span>
          Amazon Integration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Button onClick={runTests} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Run Tests'}
          </Button>
          <Button variant="outline" onClick={testStorefrontLink}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Test Storefront
          </Button>
          <Button variant="outline" onClick={testCategoryLink}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Test Category
          </Button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Test Results:</h4>
            {Object.entries(testResults).map(([test, passed]) => (
              <div key={test} className="flex items-center gap-2">
                {passed ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm">
                  {test.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {passed ? 'Passed' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Generated Links Preview:</h4>
          <div className="text-sm space-y-1">
            <div><strong>Storefront:</strong> {generateAmazonStorefrontLink()}</div>
            <div><strong>Category:</strong> {generateAmazonCategoryLink('pet+supplies')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAmazonIntegration;