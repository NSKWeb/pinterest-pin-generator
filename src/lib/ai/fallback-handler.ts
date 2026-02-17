// Fallback Handler - Handles automatic fallback with circuit breaker pattern

import { AIProviderType, GenerationRequest, GenerationResponse } from '../../types/ai-provider';
import { providerManager } from './provider-manager';
import { log } from '../logger';
import { GenerationError } from '../error-handler';

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

export class FallbackHandler {
  private circuitBreakers: Map<AIProviderType, CircuitBreaker> = new Map();

  constructor() {
    // Initialize circuit breakers for both providers
    for (const provider of ['openrouter', 'groq'] as AIProviderType[]) {
      this.circuitBreakers.set(provider, new CircuitBreaker(provider));
    }
  }

  async handleRequest(
    request: GenerationRequest,
    taskType: string,
    preferredProvider?: AIProviderType
  ): Promise<GenerationResponse> {
    const circuitBreaker = preferredProvider
      ? this.circuitBreakers.get(preferredProvider)!
      : this.selectBestCircuitBreaker(taskType);

    if (!circuitBreaker.isAvailable()) {
      throw new GenerationError(
        `Circuit breaker is open for provider ${circuitBreaker.provider}`,
        circuitBreaker.provider
      );
    }

    try {
      return await providerManager.generateWithFallback(
        request,
        taskType as any,
        preferredProvider
      );
    } catch (error) {
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  getCircuitBreakerStatus(): Record<AIProviderType, any> {
    const status: Record<AIProviderType, any> = {} as any;
    
    for (const [provider, breaker] of this.circuitBreakers) {
      status[provider] = {
        isAvailable: breaker.isAvailable(),
        failureCount: breaker.getFailureCount(),
        lastFailureTime: breaker.getLastFailureTime(),
        state: breaker.getState(),
      };
    }

    return status;
  }

  private selectBestCircuitBreaker(taskType: string): CircuitBreaker {
    // Get the best provider for the task
    const bestProvider = providerManager.getBestProviderForTask(taskType as any);
    const breaker = this.circuitBreakers.get(bestProvider)!;

    // If the best provider's circuit breaker is open, try the other one
    if (!breaker.isAvailable()) {
      const otherProvider = bestProvider === 'openrouter' ? 'groq' : 'openrouter';
      const otherBreaker = this.circuitBreakers.get(otherProvider)!;
      
      if (otherBreaker.isAvailable()) {
        return otherBreaker;
      }
    }

    return breaker;
  }

  resetCircuitBreaker(provider: AIProviderType): void {
    const breaker = this.circuitBreakers.get(provider);
    if (breaker) {
      breaker.reset();
    }
  }

  resetAllCircuitBreakers(): void {
    for (const breaker of this.circuitBreakers.values()) {
      breaker.reset();
    }
  }
}

class CircuitBreaker {
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly config: CircuitBreakerConfig;

  constructor(
    public readonly provider: AIProviderType,
    config?: Partial<CircuitBreakerConfig>
  ) {
    this.config = {
      failureThreshold: 5, // Open circuit after 5 failures
      resetTimeout: 60000, // Try to reset after 1 minute
      monitoringPeriod: 60000, // Monitor for 1 minute
      ...config,
    };
  }

  isAvailable(): boolean {
    if (this.state === 'closed') {
      return true;
    }

    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      if (timeSinceLastFailure >= this.config.resetTimeout) {
        this.state = 'half-open';
        log.info(`Circuit breaker for ${this.provider} is now half-open`);
        return true;
      }
      return false;
    }

    // Half-open state
    return true;
  }

  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    log.warn(`Circuit breaker failure recorded for ${this.provider}`, {
      failureCount: this.failures,
      threshold: this.config.failureThreshold,
    });

    if (this.failures >= this.config.failureThreshold) {
      this.state = 'open';
      log.error(`Circuit breaker opened for ${this.provider} due to too many failures`);
    }
  }

  recordSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
    log.info(`Circuit breaker success recorded for ${this.provider}`);
  }

  getFailureCount(): number {
    return this.failures;
  }

  getLastFailureTime(): Date | null {
    return this.lastFailureTime ? new Date(this.lastFailureTime) : null;
  }

  getState(): 'closed' | 'open' | 'half-open' {
    return this.state;
  }

  reset(): void {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = 'closed';
    log.info(`Circuit breaker for ${this.provider} has been reset`);
  }
}

export const fallbackHandler = new FallbackHandler();