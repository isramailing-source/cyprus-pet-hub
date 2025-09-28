import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface ImageTest {
  src: string;
  name: string;
  status: 'loading' | 'success' | 'error';
}

const ImageFallbackTest: React.FC = () => {
  const [imageTests, setImageTests] = useState<ImageTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testImages = [
    { src: '/cypruspets_logo.png', name: 'Cyprus Pets Logo' },
    { src: '/hero-cyprus-pets-bg.jpg', name: 'Hero Background' },
    { src: '/colorful-animals-pets.png', name: 'Colorful Animals' },
    { src: '/friendly-nature-background.png', name: 'Nature Background' },
    { src: '/src/assets/hero-pets-cyprus.jpg', name: 'Hero Pets Cyprus' },
    { src: '/src/assets/golden-retriever-cyprus.jpg', name: 'Golden Retriever' },
    { src: '/src/assets/british-shorthair-cyprus.jpg', name: 'British Shorthair' },
    { src: '/nonexistent-image.jpg', name: 'Non-existent (should fail)' }
  ];

  const runImageTests = () => {
    setIsRunning(true);
    const tests: ImageTest[] = testImages.map(img => ({
      ...img,
      status: 'loading'
    }));
    setImageTests(tests);

    tests.forEach((test, index) => {
      const img = new Image();
      img.onload = () => {
        setImageTests(prev => prev.map((t, i) => 
          i === index ? { ...t, status: 'success' } : t
        ));
      };
      img.onerror = () => {
        setImageTests(prev => prev.map((t, i) => 
          i === index ? { ...t, status: 'error' } : t
        ));
      };
      img.src = test.src;
    });

    setTimeout(() => setIsRunning(false), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✓ Loaded</Badge>;
      case 'error':
        return <Badge variant="destructive">✗ Failed</Badge>;
      default:
        return <Badge variant="outline">⏳ Loading</Badge>;
    }
  };

  const successCount = imageTests.filter(t => t.status === 'success').length;
  const errorCount = imageTests.filter(t => t.status === 'error').length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🖼️ Image Assets Test
          {imageTests.length > 0 && (
            <div className="flex gap-2 ml-auto">
              <Badge variant="default">{successCount} ✓</Badge>
              <Badge variant="destructive">{errorCount} ✗</Badge>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runImageTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Testing Images...' : 'Test Image Loading'}
        </Button>

        {imageTests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageTests.map((test, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                {getStatusIcon(test.status)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{test.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{test.src}</div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Image Loading Strategy:</h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>• Images in /public directory: Direct access via URL</p>
            <p>• Images in /src/assets: Must be imported as ES6 modules</p>
            <p>• External images: Should be cached or proxied for performance</p>
            <p>• Missing images: Should have fallback placeholders</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageFallbackTest;