import { PrismaClient } from '@prisma/client';
import { logger } from '@shared/utils/logger';

// Create Prisma client instance with logging
const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  // Add event listeners for Prisma events
  prisma.$on('query', (e: any) => {
    logger.debug(`Query: ${e.query}`, {
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });

  prisma.$on('error', (e: any) => {
    logger.error('Prisma Error:', e);
  });

  prisma.$on('info', (e: any) => {
    logger.info('Prisma Info:', e);
  });

  prisma.$on('warn', (e: any) => {
    logger.warn('Prisma Warning:', e);
  });

  return prisma;
};

// Define PrismaClient type
type PrismaClientInstance = ReturnType<typeof createPrismaClient>;

// Global variable to store Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientInstance | undefined;
};

// Export Prisma client as singleton
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development mode, use only one instance
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; 