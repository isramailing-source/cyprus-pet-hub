import { useState, useEffect } from 'react';

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

// No mock data - only real data from database

/**
 * Custom React hook for fetching affiliate product feeds
 * Fetches real products directly from the Supabase database
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

        // Fetch real products from database
        const { supabase } = await import('@/integrations/supabase/client');
        
        // First get products
        const { data: productsData, error: productsError } = await supabase
          .from('affiliate_products')
          .select(`
            id,
            title,
            description,
            short_description,
            price,
            original_price,
            currency,
            image_url,
            rating,
            review_count,
            category,
            subcategory,
            brand,
            affiliate_link,
            network_id,
            is_active,
            is_featured,
            availability_status,
            created_at,
            updated_at
          `)
          .eq('is_active', true)
          .eq('availability_status', 'in_stock')
          .limit(options.limit * 2); // Get more to allow for filtering

        if (productsError) {
          console.error('Error fetching affiliate products:', productsError);
          setErrors('Failed to fetch products from database');
          setBestSellers([]);
          setSeasonalPicks([]);
          setLoading(false);
          return;
        }

        // Get network names separately
        const { data: networksData, error: networksError } = await supabase
          .from('affiliate_networks')
          .select('id, name');

        if (networksError) {
          console.error('Error fetching networks:', networksError);
        }

        // Create network lookup
        const networkLookup = new Map(networksData?.map(n => [n.id, n.name]) || []);

        if (!productsData || productsData.length === 0) {
          console.warn('No affiliate products found in database');
          setBestSellers([]);
          setSeasonalPicks([]);
          setLoading(false);
          return;
        }

        // Convert database products to AffiliateProduct format
        const convertedProducts: AffiliateProduct[] = productsData.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description || product.short_description || '',
          price: product.price || 0,
          original_price: product.original_price,
          currency: product.currency || 'EUR',
          image_url: product.image_url || '',
          rating: product.rating || 4.0,
          review_count: product.review_count || 0,
          category: product.category || 'pets',
          brand: product.brand || '',
          affiliate_link: product.affiliate_link,
          network_id: product.network_id,
          network: { name: networkLookup.get(product.network_id) || 'Unknown' },
          is_active: product.is_active,
          is_featured: product.is_featured || false,
          availability_status: product.availability_status || 'in_stock',
          commission_rate: '5%',
          created_at: product.created_at,
          updated_at: product.updated_at
        }));

        // Shuffle and split products into best sellers and seasonal picks
        const shuffled = convertedProducts.sort(() => Math.random() - 0.5);
        const half = Math.ceil(Math.min(shuffled.length, options.limit) / 2);
        
        setBestSellers(shuffled.slice(0, half));
        setSeasonalPicks(shuffled.slice(half, half * 2));

      } catch (error) {
        console.error('Error fetching affiliate products:', error);
        setErrors(error instanceof Error ? error.message : 'Failed to fetch affiliate products');
        setBestSellers([]);
        setSeasonalPicks([]);
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