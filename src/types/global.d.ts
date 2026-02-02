// Global type declarations for ad SDKs

declare global {
  interface Window {
    // Google AdSense
    adsbygoogle?: any[];
    _googletag?: any;
    
    // Viads SDK (placeholder - update with actual SDK types)
    viads?: {
      init: (config: { publisherId: string; zone: string }) => void;
      loadVideo: (placementId: string) => Promise<boolean>;
      loadInterstitial: (placementId: string) => Promise<boolean>;
    };
  }
}

export {};
