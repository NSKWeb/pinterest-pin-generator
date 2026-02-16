// Three-layer authentication utilities

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';
import { log } from './logger';
import type { JWTPayload, AdminSession, AuthLayer } from '@/types/auth';

// Timing-safe string comparison
export function timingSafeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    
    if (bufA.length !== bufB.length) {
      return false;
    }
    
    return bufA.equals(bufB);
  } catch {
    return false;
  }
}

// Hash a string using bcrypt
export async function hashString(str: string, saltRounds: number = 10): Promise<string> {
  return bcrypt.hash(str, saltRounds);
}

// Verify a string against a bcrypt hash
export async function verifyHash(str: string, hash: string): Promise<boolean> {
  return bcrypt.compare(str, hash);
}

// Generate JWT token for admin session
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
  } catch (error) {
    log.auth.failure('Token verification', (error as Error).message);
    return null;
  }
}

// Generate a unique session token
export function generateSessionToken(): string {
  return uuidv4() + '-' + uuidv4();
}

// Verify a specific layer
export async function verifyLayer(
  layer: AuthLayer,
  input: string,
  storedHash: string
): Promise<boolean> {
  try {
    const isValid = await verifyHash(input, storedHash);
    
    if (isValid) {
      log.auth.success(`Layer ${layer} verified`, { layer });
    } else {
      log.auth.failure(`Layer ${layer} verification`, 'Invalid input');
    }
    
    return isValid;
  } catch (error) {
    log.auth.failure(`Layer ${layer} verification`, (error as Error).message);
    return false;
  }
}

// Check if session has all required layers
export function hasFullAuth(session: Partial<AdminSession>): boolean {
  return session.layer1Verified === true && 
         session.layer2Verified === true && 
         session.layer3Verified === true;
}

// Check if session has a specific layer verified
export function hasLayer(session: Partial<AdminSession>, layer: AuthLayer): boolean {
  switch (layer) {
    case 'layer1':
      return session.layer1Verified === true;
    case 'layer2':
      return session.layer2Verified === true;
    case 'layer3':
      return session.layer3Verified === true;
    default:
      return false;
  }
}

// Determine which layer comes next
export function getNextRequiredLayer(
  layer1: boolean,
  layer2: boolean,
  layer3: boolean
): AuthLayer | null {
  if (!layer1) return 'layer1';
  if (!layer2) return 'layer2';
  if (!layer3) return 'layer3';
  return null; // All layers verified
}

// Session expiration
export function getSessionExpiry(minutes: number = config.SESSION_TIMEOUT): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Validate session token format
export function isValidSessionToken(token: string): boolean {
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-[0-9a-f]{12}$/i;
  return uuidRegex.test(token);
}

// Rate limiting helpers
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export const rateLimitStore = new Map<string, { count: number; resetAt: Date }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetAt) {
    // First request or window expired
    const resetAt = new Date(now + windowMs);
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetAt: record.resetAt };
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt.getTime()) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute