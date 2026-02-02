"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState, useRef } from "react";
import { PLAN_CONFIG, PlanType } from "@/lib/config";
import { storageManager } from "@/utils/localStorage";
import type { UsageStats, GenerationType, LimitCheckResult, TimeRemaining } from "@/types";
import {
  loadUsageStats,
  saveUsageStats,
  checkAndResetDailyUsage,
  createDefaultUsageStats,
  syncUsageAcrossTabs,
  incrementUsage as incrementUsageCore,
  incrementAdsWatched as incrementAdsWatchedCore,
  switchPlan as switchPlanCore,
  canGenerate,
  getRemainingForType,
  getResetCountdown,
  formatResetCountdown,
} from "@/lib/usageManager";
import { logUsageIncrement, logPlanSwitch, logLimitReached } from "@/lib/analytics";
import { recoverUsageData } from "@/utils/usageRecovery";
import { getLimitForType, canWatchAds } from "@/lib/planLimits";

const PLAN_STORAGE_KEY = "pinspark_plan";
const USAGE_STORAGE_KEY = "pinspark_usage_stats";

export interface PlanContextValue {
  selectedPlan: PlanType | null;
  usage: UsageStats;
  isLoading: boolean;
  error: string | null;

  selectPlan: (plan: PlanType) => void;
  canGenerate: (type: GenerationType, count: number) => LimitCheckResult;
  getRemaining: (type: GenerationType) => number;
  incrementUsage: (type: GenerationType, count: number) => void;
  incrementAdsWatched: (extraGenerations: number) => void;
  resetDailyUsage: () => void;
  getResetCountdown: () => TimeRemaining;
  getRemainingMessage: (type: GenerationType) => string;
  getLimitReachedMessage: (type: GenerationType) => string;
  switchPlan: (newPlan: PlanType) => void;
  refreshUsage: () => void;
  clearError: () => void;
}

