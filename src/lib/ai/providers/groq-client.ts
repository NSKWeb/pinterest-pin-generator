// Groq AI Client Implementation

import { config } from '../../config';
import { log } from '../../logger';
import { GenerationError } from '../../error-handler';
import {
  ChatMessage,
  GenerationRequest,
  GenerationResponse,
  ProviderStatus,
} from '../../types/ai-provider';

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

export class GroqClient {
  private apiKey: string;
  private status: ProviderStatus;

  constructor(apiKey?: string) {
    const key = apiKey || config.GROQ_API_KEY;
    if (!key) {
      throw new Error('Groq API key is required');
    }

    this.apiKey = key;

    this.status = {
      provider: 'groq',
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
      log.generation.start('groq-chat-completion', {
        model: request.model,
        messageCount: request.messages.length,
      });

      // Prepare messages with system prompt
      const allMessages: ChatMessage[] = request.systemPrompt
        ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
        : request.messages;

      const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || 'llama-3.1-70b-versatile',
          messages: allMessages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error?.message || `Groq error: ${response.status}`);
      }

      const data = await response.json();

      const content = data.choices[0]?.message?.content || '';
      const usage = data.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      };

      const cost = this.calculateCost(usage);

      // Update status
      this.updateStatus(true, Date.now() - startTime);

      log.generation.complete('groq-chat-completion', {
        model: request.model,
        tokens: usage.total_tokens,
        cost,
        provider: 'groq',
      });

      return {
        content,
        provider: 'groq',
        model: data.model || request.model || 'llama-3.1-70b-versatile',
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
      
      log.generation.error('groq-chat-completion', error);
      
      throw new GenerationError(
        `Groq error: ${error.message || 'Unknown error'}`,
        'groq'
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
        'Failed to parse Groq response as JSON',
        'groq'
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

  private calculateCost(usage: {
    prompt_tokens: number;
    completion_tokens: number;
  }): number {
    // Groq pricing (as of Dec 2024)
    const PRICING: Record<string, { prompt: number; completion: number }> = {
      'llama-3.1-70b-versatile': {
        prompt: 0.59, // per 1M tokens
        completion: 0.79,
      },
      'llama-3.1-8b-instant': {
        prompt: 0.05,
        completion: 0.05,
      },
      'mixtral-8x7b-32768': {
        prompt: 0.27,
        completion: 0.27,
      },
      'gemma-7b-it': {
        prompt: 0.07,
        completion: 0.07,
      },
    };

    const model = 'llama-3.1-70b-versatile'; // Default model
    const pricing = PRICING[model] || PRICING['llama-3.1-70b-versatile'];

    const promptCost = (usage.prompt_tokens / 1_000_000) * pricing.prompt;
    const completionCost =
      (usage.completion_tokens / 1_000_000) * pricing.completion;

    return promptCost + completionCost;
  }
}

export function getGroqClient(): GroqClient {
  return new GroqClient();
}