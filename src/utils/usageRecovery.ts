import type { UsageStats, DailyUsage, LifetimeStats } from "@/types/usage";
import type { PlanType } from "@/lib/config";
import { createDefaultUsageStats, validateAndFixUsageStats } from "@/lib/usageManager";
import { getTodayDateString } from "@/utils/usageReset";

export interface RecoveryResult {
  success: boolean;
  stats: UsageStats;
  wasRecovered: boolean;
  errors: string[];
}

export function validateUsageData(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Data is not an object"] };
  }

  const stats = data as Partial<UsageStats>;

  if (!stats.today || typeof stats.today !== "object") {
    errors.push("Missing or invalid today data");
  } else {
    const today = stats.today as Partial<DailyUsage>;

    if (typeof today.date !== "string") {
      errors.push("Invalid date format");
    }

    if (typeof today.ideasGenerated !== "number" || today.ideasGenerated < 0) {
      errors.push("Invalid ideasGenerated value");
    }

    if (typeof today.promptsGenerated !== "number" || today.promptsGenerated < 0) {
      errors.push("Invalid promptsGenerated value");
    }

    if (typeof today.imagesGenerated !== "number" || today.imagesGenerated < 0) {
      errors.push("Invalid imagesGenerated value");
    }

    if (typeof today.videoAdsWatched !== "number" || today.videoAdsWatched < 0) {
      errors.push("Invalid videoAdsWatched value");
    }

    if (typeof today.extraUnlocked !== "number" || today.extraUnlocked < 0) {
      errors.push("Invalid extraUnlocked value");
    }

    if (typeof today.lastReset !== "string") {
      errors.push("Invalid lastReset value");
    }
  }

  if (!stats.lifetime || typeof stats.lifetime !== "object") {
    errors.push("Missing or invalid lifetime data");
  } else {
    const lifetime = stats.lifetime as Partial<LifetimeStats>;

    if (typeof lifetime.totalIdeas !== "number" || lifetime.totalIdeas < 0) {
      errors.push("Invalid totalIdeas value");
    }

    if (typeof lifetime.totalPrompts !== "number" || lifetime.totalPrompts < 0) {
      errors.push("Invalid totalPrompts value");
    }

    if (typeof lifetime.totalImages !== "number" || lifetime.totalImages < 0) {
      errors.push("Invalid totalImages value");
    }

    if (typeof lifetime.totalAdsWatched !== "number" || lifetime.totalAdsWatched < 0) {
      errors.push("Invalid totalAdsWatched value");
    }
  }

  if (typeof stats.lastUpdated !== "string") {
    errors.push("Invalid lastUpdated value");
  }

  return { valid: errors.length === 0, errors };
}

export function recoverUsageData(
  data: unknown,
  currentPlan: PlanType | null = null,
): RecoveryResult {
  const validation = validateUsageData(data);

  if (validation.valid) {
    const stats = validateAndFixUsageStats(data as UsageStats);
    return {
      success: true,
      stats,
      wasRecovered: false,
      errors: [],
    };
  }

  const errors = [...validation.errors];
  let recoveredStats: UsageStats | null = null;

  try {
    if (data && typeof data === "object") {
      const partial = data as Partial<UsageStats>;

      const today: Partial<DailyUsage> = partial.today || {};
      const lifetime: Partial<LifetimeStats> = partial.lifetime || {};

      recoveredStats = {
        today: {
          date: today.date || getTodayDateString(),
          ideasGenerated: Math.max(0, today.ideasGenerated || 0),
          promptsGenerated: Math.max(0, today.promptsGenerated || 0),
          imagesGenerated: Math.max(0, today.imagesGenerated || 0),
          videoAdsWatched: Math.max(0, today.videoAdsWatched || 0),
          extraUnlocked: Math.max(0, today.extraUnlocked || 0),
          lastReset: today.lastReset || new Date().toISOString(),
          plan: (today.plan as PlanType | null) || currentPlan,
        },
        lifetime: {
          totalIdeas: Math.max(0, lifetime.totalIdeas || 0),
          totalPrompts: Math.max(0, lifetime.totalPrompts || 0),
          totalImages: Math.max(0, lifetime.totalImages || 0),
          totalAdsWatched: Math.max(0, lifetime.totalAdsWatched || 0),
        },
        lastUpdated: partial.lastUpdated || new Date().toISOString(),
      };
    }
  } catch (recoveryError) {
    errors.push(`Recovery failed: ${recoveryError instanceof Error ? recoveryError.message : "Unknown error"}`);
  }

  if (!recoveredStats) {
    recoveredStats = createDefaultUsageStats(currentPlan);
    errors.push("Using default stats");
  }

  return {
    success: true,
    stats: recoveredStats,
    wasRecovered: true,
    errors,
  };
}

export function resetToDefaults(plan: PlanType | null = null): UsageStats {
  return createDefaultUsageStats(plan);
}

export function handleStorageQuotaExceeded(storageKey: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const keysToClear = [
      "pinspark_ad_events",
      "pinspark_old_usage",
    ];

    for (const key of keysToClear) {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore errors when clearing
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function backupUsageToMemory(stats: UsageStats): string {
  try {
    return JSON.stringify(stats);
  } catch {
    return "";
  }
}

export function restoreUsageFromMemory(backup: string): UsageStats | null {
  try {
    const parsed = JSON.parse(backup) as UsageStats;
    return validateAndFixUsageStats(parsed);
  } catch {
    return null;
  }
}

export function logUsageError(error: Error, context: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.error("[Usage Error]", error, context);
  }
}
