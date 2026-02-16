// OpenRouter AI Integration

import { config } from '../config';
import { log } from '../logger';
import { GenerationError } from '../error-handler';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
}

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

// Default options
const DEFAULT_OPTIONS: Required<GenerationOptions> = {
  model: config.OPENROUTER_FAST_MODEL,
  temperature: 0.7,
  maxTokens: 2000,
  systemPrompt: 'You are a helpful AI assistant.',
};

// Chat completion
export async function createChatCompletion(
  messages: ChatMessage[],
  options: GenerationOptions = {}
): Promise<ChatCompletionResponse> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Prepare messages with system prompt
  const allMessages: ChatMessage[] = [
    { role: 'system', content: opts.systemPrompt },
    ...messages,
  ];

  try {
    log.generation.start('chat-completion', { model: opts.model, messageCount: messages.length });

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.NEXT_PUBLIC_APP_URL,
        'X-Title': config.NEXT_PUBLIC_APP_NAME,
      },
      body: JSON.stringify({
        model: opts.model,
        messages: allMessages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `OpenRouter error: ${response.status}`);
    }

    const data = await response.json() as ChatCompletionResponse;
    
    log.generation.complete('chat-completion', {
      model: opts.model,
      tokens: data.usage.total_tokens,
    });

    return data;
  } catch (error) {
    log.generation.error('chat-completion', error);
    throw new GenerationError(
      (error as Error).message || 'Failed to generate completion',
      'openrouter'
    );
  }
}

// Generate text (simplified)
export async function generateText(
  prompt: string,
  options: GenerationOptions = {}
): Promise<string> {
  const response = await createChatCompletion(
    [{ role: 'user', content: prompt }],
    options
  );

  return response.choices[0]?.message?.content || '';
}

// Generate JSON
export async function generateJSON<T = any>(
  prompt: string,
  schema: object,
  options: GenerationOptions = {}
): Promise<T> {
  const opts = {
    ...options,
    systemPrompt: `${options.systemPrompt || ''}\n\nYou must respond with valid JSON that matches this schema:\n${JSON.stringify(schema, null, 2)}`,
  };

  const response = await createChatCompletion(
    [{ role: 'user', content: prompt }],
    opts
  );

  try {
    const content = response.choices[0]?.message?.content || '';
    return JSON.parse(content) as T;
  } catch {
    throw new GenerationError('Failed to parse AI response as JSON', 'openrouter');
  }
}

// Model selection helpers
export function getModelForTask(task: 'fast' | 'quality' | 'blog' | 'code' = 'fast'): string {
  switch (task) {
    case 'fast':
      return config.OPENROUTER_FAST_MODEL;
    case 'quality':
      return config.OPENROUTER_QUALITY_MODEL;
    case 'blog':
      return config.OPENROUTER_BLOG_MODEL;
    case 'code':
      return config.OPENROUTER_CODE_MODEL;
    default:
      return config.OPENROUTER_FAST_MODEL;
  }
}

// Calculate cost (approximate)
export function calculateCost(usage: { prompt_tokens: number; completion_tokens: number }): number {
  // Approximate pricing per 1M tokens
  const PRICING = {
    'gpt-4o-mini': { prompt: 0.15, completion: 0.6 },
    'gpt-4o': { prompt: 2.5, completion: 10 },
    'claude-3.5-sonnet': { prompt: 3, completion: 15 },
    'default': { prompt: 0.5, completion: 2 },
  };

  const modelPricing = PRICING['default']; // Simplified
  const promptCost = (usage.prompt_tokens / 1_000_000) * modelPricing.prompt;
  const completionCost = (usage.completion_tokens / 1_000_000) * modelPricing.completion;

  return promptCost + completionCost;
}