export const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [usage, setUsage] = useState<UsageStats>(() => createDefaultUsageStats());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const loadStoredData = useCallback(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const storedPlan = storageManager.get<PlanType | null>(PLAN_STORAGE_KEY, null);
      const storedUsage = loadUsageStats(USAGE_STORAGE_KEY);

      let initialUsage: UsageStats;

      if (storedUsage) {
        const recovered = recoverUsageData(storedUsage, storedPlan);
        initialUsage = checkAndResetDailyUsage(recovered.stats);
      } else {
        initialUsage = createDefaultUsageStats(storedPlan);
      }

      if (storedPlan && initialUsage.today.plan !== storedPlan) {
        initialUsage = switchPlanCore(initialUsage, storedPlan);
      }

      setSelectedPlan(storedPlan);
      setUsage(initialUsage);
      saveUsageStats(initialUsage, USAGE_STORAGE_KEY);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load plan data";
      setError(errorMessage);
      console.error("Error loading plan data:", err);

      const defaultStats = createDefaultUsageStats();
      setUsage(defaultStats);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      loadStoredData();
    }
  }, [loadStoredData]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = syncUsageAcrossTabs((newStats) => {
      setUsage(newStats);
    }, USAGE_STORAGE_KEY);

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isLoading || typeof window === "undefined") return;

    const interval = setInterval(() => {
      setUsage((current) => {
        const checked = checkAndResetDailyUsage(current);
        if (checked !== current) {
          saveUsageStats(checked, USAGE_STORAGE_KEY);
          return checked;
        }
        return current;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const selectPlan = useCallback(
    (plan: PlanType) => {
      const previousPlan = selectedPlan;

      setSelectedPlan(plan);
      storageManager.set(PLAN_STORAGE_KEY, plan);

      setUsage((current) => {
        const newUsage = switchPlanCore(current, plan);
        saveUsageStats(newUsage, USAGE_STORAGE_KEY);
        return newUsage;
      });

      logPlanSwitch(previousPlan, plan);
    },
    [selectedPlan],
  );

  const checkCanGenerate = useCallback(
    (type: GenerationType, count: number): LimitCheckResult => {
      return canGenerate(usage, type, count);
    },
    [usage],
  );

  const getRemaining = useCallback(
    (type: GenerationType): number => {
      return getRemainingForType(usage, type);
    },
    [usage],
  );

  const incrementUsage = useCallback(
    (type: GenerationType, count: number) => {
      setUsage((current) => {
        const check = canGenerate(current, type, count);

        if (!check.allowed) {
          const limit = getLimitForType(current.today.plan, type);
          const usageKey =
            type === "idea"
              ? "ideasGenerated"
              : type === "prompt"
                ? "promptsGenerated"
                : "imagesGenerated";
          const used = current.today[usageKey] || 0;
          logLimitReached(type, current.today.plan, used, limit);
          return current;
        }

        const newUsage = incrementUsageCore(current, type, count);
        saveUsageStats(newUsage, USAGE_STORAGE_KEY);
        logUsageIncrement(type, count, newUsage.today.plan, check.remaining - count);
        return newUsage;
      });
    },
    [],
  );

  const incrementAdsWatched = useCallback((extraGenerations: number) => {
    setUsage((current) => {
      const newUsage = incrementAdsWatchedCore(current, extraGenerations);
      saveUsageStats(newUsage, USAGE_STORAGE_KEY);
      return newUsage;
    });
  }, []);

  const resetDailyUsage = useCallback(() => {
    setUsage((current) => {
      const newUsage: UsageStats = {
        ...current,
        today: {
          ...createDefaultUsageStats(current.today.plan).today,
          plan: current.today.plan,
        },
      };
      saveUsageStats(newUsage, USAGE_STORAGE_KEY);
      return newUsage;
    });
  }, []);

  const getResetCountdownCallback = useCallback((): TimeRemaining => {
    const countdown = getResetCountdown();
    const nextReset = new Date();
    nextReset.setUTCHours(24, 0, 0, 0);
    const now = new Date();
    const totalMilliseconds = Math.max(nextReset.getTime() - now.getTime(), 0);
    return { ...countdown, totalMilliseconds };
  }, []);

  const getRemainingMessage = useCallback(
    (type: GenerationType): string => {
      const remaining = getRemainingForType(usage, type);
      const limit = getLimitForType(selectedPlan, type);

      if (limit === Infinity) {
        return `Unlimited ${type}s ✨`;
      }

      const effectiveLimit = limit + usage.today.extraUnlocked;
      const effectiveUsed = effectiveLimit - remaining;

      return `${Math.max(0, effectiveUsed)}/${effectiveLimit} ${type}s used today`;
    },
    [usage, selectedPlan],
  );

  const getLimitReachedMessage = useCallback(
    (type: GenerationType): string => {
      if (!selectedPlan) {
        return "Please select a plan to continue.";
      }

      const limit = getLimitForType(selectedPlan, type);

      if (selectedPlan === "PlanA") {
        return "Unlimited generations available with Plan A ✨";
      }

      if (selectedPlan === "PlanB") {
        return `Daily limit reached ❌\nYou've used your ${limit} ${type}s today.\nUpgrade to Plan A for unlimited access.`;
      }

      if (selectedPlan === "PlanC") {
        return `Daily free limit reached 🎬\nWatch an ad to unlock ${usage.today.extraUnlocked > 0 ? "more" : "2 more"} generations!`;
      }

      return "Daily limit reached.";
    },
    [selectedPlan, usage.today.extraUnlocked],
  );

  const switchPlanCallback = useCallback(
    (newPlan: PlanType) => {
      selectPlan(newPlan);
    },
    [selectPlan],
  );

  const refreshUsage = useCallback(() => {
    loadStoredData();
  }, [loadStoredData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedPlan,
      usage,
      isLoading,
      error,
      selectPlan,
      canGenerate: checkCanGenerate,
      getRemaining,
      incrementUsage,
      incrementAdsWatched,
      resetDailyUsage,
      getResetCountdown: getResetCountdownCallback,
      getRemainingMessage,
      getLimitReachedMessage,
      switchPlan: switchPlanCallback,
      refreshUsage,
      clearError,
    }),
    [
      selectedPlan,
      usage,
      isLoading,
      error,
      selectPlan,
      checkCanGenerate,
      getRemaining,
      incrementUsage,
      incrementAdsWatched,
      resetDailyUsage,
      getResetCountdownCallback,
      getRemainingMessage,
      getLimitReachedMessage,
      switchPlanCallback,
      refreshUsage,
      clearError,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};
