"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePlanContext } from "@/hooks/usePlanContext";
import { useAdConfig } from "@/hooks/useAdConfig";
import { loadViadsInterstitial } from "@/lib/adManager";
import { logAdImpression, logAdError } from "@/lib/adTracking";
import { AdCountdown } from "./AdCountdown";
import { AdPlaceholder } from "./AdPlaceholder";
import { AdFallback } from "./AdFallback";

interface AdInterstitialProps {
  isOpen: boolean;
  onClose: () => void;
  autoCloseAfter?: number;
  showCloseButton?: boolean;
}

export const AdInterstitial = ({
  isOpen,
  onClose,
  autoCloseAfter = 10,
  showCloseButton = true,
}: AdInterstitialProps) => {
  const { selectedPlan } = usePlanContext();
  const { shouldShowPlacement, getInterstitialAdConfig } = useAdConfig(selectedPlan);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [canClose, setCanClose] = useState(showCloseButton);
  const [timeLeft, setTimeLeft] = useState(autoCloseAfter);
  const [isFadedOut, setIsFadedOut] = useState(false);

  const interstitialConfig = getInterstitialAdConfig();

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setHasError(false);
      setTimeLeft(autoCloseAfter);
      setCanClose(showCloseButton);
      setIsFadedOut(false);
      return;
    }

    if (!interstitialConfig?.enabled || !selectedPlan) {
      setIsLoading(false);
      return;
    }

    loadAd();
  }, [isOpen, interstitialConfig, selectedPlan, autoCloseAfter, showCloseButton]);

  const loadAd = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const loaded = await loadViadsInterstitial("interstitial-between-sections", selectedPlan);
      
      if (loaded) {
        logAdImpression("interstitial-between-sections", "viads", selectedPlan || "PlanA");
        startCountdown();
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error loading interstitial ad:", error);
      setHasError(true);
      logAdError("interstitial-between-sections", "viads", selectedPlan || "PlanA");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlan]);

  const startCountdown = useCallback(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = useCallback(() => {
    if (!canClose) return;
    
    setIsFadedOut(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match fade-out animation duration
  }, [canClose, onClose]);

  const handleSkip = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !canClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, canClose, handleClose]);

  if (!isOpen) {
    return null;
  }

  if (!shouldShowPlacement("interstitial-between-sections") || !interstitialConfig?.enabled) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
        isFadedOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-full max-w-2xl p-4">
        {/* Close button */}
        {canClose && (
          <button
            onClick={handleClose}
            className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-colors hover:bg-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
          {isLoading ? (
            <div className="p-8">
              <AdPlaceholder width="100%" height="400px" label="Loading ad..." />
            </div>
          ) : hasError ? (
            <div className="p-8">
              <AdFallback width="100%" height="400px" message="Ad unavailable" />
              <button
                onClick={handleClose}
                className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10"
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              {/* Ad content placeholder (replace with actual Viads interstitial) */}
              <div className="aspect-[16/9] min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-8">
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <svg
                      className="h-10 w-10 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Advertisement</h3>
                    <p className="text-sm text-white/50">Sponsored content from our partners</p>
                  </div>
                  <div className="text-xs text-white/30">
                    This interstitial helps support our free service
                  </div>
                </div>
              </div>

              {/* Footer with countdown */}
              <div className="flex items-center justify-between border-t border-white/10 bg-slate-800/50 px-6 py-4">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>Advertisement</span>
                  <span>•</span>
                  <span>Sponsored</span>
                </div>
                <AdCountdown
                  seconds={timeLeft}
                  canSkip={true}
                  onSkip={handleSkip}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
