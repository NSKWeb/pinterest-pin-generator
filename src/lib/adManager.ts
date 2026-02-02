import { AD_CONFIG, shouldShowAd } from "@/lib/adConfig";
import { logAdImpression, logAdError } from "@/lib/adTracking";
import type { AdNetwork } from "@/types/ads";

declare global {
  interface Window {
    adsbygoogle?: any[];
    viads?: any;
    _googletag?: any;
  }
}

let adsenseInitialized = false;
let viadsInitialized = false;

export function initializeAdSense(): boolean {
  if (typeof window === "undefined") return false;
  if (!AD_CONFIG.adsense.enabled) return false;
  if (adsenseInitialized) return true;

  try {
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }

    // Load AdSense script
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.adsense.clientId}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      console.error("Failed to load Google AdSense");
      logAdError("adsense-init", "adsense", "PlanA");
    };
    
    document.head.appendChild(script);
    adsenseInitialized = true;

    if (AD_CONFIG.debugMode) {
      console.log("[AdSense] Initialized with client ID:", AD_CONFIG.adsense.clientId);
    }

    return true;
  } catch (error) {
    console.error("Error initializing AdSense:", error);
    return false;
  }
}

export function initializeViads(): boolean {
  if (typeof window === "undefined") return false;
  if (!AD_CONFIG.viads.enabled) return false;
  if (viadsInitialized) return true;

  try {
    // Viads SDK initialization (placeholder - replace with actual SDK)
    const script = document.createElement("script");
    script.src = "https://cdn.viads.io/sdk.js";
    script.async = true;
    script.onload = () => {
      if (window.viads && AD_CONFIG.viads.publisherId) {
        window.viads.init({
          publisherId: AD_CONFIG.viads.publisherId,
          zone: "main",
        });
        
        if (AD_CONFIG.debugMode) {
          console.log("[Viads] Initialized with publisher ID:", AD_CONFIG.viads.publisherId);
        }
      }
    };
    script.onerror = () => {
      console.error("Failed to load Viads SDK");
      logAdError("viads-init", "viads", "PlanA");
    };
    
    document.head.appendChild(script);
    viadsInitialized = true;

    return true;
  } catch (error) {
    console.error("Error initializing Viads:", error);
    return false;
  }
}

export function initializeAds(): void {
  if (typeof window === "undefined") return;

  // Initialize both ad networks
  initializeAdSense();
  initializeViads();
}

export function loadAdSenseAd(slot: string, elementId: string, plan: string | null): boolean {
  if (!AD_CONFIG.adsense.enabled) return false;
  if (!shouldShowAd(slot, plan)) return false;

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Ad element not found: ${elementId}`);
      return false;
    }

    if (window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: AD_CONFIG.adsense.clientId,
        enable_page_level_ads: true,
      });

      logAdImpression(slot, "adsense", (plan as any) || "PlanA");

      if (AD_CONFIG.debugMode) {
        console.log(`[AdSense] Loaded ad: ${slot} in element: ${elementId}`);
      }

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error loading AdSense ad:", error);
    logAdError(slot, "adsense", (plan as any) || "PlanA");
    return false;
  }
}

export function loadViadsVideo(placementId: string, plan: string | null): Promise<boolean> {
  return new Promise((resolve) => {
    if (!AD_CONFIG.viads.enabled) {
      resolve(false);
      return;
    }
    if (!shouldShowAd(placementId, plan)) {
      resolve(false);
      return;
    }

    try {
      if (!window.viads) {
        console.warn("Viads SDK not loaded");
        logAdError(placementId, "viads", (plan as any) || "PlanA");
        resolve(false);
        return;
      }

      // Placeholder for Viads video ad loading
      // Replace with actual SDK call when available
      logAdImpression(placementId, "viads", (plan as any) || "PlanA");

      if (AD_CONFIG.debugMode) {
        console.log(`[Viads] Loading video ad: ${placementId}`);
      }

      // Simulate ad load
      setTimeout(() => {
        resolve(true);
      }, 500);
    } catch (error) {
      console.error("Error loading Viads video:", error);
      logAdError(placementId, "viads", (plan as any) || "PlanA");
      resolve(false);
    }
  });
}

export function loadViadsInterstitial(placementId: string, plan: string | null): Promise<boolean> {
  return new Promise((resolve) => {
    if (!AD_CONFIG.viads.enabled) {
      resolve(false);
      return;
    }
    if (!shouldShowAd(placementId, plan)) {
      resolve(false);
      return;
    }

    try {
      if (!window.viads) {
        console.warn("Viads SDK not loaded");
        logAdError(placementId, "viads", (plan as any) || "PlanA");
        resolve(false);
        return;
      }

      // Placeholder for Viads interstitial ad loading
      logAdImpression(placementId, "viads", (plan as any) || "PlanA");

      if (AD_CONFIG.debugMode) {
        console.log(`[Viads] Loading interstitial ad: ${placementId}`);
      }

      // Simulate ad load
      setTimeout(() => {
        resolve(true);
      }, 500);
    } catch (error) {
      console.error("Error loading Viads interstitial:", error);
      logAdError(placementId, "viads", (plan as any) || "PlanA");
      resolve(false);
    }
  });
}

export function getAdNetworkStatus(): {
  adsense: { initialized: boolean; enabled: boolean };
  viads: { initialized: boolean; enabled: boolean };
} {
  return {
    adsense: {
      initialized: adsenseInitialized,
      enabled: AD_CONFIG.adsense.enabled,
    },
    viads: {
      initialized: viadsInitialized,
      enabled: AD_CONFIG.viads.enabled,
    },
  };
}
