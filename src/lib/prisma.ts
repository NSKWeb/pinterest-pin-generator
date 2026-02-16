// Prisma Client - Database connection

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prevent multiple instances in development
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Save to global in development to prevent connection exhaustion
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Helper to disconnect
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Helper to connect with retry
export async function connectPrisma(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Database connected');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export default prisma;