import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink, Star } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  amazon: boolean | string;
  chewy: boolean | string;
  petsmart: boolean | string;
  petco: boolean | string;
  canadaPetCare: boolean | string;
  alibaba: boolean | string;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    name: 'Commission Rate',
    amazon: 'Up to 10%',
    chewy: 'Up to 8%',
    petsmart: 'Up to 6%',
    petco: 'Up to 5%',
    canadaPetCare: 'Up to 15%',
    alibaba: 'Variable'
  },
  {
    name: 'Cyprus Shipping',
    amazon: true,
    chewy: false,
    petsmart: false,
    petco: false,
    canadaPetCare: true,
    alibaba: true
  },
  {
    name: 'Prescription Meds',
    amazon: false,
    chewy: true,
    petsmart: true,
    petco: true,
    canadaPetCare: true,
    alibaba: false
  },
  {
    name: 'Auto-Ship Service',
    amazon: true,
    chewy: true,
    petsmart: true,
    petco: true,
    canadaPetCare: false,
    alibaba: false
  },
  {
    name: 'Live Chat Support',
    amazon: true,
    chewy: true,
    petsmart: true,
    petco: true,
    canadaPetCare: true,
    alibaba: true
  },
  {
    name: 'Price Match',
    amazon: false,
    chewy: false,
    petsmart: true,
    petco: true,
    canadaPetCare: false,
    alibaba: false
  },
  {
    name: 'Bulk Ordering',
    amazon: false,
    chewy: false,
    petsmart: false,
    petco: false,
    canadaPetCare: false,
    alibaba: true
  },
  {
    name: 'Professional Services',
    amazon: false,
    chewy: false,
    petsmart: true,
    petco: true,
    canadaPetCare: false,
    alibaba: false
  }
];

const networks = [
  { id: 'amazon', name: 'Amazon', logo: '🛒', color: 'from-orange-500 to-yellow-500' },
  { id: 'chewy', name: 'Chewy', logo: '🐕', color: 'from-blue-500 to-cyan-500' },
  { id: 'petsmart', name: 'PetSmart', logo: '🏪', color: 'from-blue-600 to-purple-600' },
  { id: 'petco', name: 'Petco', logo: '🐾', color: 'from-red-500 to-pink-500' },
  { id: 'canadaPetCare', name: 'Canada Pet Care', logo: '🇨🇦', color: 'from-red-500 to-red-600' },
  { id: 'alibaba', name: 'Alibaba.com', logo: '🌐', color: 'from-orange-400 to-orange-600' }
];

export default function NetworkComparisonTable() {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Network Comparison</h2>
        <p className="text-muted-foreground">
          Compare features and benefits across our partner networks
        </p>
      </div>

      {/* Mobile-friendly cards for smaller screens */}
      <div className="block lg:hidden space-y-4">
        {networks.map((network) => (
          <Card key={network.id} className="overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${network.color}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{network.logo}</span>
                {network.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comparisonFeatures.map((feature) => (
                <div key={feature.name} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{feature.name}</span>
                  <div className="flex items-center">
                    {renderValue(feature[network.id as keyof ComparisonFeature] as boolean | string)}
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit {network.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Features</th>
                    {networks.map((network) => (
                      <th key={network.id} className="text-center p-4 min-w-[120px]">
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${network.color} flex items-center justify-center text-white text-lg`}>
                            {network.logo}
                          </div>
                          <span className="font-semibold text-sm">{network.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={feature.name} className={`border-b ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                      <td className="p-4 font-medium">{feature.name}</td>
                      {networks.map((network) => (
                        <td key={network.id} className="p-4 text-center">
                          {renderValue(feature[network.id as keyof ComparisonFeature] as boolean | string)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-muted/50">
                    <td className="p-4 font-semibold">Quick Access</td>
                    {networks.map((network) => (
                      <td key={network.id} className="p-4 text-center">
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Best for Healthcare</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Canada Pet Care offers the highest commission rates and specializes in veterinary products.
            </p>
            <Badge className="bg-green-600 text-white">15% Commission</Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">Best Selection</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Amazon offers the largest product catalog with reliable Cyprus shipping options.
            </p>
            <Badge className="bg-blue-600 text-white">Largest Catalog</Badge>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-orange-600" />
              <h3 className="font-semibold">Best for Bulk</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Alibaba.com is perfect for wholesale purchases and custom pet product orders.
            </p>
            <Badge className="bg-orange-600 text-white">Wholesale Prices</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}