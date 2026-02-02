import type { PlanType, STORAGE_KEYS } from "@/lib/config";
import type {
  DailyUsage,
  GenerationType,
  LifetimeStats,
  LimitCheckResult,
  UsageStats,
} from "@/types/usage";
import { getLimitForType, getPlanLimits, getUsageKeyForType, isUnlimited } from "@/lib/planLimits";
import { shouldReset, getTodayDateString, getNextResetTime } from "@/utils/usageReset";

const DEFAULT_STORAGE_KEY = "pinspark_usage_stats";

export function createDefaultDailyUsage(plan: PlanType | null = null): DailyUsage {
  return {
    date: getTodayDateString(),
    ideasGenerated: 0,
    promptsGenerated: 0,
    imagesGenerated: 0,
    videoAdsWatched: 0,
    extraUnlocked: 0,
    lastReset: new Date().toISOString(),
    plan,
  };
}

export function createDefaultLifetimeStats(): LifetimeStats {
  return {
    totalIdeas: 0,
    totalPrompts: 0,
    totalImages: 0,
    totalAdsWatched: 0,
  };
}

export function createDefaultUsageStats(plan: PlanType | null = null): UsageStats {
  return {
    today: createDefaultDailyUsage(plan),
    lifetime: createDefaultLifetimeStats(),
    lastUpdated: new Date().toISOString(),
  };
}

export function loadUsageStats(storageKey = DEFAULT_STORAGE_KEY): UsageStats | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as UsageStats;
    return validateAndFixUsageStats(parsed);
  } catch (error) {
    console.error("Error loading usage stats:", error);
    return null;
  }
}

export function saveUsageStats(stats: UsageStats, storageKey = DEFAULT_STORAGE_KEY): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(storageKey, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error("Error saving usage stats:", error);

    if (error instanceof Error && error.name === "QuotaExceededError") {
      return handleStorageQuotaExceeded(stats, storageKey);
    }

    return false;
  }
}

function handleStorageQuotaExceeded(stats: UsageStats, storageKey: string): boolean {
  try {
    const minimalStats: UsageStats = {
      today: stats.today,
      lifetime: {
        totalIdeas: stats.lifetime.totalIdeas,
        totalPrompts: stats.lifetime.totalPrompts,
        totalImages: stats.lifetime.totalImages,
        totalAdsWatched: stats.lifetime.totalAdsWatched,
      },
      lastUpdated: stats.lastUpdated,
    };

    localStorage.setItem(storageKey, JSON.stringify(minimalStats));
    return true;
  } catch {
    return false;
  }
}

export function validateAndFixUsageStats(stats: Partial<UsageStats>): UsageStats {
  const defaultStats = createDefaultUsageStats();

  const today = stats.today ?? defaultStats.today;
  const lifetime = stats.lifetime ?? defaultStats.lifetime;

  return {
    today: {
      date: today.date || getTodayDateString(),
      ideasGenerated: Math.max(0, today.ideasGenerated || 0),
      promptsGenerated: Math.max(0, today.promptsGenerated || 0),
      imagesGenerated: Math.max(0, today.imagesGenerated || 0),
      videoAdsWatched: Math.max(0, today.videoAdsWatched || 0),
      extraUnlocked: Math.max(0, today.extraUnlocked || 0),
      lastReset: today.lastReset || new Date().toISOString(),
      plan: today.plan || null,
    },
    lifetime: {
      totalIdeas: Math.max(0, lifetime.totalIdeas || 0),
      totalPrompts: Math.max(0, lifetime.totalPrompts || 0),
      totalImages: Math.max(0, lifetime.totalImages || 0),
      totalAdsWatched: Math.max(0, lifetime.totalAdsWatched || 0),
    },
    lastUpdated: stats.lastUpdated || new Date().toISOString(),
  };
}

export function checkAndResetDailyUsage(stats: UsageStats): UsageStats {
  if (shouldReset(stats.today.lastReset)) {
    const newStats: UsageStats = {
      ...stats,
      today: {
        ...createDefaultDailyUsage(stats.today.plan),
        plan: stats.today.plan,
      },
    };
    return newStats;
  }
  return stats;
}

