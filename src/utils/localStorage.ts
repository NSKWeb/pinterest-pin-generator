import type { UsageStats } from "@/types/usage";

export const STORAGE_KEYS = {
  USAGE_STATS: "pinspark_usage_stats",
  PLAN: "pinspark_plan",
  LAST_RESET: "pinspark_last_reset",
  AD_UNLOCK: "pinspark_ad_unlock",
  AD_EVENTS: "pinspark_ad_events",
  IDEAS: "pinspark_ideas",
  PROMPTS: "pinspark_prompts",
  IMAGES: "pinspark_images",
  SELECTED_IDEA: "pinspark_selected_idea",
  ANALYTICS: "pinspark_analytics",
  BACKUP: "pinspark_backup",
} as const;

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private backupData: Map<string, string> = new Map();

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") {
      return fallback;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) {
        return fallback;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Storage read failed for key: ${key}`, error);
      return fallback;
    }
  }

  set<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      this.backupData.set(key, serialized);
      return true;
    } catch (error) {
      console.error(`Storage write failed for key: ${key}`, error);

      if (error instanceof Error && error.name === "QuotaExceededError") {
        return this.handleQuotaExceeded(key, value);
      }

      return false;
    }
  }

  remove(key: string): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      window.localStorage.removeItem(key);
      this.backupData.delete(key);
      return true;
    } catch (error) {
      console.error(`Storage remove failed for key: ${key}`, error);
      return false;
    }
  }

  clear(): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      window.localStorage.clear();
      this.backupData.clear();
      return true;
    } catch (error) {
      console.error("Storage clear failed:", error);
      return false;
    }
  }

  has(key: string): boolean {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }

  keys(): string[] {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      return Object.keys(window.localStorage);
    } catch {
      return [];
    }
  }

  size(): number {
    if (typeof window === "undefined") {
      return 0;
    }

    try {
      let total = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          total += window.localStorage.getItem(key)?.length || 0;
        }
      }
      return total * 2;
    } catch {
      return 0;
    }
  }

  private handleQuotaExceeded<T>(key: string, value: T): boolean {
    try {
      const keysToClear = [
        STORAGE_KEYS.AD_EVENTS,
        STORAGE_KEYS.BACKUP,
        STORAGE_KEYS.ANALYTICS,
      ];

      for (const clearKey of keysToClear) {
        if (clearKey !== key) {
          try {
            window.localStorage.removeItem(clearKey);
          } catch {
            // Ignore errors
          }
        }
      }

      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch {
      return false;
    }
  }

  restoreFromBackup(key: string): string | null {
    return this.backupData.get(key) || null;
  }

  syncAcrossTabs(callback: (key: string, newValue: string | null) => void): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handler = (event: StorageEvent) => {
      if (event.key) {
        callback(event.key, event.newValue);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }
}

export const storageManager = LocalStorageManager.getInstance();

export function getUsageFromStorage(): UsageStats | null {
  return storageManager.get<UsageStats | null>(STORAGE_KEYS.USAGE_STATS, null);
}

export function saveUsageToStorage(stats: UsageStats): boolean {
  return storageManager.set(STORAGE_KEYS.USAGE_STATS, stats);
}

export function getPlanFromStorage(): string | null {
  return storageManager.get<string | null>(STORAGE_KEYS.PLAN, null);
}

export function savePlanToStorage(plan: string | null): boolean {
  return storageManager.set(STORAGE_KEYS.PLAN, plan);
}

export function clearAllUsageData(): void {
  const keysToRemove = [
    STORAGE_KEYS.USAGE_STATS,
    STORAGE_KEYS.PLAN,
    STORAGE_KEYS.LAST_RESET,
    STORAGE_KEYS.AD_UNLOCK,
    STORAGE_KEYS.AD_EVENTS,
    STORAGE_KEYS.ANALYTICS,
  ];

  for (const key of keysToRemove) {
    storageManager.remove(key);
  }
}

export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const test = "__storage_test__";
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
