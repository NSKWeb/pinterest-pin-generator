// API Middleware - Common patterns for API routes

import type { NextRequest } from 'next/server';
import { verifyToken } from './auth/three-layer';
import { log } from './logger';
import { handleApiError, RateLimitError } from './error-handler';
import { config } from './config';
import { checkRateLimit } from './auth/three-layer';

// Base middleware context
export interface MiddlewareContext {
  userId?: string;
  sessionId?: string;
  layers?: {
    layer1: boolean;
    layer2: boolean;
    layer3: boolean;
  };
  ip?: string;
  userAgent?: string;
}

// Parse request body
export async function parseRequestBody(request: NextRequest): Promise<any> {
  const contentType = request.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await request.json();
  }
  
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const body: Record<string, any> = {};
    formData.forEach((value, key) => {
      body[key] = value;
    });
    return body;
  }
  
  return {};
}

// Build middleware context from request
export function buildContext(request: NextRequest): MiddlewareContext {
  const ip = 
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';
    
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return {
    ip,
    userAgent,
  };
}

// Authentication middleware
export async function withAuth(
  request: NextRequest,
  requiredLayers: Array<'layer1' | 'layer2' | 'layer3'> = ['layer1', 'layer2', 'layer3']
): Promise<{ context: MiddlewareContext; error?: any }> {
  try {
    const authHeader = request.headers.get('authorization');
    const context = buildContext(request);
    
    if (!authHeader?.startsWith('Bearer ')) {
      log.auth.failure('Auth middleware', 'No token provided');
      return { 
        context, 
        error: { status: 401, message: 'Authorization token required' }
      };
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    
    if (!payload) {
      log.auth.failure('Auth middleware', 'Invalid token');
      return { 
        context, 
        error: { status: 401, message: 'Invalid token' }
      };
    }

    // Check if all required layers are verified
    const hasAllLayers = requiredLayers.every(layer => payload.layers[layer]);
    
    if (!hasAllLayers) {
      const missingLayers = requiredLayers.filter(layer => !payload.layers[layer]);
      log.auth.failure('Auth middleware', `Missing layers: ${missingLayers.join(', ')}`);
      return { 
        context, 
        error: { status: 403, message: 'Incomplete authentication' }
      };
    }

    context.userId = payload.sub;
    context.sessionId = payload.sessionId;
    context.layers = payload.layers;
    
    log.auth.success('Auth middleware', { userId: payload.sub, layers: payload.layers });
    
    return { context };
  } catch (error) {
    log.auth.failure('Auth middleware', (error as Error).message);
    return { 
      context: buildContext(request), 
      error: { status: 401, message: 'Authentication failed' }
    };
  }
}

// Rate limiting middleware
export function withRateLimit(
  maxRequests: number = config.RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = config.RATE_LIMIT_WINDOW_MS
) {
  return (
    request: NextRequest,
    identifier?: string
  ): { allowed: boolean; error?: any } => {
    const context = buildContext(request);
    const key = identifier || context.ip || 'unknown';
    
    const result = checkRateLimit(key, maxRequests, windowMs);
    
    if (!result.allowed) {
      log.api.error('Rate limit exceeded', 'RATE_LIMIT', {
        key,
        maxRequests,
        windowMs,
      });
      
      return {
        allowed: false,
        error: {
          status: 429,
          message: 'Too many requests',
          headers: {
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(result.resetAt.getTime() / 1000).toString(),
          },
        },
      };
    }
    
    return { allowed: true };
  };
}

// Admin-only middleware
export function withAdminAuth(request: NextRequest) {
  const adminRateLimit = withRateLimit(
    config.ADMIN_RATE_LIMIT_MAX,
    config.ADMIN_RATE_LIMIT_WINDOW_MS
  );
  
  return withAuth(request, ['layer1', 'layer2', 'layer3']);
}

// CORS middleware
export function withCORS(request: NextRequest): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  return null;
}

// Add CORS headers to response
export function addCORSHeaders(response: Response): Response {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

// Helper to create JSON response
export function createJsonResponse(
  data: any,
  status: number = 200,
  headers?: Record<string, string>
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

// Helper to create error response
export function createErrorResponse(error: any, status?: number): Response {
  const handled = handleApiError(error);
  const statusCode = status || handled.statusCode;
  
  return createJsonResponse(
    {
      success: false,
      error: handled.error,
      code: handled.code,
    },
    statusCode
  );
}