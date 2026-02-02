"use client";

import { useCallback, useMemo } from "react";
import type { PlanType } from "@/lib/config";
import type { UsageStats, GenerationType, LimitCheckResult } from "@/types/usage";
import {
  canGenerate as canGenerateCore,
  getRemainingForType,
  getUsagePercentage,
  isNearLimit as isNearLimitCore,
  isAtLimit as isAtLimitCore,
} from "@/lib/usageManager";
import { getLimitForType, canWatchAds, formatLimit } from "@/lib/planLimits";

interface UseLimitCheckReturn {
  canGenerate: (type: GenerationType, count: number) => LimitCheckResult;
  getRemaining: (type: GenerationType) => number;
  getRemainingMessage: (type: GenerationType) => string;
  getLimitReachedMessage: (type: GenerationType) => string;
  getUsagePercentage: (type: GenerationType) => number;
  isNearLimit: (type: GenerationType, threshold?: number) => boolean;
  isAtLimit: (type: GenerationType) => boolean;
  canWatchAd: boolean;
  getProgressColor: (type: GenerationType) => string;
}

export function useLimitCheck(
  usage: UsageStats,
  plan: PlanType | null,
): UseLimitCheckReturn {
  const canGenerate = useCallback(
    (type: GenerationType, count: number): LimitCheckResult => {
      return canGenerateCore(usage, type, count);
    },
    [usage],
  );

  const getRemaining = useCallback(
    (type: GenerationType): number => {
      return getRemainingForType(usage, type);
    },
    [usage],
  );

  const getRemainingMessage = useCallback(
    (type: GenerationType): string => {
      const remaining = getRemainingForType(usage, type);
      const limit = getLimitForType(plan, type);
      const used = limit === Infinity ? 0 : limit - remaining;

      if (limit === Infinity) {
        return `Unlimited ${type}s ✨`;
      }

      const effectiveLimit = limit + usage.today.extraUnlocked;
      const effectiveUsed = used + usage.today.extraUnlocked - (limit - remaining);

      return `${Math.max(0, effectiveUsed)}/${effectiveLimit} ${type}s used today`;
    },
    [usage, plan],
  );

  const getLimitReachedMessage = useCallback(
    (type: GenerationType): string => {
      if (!plan) {
        return "Please select a plan to continue.";
      }

      const limit = getLimitForType(plan, type);

      if (plan === "PlanA") {
        return "Unlimited generations available with Plan A ✨";
      }

      if (plan === "PlanB") {
        return `Daily limit reached ❌\nYou've used your ${formatLimit(limit)} ${type}s today.\nUpgrade to Plan A for unlimited access.`;
      }

      if (plan === "PlanC") {
        return `Daily free limit reached 🎬\nWatch an ad to unlock ${usage.today.extraUnlocked > 0 ? "more" : "2 more"} generations!`;
      }

      return "Daily limit reached.";
    },
    [plan, usage.today.extraUnlocked],
  );

  const getUsagePercentageCallback = useCallback(
    (type: GenerationType): number => {
      return getUsagePercentage(usage, type);
    },
    [usage],
  );

  const isNearLimitCallback = useCallback(
    (type: GenerationType, threshold = 0.8): boolean => {
      return isNearLimitCore(usage, type, threshold);
    },
    [usage],
  );

  const isAtLimitCallback = useCallback(
    (type: GenerationType): boolean => {
      return isAtLimitCore(usage, type);
    },
    [usage],
  );

  const canWatchAd = useMemo(() => {
    return canWatchAds(plan);
  }, [plan]);

  const getProgressColor = useCallback(
    (type: GenerationType): string => {
      const percentage = getUsagePercentage(usage, type);

      if (percentage >= 100) {
        return "bg-red-500";
      }
      if (percentage >= 80) {
        return "bg-yellow-500";
      }
      if (percentage >= 50) {
        return "bg-blue-500";
      }
      return "bg-emerald-500";
    },
    [usage],
  );

  return {
    canGenerate,
    getRemaining,
    getRemainingMessage,
    getLimitReachedMessage,
    getUsagePercentage: getUsagePercentageCallback,
    isNearLimit: isNearLimitCallback,
    isAtLimit: isAtLimitCallback,
    canWatchAd,
    getProgressColor,
  };
}
