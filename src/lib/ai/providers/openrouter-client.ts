// OpenRouter AI Client Implementation

import { config } from '../../config';
import { log } from '../../logger';
import { GenerationError } from '../../error-handler';
import {
  ChatMessage,
  GenerationRequest,
  GenerationResponse,
  ProviderStatus,
} from '../../types/ai-provider';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterClient {
  private status: ProviderStatus;

  constructor() {
    this.status = {
      provider: 'openrouter',
      healthy: true,
      lastChecked: new Date(),
      failureCount: 0,
    };
  }

  async createChatCompletion(
    request: GenerationRequest
  ): Promise<GenerationResponse> {
    const startTime = Date.now();

    try {
      log.generation.start('openrouter-chat-completion', {
        model: request.model,
        messageCount: request.messages.length,
      });

      // Prepare messages with system prompt
      const allMessages: ChatMessage[] = request.systemPrompt
        ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
        : request.messages;

      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': config.NEXT_PUBLIC_APP_URL,
          'X-Title': config.NEXT_PUBLIC_APP_NAME,
        },
        body: JSON.stringify({
          model: request.model || config.OPENROUTER_FAST_MODEL,
          messages: allMessages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.message || `OpenRouter error: ${response.status}`
        );
      }

      const data = await response.json();

      const content = data.choices[0]?.message?.content || '';
      const usage = data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      const cost = this.calculateCost(usage, data.model);

      // Update status
      this.updateStatus(true, Date.now() - startTime);

      log.generation.complete('openrouter-chat-completion', {
        model: data.model,
        tokens: usage.total_tokens,
        cost,
        provider: 'openrouter',
      });

      return {
        content,
        provider: 'openrouter',
        model: data.model,
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
        },
        cost,
        finishReason: data.choices[0]?.finish_reason || 'stop',
      };
    } catch (error: any) {
      this.updateStatus(false, Date.now() - startTime, error.message);
      
      log.generation.error('openrouter-chat-completion', error);
      
      throw new GenerationError(
        `OpenRouter error: ${error.message || 'Unknown error'}`,
        'openrouter'
      );
    }
  }

  async generateText(
    prompt: string,
    options: Partial<GenerationRequest> = {}
  ): Promise<GenerationResponse> {
    return this.createChatCompletion({
      messages: [{ role: 'user', content: prompt }],
      ...options,
    });
  }

  async generateJSON<T = any>(
    prompt: string,
    options: Partial<GenerationRequest> = {}
  ): Promise<{ data: T; response: GenerationResponse }> {
    const opts = {
      ...options,
      systemPrompt: `${
        options.systemPrompt || ''
      }\n\nYou must respond with valid JSON only.`,
      messages: [{ role: 'user', content: prompt }],
    };

    const response = await this.createChatCompletion(opts);

    try {
      const data = JSON.parse(response.content) as T;
      return { data, response };
    } catch {
      throw new GenerationError(
        'Failed to parse OpenRouter response as JSON',
        'openrouter'
      );
    }
  }

  getStatus(): ProviderStatus {
    return { ...this.status };
  }

  isHealthy(): boolean {
    return this.status.healthy && this.status.failureCount < 3;
  }

  private updateStatus(
    success: boolean,
    latency: number,
    error?: string
  ): void {
    this.status.lastChecked = new Date();
    this.status.latency = latency;

    if (success) {
      this.status.healthy = true;
      this.status.failureCount = 0;
      this.status.error = undefined;
    } else {
      this.status.failureCount++;
      this.status.healthy = this.status.failureCount < 3;
      this.status.error = error;
    }
  }

  private calculateCost(
    usage: { prompt_tokens: number; completion_tokens: number },
    model: string
  ): number {
    // OpenRouter pricing (approximate as of Dec 2024)
    const PRICING: Record<string, { prompt: number; completion: number }> = {
      'openai/gpt-4o': {
        prompt: 2.5,
        completion: 10,
      },
      'openai/gpt-4o-mini': {
        prompt: 0.15,
        completion: 0.6,
      },
      'anthropic/claude-3-5-sonnet-20241022': {
        prompt: 3,
        completion: 15,
      },
      'anthropic/claude-3-haiku': {
        prompt: 0.25,
        completion: 1.25,
      },
      'google/gemini-pro': {
        prompt: 0.35,
        completion: 1.05,
      },
    };

    const pricing =
      PRICING[model] ||
      PRICING['openai/gpt-4o-mini']; // Default to fast model pricing

    const promptCost = (usage.prompt_tokens / 1_000_000) * pricing.prompt;
    const completionCost =
      (usage.completion_tokens / 1_000_000) * pricing.completion;

    return promptCost + completionCost;
  }
}

export function getOpenRouterClient(): OpenRouterClient {
  return new OpenRouterClient();
}