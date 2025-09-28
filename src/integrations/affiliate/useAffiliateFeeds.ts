import { useState, useEffect } from 'react';
import { affiliateNetworks, searchAliExpressProducts, convertAliExpressProduct } from '../affiliateNetworks';

// Types for the hook interface
export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  currency: string;
  image_url: string;
  rating: number;
  review_count: number;
  category: string;
  brand: string;
  affiliate_link: string;
  network_id: string;
  amazon_asin?: string;
  aliexpress_product_url?: string;
  network: { name: string };
  is_active: boolean;
  is_featured: boolean;
  availability_status: string;
  commission_rate?: string;
  created_at: string;
  updated_at: string;
}

export interface UseAffiliateFeedsOptions {
  sources: string[];
  country: string;
  currency: string;
  limit: number;
}

export interface UseAffiliateFeedsResult {
  bestSellers: AffiliateProduct[];
  seasonalPicks: AffiliateProduct[];
  loading: boolean;
  errors: string | null;
}

// Mock data for demonstration/fallback
const mockProducts: AffiliateProduct[] = [
  {
    id: 'mock_1',
    title: 'Premium Pet Food Bowl Set',
    description: 'Stainless steel food and water bowls for pets',
    price: 24.99,
    original_price: 34.99,
    currency: 'EUR',
    image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=300',
    rating: 4.5,
    review_count: 128,
    category: 'pets',
    brand: 'PetCare',
    affiliate_link: 'https://amazon.com/dp/mock1?tag=cypruspets20-20',
    network_id: 'amazon',
    network: { name: 'Amazon' },
    is_active: true,
    is_featured: true,
    availability_status: 'in_stock',
    commission_rate: '8%',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock_2',
    title: 'Interactive Dog Toy Ball',
    description: 'Smart interactive ball that keeps dogs engaged',
    price: 19.99,
    original_price: 29.99,
    currency: 'EUR',
    image_url: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=300',
    rating: 4.3,
    review_count: 87,
    category: 'pets',
    brand: 'DogFun',
    affiliate_link: 'https://amazon.com/dp/mock2?tag=cypruspets20-20',
    network_id: 'amazon',
    network: { name: 'Amazon' },
    is_active: true,
    is_featured: false,
    availability_status: 'in_stock',
    commission_rate: '6%',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'mock_3',
    title: 'Cat Scratching Post Tower',
    description: 'Multi-level scratching post with cozy hideaways',
    price: 45.99,
    original_price: 65.99,
    currency: 'EUR',
    image_url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300',
    rating: 4.7,
    review_count: 203,
    category: 'pets',
    brand: 'CatComfort',
    affiliate_link: 'https://amazon.com/dp/mock3?tag=cypruspets20-20',
    network_id: 'amazon',
    network: { name: 'Amazon' },
    is_active: true,
    is_featured: true,
    availability_status: 'in_stock',
    commission_rate: '10%',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

/**
 * Custom React hook for fetching affiliate product feeds
 * Integrates with multiple affiliate networks (Amazon, AliExpress, Rakuten, Admitad)
 * 
 * @param options Configuration options for the feed
 * @returns Object containing product arrays and loading states
 */
export const useAffiliateFeeds = (options: UseAffiliateFeedsOptions): UseAffiliateFeedsResult => {
  const [bestSellers, setBestSellers] = useState<AffiliateProduct[]>([]);
  const [seasonalPicks, setSeasonalPicks] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    const fetchAffiliateProducts = async () => {
      try {
        setLoading(true);
        setErrors(null);

        // Get active networks based on sources
        const activeNetworks = affiliateNetworks.filter(
          network => network.enabled && options.sources.includes(network.id)
        );

        if (activeNetworks.length === 0) {
          console.warn('No active affiliate networks found for sources:', options.sources);
          // Use mock data as fallback
          setBestSellers(mockProducts.slice(0, Math.ceil(options.limit / 2)));
          setSeasonalPicks(mockProducts.slice(Math.ceil(options.limit / 2)));
          setLoading(false);
          return;
        }

        const allProducts: AffiliateProduct[] = [];

        // Fetch from each active network
        for (const network of activeNetworks) {
          try {
            if (network.id === 'aliexpress') {
              // Fetch from AliExpress API
              const aliexpressResults = await searchAliExpressProducts(
                'pet supplies',
                undefined,
                undefined,
                undefined,
                'VOLUME_DESC',
                1,
                Math.ceil(options.limit / activeNetworks.length)
              );

              if (aliexpressResults?.products) {
                const convertedProducts = aliexpressResults.products.map(convertAliExpressProduct);
                allProducts.push(...convertedProducts);
              }
            }
            // Additional network integrations can be added here
            // For now, we'll use mock data for other networks
          } catch (networkError) {
            console.error(`Error fetching from ${network.name}:`, networkError);
            // Continue with other networks
          }
        }

        // If we couldn't fetch from APIs, use mock data
        if (allProducts.length === 0) {
          console.info('Using fallback mock data for affiliate products');
          allProducts.push(...mockProducts);
        }

        // Shuffle and split products
        const shuffled = allProducts.sort(() => Math.random() - 0.5);
        const half = Math.ceil(shuffled.length / 2);
        
        setBestSellers(shuffled.slice(0, half));
        setSeasonalPicks(shuffled.slice(half));

      } catch (error) {
        console.error('Error fetching affiliate products:', error);
        setErrors(error instanceof Error ? error.message : 'Failed to fetch affiliate products');
        
        // Use mock data as fallback on error
        setBestSellers(mockProducts.slice(0, Math.ceil(options.limit / 2)));
        setSeasonalPicks(mockProducts.slice(Math.ceil(options.limit / 2)));
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to simulate real API calls
    const timeoutId = setTimeout(fetchAffiliateProducts, 300);

    return () => clearTimeout(timeoutId);
  }, [options.sources, options.country, options.currency, options.limit]);

  return {
    bestSellers,
    seasonalPicks,
    loading,
    errors
  };
};

export default useAffiliateFeeds;
