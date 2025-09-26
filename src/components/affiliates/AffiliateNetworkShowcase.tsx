import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, TrendingUp, Globe, Package, Heart } from 'lucide-react';

interface AffiliateNetwork {
  id: string;
  name: string;
  description: string;
  logo: string;
  primaryColor: string;
  category: string;
  commissionRate: string;
  specialties: string[];
  url: string;
  badge?: string;
}

const networks: AffiliateNetwork[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'World\'s largest online marketplace with pet supplies',
    logo: '🛒',
    primaryColor: 'from-orange-500 to-yellow-500',
    category: 'General Marketplace',
    commissionRate: 'Up to 10%',
    specialties: ['Pet Food', 'Toys', 'Accessories', 'Health Products'],
    url: 'https://amazon.com',
    badge: 'Most Popular'
  },
  {
    id: 'canada-pet-care',
    name: 'Canada Pet Care',
    description: 'Premium Canadian pet healthcare and wellness products',
    logo: '🇨🇦',
    primaryColor: 'from-red-500 to-red-600',
    category: 'Pet Healthcare',
    commissionRate: 'Up to 15%',
    specialties: ['Veterinary Products', 'Supplements', 'Flea & Tick', 'Dental Care'],
    url: 'https://www.canadapetcare.com',
    badge: 'Healthcare Focus'
  },
  {
    id: 'chewy',
    name: 'Chewy',
    description: 'America\'s trusted online pet retailer',
    logo: '🐕',
    primaryColor: 'from-blue-500 to-cyan-500',
    category: 'Pet Retailer',
    commissionRate: 'Up to 8%',
    specialties: ['Pet Food', 'Auto-Ship', 'Prescription Meds', '24/7 Support'],
    url: 'https://chewy.com',
    badge: 'Auto-Ship Available'
  },
  {
    id: 'petsmart',
    name: 'PetSmart',
    description: 'Complete pet care solutions and services',
    logo: '🏪',
    primaryColor: 'from-blue-600 to-purple-600',
    category: 'Pet Retailer',
    commissionRate: 'Up to 6%',
    specialties: ['Grooming', 'Training', 'Veterinary', 'Boarding'],
    url: 'https://petsmart.com',
    badge: 'Services Available'
  },
  {
    id: 'petco',
    name: 'Petco',
    description: 'Where the healthy pets go for premium care',
    logo: '🐾',
    primaryColor: 'from-red-500 to-pink-500',
    category: 'Pet Retailer',
    commissionRate: 'Up to 5%',
    specialties: ['Wellness Plans', 'Grooming', 'Training', 'Adoption'],
    url: 'https://petco.com',
    badge: 'Wellness Focus'
  },
  {
    id: 'alibaba',
    name: 'Alibaba.com',
    description: 'Global wholesale marketplace for pet products',
    logo: '🌐',
    primaryColor: 'from-orange-400 to-orange-600',
    category: 'Wholesale',
    commissionRate: 'Variable',
    specialties: ['Bulk Orders', 'Pet Toys', 'Accessories', 'Custom Products'],
    url: 'https://alibaba.com',
    badge: 'Wholesale Prices'
  }
];

export default function AffiliateNetworkShowcase() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Trusted Pet Store Partners</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We've partnered with the world's leading pet retailers to bring you the best products, 
          prices, and service for your beloved pets in Cyprus.
        </p>
      </div>

      {/* Featured Networks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks.map((network) => (
          <Card key={network.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${network.primaryColor}`} />
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{network.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{network.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {network.category}
                    </Badge>
                  </div>
                </div>
                {network.badge && (
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                    {network.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {network.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Commission:</span>
                  <span className="font-semibold text-green-600">{network.commissionRate}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Specialties
                </h4>
                <div className="flex flex-wrap gap-1">
                  {network.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full group-hover:bg-primary/90 transition-colors"
                onClick={() => window.open(network.url, '_blank', 'noopener,noreferrer')}
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
            <h3 className="text-2xl font-bold">6+</h3>
            <p className="text-muted-foreground">Trusted Partners</p>
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