export function canGenerate(
  stats: UsageStats,
  type: GenerationType,
  count: number,
): LimitCheckResult {
  const plan = stats.today.plan;

  if (isUnlimited(plan)) {
    return {
      allowed: true,
      remaining: Infinity,
      canWatchAd: false,
    };
  }

  const limit = getLimitForType(plan, type);

  if (limit === Infinity) {
    return {
      allowed: true,
      remaining: Infinity,
      canWatchAd: false,
    };
  }

  const usageKey = getUsageKeyForType(type);
  const used = stats.today[usageKey] || 0;
  const extraUnlocked = stats.today.extraUnlocked || 0;
  const effectiveLimit = limit + extraUnlocked;
  const remaining = Math.max(0, effectiveLimit - used);
  const allowed = remaining >= count;

  return {
    allowed,
    remaining,
    message: !allowed
      ? `${remaining} ${type}(s) remaining today`
      : `${remaining} ${type}(s) remaining`,
    canWatchAd: plan === "PlanC" && !allowed,
  };
}

export function getRemainingForType(stats: UsageStats, type: GenerationType): number {
  const check = canGenerate(stats, type, 0);
  return check.remaining;
}

export function incrementUsage(
  stats: UsageStats,
  type: GenerationType,
  count: number,
): UsageStats {
  const usageKey = getUsageKeyForType(type);
  const lifetimeKey = getLifetimeKeyForType(type);

  return {
    ...stats,
    today: {
      ...stats.today,
      [usageKey]: (stats.today[usageKey] || 0) + count,
    },
    lifetime: {
      ...stats.lifetime,
      [lifetimeKey]: (stats.lifetime[lifetimeKey] || 0) + count,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function incrementAdsWatched(stats: UsageStats, extraGenerations: number): UsageStats {
  return {
    ...stats,
    today: {
      ...stats.today,
      videoAdsWatched: stats.today.videoAdsWatched + 1,
      extraUnlocked: stats.today.extraUnlocked + extraGenerations,
    },
    lifetime: {
      ...stats.lifetime,
      totalAdsWatched: stats.lifetime.totalAdsWatched + 1,
    },
    lastUpdated: new Date().toISOString(),
  };
}

function getLifetimeKeyForType(type: GenerationType): keyof LifetimeStats {
  switch (type) {
    case "idea":
      return "totalIdeas";
    case "prompt":
      return "totalPrompts";
    case "image":
      return "totalImages";
    default:
      return "totalIdeas";
  }
}

export function getUsagePercentage(stats: UsageStats, type: GenerationType): number {
  const plan = stats.today.plan;
  const limit = getLimitForType(plan, type);

  if (limit === Infinity || limit === 0) {
    return limit === Infinity ? 0 : 100;
  }

  const usageKey = getUsageKeyForType(type);
  const used = stats.today[usageKey] || 0;
  const percentage = (used / limit) * 100;

  return Math.min(percentage, 100);
}

export function isNearLimit(stats: UsageStats, type: GenerationType, threshold = 0.8): boolean {
  const percentage = getUsagePercentage(stats, type);
  return percentage >= threshold * 100 && percentage < 100;
}

export function isAtLimit(stats: UsageStats, type: GenerationType): boolean {
  const check = canGenerate(stats, type, 1);
  return !check.allowed;
}

export function getResetCountdown(): { hours: number; minutes: number; seconds: number } {
  const nextReset = getNextResetTime();
  const now = new Date();
  const diff = Math.max(nextReset.getTime() - now.getTime(), 0);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export function formatResetCountdown(countdown: { hours: number; minutes: number; seconds: number }): string {
  const { hours, minutes, seconds } = countdown;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

export function switchPlan(stats: UsageStats, newPlan: PlanType): UsageStats {
  const currentDate = stats.today.date;
  const today = getTodayDateString();

  if (currentDate !== today) {
    return {
      ...createDefaultUsageStats(newPlan),
      lifetime: stats.lifetime,
    };
  }

  return {
    ...stats,
    today: {
      ...stats.today,
      plan: newPlan,
    },
  };
}

export function syncUsageAcrossTabs(
  callback: (stats: UsageStats) => void,
  storageKey = DEFAULT_STORAGE_KEY,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey && event.newValue) {
      try {
        const newStats = JSON.parse(event.newValue) as UsageStats;
        callback(validateAndFixUsageStats(newStats));
      } catch (error) {
        console.error("Error syncing usage across tabs:", error);
      }
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}
