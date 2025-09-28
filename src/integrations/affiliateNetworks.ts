// Affiliate Networks Configuration
// This file contains configuration for all affiliate partners

// Types for affiliate network configurations
export interface AffiliateNetwork {
  name: string;
  id: string;
  enabled: boolean;
  config: Record<string, any>;
}

export interface AmazonConfig {
  tag: string;
  region: string;
  baseUrl: string;
}

export interface RakutenConfig {
  widgetScript: string;
  partnerId: string;
}

export interface AliExpressConfig {
  trackingId: string;
  baseUrl: string;
  apiKey?: string;
  apiSecret?: string;
  appKey?: string;
}

export interface AdmitadConfig {
  websiteId: string;
  apiUrl: string;
  secretKey?: string; // For future API integration
}

// AliExpress Product API Types
export interface AliExpressProduct {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  product_small_image_urls?: string[];
  product_video_url?: string;
  app_sale_price: string;
  app_sale_price_currency: string;
  original_price?: string;
  discount?: string;
  evaluate_rate?: string;
  volume?: number;
  shop_id?: string;
  shop_url?: string;
  product_detail_url: string;
  lastest_volume?: number;
  hot_product_commission_rate?: string;
  commission_rate?: string;
  relevant_market_commission_rate?: string;
  sale_price?: string;
  sale_price_currency?: string;
  category_id?: number;
  second_level_category_id?: number;
}

export interface AliExpressSearchResponse {
  current_page_no: number;
  current_record_count: number;
  total_record_count: number;
  products: AliExpressProduct[];
}

// Amazon Associates Configuration
export const amazonConfig: AmazonConfig = {
  tag: 'cypruspets20-20',
  region: 'US', // Can be changed based on target market
  baseUrl: 'https://www.amazon.com'
};

// Rakuten Configuration
export const rakutenConfig: RakutenConfig = {
  widgetScript: 'https://js.revsharesale.com/widget.js',
  partnerId: 'cypruspets' // To be updated with actual partner ID
};

// AliExpress Configuration with API support via Supabase secrets
export const aliExpressConfig: AliExpressConfig = {
  trackingId: 'Cyrus-pets',
  baseUrl: 'https://www.aliexpress.com',
  // API credentials managed via Supabase Edge Functions
  // These are accessed securely through the affiliate-content-manager edge function
};

// Admitad Configuration
export const admitadConfig: AdmitadConfig = {
  websiteId: 'cyprus-pets',
  apiUrl: 'https://api.admitad.com/advcampaigns/',
  // Secret key managed via Supabase Edge Functions for security
};

// Main affiliate networks configuration
export const affiliateNetworks: AffiliateNetwork[] = [
  {
    name: 'Amazon Associates',
    id: 'amazon',
    enabled: true,
    config: amazonConfig
  },
  {
    name: 'Rakuten Advertising',
    id: 'rakuten',
    enabled: true,
    config: rakutenConfig
  },
  {
    name: 'AliExpress',
    id: 'aliexpress',
    enabled: true,
    config: aliExpressConfig
  },
  {
    name: 'Admitad',
    id: 'admitad',
    enabled: true,
    config: admitadConfig
  }
];

// Helper functions for affiliate links
export const generateAmazonLink = (productId: string, tag: string = amazonConfig.tag): string => {
  return `${amazonConfig.baseUrl}/dp/${productId}?tag=${tag}`;
};

// Generate Amazon storefront link using Shop ID
export const generateAmazonStorefrontLink = (shopId?: string): string => {
  const storeId = shopId || 'cypruspets';
  const affiliateTag = amazonConfig.tag;
  return `https://www.amazon.com/shop/${storeId}?tag=${affiliateTag}`;
};

// Generate Amazon category link
export const generateAmazonCategoryLink = (category: string, shopId?: string): string => {
  const storeId = shopId || 'cypruspets';
  const affiliateTag = amazonConfig.tag;
  
  if (storeId) {
    return `https://www.amazon.com/shop/${storeId}?tag=${affiliateTag}&category=${category}`;
  }
  
  // Fallback to category search
  return `https://www.amazon.com/s?k=${encodeURIComponent(category)}&tag=${affiliateTag}`;
};

export const generateAliExpressLink = (productUrl: string, trackingId: string = aliExpressConfig.trackingId): string => {
  const separator = productUrl.includes('?') ? '&' : '?';
  return `${productUrl}${separator}aff_trace_key=${trackingId}`;
};

