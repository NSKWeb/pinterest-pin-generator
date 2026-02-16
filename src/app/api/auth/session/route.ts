// Session verification API Route

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/three-layer';
import { createJsonResponse, withCORS, addCORSHeaders } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
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

  return addCORSHeaders(createJsonResponse({
    success: true,
    session: {
      layer1: session.layer1Verified,
      layer2: session.layer2Verified,
      layer3: session.layer3Verified,
      expiresAt: session.expiresAt,
    },
  }));
}
