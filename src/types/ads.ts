import type { PlanType } from "@/lib/config";

export type AdNetwork = "adsense" | "viads";

export type AdType = "banner" | "video" | "interstitial";

export type AdFrequency = "always" | "per-action" | "on-demand";

export type AdEventType = "impression" | "click" | "complete" | "skip" | "error";

export interface AdPlacement {
  id: string;
  network: AdNetwork;
  type: AdType;
  location: string;
  planA: boolean;
  planB: boolean;
  planC: boolean;
  frequency?: AdFrequency;
}

export interface AdEvent {
  id: string;
  type: AdEventType;
  network: AdNetwork;
  placement: string;
  timestamp: Date;
  userId?: string;
  plan: PlanType;
}

export interface AdStats {
  impressions: number;
  clicks: number;
  videoWatches: number;
  videoSkips: number;
  byPlacement: Record<string, number>;
  byNetwork: Record<AdNetwork, number>;
}

export interface AdSettings {
  showHeaderAd: boolean;
  showVideoAds: boolean;
  showInterstitials: boolean;
  videoAdsWatched: number;
  adFrequency: "high" | "medium" | "low";
}

export interface AdConfig {
  enabled: boolean;
  adsense: {
    clientId: string;
    headerSlotId: string;
    responsiveSlotId: string;
    enabled: boolean;
  };
  viads: {
    publisherId: string;
    videoPlacementId: string;
    interstitialPlacementId: string;
    bannerPlacementId: string;
    enabled: boolean;
  };
  debugMode: boolean;
}

export interface AdUnlockState {
  unlockedCount: number;
  lastAdWatchedAt: string | null;
  canWatchMore: boolean;
}
