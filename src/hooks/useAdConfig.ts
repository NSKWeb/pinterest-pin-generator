import { useMemo, useCallback } from "react";
import { AD_PLACEMENTS, shouldShowAd, getAdFrequency, getAdConfigByPlan } from "@/lib/adConfig";
import type { PlanType, AdPlacement, AdSettings } from "@/types/ads";

export function useAdConfig(plan: PlanType | null) {
  const adSettings = useMemo<AdSettings>(() => {
    return getAdConfigByPlan(plan) || {
      showHeaderAd: false,
      showVideoAds: false,
      showInterstitials: false,
      videoAdsWatched: 0,
      adFrequency: "low",
    };
  }, [plan]);

  const getAdConfig = useCallback((placementId: string): AdPlacement | null => {
    return AD_PLACEMENTS.find((p) => p.id === placementId) || null;
  }, []);

  const shouldShowPlacement = useCallback((placementId: string): boolean => {
    return shouldShowAd(placementId, plan);
  }, [plan]);

  const getPlacementFrequency = useCallback((placementId: string): "always" | "per-action" | "on-demand" => {
    return getAdFrequency(placementId, plan);
  }, [plan]);

  const getBannerAdConfig = useCallback(() => {
    const placement = AD_PLACEMENTS.find((p) => p.id === "header-banner");
    if (!placement || !shouldShowPlacement(placement.id)) return null;
    
    return {
      enabled: true,
      network: placement.network,
      slot: placement.id,
    };
  }, [shouldShowPlacement]);

  const getVideoAdConfig = useCallback(() => {
    const placement = AD_PLACEMENTS.find((p) => p.id === "video-before-download");
    if (!placement || !shouldShowPlacement(placement.id)) return null;
    
    return {
      enabled: true,
      network: placement.network,
      placementId: placement.id,
    };
  }, [shouldShowPlacement]);

  const getInterstitialAdConfig = useCallback(() => {
    const placement = AD_PLACEMENTS.find((p) => p.id === "interstitial-between-sections");
    if (!placement || !shouldShowPlacement(placement.id)) return null;
    
    return {
      enabled: true,
      network: placement.network,
      placementId: placement.id,
    };
  }, [shouldShowPlacement]);

  return {
    adSettings,
    getAdConfig,
    shouldShowPlacement,
    getPlacementFrequency,
    getBannerAdConfig,
    getVideoAdConfig,
    getInterstitialAdConfig,
    allPlacements: AD_PLACEMENTS,
  };
}
