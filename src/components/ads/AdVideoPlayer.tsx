"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePlanContext } from "@/hooks/usePlanContext";
import { useAdConfig } from "@/hooks/useAdConfig";
import { loadViadsVideo } from "@/lib/adManager";
import { logVideoWatch, logAdError } from "@/lib/adTracking";
import { AdCountdown } from "./AdCountdown";
import { AdPlaceholder } from "./AdPlaceholder";
import { AdFallback } from "./AdFallback";

interface AdVideoPlayerProps {
  onComplete: (completed: boolean) => void;
  autoPlay?: boolean;
  showCountdown?: boolean;
  skipAfterSeconds?: number;
  className?: string;
}

export const AdVideoPlayer = ({ 
  onComplete, 
  autoPlay = true,
  showCountdown = true,
  skipAfterSeconds = 5,
  className = ""
}: AdVideoPlayerProps) => {
  const { selectedPlan } = usePlanContext();
  const { shouldShowPlacement, getVideoAdConfig } = useAdConfig(selectedPlan);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [videoDuration] = useState(30); // Default 30 seconds
  const [elapsed, setElapsed] = useState(0);

  const videoConfig = getVideoAdConfig();

  useEffect(() => {
    if (!videoConfig?.enabled || !selectedPlan) {
      setIsLoading(false);
      return;
    }

    if (!autoPlay) {
      setIsLoading(false);
      return;
    }

    loadVideo();
  }, [videoConfig, selectedPlan, autoPlay]);

  const loadVideo = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setElapsed(0);

    try {
      const loaded = await loadViadsVideo("video-before-download", selectedPlan);
      
      if (loaded) {
        setIsPlaying(true);
        // Simulate video playback (replace with actual Viads SDK events)
        startPlaybackSimulation();
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Error loading video ad:", error);
      setHasError(true);
      logAdError("video-before-download", "viads", selectedPlan || "PlanA");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPlan]);

  const startPlaybackSimulation = useCallback(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= videoDuration) {
          clearInterval(timer);
          setIsPlaying(false);
          logVideoWatch("video-before-download", "viads", selectedPlan || "PlanA", true);
          onComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [videoDuration, selectedPlan, onComplete]);

  const handleSkip = useCallback(() => {
    setIsPlaying(false);
    logVideoWatch("video-before-download", "viads", selectedPlan || "PlanA", false);
    onComplete(false);
  }, [selectedPlan, onComplete]);

  const handleRetry = useCallback(() => {
    loadVideo();
  }, [loadVideo]);

  if (!shouldShowPlacement("video-before-download") || !videoConfig?.enabled) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AdPlaceholder width="100%" height="315px" label="Loading video ad..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex flex-col items-center gap-4 ${className}`}>
        <AdFallback width="100%" height="315px" message="Video ad unavailable" />
        <button
          onClick={handleRetry}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
        >
          Try Again
        </button>
      </div>
    );
  }

  const remainingTime = videoDuration - elapsed;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900">
        {/* Video placeholder (replace with actual Viads video player) */}
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-white/90">Video Ad</p>
              <p className="text-xs text-white/50">Sponsored content</p>
            </div>
          </div>
        </div>

        {/* Overlay with progress bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${(elapsed / videoDuration) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {showCountdown && isPlaying && (
        <AdCountdown
          seconds={remainingTime}
          canSkip={elapsed >= skipAfterSeconds}
          onSkip={handleSkip}
        />
      )}

      <div className="flex items-center gap-2 text-xs text-white/40">
        <span>Advertisement</span>
        <span>•</span>
        <span>Sponsored</span>
      </div>
    </div>
  );
};
