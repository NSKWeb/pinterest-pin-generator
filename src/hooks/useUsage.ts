"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PlanType } from "@/lib/config";
import type { UsageStats, DailyUsage, LifetimeStats, GenerationType } from "@/types/usage";
import {
  loadUsageStats,
  saveUsageStats,
  checkAndResetDailyUsage,
  createDefaultUsageStats,
  syncUsageAcrossTabs,
  incrementUsage as incrementUsageCore,
  incrementAdsWatched as incrementAdsWatchedCore,
  switchPlan as switchPlanCore,
} from "@/lib/usageManager";
import { logUsageIncrement } from "@/lib/analytics";
import { recoverUsageData } from "@/utils/usageRecovery";

interface UseUsageReturn {
  usage: UsageStats;
  isLoading: boolean;
  error: string | null;
  incrementUsage: (type: GenerationType, count: number) => void;
  incrementAdsWatched: (extraGenerations: number) => void;
  switchPlan: (newPlan: PlanType) => void;
  refreshUsage: () => void;
  resetUsage: () => void;
  clearError: () => void;
}

const STORAGE_KEY = "pinspark_usage_stats";

export function useUsage(initialPlan: PlanType | null = null): UseUsageReturn {
  const [usage, setUsage] = useState<UsageStats>(() => createDefaultUsageStats(initialPlan));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const loadUsage = useCallback(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const stored = loadUsageStats(STORAGE_KEY);

      if (stored) {
        const recovered = recoverUsageData(stored, initialPlan);
        const checked = checkAndResetDailyUsage(recovered.stats);
        setUsage(checked);
      } else {
        const defaultStats = createDefaultUsageStats(initialPlan);
        setUsage(defaultStats);
        saveUsageStats(defaultStats, STORAGE_KEY);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load usage data";
      setError(errorMessage);
      console.error("Error loading usage:", err);

      const defaultStats = createDefaultUsageStats(initialPlan);
      setUsage(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, [initialPlan]);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadUsage();
    }
  }, [loadUsage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = syncUsageAcrossTabs((newStats) => {
      setUsage(newStats);
    }, STORAGE_KEY);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading || typeof window === "undefined") return;

    const interval = setInterval(() => {
      setUsage((current) => {
        const checked = checkAndResetDailyUsage(current);
        if (checked !== current) {
          saveUsageStats(checked, STORAGE_KEY);
          return checked;
        }
        return current;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const incrementUsage = useCallback((type: GenerationType, count: number) => {
    setUsage((current) => {
      const newUsage = incrementUsageCore(current, type, count);
      saveUsageStats(newUsage, STORAGE_KEY);
      logUsageIncrement(type, count, newUsage.today.plan, 0);
      return newUsage;
    });
  }, []);

  const incrementAdsWatched = useCallback((extraGenerations: number) => {
    setUsage((current) => {
      const newUsage = incrementAdsWatchedCore(current, extraGenerations);
      saveUsageStats(newUsage, STORAGE_KEY);
      return newUsage;
    });
  }, []);

  const switchPlan = useCallback((newPlan: PlanType) => {
    setUsage((current) => {
      const newUsage = switchPlanCore(current, newPlan);
      saveUsageStats(newUsage, STORAGE_KEY);
      return newUsage;
    });
  }, []);

  const refreshUsage = useCallback(() => {
    loadUsage();
  }, [loadUsage]);

  const resetUsage = useCallback(() => {
    const defaultStats = createDefaultUsageStats(usage.today.plan);
    setUsage(defaultStats);
    saveUsageStats(defaultStats, STORAGE_KEY);
  }, [usage.today.plan]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    usage,
    isLoading,
    error,
    incrementUsage,
    incrementAdsWatched,
    switchPlan,
    refreshUsage,
    resetUsage,
    clearError,
  };
}
