import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

const createRedisClient = () => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
    lazyConnect: true,
    enableOfflineQueue: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
  });

  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    console.log('Redis connected');
  });

  client.on('ready', () => {
    console.log('Redis ready');
  });

  return client;
};

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// Connect lazily
if (process.env.REDIS_URL) {
  redis.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });
}

// Cache key builders
export const CacheKeys = {
  company: (id: string) => `company:${id}`,
  companies: (filters: string) => `companies:${filters}`,
  contact: (id: string) => `contact:${id}`,
  contacts: (companyId: string) => `contacts:company:${companyId}`,
  relationship: (id: string) => `relationship:${id}`,
  relationships: (companyId: string) => `relationships:company:${companyId}`,
  offer: (id: string) => `offer:${id}`,
  offers: (filters: string) => `offers:${filters}`,
  order: (id: string) => `order:${id}`,
  invoice: (id: string) => `invoice:${id}`,
  session: (token: string) => `session:${token}`,
  rateLimit: (key: string) => `ratelimit:${key}`,
  stats: (type: string) => `stats:${type}`,
} as const;

// Cache TTL (in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
  SESSION: 604800, // 7 days
} as const;

// Cache service
export class CacheService {
  private client: Redis;

  constructor(client: Redis = redis) {
    this.client = client;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      if (Array.isArray(key)) {
        if (key.length > 0) {
          await this.client.del(...key);
        }
      } else {
        await this.client.del(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error('Cache delete pattern error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async incr(key: string, ttl?: number): Promise<number> {
    try {
      const value = await this.client.incr(key);
      if (ttl) {
        await this.client.expire(key, ttl);
      }
      return value;
    } catch (error) {
      console.error('Cache incr error:', error);
      return 0;
    }
  }

  async decr(key: string): Promise<number> {
    try {
      return await this.client.decr(key);
    } catch (error) {
      console.error('Cache decr error:', error);
      return 0;
    }
  }

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hget(key, field);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Cache hget error:', error);
      return null;
    }
  }

  async hset(key: string, field: string, value: unknown, ttl?: number): Promise<void> {
    try {
      await this.client.hset(key, field, JSON.stringify(value));
      if (ttl) {
        await this.client.expire(key, ttl);
      }
    } catch (error) {
      console.error('Cache hset error:', error);
    }
  }

  async hgetall<T>(key: string): Promise<Record<string, T>> {
    try {
      const data = await this.client.hgetall(key);
      const result: Record<string, T> = {};
      for (const [field, value] of Object.entries(data)) {
        result[field] = JSON.parse(value) as T;
      }
      return result;
    } catch (error) {
      console.error('Cache hgetall error:', error);
      return {};
    }
  }

  async hdel(key: string, field: string | string[]): Promise<void> {
    try {
      if (Array.isArray(field)) {
        await this.client.hdel(key, ...field);
      } else {
        await this.client.hdel(key, field);
      }
    } catch (error) {
      console.error('Cache hdel error:', error);
    }
  }

  // List operations for queues
  async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await this.client.lpush(key, ...values);
    } catch (error) {
      console.error('Cache lpush error:', error);
      return 0;
    }
  }

  async rpop(key: string): Promise<string | null> {
    try {
      return await this.client.rpop(key);
    } catch (error) {
      console.error('Cache rpop error:', error);
      return null;
    }
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      return await this.client.lrange(key, start, stop);
    } catch (error) {
      console.error('Cache lrange error:', error);
      return [];
    }
  }

  // Pub/Sub for real-time updates
  async publish(channel: string, message: unknown): Promise<void> {
    try {
      await this.client.publish(channel, JSON.stringify(message));
    } catch (error) {
      console.error('Cache publish error:', error);
    }
  }

  subscribe(channel: string, callback: (message: unknown) => void): void {
    const subscriber = this.client.duplicate();
    subscriber.subscribe(channel);
    subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        try {
          callback(JSON.parse(msg));
        } catch (error) {
          console.error('Cache subscribe callback error:', error);
        }
      }
    });
  }

  // Flush all cache (use with caution!)
  async flush(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }

  // Get Redis info
  async info(): Promise<string> {
    try {
      return await this.client.info();
    } catch (error) {
      console.error('Cache info error:', error);
      return '';
    }
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    try {
      await this.client.quit();
    } catch (error) {
      console.error('Cache disconnect error:', error);
    }
  }
}

export const cache = new CacheService(redis);

