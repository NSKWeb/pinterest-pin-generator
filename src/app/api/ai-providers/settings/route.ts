// AI Providers Settings API

import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAdminAuth } from '@/lib/api-middleware';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';
import { TASK_MAPPINGS } from '@/lib/ai/model-router';
import { TaskType, AIProviderType, FallbackConfig } from '@/types/ai-provider';

const prisma = new PrismaClient();

interface AISettings {
  defaultProvider: AIProviderType | 'auto';
  fallbackEnabled: boolean;
  fallbackConfig: FallbackConfig;
  taskMappings: Record<TaskType, { provider: AIProviderType; model: string }>;
}

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

    // Try to get settings from database
    const dbSettings = await prisma.setting.findFirst({
      where: { key: 'ai_provider_settings' },
    });

    let settings: AISettings;

    if (dbSettings) {
      settings = JSON.parse(dbSettings.value);
    } else {
      // Use defaults
      settings = {
        defaultProvider: 'auto',
        fallbackEnabled: true,
        fallbackConfig: {
          enabled: true,
          maxRetries: 3,
          retryDelayMs: 1000,
          backoffMultiplier: 2,
          circuitBreakerThreshold: 5,
          circuitBreakerResetMs: 300000,
        },
        taskMappings: TASK_MAPPINGS,
      };
    }

    return createJsonResponse({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Failed to get AI settings:', error);
    return createJsonResponse(
      { success: false, error: 'Failed to get settings' },
      500
    );
  }
}

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

    // Validate body
    const {
      defaultProvider,
      fallbackEnabled,
      fallbackConfig,
      taskMappings,
    } = body;

    // Merge with defaults
    const settings: AISettings = {
      defaultProvider: defaultProvider || 'auto',
      fallbackEnabled: fallbackEnabled ?? true,
      fallbackConfig: fallbackConfig || {
        enabled: true,
        maxRetries: 3,
        retryDelayMs: 1000,
        backoffMultiplier: 2,
        circuitBreakerThreshold: 5,
        circuitBreakerResetMs: 300000,
      },
      taskMappings: taskMappings || TASK_MAPPINGS,
    };

    // Save to database
    await prisma.setting.upsert({
      where: { key: 'ai_provider_settings' },
      update: { value: JSON.stringify(settings) },
      create: { key: 'ai_provider_settings', value: JSON.stringify(settings) },
    });

    return createJsonResponse({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Failed to save AI settings:', error);
    return createJsonResponse(
      { success: false, error: 'Failed to save settings' },
      500
    );
  }
}