import type { PlanType } from "@/lib/config";
import type { GenerationType, PlanLimits } from "@/types/usage";

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  PlanA: {
    ideasPerDay: Infinity,
    promptsPerDay: Infinity,
    imagesPerDay: Infinity,
    extraPerAd: 0,
    maxAdsPerDay: 0,
    unlocked: true,
  },
  PlanB: {
    ideasPerDay: 10,
    promptsPerDay: 10,
    imagesPerDay: 10,
    extraPerAd: 0,
    maxAdsPerDay: 0,
    unlocked: false,
  },
  PlanC: {
    ideasPerDay: 5,
    promptsPerDay: 5,
    imagesPerDay: 5,
    extraPerAd: 2,
    maxAdsPerDay: 10,
    unlocked: false,
  },
};

export const RESET_HOUR_UTC = 0;
export const EXTRA_PER_AD = 2;
export const AD_VIDEO_DURATION = 30;

export function getPlanLimits(plan: PlanType | null): PlanLimits {
  if (!plan) {
    return {
      ideasPerDay: 0,
      promptsPerDay: 0,
      imagesPerDay: 0,
      extraPerAd: 0,
      maxAdsPerDay: 0,
      unlocked: false,
    };
  }
  return PLAN_LIMITS[plan];
}

export function getLimitForType(plan: PlanType | null, type: GenerationType): number {
  const limits = getPlanLimits(plan);

  switch (type) {
    case "idea":
      return limits.ideasPerDay;
    case "prompt":
      return limits.promptsPerDay;
    case "image":
      return limits.imagesPerDay;
    default:
      return 0;
  }
}

export function getUsageKeyForType(type: GenerationType): keyof {
  ideasGenerated: number;
  promptsGenerated: number;
  imagesGenerated: number;
} {
  switch (type) {
    case "idea":
      return "ideasGenerated";
    case "prompt":
      return "promptsGenerated";
    case "image":
      return "imagesGenerated";
    default:
      return "ideasGenerated";
  }
}

export function isUnlimited(plan: PlanType | null): boolean {
  if (!plan) return false;
  return PLAN_LIMITS[plan].unlocked;
}

export function canWatchAds(plan: PlanType | null): boolean {
  if (!plan) return false;
  return plan === "PlanC";
}

export function formatLimit(limit: number): string {
  if (limit === Infinity) return "∞";
  return limit.toString();
}

export function getPlanDisplayName(plan: PlanType | null): string {
  if (!plan) return "No Plan";

  const names: Record<PlanType, string> = {
    PlanA: "Unlimited ✨",
    PlanB: "Limited Free",
    PlanC: "Watch & Unlock 🎬",
  };

  return names[plan];
}
