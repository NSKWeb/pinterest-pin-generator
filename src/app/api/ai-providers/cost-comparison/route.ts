// AI Providers Cost Comparison API

import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api-middleware';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';
import { OPENROUTER_MODELS, GROQ_MODELS } from '@/lib/ai/model-router';
import { CostComparison } from '@/types/ai-provider';

export async function GET(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const auth = withAdminAuth(request);
    if (auth.error) {
      return createJsonResponse({ success: false, error: auth.error.message }, 401);
    }

    const allModels = [...OPENROUTER_MODELS, ...GROQ_MODELS];
    
    const costs: CostComparison[] = allModels.map(model => ({
      provider: model.provider,
      model: model.id,
      promptPricePer1M: model.pricing.prompt,
      completionPricePer1M: model.pricing.completion,
      averageTotalPricePer1M: (model.pricing.prompt + model.pricing.completion) / 2,
    }));

    // Sort by average cost
    costs.sort((a, b) => a.averageTotalPricePer1M - b.averageTotalPricePer1M);

    return createJsonResponse({
      success: true,
      costs,
      summary: {
        cheapest: costs[0],
        mostExpensive: costs[costs.length - 1],
        totalModels: costs.length,
      },
    });
  } catch (error) {
    console.error('Failed to get cost comparison:', error);
    return createJsonResponse(
      { success: false, error: 'Failed to get cost comparison' },
      500
    );
  }
}