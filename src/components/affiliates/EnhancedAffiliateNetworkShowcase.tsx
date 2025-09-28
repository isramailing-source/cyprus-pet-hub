import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Star, TrendingUp, Globe, Package, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface AffiliateNetwork {
  id: string;
  name: string;
  commission_rate: number;
  settings: any; // Use any to handle Json type from database
  is_active: boolean;
}

export default function EnhancedAffiliateNetworkShowcase() {
  const [networks, setNetworks] = useState<AffiliateNetwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_networks')
        .select('*')
        .eq('is_active', true)
        .order('commission_rate', { ascending: false });

      if (error) throw error;
      setNetworks(data || []);
    } catch (error) {
      console.error('Error fetching networks:', error);
      toast.error('Failed to load affiliate networks');
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkClick = async (network: AffiliateNetwork) => {
    try {
      // Track the click
      await supabase
        .from('affiliate_clicks')
        .insert({
          network_id: network.id,
          user_id: null, // Anonymous click
          click_time: new Date().toISOString()
        });

      // Determine the URL to open
      const affiliateUrl = network.settings.affiliate_url || network.settings.base_url;
      if (affiliateUrl) {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
        toast.success(`Redirecting to ${network.name}`);
      } else {
        toast.error('Affiliate link not available');
      }
    } catch (error) {
      console.error('Error tracking click:', error);
      // Still open the link even if tracking fails
      const affiliateUrl = network.settings.affiliate_url || network.settings.base_url;
      if (affiliateUrl) {
        window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const getNetworkIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'amazon associates':
        return '🛒';
      case 'alibaba.com':
        return '🌐';
      case 'chewy':
        return '🐕';
      case 'petsmart':
        return '🏪';
      case 'petco':
        return '🐾';
      default:
        return '🛍️';
    }
  };

  const getNetworkDescription = (network: AffiliateNetwork) => {
    const name = network.name.toLowerCase();
    if (name.includes('amazon')) return "World's largest online marketplace with comprehensive pet supplies";
    if (name.includes('alibaba')) return "Global wholesale marketplace for bulk pet product orders";
    if (name.includes('chewy')) return "America's trusted online pet retailer with auto-ship service";
    if (name.includes('petsmart')) return "Complete pet care solutions with grooming and training services";
    if (name.includes('petco')) return "Premium pet retailer focusing on health and wellness";
    return "Quality pet products and services for Cyprus pet owners";
  };

  const getNetworkSpecialties = (network: AffiliateNetwork) => {
    const name = network.name.toLowerCase();
    if (name.includes('amazon')) return ['Pet Food', 'Toys', 'Accessories', 'Health Products'];
    if (name.includes('alibaba')) return ['Bulk Orders', 'Custom Products', 'Wholesale Prices'];
    if (name.includes('chewy')) return ['Auto-Ship', 'Prescription Meds', '24/7 Support'];
    if (name.includes('petsmart')) return ['Grooming', 'Training', 'Veterinary Services'];
    if (name.includes('petco')) return ['Wellness Plans', 'Grooming', 'Pet Adoption'];
    return ['Quality Products', 'Fast Shipping', 'Customer Support'];
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Trusted Pet Store Partners</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We've partnered with leading pet retailers to bring you the best products, 
          prices, and service for your beloved pets in Cyprus.
        </p>
      </div>

      {/* Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks.map((network) => (
          <Card key={network.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{getNetworkIcon(network.name)}</div>
                  <div>
                    <CardTitle className="text-lg">{network.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {network.settings.platform_type || 'Pet Retailer'}
                    </Badge>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  {network.commission_rate}% Commission
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {getNetworkDescription(network)}
              </p>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Specialties
                </h4>
                <div className="flex flex-wrap gap-1">
                  {getNetworkSpecialties(network).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full group-hover:bg-primary/90 transition-colors"
                onClick={() => handleNetworkClick(network)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Shop Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Network Stats */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center mb-2">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">{networks.length}+</h3>
            <p className="text-muted-foreground">Active Partners</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">10,000+</h3>
            <p className="text-muted-foreground">Pet Products</p>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">100%</h3>
            <p className="text-muted-foreground">Pet Owner Approved</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Best Prices Guaranteed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We constantly compare prices across all our partner networks to ensure you get the best deals for your pets.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Cyprus Delivery Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Most of our partners offer international shipping to Cyprus, with some providing expedited delivery options.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}