// AI Provider Type Definitions

export type AIProviderType = 'openrouter' | 'groq';

export type TaskType = 'recipes' | 'blogs' | 'seo' | 'pins' | 'bulk' | 'general';

export type SelectionMode = 'auto-cheapest' | 'auto-fastest' | 'manual';

export interface ProviderConfig {
  type: AIProviderType;
  apiKey: string;
  baseUrl?: string;
  enabled: boolean;
  priority: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: AIProviderType;
  contextLength: number;
  supportsStreaming: boolean;
  supportsJson: boolean;
  pricing: {
    prompt: number; // per 1M tokens
    completion: number; // per 1M tokens
  };
  recommendedFor: TaskType[];
}

export interface TaskProviderMapping {
  taskType: TaskType;
  primaryProvider: AIProviderType;
  primaryModel: string;
  fallbackProvider: AIProviderType;
  fallbackModel: string;
  autoSelect: boolean;
}

export interface ProviderStatus {
  provider: AIProviderType;
  healthy: boolean;
  lastChecked: Date;
  latency?: number;
  error?: string;
  failureCount: number;
}

export interface UsageStats {
  provider: AIProviderType;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  requests: number;
  cost: number;
  period: string;
}

export interface CostComparison {
  provider: AIProviderType;
  model: string;
  promptPricePer1M: number;
  completionPricePer1M: number;
  averageTotalPricePer1M: number;
}

export interface FallbackConfig {
  enabled: boolean;
  maxRetries: number;
  retryDelayMs: number;
  backoffMultiplier: number;
  circuitBreakerThreshold: number;
  circuitBreakerResetMs: number;
}

export interface GenerationRequest {
  messages: ChatMessage[];
  model?: string;
  provider?: AIProviderType;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  responseFormat?: 'text' | 'json';
}

export interface GenerationResponse {
  content: string;
  provider: AIProviderType;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  finishReason: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderPreference {
  id: string;
  adminId: string;
  defaultProvider: AIProviderType;
  fallbackEnabled: boolean;
  taskMappings: TaskProviderMapping[];
  monthlyBudgetPerProvider?: {
    openrouter?: number;
    groq?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderHealth {
  provider: AIProviderType;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency: number;
  lastCheck: Date;
  errorRate: number;
}
