"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePlanContext } from "@/hooks/usePlanContext";
import { useAdConfig } from "@/hooks/useAdConfig";
import { loadAdSenseAd, initializeAdSense } from "@/lib/adManager";
import { AD_CONFIG } from "@/lib/adConfig";
import { AdPlaceholder } from "./AdPlaceholder";
import { AdFallback } from "./AdFallback";

interface AdBannerHeaderProps {
  className?: string;
}

export const AdBannerHeader = ({ className = "" }: AdBannerHeaderProps) => {
  const { selectedPlan } = usePlanContext();
  const { shouldShowPlacement, getBannerAdConfig } = useAdConfig(selectedPlan);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const adElementRef = useRef<HTMLDivElement>(null);
  const adId = useRef(`header-banner-${Math.random().toString(36).substr(2, 9)}`);

  const bannerConfig = getBannerAdConfig();

  useEffect(() => {
    if (!bannerConfig?.enabled || !selectedPlan) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Initialize AdSense
    initializeAdSense();

    // Load ad after a short delay to ensure script is ready
    const timer = setTimeout(() => {
      try {
        const loaded = loadAdSenseAd("header-banner", adId.current, selectedPlan);
        if (!loaded) {
          setHasError(true);
        }
      } catch (error) {
        console.error("Error loading header banner ad:", error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [bannerConfig, selectedPlan]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!bannerConfig?.enabled || !selectedPlan || hasError) return;

    const refreshInterval = setInterval(() => {
      try {
        loadAdSenseAd("header-banner", adId.current, selectedPlan);
      } catch (error) {
        console.error("Error refreshing header banner ad:", error);
      }
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, [bannerConfig, selectedPlan, hasError]);

  if (!shouldShowPlacement("header-banner") || !bannerConfig?.enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <AdPlaceholder width="100%" height="90px" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`w-full ${className}`}>
        <AdFallback width="100%" height="90px" />
      </div>
    );
  }

  return (
    <div 
      ref={adElementRef}
      id={adId.current}
      className={`w-full ${className}`}
      style={{ minHeight: "90px" }}
    >
      {AD_CONFIG.adsense.enabled && (
        <ins
          className="adsbygoogle block"
          style={{ display: "block", minHeight: "90px" }}
          data-ad-client={AD_CONFIG.adsense.clientId}
          data-ad-slot={AD_CONFIG.adsense.headerSlotId}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};
