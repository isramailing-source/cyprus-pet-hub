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
}

export interface AdmitadConfig {
  websiteId: string;
  apiUrl: string;
  secretKey?: string; // For future API integration
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

// AliExpress Configuration
export const aliExpressConfig: AliExpressConfig = {
  trackingId: 'Cyrus-pets',
  baseUrl: 'https://www.aliexpress.com'
};

// Admitad Configuration
export const admitadConfig: AdmitadConfig = {
  websiteId: 'cyprus-pets',
  apiUrl: 'https://api.admitad.com/advcampaigns/',
  secretKey: process.env.ADMITAD_SECRET_KEY // Store securely in environment variables
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

export const generateAliExpressLink = (productUrl: string, trackingId: string = aliExpressConfig.trackingId): string => {
  const separator = productUrl.includes('?') ? '&' : '?';
  return `${productUrl}${separator}aff_trace_key=${trackingId}`;
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
