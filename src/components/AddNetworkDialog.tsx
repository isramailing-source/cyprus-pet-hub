import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Globe, Link, TrendingUp, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NetworkDetection {
  name: string;
  type: string;
  description: string;
  suggestedCommission: number;
  suggestedFrequency: number;
  categories: string[];
  isValid: boolean;
}

interface AddNetworkDialogProps {
  onNetworkAdded: () => void;
}

export default function AddNetworkDialog({ onNetworkAdded }: AddNetworkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [detection, setDetection] = useState<NetworkDetection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCommission, setCustomCommission] = useState('');
  const [customFrequency, setCustomFrequency] = useState('');

  const detectNetwork = async (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setDetection(null);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Client-side URL analysis
      const urlObj = new URL(inputUrl);
      const domain = urlObj.hostname.toLowerCase();
      
      let networkDetection: NetworkDetection;

      if (domain.includes('alibaba.com')) {
        networkDetection = {
          name: 'Alibaba B2B Marketplace',
          type: 'B2B Wholesale',
          description: 'Wholesale pet supplies and bulk orders from manufacturers',
          suggestedCommission: 5,
          suggestedFrequency: 24,
          categories: ['Pet Food', 'Pet Toys', 'Pet Accessories', 'Grooming Supplies'],
          isValid: true
        };
      } else if (domain.includes('amazon.')) {
        networkDetection = {
          name: 'Amazon Associates',
          type: 'Retail Marketplace',
          description: 'Consumer pet products with Amazon affiliate program',
          suggestedCommission: 8,
          suggestedFrequency: 12,
          categories: ['Pet Food', 'Pet Toys', 'Pet Care', 'Pet Supplies'],
          isValid: true
        };
      } else if (domain.includes('chewy.com')) {
        networkDetection = {
          name: 'Chewy Partner Program',
          type: 'Pet Specialist',
          description: 'Specialized pet retailer with comprehensive product range',
          suggestedCommission: 6,
          suggestedFrequency: 24,
          categories: ['Pet Food', 'Pet Medications', 'Pet Toys', 'Pet Care'],
          isValid: true
        };
      } else if (domain.includes('petco.com') || domain.includes('petsmart.com')) {
        networkDetection = {
          name: domain.includes('petco.com') ? 'Petco Affiliate Program' : 'PetSmart Partner Program',
          type: 'Pet Retail Chain',
          description: 'Major pet retail chain with diverse product selection',
          suggestedCommission: 4,
          suggestedFrequency: 24,
          categories: ['Pet Food', 'Pet Supplies', 'Pet Services', 'Pet Care'],
          isValid: true
        };
      } else {
        networkDetection = {
          name: `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} Network`,
          type: 'Generic Affiliate',
          description: 'Custom affiliate network - manual configuration recommended',
          suggestedCommission: 5,
          suggestedFrequency: 24,
          categories: ['Pet Products'],
          isValid: true
        };
      }

      setDetection(networkDetection);
      setCustomName(networkDetection.name);
      setCustomCommission(networkDetection.suggestedCommission.toString());
      setCustomFrequency(networkDetection.suggestedFrequency.toString());
      
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setDetection({
        name: 'Invalid URL',
        type: 'Error',
        description: 'Please enter a valid URL',
        suggestedCommission: 0,
        suggestedFrequency: 24,
        categories: [],
        isValid: false
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    detectNetwork(value);
  };

  const handleAddNetwork = async () => {
    if (!detection?.isValid || !customName.trim()) {
      toast.error('Please provide valid network details');
      return;
    }

    setIsAdding(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
        body: { 
          action: 'add_network',
          url: url,
          name: customName.trim(),
          commission_rate: parseFloat(customCommission) || detection.suggestedCommission,
          update_frequency_hours: parseInt(customFrequency) || detection.suggestedFrequency,
          network_type: detection.type
        }
      });

      if (error) throw error;

      toast.success(`${customName} added successfully! Starting initial sync...`);
      setIsOpen(false);
      onNetworkAdded();
      
      // Reset form
      setUrl('');
      setDetection(null);
      setCustomName('');
      setCustomCommission('');
      setCustomFrequency('');
      
    } catch (error) {
      console.error('Error adding network:', error);
      toast.error('Failed to add affiliate network');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Network
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Add Affiliate Network
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="affiliate-url">Affiliate URL</Label>
            <div className="relative">
              <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="affiliate-url"
                placeholder="Paste your affiliate or product URL here..."
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Paste any affiliate URL (Amazon, Alibaba, Chewy, etc.) to auto-detect network settings
            </p>
          </div>

          {/* Detection Results */}
          {isAnalyzing && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  <span>Analyzing network...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {detection && (
            <Card className={detection.isValid ? 'border-primary' : 'border-destructive'}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="font-semibold">{detection.name}</span>
                    </div>
                    <Badge variant={detection.isValid ? "default" : "destructive"}>
                      {detection.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{detection.description}</p>
                  
                  {detection.isValid && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-3 w-3" />
                        <span>Commission: {detection.suggestedCommission}%</span>
                      </div>
                      <div>
                        <span>Update: Every {detection.suggestedFrequency}h</span>
                      </div>
                    </div>
                  )}
                  
                  {detection.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {detection.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Configuration */}
          {detection?.isValid && (
            <div className="space-y-4">
              <h3 className="font-semibold">Network Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="network-name">Network Name</Label>
                  <Input
                    id="network-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter network name..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                  <Input
                    id="commission-rate"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={customCommission}
                    onChange={(e) => setCustomCommission(e.target.value)}
                    placeholder="5.0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="update-frequency">Update Frequency (hours)</Label>
                  <Input
                    id="update-frequency"
                    type="number"
                    min="1"
                    max="168"
                    value={customFrequency}
                    onChange={(e) => setCustomFrequency(e.target.value)}
                    placeholder="24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddNetwork} 
              disabled={!detection?.isValid || isAdding || !customName.trim()}
              className="flex items-center gap-2"
            >
              {isAdding ? (
                <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isAdding ? 'Adding...' : 'Add Network'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}