// AliExpress API Integration Functions
export const searchAliExpressProducts = async (
  keywords: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  sort?: 'SALE_PRICE_ASC' | 'SALE_PRICE_DESC' | 'DISCOUNT_ASC' | 'DISCOUNT_DESC' | 'VOLUME_DESC',
  pageNo: number = 1,
  pageSize: number = 20
): Promise<AliExpressSearchResponse | null> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    console.log('Searching AliExpress products via edge function...', keywords);
    
    // Call the affiliate content manager edge function to search AliExpress products
    const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
      body: { 
        action: 'search_products',
        keywords,
        options: {
          pageNo,
          pageSize,
          category,
          minPrice,
          maxPrice,
          sort
        }
      }
    });

    if (error) {
      console.error('Error calling AliExpress search edge function:', error);
      return null;
    }

    if (data?.error) {
      console.error('AliExpress search error:', data.error);
      return null;
    }

    return { products: data?.products || [], current_page_no: pageNo, current_record_count: data?.products?.length || 0, total_record_count: data?.products?.length || 0 } as AliExpressSearchResponse;
  } catch (error) {
    console.error('Error searching AliExpress products:', error);
    return null;
  }
};

// Get AliExpress product details by ID
export const getAliExpressProduct = async (productId: string): Promise<AliExpressProduct | null> => {
  try {
    // API calls are handled via Supabase Edge Functions for security
    console.log('AliExpress product fetch via edge function...');

    const params = new URLSearchParams({
      method: 'aliexpress.affiliate.product.detail.get',
      app_key: aliExpressConfig.appKey,
      sign_method: 'md5',
      timestamp: Date.now().toString(),
      format: 'json',
      v: '2.0',
      product_ids: productId,
      tracking_id: aliExpressConfig.trackingId,
      fields: 'product_id,product_title,product_main_image_url,product_small_image_urls,app_sale_price,app_sale_price_currency,original_price,discount,evaluate_rate,volume,product_detail_url,commission_rate'
    });

    const response = await fetch(`/api/aliexpress/product?${params}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const products = data.aliexpress_affiliate_product_detail_get_response?.resp_result?.result?.products;
    
    return products && products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error('Error getting AliExpress product:', error);
    return null;
  }
};

// Convert AliExpress product to internal format
export const convertAliExpressProduct = (product: AliExpressProduct) => {
  return {
    id: `aliexpress_${product.product_id}`,
    title: product.product_title,
    description: product.product_title, // AliExpress doesn't provide separate descriptions in search
    price: parseFloat(product.app_sale_price) || 0,
    original_price: product.original_price ? parseFloat(product.original_price) : null,
    currency: product.app_sale_price_currency || 'USD',
    image_url: product.product_main_image_url,
    rating: product.evaluate_rate ? parseFloat(product.evaluate_rate) : 0,
    review_count: product.volume || 0,
    category: 'pets', // Default category for pet products
    brand: 'Various', // AliExpress doesn't always provide brand info
    affiliate_link: generateAliExpressLink(product.product_detail_url),
    network_id: 'aliexpress',
    amazon_asin: null,
    aliexpress_product_url: product.product_detail_url,
    network: { name: 'AliExpress' },
    is_active: true,
    is_featured: false,
    availability_status: 'in_stock',
    commission_rate: product.commission_rate,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

// Fetch and sync AliExpress products with database via edge function
export const syncAliExpressProducts = async (
  keywords: string[] = ['pet supplies', 'dog toys', 'cat food', 'pet accessories'],
  maxProductsPerKeyword: number = 10
) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    console.log('Starting AliExpress product sync via edge function...');
    
    // Call the affiliate content manager edge function to sync AliExpress products
    const { data, error } = await supabase.functions.invoke('affiliate-content-manager', {
      body: { 
        action: 'sync_products',
        keywords,
        maxProductsPerKeyword
      }
    });

    if (error) {
      console.error('Error syncing AliExpress products:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sync AliExpress products' 
      };
    }

    console.log('AliExpress sync completed:', data);
    return { 
      success: true, 
      productsCount: data?.products_synced || 0 
    };

  } catch (error) {
    console.error('AliExpress sync error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Widget insertion helper for Rakuten
export const insertRakutenWidget = (containerId: string): void => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = rakutenConfig.widgetScript;
    script.async = true;
    
    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(script);
    }
  }
};

// Get active affiliate networks
export const getActiveNetworks = (): AffiliateNetwork[] => {
  return affiliateNetworks.filter(network => network.enabled);
};

// Get network by ID
export const getNetworkById = (id: string): AffiliateNetwork | undefined => {
  return affiliateNetworks.find(network => network.id === id);
};

export default affiliateNetworks;
