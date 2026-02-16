// Initialize Admin API Route

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashString } from '@/lib/auth/three-layer';
import { createJsonResponse, withCORS } from '@/lib/api-middleware';

export async function POST(request: NextRequest) {
  const corsResponse = withCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const body = await request.json();
    const { email, password, securityQuestion, securityAnswer, secretKey } = body;

    if (!email || !password || !securityQuestion || !securityAnswer || !secretKey) {
      return createJsonResponse(
        { success: false, error: 'All fields are required' },
        400
      );
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return createJsonResponse(
        { success: false, error: 'Admin already exists' },
        400
      );
    }

    // Hash all the secrets
    const passwordHash = await hashString(password);
    const securityAnswerHash = await hashString(securityAnswer);
    const secretKeyHash = await hashString(secretKey);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash,
        securityQuestion,
        securityAnswerHash,
        secretKeyHash,
      },
    });

    return createJsonResponse({
      success: true,
      message: 'Admin created successfully',
      adminId: admin.id,
    });

  } catch (error) {
    console.error('Admin initialization error:', error);
    return createJsonResponse(
      { success: false, error: 'Failed to initialize admin' },
      500
    );
  }
}