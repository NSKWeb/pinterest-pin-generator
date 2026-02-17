// AI Providers Status API

import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api-middleware';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';
import { providerManager } from '@/lib/ai/providers/provider-manager';

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

    // Get provider status
    const status = providerManager.getProviderStatus();

    return createJsonResponse({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Failed to get provider status:', error);
    return createJsonResponse(
      { success: false, error: 'Failed to get provider status' },
      500
    );
  }
}