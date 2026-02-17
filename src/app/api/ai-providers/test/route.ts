// AI Providers Test API

import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api-middleware';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';
import { ProviderFactory } from '@/lib/ai/providers/provider-factory';
import { AIProviderType } from '@/types/ai-provider';

export async function POST(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const auth = withAdminAuth(request);
    if (auth.error) {
      return createJsonResponse({ success: false, error: auth.error.message }, 401);
    }

    const body = await request.json();
    const { provider } = body;

    if (!provider || !['openrouter', 'groq'].includes(provider)) {
      return createJsonResponse(
        { success: false, error: 'Invalid or missing provider' },
        400
      );
    }

    try {
      const client = ProviderFactory.getClient(provider as AIProviderType);
      
      // Test with a simple prompt
      const response = await client.generateText('Hello', {
        maxTokens: 10,
        temperature: 0,
      });

      return createJsonResponse({
        success: true,
        response: {
          content: response.content,
          model: response.model,
          usage: response.usage,
        },
      });
    } catch (error: any) {
      return createJsonResponse({
        success: false,
        error: error.message || 'Provider test failed',
        details: error,
      }, 500);
    }
  } catch (error) {
    console.error('Provider test failed:', error);
    return createJsonResponse(
      { success: false, error: 'Provider test failed' },
      500
    );
  }
}