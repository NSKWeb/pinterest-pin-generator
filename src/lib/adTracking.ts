import type { AdEventType, AdNetwork, AdEvent, AdStats } from "@/types/ads";
import type { PlanType } from "@/lib/config";
import { STORAGE_KEYS } from "@/lib/config";

const MAX_EVENTS = 1000;

function getStoredEvents(): AdEvent[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.adEvents);
    if (!stored) return [];
    const events = JSON.parse(stored) as AdEvent[];
    return events.map((event) => ({
      ...event,
      timestamp: new Date(event.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveStoredEvents(events: AdEvent[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.adEvents, JSON.stringify(events));
  } catch {
    // Handle storage quota exceeded
    const trimmed = events.slice(-MAX_EVENTS);
    try {
      localStorage.setItem(STORAGE_KEYS.adEvents, JSON.stringify(trimmed));
    } catch {
      // Still failing, clear and save only latest
      localStorage.setItem(STORAGE_KEYS.adEvents, JSON.stringify(events.slice(-100)));
    }
  }
}

export function logAdImpression(placement: string, network: AdNetwork, plan: PlanType): void {
  logAdEvent("impression", placement, network, plan);
}

export function logAdClick(placement: string, network: AdNetwork, plan: PlanType): void {
  logAdEvent("click", placement, network, plan);
}

export function logVideoWatch(placement: string, network: AdNetwork, plan: PlanType, completed: boolean): void {
  logAdEvent(completed ? "complete" : "skip", placement, network, plan);
}

export function logAdError(placement: string, network: AdNetwork, plan: PlanType): void {
  logAdEvent("error", placement, network, plan);
}

function logAdEvent(type: AdEventType, placement: string, network: AdNetwork, plan: PlanType): void {
  const event: AdEvent = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    network,
    placement,
    timestamp: new Date(),
    plan,
  };

  const events = getStoredEvents();
  events.push(event);

  // Keep only recent events to prevent storage overflow
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }

  saveStoredEvents(events);

  if (process.env.NEXT_PUBLIC_AD_DEBUG_MODE === "true") {
    console.log("[Ad Tracking]", type, placement, network, plan);
  }
}

export function getAdStats(): AdStats {
  const events = getStoredEvents();
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentEvents = events.filter((e) => e.timestamp >= oneDayAgo);

  const stats: AdStats = {
    impressions: recentEvents.filter((e) => e.type === "impression").length,
    clicks: recentEvents.filter((e) => e.type === "click").length,
    videoWatches: recentEvents.filter((e) => e.type === "complete").length,
    videoSkips: recentEvents.filter((e) => e.type === "skip").length,
    byPlacement: {},
    byNetwork: {
      adsense: 0,
      viads: 0,
    },
  };

  recentEvents.forEach((event) => {
    stats.byPlacement[event.placement] = (stats.byPlacement[event.placement] || 0) + 1;
    stats.byNetwork[event.network] = (stats.byNetwork[event.network] || 0) + 1;
  });

  return stats;
}

export function clearAdStats(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.adEvents);
}

export function getTodayVideoAdsWatched(): number {
  const events = getStoredEvents();
  const today = new Date().toDateString();
  
  return events.filter((e) => 
    e.type === "complete" && 
    new Date(e.timestamp).toDateString() === today
  ).length;
}
