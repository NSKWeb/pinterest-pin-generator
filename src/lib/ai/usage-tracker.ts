// Usage Tracker - Tracks costs and usage per provider

import { PrismaClient } from '@prisma/client';
import { 
  AIProviderType, 
  UsageStats, 
  ModelInfo, 
  CostComparison 
} from '../../types/ai-provider';
import { OPENROUTER_MODELS, GROQ_MODELS } from './model-router';
import { log } from '../logger';

const prisma = new PrismaClient();

export class UsageTracker {
  private static instance: UsageTracker;
  
  private constructor() {}

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  async recordUsage(
    adminId: string,
    provider: AIProviderType,
    model: string,
    promptTokens: number,
    completionTokens: number,
    totalTokens: number,
    cost: number
  ): Promise<void> {
    try {
      await prisma.apiUsage.create({
        data: {
          adminId,
          provider,
          model,
          promptTokens,
          completionTokens,
          totalTokens,
          cost,
          requests: 1,
        },
      });

      log.info('Usage recorded', {
        adminId,
        provider,
        model,
        totalTokens,
        cost,
      });
    } catch (error) {
      log.error('Failed to record usage', {
        adminId,
        provider,
        model,
        error,
      });
    }
  }

  async getUsageStats(
    adminId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<Record<AIProviderType, UsageStats>> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const usage = await prisma.apiUsage.groupBy({
      by: ['provider'],
      where: {
        adminId,
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        cost: true,
        requests: true,
      },
    });

    const stats: Record<AIProviderType, UsageStats> = {
      openrouter: {
        provider: 'openrouter',
        model: '',
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        requests: 0,
        cost: 0,
        period,
      },
      groq: {
        provider: 'groq',
        model: '',
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        requests: 0,
        cost: 0,
        period,
      },
    };

    for (const item of usage) {
      const provider = item.provider as AIProviderType;
      stats[provider] = {
        provider,
        model: 'all',
        promptTokens: item._sum.promptTokens || 0,
        completionTokens: item._sum.completionTokens || 0,
        totalTokens: item._sum.totalTokens || 0,
        requests: item._sum.requests || 0,
        cost: item._sum.cost || 0,
        period,
      };
    }

    return stats;
  }

  async getUsageStatsByModel(
    adminId: string,
    provider: AIProviderType,
    period: 'daily' | 'weekly' | 'monthly' = 'monthly'
  ): Promise<UsageStats[]> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const usage = await prisma.apiUsage.groupBy({
      by: ['model'],
      where: {
        adminId,
        provider,
        createdAt: {
          gte: startDate,
        },
      },
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        cost: true,
        requests: true,
      },
    });

    return usage.map(item => ({
      provider,
      model: item.model,
      promptTokens: item._sum.promptTokens || 0,
      completionTokens: item._sum.completionTokens || 0,
      totalTokens: item._sum.totalTokens || 0,
      requests: item._sum.requests || 0,
      cost: item._sum.cost || 0,
      period,
    }));
  }

  async getCostComparison(): Promise<CostComparison[]> {
    const models = [...OPENROUTER_MODELS, ...GROQ_MODELS];
    
    return models.map(model => ({
      provider: model.provider,
      model: model.id,
      promptPricePer1M: model.pricing.prompt,
      completionPricePer1M: model.pricing.completion,
      averageTotalPricePer1M: (model.pricing.prompt + model.pricing.completion) / 2,
    }));
  }

  async checkBudgetLimits(
    adminId: string,
    provider: AIProviderType
  ): Promise<{ limit: number | null; current: number; remaining: number | null }> {
    // Get monthly usage for the provider
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const usage = await prisma.apiUsage.aggregate({
      where: {
        adminId,
        provider,
        createdAt: {
          gte: startOfMonth,
        },
      },
      _sum: {
        cost: true,
      },
    });

    const current = usage._sum.cost || 0;

    // Get budget settings (this would come from admin preferences)
    // For now, return null for unlimited
    return {
      limit: null,
      current,
      remaining: null,
    };
  }

  async getProviderUsageTrends(
    adminId: string,
    days: number = 30
  ): Promise<Array<{ date: string; provider: AIProviderType; cost: number; tokens: number }>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usage = await prisma.apiUsage.findMany({
      where: {
        adminId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        provider: true,
        cost: true,
        totalTokens: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by date and provider
    const trends = new Map<string, Map<AIProviderType, { cost: number; tokens: number }>>();

    for (const item of usage) {
      const date = item.createdAt.toISOString().split('T')[0];
      
      if (!trends.has(date)) {
        trends.set(date, new Map());
      }
      
      const dayData = trends.get(date)!;
      const existing = dayData.get(item.provider) || { cost: 0, tokens: 0 };
      
      dayData.set(item.provider, {
        cost: existing.cost + item.cost,
        tokens: existing.tokens + item.totalTokens,
      });
    }

    // Convert to array format
    const result: Array<{ date: string; provider: AIProviderType; cost: number; tokens: number }> = [];
    
    for (const [date, providers] of trends) {
      for (const [provider, data] of providers) {
        result.push({
          date,
          provider,
          cost: data.cost,
          tokens: data.tokens,
        });
      }
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getTopModels(
    adminId: string,
    limit: number = 10
  ): Promise<Array<{ model: string; provider: AIProviderType; usage: number; cost: number }>> {
    const usage = await prisma.apiUsage.groupBy({
      by: ['model', 'provider'],
      where: {
        adminId,
      },
      _sum: {
        totalTokens: true,
        cost: true,
      },
      orderBy: {
        _sum: {
          totalTokens: 'desc',
        },
      },
      take: limit,
    });

    return usage.map(item => ({
      model: item.model,
      provider: item.provider as AIProviderType,
      usage: item._sum.totalTokens || 0,
      cost: item._sum.cost || 0,
    }));
  }

  async getCostOptimizationSuggestions(
    adminId: string
  ): Promise<Array<{ suggestion: string; potentialSavings: number; reason: string }>> {
    const suggestions: Array<{ suggestion: string; potentialSavings: number; reason: string }> = [];
    
    // Check if user is using expensive models for simple tasks
    const topModels = await this.getTopModels(adminId, 5);
    
    for (const model of topModels) {
      if (model.model.includes('gpt-4o') && model.cost > 5) {
        suggestions.push({
          suggestion: `Consider using GPT-4o Mini instead of ${model.model} for non-creative tasks`,
          potentialSavings: 3.5,
          reason: 'GPT-4o Mini costs significantly less while providing adequate quality for most tasks',
        });
      }
      
      if (model.model.includes('claude-3-5-sonnet') && model.cost > 3) {
        suggestions.push({
          suggestion: `Switch to Mixtral-8x7B for SEO tasks`,
          potentialSavings: 2.0,
          reason: 'Mixtral provides similar quality for structured content at lower cost',
        });
      }
    }

    // Check provider distribution
    const usageStats = await this.getUsageStats(adminId, 'monthly');
    
    if (usageStats.openrouter.cost > usageStats.groq.cost * 2) {
      suggestions.push({
        suggestion: 'Consider using Groq for more tasks to reduce costs',
        potentialSavings: usageStats.openrouter.cost * 0.3,
        reason: 'Groq models are generally more cost-effective for similar quality',
      });
    }

    return suggestions;
  }
}

export const usageTracker = UsageTracker.getInstance();