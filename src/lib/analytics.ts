import type { PlanType } from "@/lib/config";
import type {
  GenerationType,
  UsageEvent,
  LimitReachedEvent,
  AnalyticsData,
} from "@/types/usage";
import { STORAGE_KEYS } from "@/utils/localStorage";

const MAX_EVENTS = 500;
const ANALYTICS_KEY = STORAGE_KEYS.ANALYTICS;

function getStoredAnalytics(): AnalyticsData {
  if (typeof window === "undefined") {
    return { events: [], limitReachedEvents: [], planSwitches: [] };
  }

  try {
    const stored = localStorage.getItem(ANALYTICS_KEY);
    if (!stored) {
      return { events: [], limitReachedEvents: [], planSwitches: [] };
    }

    const parsed = JSON.parse(stored) as AnalyticsData;
    return {
      events: parsed.events || [],
      limitReachedEvents: parsed.limitReachedEvents || [],
      planSwitches: parsed.planSwitches || [],
    };
  } catch {
    return { events: [], limitReachedEvents: [], planSwitches: [] };
  }
}

function saveAnalytics(analytics: AnalyticsData): void {
  if (typeof window === "undefined") return;

  try {
    const trimmedAnalytics: AnalyticsData = {
      events: analytics.events.slice(-MAX_EVENTS),
      limitReachedEvents: analytics.limitReachedEvents.slice(-MAX_EVENTS),
      planSwitches: analytics.planSwitches.slice(-MAX_EVENTS),
    };

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(trimmedAnalytics));
  } catch (error) {
    console.error("Error saving analytics:", error);
  }
}

export function logUsageIncrement(
  type: GenerationType,
  count: number,
  plan: PlanType | null,
  remaining: number,
): void {
  const analytics = getStoredAnalytics();

  const event: UsageEvent = {
    type,
    count,
    plan: plan || "PlanB",
    timestamp: new Date().toISOString(),
    remaining,
  };

  analytics.events.push(event);

  if (analytics.events.length > MAX_EVENTS) {
    analytics.events = analytics.events.slice(-MAX_EVENTS);
  }

  saveAnalytics(analytics);

  if (process.env.NEXT_PUBLIC_AD_DEBUG_MODE === "true") {
    console.log("[Analytics] Usage increment:", event);
  }
}

export function logLimitReached(
  type: GenerationType,
  plan: PlanType | null,
  dailyUsage: number,
  limit: number,
): void {
  const analytics = getStoredAnalytics();

  const event: LimitReachedEvent = {
    type,
    plan: plan || "PlanB",
    timestamp: new Date().toISOString(),
    dailyUsage,
    limit,
  };

  analytics.limitReachedEvents.push(event);

  if (analytics.limitReachedEvents.length > MAX_EVENTS) {
    analytics.limitReachedEvents = analytics.limitReachedEvents.slice(-MAX_EVENTS);
  }

  saveAnalytics(analytics);

  if (process.env.NEXT_PUBLIC_AD_DEBUG_MODE === "true") {
    console.log("[Analytics] Limit reached:", event);
  }
}

export function logPlanSwitch(
  oldPlan: PlanType | null,
  newPlan: PlanType,
): void {
  const analytics = getStoredAnalytics();

  analytics.planSwitches.push({
    from: oldPlan,
    to: newPlan,
    timestamp: new Date().toISOString(),
  });

  if (analytics.planSwitches.length > MAX_EVENTS) {
    analytics.planSwitches = analytics.planSwitches.slice(-MAX_EVENTS);
  }

  saveAnalytics(analytics);

  if (process.env.NEXT_PUBLIC_AD_DEBUG_MODE === "true") {
    console.log("[Analytics] Plan switch:", { from: oldPlan, to: newPlan });
  }
}

export function logAdWatched(
  completed: boolean,
  unlockedCount: number,
  plan: PlanType,
): void {
  const analytics = getStoredAnalytics();

  const adEvent: UsageEvent = {
    type: completed ? "image" : "prompt",
    count: completed ? 1 : 0,
    plan,
    timestamp: new Date().toISOString(),
    remaining: unlockedCount,
  };

  analytics.events.push(adEvent);

  saveAnalytics(analytics);

  if (process.env.NEXT_PUBLIC_AD_DEBUG_MODE === "true") {
    console.log("[Analytics] Ad watched:", { completed, unlockedCount, plan });
  }
}

export function getAnalytics(): AnalyticsData {
  return getStoredAnalytics();
}

export function clearAnalytics(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ANALYTICS_KEY);
}

export function getTodayStats(): {
  generations: number;
  limitReached: number;
  adsWatched: number;
} {
  const analytics = getStoredAnalytics();
  const today = new Date().toDateString();

  const todayEvents = analytics.events.filter(
    (e) => new Date(e.timestamp).toDateString() === today,
  );

  const generations = todayEvents.filter(
    (e) => e.type === "idea" || e.type === "prompt" || e.type === "image",
  ).length;

  const adsWatched = todayEvents.length - generations;

  const limitReached = analytics.limitReachedEvents.filter(
    (e) => new Date(e.timestamp).toDateString() === today,
  ).length;

  return { generations, limitReached, adsWatched };
}

export function getUsageByPlan(): Record<PlanType, number> {
  const analytics = getStoredAnalytics();

  const stats: Record<PlanType, number> = {
    PlanA: 0,
    PlanB: 0,
    PlanC: 0,
  };

  analytics.events.forEach((event) => {
    if (event.type === "idea" || event.type === "prompt" || event.type === "image") {
      stats[event.plan] = (stats[event.plan] || 0) + event.count;
    }
  });

  return stats;
}

export function getLimitHitRate(): number {
  const analytics = getStoredAnalytics();

  if (analytics.events.length === 0) return 0;

  const totalGenerations = analytics.events.filter(
    (e) => e.type === "idea" || e.type === "prompt" || e.type === "image",
  ).length;

  if (totalGenerations === 0) return 0;

  return (analytics.limitReachedEvents.length / totalGenerations) * 100;
}

export function exportAnalytics(): string {
  const analytics = getStoredAnalytics();

  return JSON.stringify(
    {
      ...analytics,
      exportedAt: new Date().toISOString(),
      summary: {
        today: getTodayStats(),
        byPlan: getUsageByPlan(),
        limitHitRate: getLimitHitRate(),
      },
    },
    null,
    2,
  );
}
