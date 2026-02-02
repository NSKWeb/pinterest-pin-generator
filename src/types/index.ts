import type { PlanType } from "@/lib/config";

export type UsageState = {
  plan: PlanType | null;
  ideasUsed: number;
  promptsUsed: number;
  imagesUsed: number;
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

export type GeneratedImage = {
  id: string;
  url: string;
  width: number;
  height: number;
  aspectRatio: string;
  generatedAt: string;
  seed: number;
  generationTime: number;
  model: string;
};

export type ImageGenerationResponse = {
  success: boolean;
  generatedAt: string;
  promptId: string;
  images: GeneratedImage[];
  totalGenerationTime: number;
  variationCount: number;
};

export interface StoredImage {
  id: string;
  ideaId: string;
  promptId: string;
  imageUrl: string;
  generatedAt: string;
  prompt: string;
  generationTime: number;
  pinTitle: string;
  aspectRatio: string;
}

// Re-export ad types
export type {
  AdNetwork,
  AdType,
  AdFrequency,
  AdEventType,
  AdPlacement,
  AdEvent,
  AdStats,
  AdSettings,
  AdConfig,
  AdUnlockState,
} from "./ads";
