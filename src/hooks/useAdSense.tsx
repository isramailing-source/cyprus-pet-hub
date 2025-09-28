import { useEffect, useRef, useCallback } from 'react';

// AdSense configuration
const ADSENSE_CLIENT_ID = 'ca-pub-4659190065021043';
const SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

// Global declarations for AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface UseAdSenseOptions {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal' | 'fluid';
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
}

// Singleton to track script loading and prevent duplicates
class AdSenseManager {
  private static instance: AdSenseManager;
  private scriptLoaded = false;
  private scriptLoading = false;
  private callbacks: (() => void)[] = [];
  private initializedAds = new Set<string>();

  static getInstance(): AdSenseManager {
    if (!AdSenseManager.instance) {
      AdSenseManager.instance = new AdSenseManager();
    }
    return AdSenseManager.instance;
  }

  async loadScript(): Promise<void> {
    if (this.scriptLoaded) {
      return Promise.resolve();
    }

    if (this.scriptLoading) {
      return new Promise((resolve) => {
        this.callbacks.push(resolve);
      });
    }

    this.scriptLoading = true;

    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector(`script[src="${SCRIPT_URL}"]`);
      if (existingScript) {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
        resolve();
      };

      script.onerror = () => {
        this.scriptLoading = false;
        reject(new Error('Failed to load AdSense script'));
      };

      document.head.appendChild(script);
    });
  }

  isAdInitialized(adId: string): boolean {
    return this.initializedAds.has(adId);
  }

  markAdInitialized(adId: string): void {
    this.initializedAds.add(adId);
  }

  initializeAd(element: HTMLElement): boolean {
    if (typeof window === 'undefined' || !window.adsbygoogle) {
      return false;
    }

    try {
      const adIns = element.querySelector('.adsbygoogle') as HTMLElement;
      if (!adIns || adIns.dataset.adsbygoogleStatus) {
        return false; // Already initialized
      }

      // Push to AdSense queue
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      return true;
    } catch (error) {
      console.error('AdSense initialization error:', error);
      return false;
    }
  }
}

const adSenseManager = AdSenseManager.getInstance();

export const useAdSense = (options: UseAdSenseOptions) => {
  const adRef = useRef<HTMLDivElement>(null);
  const { slot, format = 'auto', layoutKey, responsive = true, className } = options;
  
  // Create unique ad ID for tracking
  const adId = `${slot}-${format}-${Date.now()}`;

  const initializeAd = useCallback(async () => {
    if (!adRef.current || adSenseManager.isAdInitialized(adId)) {
      return;
    }

    try {
      // Load AdSense script if not already loaded
      await adSenseManager.loadScript();
      
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (adRef.current && !adSenseManager.isAdInitialized(adId)) {
          const success = adSenseManager.initializeAd(adRef.current);
          if (success) {
            adSenseManager.markAdInitialized(adId);
          }
        }
      }, 100);
    } catch (error) {
      console.error('Failed to initialize AdSense ad:', error);
    }
  }, [adId]);

  useEffect(() => {
    initializeAd();
  }, [initializeAd]);

  // Check if this is a demo/placeholder slot
  const isDemoSlot = slot.length < 10 || slot.match(/^[0-9]+$/);
  
  const renderAd = () => {
    if (isDemoSlot) {
      return (
        <div 
          ref={adRef} 
          className={`ad-container p-4 border-2 border-dashed rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 ${className || ''}`}
          style={{ minHeight: '150px' }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
            <div className="text-lg font-semibold text-blue-700">📢 AdSense Placeholder</div>
            <div className="text-sm text-blue-600">Slot: {slot}</div>
            <div className="text-xs text-blue-500">Replace with real AdSense slot ID from Google AdSense dashboard</div>
          </div>
        </div>
      );
    }

    return (
      <div ref={adRef} className={`ad-container ${className || ''}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format === 'fluid' ? 'fluid' : format}
          data-ad-layout-key={layoutKey}
          data-full-width-responsive={responsive.toString()}
        />
      </div>
    );
  };

  return {
    adRef,
    renderAd,
    isDemo: isDemoSlot,
    reinitialize: initializeAd
  };
};

export default useAdSense;
