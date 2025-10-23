import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    
    // Connection pooling optimizations
    datasourceUrl: process.env.DATABASE_URL,
    
    // Query optimizations
    omit: {
      // Add default omit for sensitive fields if needed
    },
  });

// Connection pool configuration
if (process.env.NODE_ENV === 'development') {
  process.on('beforeExit', async () => {
    console.log('Prisma disconnecting...');
    await prisma.$disconnect();
  });
}

// Enable prepared statements and query batching
if (process.env.NODE_ENV === 'production') {
  // Warm up connection pool
  prisma.$connect().catch((err) => {
    console.error('Failed to connect to database:', err);
  });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper for transactions with optimal settings
export async function transaction<T>(
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
  options?: {
    maxWait?: number;
    timeout?: number;
    isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable';
  }
): Promise<T> {
  return prisma.$transaction(fn, {
    maxWait: options?.maxWait ?? 5000, // 5s
    timeout: options?.timeout ?? 10000, // 10s
    isolationLevel: options?.isolationLevel,
  });
}

// Batch operations helper
export async function batchWrite<T>(
  operations: Array<Promise<T>>,
  batchSize = 100
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
  }
  
  return results;
}
