// Provider Manager - Handles provider selection, fallback, and health

import {
  AIProviderType,
  TaskType,
  ProviderStatus,
  FallbackConfig,
  GenerationRequest,
  GenerationResponse,
  ModelInfo,
  CostComparison,
} from '../../../types/ai-provider';
import { ProviderFactory, AIProvider } from './provider-factory';
import { log } from '../../logger';
import { GenerationError } from '../../error-handler';

export class ProviderManager {
  private static instance: ProviderManager;
  private healthChecks: Map<AIProviderType, ProviderStatus> = new Map();
  private fallbackConfig: FallbackConfig = {
    enabled: true,
    maxRetries: 3,
    retryDelayMs: 1000,
    backoffMultiplier: 2,
    circuitBreakerThreshold: 5,
    circuitBreakerResetMs: 300000, // 5 minutes
  };
  private lastHealthCheck: Map<AIProviderType, Date> = new Map();

  // Default model mappings for different tasks
  private modelMappings: Record<TaskType, { provider: AIProviderType; model: string }[]> = {
    recipes: [
      { provider: 'groq', model: 'llama-3.1-8b-instant' },
      { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
    ],
    blogs: [
      { provider: 'openrouter', model: 'openai/gpt-4o' },
      { provider: 'groq', model: 'llama-3.1-70b-versatile' },
    ],
    seo: [
      { provider: 'openrouter', model: 'anthropic/claude-3-5-sonnet-20241022' },
      { provider: 'groq', model: 'mixtral-8x7b-32768' },
    ],
    pins: [
      { provider: 'groq', model: 'llama-3.1-8b-instant' },
      { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
    ],
    bulk: [
      { provider: 'groq', model: 'llama-3.1-8b-instant' },
      { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
    ],
    general: [
      { provider: 'openrouter', model: 'openai/gpt-4o-mini' },
      { provider: 'groq', model: 'llama-3.1-8b-instant' },
    ],
  };

  // Pricing for cost optimization
  private costComparison: CostComparison[] = [
    {
      provider: 'groq',
      model: 'llama-3.1-8b-instant',
      promptPricePer1M: 0.05,
      completionPricePer1M: 0.05,
      averageTotalPricePer1M: 0.05,
    },
    {
      provider: 'groq',
      model: 'llama-3.1-70b-versatile',
      promptPricePer1M: 0.59,
      completionPricePer1M: 0.79,
      averageTotalPricePer1M: 0.69,
    },
    {
      provider: 'openrouter',
      model: 'openai/gpt-4o-mini',
      promptPricePer1M: 0.15,
      completionPricePer1M: 0.6,
      averageTotalPricePer1M: 0.375,
    },
    {
      provider: 'openrouter',
      model: 'openai/gpt-4o',
      promptPricePer1M: 2.5,
      completionPricePer1M: 10,
      averageTotalPricePer1M: 6.25,
    },
    {
      provider: 'openrouter',
      model: 'anthropic/claude-3-5-sonnet-20241022',
      promptPricePer1M: 3,
      completionPricePer1M: 15,
      averageTotalPricePer1M: 9,
    },
  ];

  private constructor() {
    this.initializeHealthMonitoring();
  }

  static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  async generateWithFallback(
    request: GenerationRequest,
    taskType: TaskType = 'general',
    preferredProvider?: AIProviderType
  ): Promise<GenerationResponse> {
    const providers = this.getProviderOrder(taskType, preferredProvider);
    const maxAttempts = this.fallbackConfig.enabled ? providers.length : 1;
    let lastError: Error | null = null;

    for (let i = 0; i < maxAttempts; i++) {
      const providerInfo = providers[i];
      const provider = ProviderFactory.getClient(providerInfo.provider);

      try {
        // Add the selected model to the request
        const enrichedRequest = {
          ...request,
          model: request.model || providerInfo.model,
        };

        log.info(`Attempting generation with ${providerInfo.provider}`, {
          taskType,
          model: providerInfo.model,
          attempt: i + 1,
        });

        const response = await provider.createChatCompletion(enrichedRequest);

        // Log successful provider switch
        if (i > 0) {
          log.info(`Successfully switched to fallback provider`, {
            initialProvider: providers[0].provider,
            fallbackProvider: providerInfo.provider,
            taskType,
          });
        }

        return response;
      } catch (error) {
        lastError = error as Error;
        log.warn(`Provider ${providerInfo.provider} failed`, {
          taskType,
          error: lastError.message,
          attempt: i + 1,
          maxAttempts,
        });

        // Update health status
        this.updateProviderHealth(providerInfo.provider, false, lastError.message);

        // Wait before trying next provider (with exponential backoff)
        if (i < maxAttempts - 1) {
          const delay = this.fallbackConfig.retryDelayMs * Math.pow(this.fallbackConfig.backoffMultiplier, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // All providers failed
    const errorMsg = `All providers failed for task ${taskType}. Last error: ${lastError?.message}`;
    log.error(errorMsg);
    throw new GenerationError(errorMsg);
  }

  async checkProviderHealth(provider: AIProviderType): Promise<ProviderStatus> {
    const lastCheck = this.lastHealthCheck.get(provider);
    const now = new Date();

    // Don't check more frequently than every 30 seconds
    if (lastCheck && now.getTime() - lastCheck.getTime() < 30000) {
      return this.healthChecks.get(provider) || {
        provider,
        healthy: true,
        lastChecked: now,
        failureCount: 0,
      };
    }

    try {
      const client = ProviderFactory.getClient(provider);
      const startTime = Date.now();

      // Simple test request
      const testResponse = await client.generateText('Test', {
        maxTokens: 10,
        temperature: 0,
      });

      const latency = Date.now() - startTime;
      const healthy = testResponse.content.length > 0;

      const status: ProviderStatus = {
        provider,
        healthy,
        lastChecked: now,
        latency,
        failureCount: 0,
      };

      this.healthChecks.set(provider, status);
      this.lastHealthCheck.set(provider, now);

      return status;
    } catch (error) {
      const status: ProviderStatus = {
        provider,
        healthy: false,
        lastChecked: now,
        failureCount: 1,
        error: (error as Error).message,
      };

      this.healthChecks.set(provider, status);
      this.lastHealthCheck.set(provider, now);

      return status;
    }
  }

  getBestProviderForTask(taskType: TaskType): AIProviderType {
    const mappings = this.modelMappings[taskType] || this.modelMappings.general;
    
    // Find first healthy provider
    for (const mapping of mappings) {
      const status = this.healthChecks.get(mapping.provider);
      if (status?.healthy !== false) {
        return mapping.provider;
      }
    }

    // Default to first mapping if all are unhealthy
    return mappings[0].provider;
  }

  getCheapestProvider(): AIProviderType {
    // Find the provider with lowest average cost
    const costs = this.costComparison.reduce((acc, curr) => {
      if (!acc[curr.provider] || curr.averageTotalPricePer1M < acc[curr.provider]) {
        acc[curr.provider] = curr.averageTotalPricePer1M;
      }
      return acc;
    }, {} as Record<AIProviderType, number>);

    // Groq is generally cheaper
    return 'groq';
  }

  getFastestProvider(): AIProviderType {
    // This would ideally be based on actual latency metrics
    // For now, return groq as it's generally faster
    return 'groq';
  }

  getProviderStatus(provider?: AIProviderType): ProviderStatus | Record<AIProviderType, ProviderStatus> {
    if (provider) {
      return this.healthChecks.get(provider) || {
        provider,
        healthy: true,
        lastChecked: new Date(),
        failureCount: 0,
      };
    }

    const allStatuses: Record<AIProviderType, ProviderStatus> = {
      openrouter: {
        provider: 'openrouter',
        healthy: true,
        lastChecked: new Date(),
        failureCount: 0,
      },
      groq: {
        provider: 'groq',
        healthy: true,
        lastChecked: new Date(),
        failureCount: 0,
      },
    };

    for (const [prov, status] of this.healthChecks) {
      allStatuses[prov] = status;
    }

    return allStatuses;
  }

  getCostComparison(): CostComparison[] {
    return [...this.costComparison];
  }

  private getProviderOrder(
    taskType: TaskType,
    preferredProvider?: AIProviderType
  ): Array<{ provider: AIProviderType; model: string }> {
    const mappings = this.modelMappings[taskType] || this.modelMappings.general;

    if (preferredProvider) {
      // Move preferred provider to front
      const preferredMapping = mappings.find(m => m.provider === preferredProvider);
      if (preferredMapping) {
        const otherMappings = mappings.filter(m => m.provider !== preferredProvider);
        return [preferredMapping, ...otherMappings];
      }
    }

    return mappings;
  }

  private updateProviderHealth(
    provider: AIProviderType,
    healthy: boolean,
    error?: string
  ): void {
    const current = this.healthChecks.get(provider) || {
      provider,
      healthy: true,
      lastChecked: new Date(),
      failureCount: 0,
    };

    const updated: ProviderStatus = {
      ...current,
      healthy,
      lastChecked: new Date(),
      failureCount: healthy ? 0 : current.failureCount + 1,
      error: healthy ? undefined : error,
    };

    this.healthChecks.set(provider, updated);
  }

  private initializeHealthMonitoring(): void {
    // Check provider health every 5 minutes
    setInterval(async () => {
      for (const provider of ['openrouter', 'groq'] as AIProviderType[]) {
        try {
          await this.checkProviderHealth(provider);
        } catch (error) {
          log.warn(`Health check failed for ${provider}`, { error });
        }
      }
    }, 5 * 60 * 1000);
  }

  setFallbackConfig(config: Partial<FallbackConfig>): void {
    this.fallbackConfig = { ...this.fallbackConfig, ...config };
  }

  getFallbackConfig(): FallbackConfig {
    return { ...this.fallbackConfig };
  }
}

export const providerManager = ProviderManager.getInstance();