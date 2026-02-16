// Layer 3: Secret Key Verification

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyHash, generateToken, verifyToken, getSessionExpiry, checkRateLimit } from '@/lib/auth/three-layer';
import { createJsonResponse, withCORS, addCORSHeaders } from '@/lib/api-middleware';
import { log } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = checkRateLimit(`auth_layer3_${ip}`, 5, 60 * 1000);

    if (!rateLimitResult.allowed) {
      return createJsonResponse(
        { success: false, error: 'Too many attempts. Try again later.' },
        429
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return createJsonResponse(
        { success: false, error: 'Authorization token required' },
        401
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return createJsonResponse(
        { success: false, error: 'Invalid session token' },
        401
      );
    }

    const session = await prisma.adminSession.findUnique({
      where: { token: payload.sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.adminSession.delete({ where: { id: session.id } });
      }
      return createJsonResponse(
        { success: false, error: 'Session expired' },
        401
      );
    }

    if (!session.layer2Verified) {
      return createJsonResponse(
        { success: false, error: 'Layer 2 verification required' },
        403
      );
    }

    const body = await request.json();
    const { secretKey } = body;

    if (!secretKey) {
      return createJsonResponse(
        { success: false, error: 'Secret key is required' },
        400
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { id: session.adminId },
    });

    if (!admin) {
      return createJsonResponse(
        { success: false, error: 'Invalid credentials' },
        401
      );
    }

    const isValid = await verifyHash(secretKey, admin.secretKeyHash);

    if (!isValid) {
      log.auth.failure('Layer 3', `Invalid secret key from ${ip}`);
      return createJsonResponse(
        { success: false, error: 'Invalid secret key' },
        401
      );
    }

    await prisma.adminSession.update({
      where: { id: session.id },
      data: {
        layer3Verified: true,
        expiresAt: getSessionExpiry(),
      },
    });

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        failedAttempts: 0,
        lockedUntil: null,
      },
    });

    const jwtToken = generateToken({
      sub: admin.id,
      sessionId: session.token,
      layers: {
        layer1: true,
        layer2: true,
        layer3: true,
      },
    });

    log.auth.success('Layer 3', { adminId: admin.id, ip });

    return addCORSHeaders(createJsonResponse({
      success: true,
      message: 'Secret key verified. Authentication complete.',
      requiresNextLayer: false,
      layer: 'layer3',
      token: jwtToken,
    }));
  } catch (error) {
    log.error('Layer 3 authentication error:', error);
    return createJsonResponse(
      { success: false, error: 'Authentication failed' },
      500
    );
  }
}
