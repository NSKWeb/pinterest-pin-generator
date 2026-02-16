// Session refresh API Route

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, generateToken, getSessionExpiry } from '@/lib/auth/three-layer';
import { createJsonResponse, withCORS, addCORSHeaders } from '@/lib/api-middleware';

export async function POST(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
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

  const updated = await prisma.adminSession.update({
    where: { id: session.id },
    data: { expiresAt: getSessionExpiry() },
  });

  const jwtToken = generateToken({
    sub: payload.sub,
    sessionId: updated.token,
    layers: {
      layer1: updated.layer1Verified,
      layer2: updated.layer2Verified,
      layer3: updated.layer3Verified,
    },
  });

  return addCORSHeaders(createJsonResponse({
    success: true,
    token: jwtToken,
  }));
}
