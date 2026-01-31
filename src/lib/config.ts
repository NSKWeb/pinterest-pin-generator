export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "PinSpark";

export const STORAGE_KEYS = {
  plan: "pinspark_plan",
  usage: "pinspark_usage",
  lastReset: "pinspark_last_reset",
};

export type PlanType = "PlanA" | "PlanB" | "PlanC";

export type PlanConfig = {
  id: PlanType;
  name: string;
  description: string;
  limit: number | null;
  ads: string;
  highlights: string[];
};

export const PLAN_CONFIG: Record<PlanType, PlanConfig> = {
  PlanA: {
    id: "PlanA",
    name: "Plan A · Unlimited Ads",
    description: "Unlimited generations with heavy ads for maximum access.",
    limit: null,
    ads: "Heavy ads",
    highlights: [
      "Unlimited pin ideas",
      "Full access to generator",
      "Best for high-volume creators",
    ],
  },
  PlanB: {
    id: "PlanB",
    name: "Plan B · Limited Free",
    description: "5 daily ideas with light ads for steady workflows.",
    limit: 5,
    ads: "Light ads",
    highlights: [
      "5 ideas per day",
      "Light ad experience",
      "Great for casual use",
    ],
  },
  PlanC: {
    id: "PlanC",
    name: "Plan C · Watch & Unlock",
    description: "3 free ideas daily, watch ads to unlock more.",
    limit: 3,
    ads: "Rewarded ads",
    highlights: [
      "3 ideas per day",
      "Watch ads for extra credits",
      "Flexible for experiments",
    ],
  },
};
