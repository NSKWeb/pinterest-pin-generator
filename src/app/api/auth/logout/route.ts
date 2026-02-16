// Logout API Route

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/three-layer';
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

  await prisma.adminSession.deleteMany({
    where: { token: payload.sessionId },
  });

  return addCORSHeaders(createJsonResponse({
    success: true,
    message: 'Logged out successfully',
  }));
}
