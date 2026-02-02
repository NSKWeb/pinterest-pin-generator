import type { AdPlacement, AdConfig } from "@/types/ads";

export const AD_PLACEMENTS: AdPlacement[] = [
  {
    id: "header-banner",
    network: "adsense",
    type: "banner",
    location: "header",
    planA: true,
    planB: true,
    planC: true,
    frequency: "always",
  },
  {
    id: "video-before-download",
    network: "viads",
    type: "video",
    location: "before-download",
    planA: true,
    planB: true,
    planC: true,
    frequency: "on-demand",
  },
  {
    id: "interstitial-between-sections",
    network: "viads",
    type: "interstitial",
    location: "between-sections",
    planA: true,
    planB: false,
    planC: false,
    frequency: "per-action",
  },
];

export const AD_CONFIG: AdConfig = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true" || process.env.NEXT_PUBLIC_ENABLE_VIADS === "true",
  adsense: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID ?? "",
    headerSlotId: process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID ?? "",
    responsiveSlotId: process.env.NEXT_PUBLIC_ADSENSE_RESPONSIVE_SLOT_ID ?? "",
    enabled: process.env.NEXT_PUBLIC_ENABLE_ADSENSE === "true",
  },
  viads: {
    publisherId: process.env.NEXT_PUBLIC_VIADS_PUBLISHER_ID ?? "",
    videoPlacementId: process.env.NEXT_PUBLIC_VIADS_VIDEO_PLACEMENT_ID ?? "",
    interstitialPlacementId: process.env.NEXT_PUBLIC_VIADS_INTERSTITIAL_PLACEMENT_ID ?? "",
    bannerPlacementId: process.env.NEXT_PUBLIC_VIADS_BANNER_PLACEMENT_ID ?? "",
    enabled: process.env.NEXT_PUBLIC_ENABLE_VIADS === "true",
  },
  debugMode: process.env.NEXT_PUBLIC_AD_DEBUG_MODE === "true",
};

export const AD_SETTINGS_BY_PLAN = {
  PlanA: {
    showHeaderAd: true,
    showVideoAds: true,
    showInterstitials: true,
    videoAdsWatched: 0,
    adFrequency: "high" as const,
  },
  PlanB: {
    showHeaderAd: true,
    showVideoAds: false,
    showInterstitials: false,
    videoAdsWatched: 0,
    adFrequency: "low" as const,
  },
  PlanC: {
    showHeaderAd: true,
    showVideoAds: true,
    showInterstitials: false,
    videoAdsWatched: 0,
    adFrequency: "medium" as const,
  },
};

export const UNLOCK_REWARDS = {
  PlanC: {
    extraGenerationsPerAd: 2,
    maxAdsPerDay: 10,
  },
};

export function shouldShowAd(placementId: string, plan: string | null): boolean {
  if (!plan) return false;
  
  const placement = AD_PLACEMENTS.find((p) => p.id === placementId);
  if (!placement) return false;

  const planKey = plan as keyof typeof placement;
  return placement[planKey] === true;
}

export function getAdFrequency(placementId: string, plan: string | null): "always" | "per-action" | "on-demand" {
  if (!plan) return "on-demand";
  
  const placement = AD_PLACEMENTS.find((p) => p.id === placementId);
  if (!placement) return "on-demand";

  if (!shouldShowAd(placementId, plan)) return "on-demand";
  return placement.frequency ?? "on-demand";
}

export function getAdConfigByPlan(plan: string | null) {
  if (!plan) return null;
  const planKey = plan as keyof typeof AD_SETTINGS_BY_PLAN;
  return AD_SETTINGS_BY_PLAN[planKey] ?? null;
}
