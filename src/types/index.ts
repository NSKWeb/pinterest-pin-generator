import type { PlanType } from "@/lib/config";

export type UsageState = {
  plan: PlanType | null;
  ideasUsed: number;
  promptsUsed: number;
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

export type PinIdea = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
};

export type ImagePrompt = {
  id: string;
  main_prompt: string;
  style_guide: string;
  negative_prompt: string;
};

export type IdeaResponse = {
  success: boolean;
  ideas: PinIdea[];
  count: number;
  generatedAt: string;
};

export type PromptResponse = {
  success: boolean;
  ideaId: string;
  prompts: ImagePrompt[];
  variationCount: number;
};
