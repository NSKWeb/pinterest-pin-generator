// Layer 2: Admin Password Verification

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
    const rateLimitResult = checkRateLimit(`auth_layer2_${ip}`, 5, 60 * 1000);

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

    if (!session.layer1Verified) {
      return createJsonResponse(
        { success: false, error: 'Layer 1 verification required' },
        403
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return createJsonResponse(
        { success: false, error: 'Password is required' },
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

    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return createJsonResponse(
        { success: false, error: 'Account temporarily locked' },
        423
      );
    }

    const isValid = await verifyHash(password, admin.passwordHash);

    if (!isValid) {
      log.auth.failure('Layer 2', `Invalid password from ${ip}`);
      await prisma.admin.update({
        where: { id: admin.id },
        data: { failedAttempts: admin.failedAttempts + 1 },
      });
      return createJsonResponse(
        { success: false, error: 'Invalid password' },
        401
      );
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    await prisma.adminSession.update({
      where: { id: session.id },
      data: {
        layer2Verified: true,
        expiresAt: getSessionExpiry(),
      },
    });

    const jwtToken = generateToken({
      sub: admin.id,
      sessionId: session.token,
      layers: {
        layer1: true,
        layer2: true,
        layer3: false,
      },
    });

    log.auth.success('Layer 2', { adminId: admin.id, ip });

    return addCORSHeaders(createJsonResponse({
      success: true,
      message: 'Admin password verified',
      requiresNextLayer: true,
      layer: 'layer2',
      token: jwtToken,
    }));
  } catch (error) {
    log.error('Layer 2 authentication error:', error);
    return createJsonResponse(
      { success: false, error: 'Authentication failed' },
      500
    );
  }
}
