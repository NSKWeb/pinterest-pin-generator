import { useState, useCallback, useEffect } from "react";
import { UNLOCK_REWARDS } from "@/lib/adConfig";
import { getTodayVideoAdsWatched, logVideoWatch } from "@/lib/adTracking";
import { STORAGE_KEYS } from "@/lib/config";
import type { PlanType, AdUnlockState } from "@/types/ads";

interface StoredUnlockState {
  unlockedCount: number;
  lastAdWatchedAt: string | null;
}

function getStoredState(): StoredUnlockState {
  if (typeof window === "undefined") {
    return { unlockedCount: 0, lastAdWatchedAt: null };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.adUnlock);
    if (!stored) return { unlockedCount: 0, lastAdWatchedAt: null };
    return JSON.parse(stored) as StoredUnlockState;
  } catch {
    return { unlockedCount: 0, lastAdWatchedAt: null };
  }
}

function saveStoredState(state: StoredUnlockState): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.adUnlock, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving ad unlock state:", error);
  }
}

export function useAdUnlock(plan: PlanType | null) {
  const [state, setState] = useState<StoredUnlockState>({ unlockedCount: 0, lastAdWatchedAt: null });
  const [isWatching, setIsWatching] = useState(false);
  const [watchError, setWatchError] = useState<string | null>(null);

  useEffect(() => {
    setState(getStoredState());
  }, []);

  const canWatchMoreAds = useCallback((): boolean => {
    if (plan !== "PlanC") return false;
    
    const config = UNLOCK_REWARDS.PlanC;
    const todayWatched = getTodayVideoAdsWatched();
    
    return todayWatched < config.maxAdsPerDay;
  }, [plan]);

  const watchAdToUnlock = useCallback(async (count: number = 2): Promise<boolean> => {
    if (!plan) {
      setWatchError("Please select a plan first");
      return false;
    }

    if (plan !== "PlanC") {
      setWatchError("Watch to unlock is only available for Plan C");
      return false;
    }

    if (!canWatchMoreAds()) {
      setWatchError("You've reached the daily limit for watching ads");
      return false;
    }

    setIsWatching(true);
    setWatchError(null);

    try {
      // Simulate video ad playback (replace with actual Viads SDK call)
      await new Promise((resolve) => setTimeout(resolve, 30000));

      // Log the video watch
      logVideoWatch("video-before-download", "viads", plan, true);

      // Update state
      const now = new Date().toISOString();
      const newState: StoredUnlockState = {
        unlockedCount: state.unlockedCount + count,
        lastAdWatchedAt: now,
      };
      setState(newState);
      saveStoredState(newState);

      setIsWatching(false);
      return true;
    } catch (error) {
      console.error("Error watching ad:", error);
      setWatchError("Failed to play ad. Please try again.");
      logVideoWatch("video-before-download", "viads", plan, false);
      setIsWatching(false);
      return false;
    }
  }, [plan, state.unlockedCount, canWatchMoreAds]);

  const markAdWatched = useCallback((count: number = 2): void => {
    const now = new Date().toISOString();
    const newState: StoredUnlockState = {
      unlockedCount: state.unlockedCount + count,
      lastAdWatchedAt: now,
    };
    setState(newState);
    saveStoredState(newState);
  }, [state.unlockedCount]);

  const getUnlockCount = useCallback((): number => {
    return state.unlockedCount;
  }, [state.unlockedCount]);

  const getAdUnlockState = useCallback((): AdUnlockState => {
    const todayWatched = getTodayVideoAdsWatched();
    const config = UNLOCK_REWARDS.PlanC;
    
    return {
      unlockedCount: state.unlockedCount,
      lastAdWatchedAt: state.lastAdWatchedAt,
      canWatchMore: plan === "PlanC" && todayWatched < config.maxAdsPerDay,
    };
  }, [state.unlockedCount, state.lastAdWatchedAt, plan]);

  const resetUnlockState = useCallback((): void => {
    const newState: StoredUnlockState = {
      unlockedCount: 0,
      lastAdWatchedAt: null,
    };
    setState(newState);
    saveStoredState(newState);
  }, []);

  return {
    unlockState: getAdUnlockState(),
    watchAdToUnlock,
    markAdWatched,
    getUnlockCount,
    canWatchMoreAds,
    isWatching,
    watchError,
    resetUnlockState,
  };
}
