import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdBanner, AdSidebar, AdInFeed } from '@/components/ads';
import { useToast } from '@/hooks/use-toast';

const AdSenseTestComponent = () => {
  const [testSlot, setTestSlot] = useState('1234567890');
  const [adFormat, setAdFormat] = useState<'auto' | 'rectangle' | 'vertical' | 'horizontal'>('auto');
  const [isTestMode, setIsTestMode] = useState(true);
  const { toast } = useToast();

  const handleTestAd = () => {
    if (testSlot.length < 10) {
      toast({
        title: "Invalid Slot ID",
        description: "AdSense slot IDs are typically 10+ characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsTestMode(false);
    toast({
      title: "AdSense Test Started",
      description: `Testing slot: ${testSlot} with format: ${adFormat}`,
    });
  };

  const resetTest = () => {
    setIsTestMode(true);
    setTestSlot('1234567890');
    setAdFormat('auto');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 AdSense Integration Test Suite
            <Badge variant={isTestMode ? "secondary" : "default"}>
              {isTestMode ? "Demo Mode" : "Live Test"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slot">AdSense Slot ID</Label>
              <Input
                id="slot"
                value={testSlot}
                onChange={(e) => setTestSlot(e.target.value)}
                placeholder="Enter your AdSense slot ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="format">Ad Format</Label>
              <Select value={adFormat} onValueChange={(value) => setAdFormat(value as typeof adFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="rectangle">Rectangle</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end space-x-2">
              <Button onClick={handleTestAd} className="flex-1">
                Test Ad
              </Button>
              <Button variant="outline" onClick={resetTest}>
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Banner Ad (Top)</CardTitle>
            </CardHeader>
            <CardContent>
              <AdBanner 
                slot={isTestMode ? 'demo-banner' : testSlot} 
                format={adFormat}
                className="border rounded-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>In-Feed Ad (Content)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sample content paragraph to demonstrate in-feed ad placement...
                </p>
                <AdInFeed 
                  slot={isTestMode ? 'demo-infeed' : testSlot}
                  className="border rounded-lg"
                />
                <p className="text-muted-foreground">
                  More content continues after the ad placement...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sidebar Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <AdSidebar 
                slot={isTestMode ? 'demo-sidebar' : testSlot}
                className="border rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">AdSense Configuration</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✅ Publisher ID configured</li>
                <li>✅ Script loading optimized</li>
                <li>✅ Auto-sizing enabled</li>
                <li>✅ Responsive containers</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Container Optimization</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✅ Proper dimensions set</li>
                <li>✅ Layout containment</li>
                <li>✅ Intersection observer</li>
                <li>✅ Loading states</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSenseTestComponent;