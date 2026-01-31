import type { PlanType } from "@/lib/config";

export type UsageState = {
  plan: PlanType | null;
  used: number;
  limit: number | null;
  lastReset: string | null;
};

export type PlanOption = {
  id: PlanType;
  name: string;
  description: string;
  limit: number | null;
  ads: string;
  highlights: string[];
};
