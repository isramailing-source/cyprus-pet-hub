import React, { useEffect, useState } from 'react';
import { searchAliExpressProducts, convertAliExpressProduct } from '@/integrations/affiliateNetworks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  currency: string;
  image_url: string;
  rating: number;
  review_count: number;
  category: string;
  brand: string;
  affiliate_link: string;
  network: { name: string };
  network_id: string;
}

export default function AliExpressApiShowcase({
  keywords = 'pet supplies',
  limit = 8,
}: { keywords?: string; limit?: number }) {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await searchAliExpressProducts(keywords, undefined, undefined, undefined, 'VOLUME_DESC', 1, limit);
      if (res && res.products) {
        const normalized = res.products.map(convertAliExpressProduct);
        setItems(normalized);
      } else {
        setItems([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [keywords, limit]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">AliExpress Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">AliExpress Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((p) => (
            <a key={p.id} href={p.affiliate_link} target="_blank" rel="noopener noreferrer">
              <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg border">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-white">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-4"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge className="bg-red-500 text-white">AliExpress</Badge>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{p.brand}</div>
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight group-hover:text-blue-600">
                    {p.title}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('en-CY', { style: 'currency', currency: p.currency || 'USD' }).format(p.price)}
                      </span>
                      {p.original_price && p.original_price > p.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat('en-CY', { style: 'currency', currency: p.currency || 'USD' }).format(p.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <Badge variant="outline" className="text-xs text-gray-600">
                      {p.network?.name || 'AliExpress'}
                    </Badge>
                    <span className="text-xs text-gray-500">{p.review_count?.toLocaleString()} reviews</span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
