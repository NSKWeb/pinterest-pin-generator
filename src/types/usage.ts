import type { PlanType } from "@/lib/config";

export interface DailyUsage {
  date: string;
  ideasGenerated: number;
  promptsGenerated: number;
  imagesGenerated: number;
  videoAdsWatched: number;
  extraUnlocked: number;
  lastReset: string;
  plan: PlanType | null;
}

export interface LifetimeStats {
  totalIdeas: number;
  totalPrompts: number;
  totalImages: number;
  totalAdsWatched: number;
}

export interface UsageStats {
  today: DailyUsage;
  lifetime: LifetimeStats;
  lastUpdated: string;
}

export type GenerationType = "idea" | "prompt" | "image";

export interface LimitCheckResult {
  allowed: boolean;
  remaining: number;
  message?: string;
  canWatchAd?: boolean;
}

export interface PlanLimits {
  ideasPerDay: number;
  promptsPerDay: number;
  imagesPerDay: number;
  extraPerAd: number;
  maxAdsPerDay: number;
  unlocked: boolean;
}

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
}

export interface UsageEvent {
  type: GenerationType;
  count: number;
  plan: PlanType;
  timestamp: string;
  remaining: number;
}

export interface LimitReachedEvent {
  type: GenerationType;
  plan: PlanType;
  timestamp: string;
  dailyUsage: number;
  limit: number;
}

export interface AnalyticsData {
  events: UsageEvent[];
  limitReachedEvents: LimitReachedEvent[];
  planSwitches: Array<{
    from: PlanType | null;
    to: PlanType;
    timestamp: string;
  }>;
}
