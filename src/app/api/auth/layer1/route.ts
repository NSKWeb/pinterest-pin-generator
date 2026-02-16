// Three-Layer Authentication API Routes

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyHash, generateSessionToken, getSessionExpiry, generateToken } from '@/lib/auth/three-layer';
import { createJsonResponse, withCORS, addCORSHeaders } from '@/lib/api-middleware';
import { log } from '@/lib/logger';
import { checkRateLimit } from '@/lib/auth/three-layer';


// Layer 1: Security Question Verification
export async function POST(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = checkRateLimit(`auth_layer1_${ip}`, 5, 60 * 1000);

    if (!rateLimitResult.allowed) {
      return createJsonResponse(
        { success: false, error: 'Too many attempts. Try again later.' },
        429
      );
    }

    const body = await request.json();
    const { answer } = body;

    if (!answer) {
      return createJsonResponse(
        { success: false, error: 'Answer is required' },
        400
      );
    }

    // Get admin record (assuming single admin for now)
    const admin = await prisma.admin.findFirst();
    
    if (!admin) {
      log.auth.failure('Layer 1', 'No admin found');
      return createJsonResponse(
        { success: false, error: 'Invalid credentials' },
        401
      );
    }

    // Verify security answer
    const isValid = await verifyHash(answer, admin.securityAnswerHash);

    if (!isValid) {
      log.auth.failure('Layer 1', `Invalid answer from ${ip}`);
      
      // Increment failed attempts
      await prisma.admin.update({
        where: { id: admin.id },
        data: { failedAttempts: admin.failedAttempts + 1 },
      });

      return createJsonResponse(
        { success: false, error: 'Invalid answer' },
        401
      );
    }

    // Create session with layer 1 verified
    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiry();

    await prisma.adminSession.create({
      data: {
        adminId: admin.id,
        token: sessionToken,
        layer1Verified: true,
        layer2Verified: false,
        layer3Verified: false,
        expiresAt,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
      },
    });

    const jwtToken = generateToken({
      sub: admin.id,
      sessionId: sessionToken,
      layers: {
        layer1: true,
        layer2: false,
        layer3: false,
      },
    });

    log.auth.success('Layer 1', { adminId: admin.id, ip });

    return addCORSHeaders(createJsonResponse({
      success: true,
      message: 'Security question verified',
      requiresNextLayer: true,
      layer: 'layer1',
      token: jwtToken,
    }));

  } catch (error) {
    log.error('Layer 1 authentication error:', error);
    return createJsonResponse(
      { success: false, error: 'Authentication failed' },
      500
    );
  }
}