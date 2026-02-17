// Provider Factory - Creates appropriate AI provider client

import { AIProviderType } from '../../types/ai-provider';
import { OpenRouterClient, getOpenRouterClient } from './openrouter-client';
import { GroqClient, getGroqClient } from './groq-client';
import { config } from '../../config';

export interface AIProvider {
  createChatCompletion(request: any): Promise<any>;
  generateText(prompt: string, options?: any): Promise<any>;
  generateJSON<T = any>(prompt: string, options?: any): Promise<{ data: T; response: any }>;
  getStatus(): any;
  isHealthy(): boolean;
}

export class ProviderFactory {
  private static instances: Map<AIProviderType, AIProvider> = new Map();

  static getClient(provider: AIProviderType): AIProvider {
    // Return cached instance if available
    if (this.instances.has(provider)) {
      return this.instances.get(provider)!;
    }

    // Create new instance based on provider type
    let client: AIProvider;

    switch (provider) {
      case 'openrouter':
        client = getOpenRouterClient();
        break;
      case 'groq':
        client = getGroqClient();
        break;
      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }

    // Cache the instance
    this.instances.set(provider, client);
    return client;
  }

  static getDefaultProvider(): AIProviderType {
    // Check config for default provider
    const configured = config.DEFAULT_AI_PROVIDER;
    if (configured === 'openrouter' || configured === 'groq' || configured === 'auto') {
      if (configured !== 'auto') {
        return configured;
      }
    }

    // Default to openrouter if auto or not configured
    return 'openrouter';
  }

  static getProviderForTask(taskType: string): AIProviderType {
    // Use the model router to determine the best provider for a task
    // This will be implemented in model-router.ts
    const { getProviderForTask } = require('../model-router');
    return getProviderForTask(taskType);
  }

  static clearInstances(): void {
    this.instances.clear();
  }
}

export function getProviderClient(provider: AIProviderType): AIProvider {
  return ProviderFactory.getClient(provider);
}

export function getDefaultProvider(): AIProviderType {
  return ProviderFactory.getDefaultProvider();
}