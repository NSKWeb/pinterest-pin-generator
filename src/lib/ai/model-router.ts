// Model Router - Determines best provider/model for each task

import { AIProviderType, TaskType, ModelInfo, SelectionMode } from '../../types/ai-provider';

// Define available models for both providers
export const OPENROUTER_MODELS: ModelInfo[] = [
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'openrouter',
    contextLength: 128000,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 2.5, completion: 10 },
    recommendedFor: ['blogs', 'general'],
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openrouter',
    contextLength: 128000,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.15, completion: 0.6 },
    recommendedFor: ['recipes', 'pins', 'bulk', 'general'],
  },
  {
    id: 'anthropic/claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'openrouter',
    contextLength: 200000,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 3, completion: 15 },
    recommendedFor: ['seo', 'blogs', 'general'],
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'openrouter',
    contextLength: 200000,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.25, completion: 1.25 },
    recommendedFor: ['pins', 'bulk', 'general'],
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'openrouter',
    contextLength: 32768,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.35, completion: 1.05 },
    recommendedFor: ['general'],
  },
];

export const GROQ_MODELS: ModelInfo[] = [
  {
    id: 'llama-3.1-70b-versatile',
    name: 'Llama 3.1 70B',
    provider: 'groq',
    contextLength: 32768,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.59, completion: 0.79 },
    recommendedFor: ['blogs', 'general'],
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    provider: 'groq',
    contextLength: 8192,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.05, completion: 0.05 },
    recommendedFor: ['recipes', 'pins', 'bulk', 'general'],
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Mixtral 8x7B',
    provider: 'groq',
    contextLength: 32768,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.27, completion: 0.27 },
    recommendedFor: ['seo', 'blogs', 'general'],
  },
  {
    id: 'gemma-7b-it',
    name: 'Gemma 7B',
    provider: 'groq',
    contextLength: 8192,
    supportsStreaming: true,
    supportsJson: true,
    pricing: { prompt: 0.07, completion: 0.07 },
    recommendedFor: ['pins', 'bulk', 'general'],
  },
];

// All available models
export const ALL_MODELS: ModelInfo[] = [...OPENROUTER_MODELS, ...GROQ_MODELS];

// Task to provider/model mapping
export const TASK_MAPPINGS: Record<TaskType, { primary: { provider: AIProviderType; model: string }; fallback: { provider: AIProviderType; model: string } }> = {
  recipes: {
    primary: { provider: 'groq', model: 'llama-3.1-8b-instant' },
    fallback: { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
  },
  blogs: {
    primary: { provider: 'openrouter', model: 'openai/gpt-4o' },
    fallback: { provider: 'groq', model: 'llama-3.1-70b-versatile' },
  },
  seo: {
    primary: { provider: 'openrouter', model: 'anthropic/claude-3-5-sonnet-20241022' },
    fallback: { provider: 'groq', model: 'mixtral-8x7b-32768' },
  },
  pins: {
    primary: { provider: 'groq', model: 'llama-3.1-8b-instant' },
    fallback: { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
  },
  bulk: {
    primary: { provider: 'groq', model: 'llama-3.1-8b-instant' },
    fallback: { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
  },
  general: {
    primary: { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
    fallback: { provider: 'groq', model: 'llama-3.1-8b-instant' },
  },
};

export function getProviderForTask(
  taskType: TaskType,
  selectionMode: SelectionMode = 'auto-cheapest'
): { provider: AIProviderType; model: string } {
  switch (selectionMode) {
    case 'auto-cheapest':
      return getCheapestForTask(taskType);
    case 'auto-fastest':
      return getFastestForTask(taskType);
    case 'manual':
      // Return primary configured mapping
      return TASK_MAPPINGS[taskType].primary;
    default:
      return TASK_MAPPINGS[taskType].primary;
  }
}

function getCheapestForTask(taskType: TaskType): { provider: AIProviderType; model: string } {
  const mapping = TASK_MAPPINGS[taskType];
  
  // Compare costs between primary and fallback
  const primaryModel = ALL_MODELS.find(m => m.id === mapping.primary.model);
  const fallbackModel = ALL_MODELS.find(m => m.id === mapping.fallback.model);
  
  if (!primaryModel || !fallbackModel) {
    return mapping.primary;
  }

  const primaryCost = primaryModel.pricing.prompt + primaryModel.pricing.completion;
  const fallbackCost = fallbackModel.pricing.prompt + fallbackModel.pricing.completion;

  return fallbackCost < primaryCost ? mapping.fallback : mapping.primary;
}

function getFastestForTask(taskType: TaskType): { provider: AIProviderType; model: string } {
  const mapping = TASK_MAPPINGS[taskType];
  
  // Generally, smaller models are faster
  const primaryModel = ALL_MODELS.find(m => m.id === mapping.primary.model);
  const fallbackModel = ALL_MODELS.find(m => m.id === mapping.fallback.model);
  
  if (!primaryModel || !fallbackModel) {
    return mapping.primary;
  }

  // Prefer smaller context models as they're typically faster
  return primaryModel.contextLength < fallbackModel.contextLength
    ? mapping.primary
    : mapping.fallback;
}

export function getModelById(modelId: string): ModelInfo | undefined {
  return ALL_MODELS.find(m => m.id === modelId);
}

export function getModelsByProvider(provider: AIProviderType): ModelInfo[] {
  return ALL_MODELS.filter(m => m.provider === provider);
}

export function getModelsByTask(taskType: TaskType): ModelInfo[] {
  const mapping = TASK_MAPPINGS[taskType];
  const models: ModelInfo[] = [];
  
  const primaryModel = ALL_MODELS.find(m => m.id === mapping.primary.model);
  const fallbackModel = ALL_MODELS.find(m => m.id === mapping.fallback.model);
  
  if (primaryModel) models.push(primaryModel);
  if (fallbackModel && fallbackModel.id !== mapping.primary.model) {
    models.push(fallbackModel);
  }
  
  return models;
}

export function getTaskTypes(): TaskType[] {
  return ['recipes', 'blogs', 'seo', 'pins', 'bulk', 'general'];
}

export function getAllProviders(): AIProviderType[] {
  return ['openrouter', 'groq'];
}