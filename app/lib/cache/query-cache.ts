import { cache, CacheKeys, CacheTTL } from './redis';

export interface CacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
  revalidate?: boolean;
}

type QueryFunction<T> = () => Promise<T>;

export class QueryCache {
  async wrap<T>(
    queryFn: QueryFunction<T>,
    options: CacheOptions
  ): Promise<T> {
    if (!options.key) {
      // No caching, just execute
      return queryFn();
    }

    // Check cache first
    const cached = await cache.get<T>(options.key);
    if (cached !== null && !options.revalidate) {
      return cached;
    }

    // Execute query
    const result = await queryFn();

    // Store in cache
    const ttl = options.ttl ?? CacheTTL.MEDIUM;
    await cache.set(options.key, result, ttl);

    // Store tags for invalidation
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        const tagKey = `tag:${tag}`;
        await cache['client'].sadd(tagKey, options.key);
        await cache['client'].expire(tagKey, ttl);
      }
    }

    return result;
  }

  async invalidate(keyOrTag: string, isTag = false): Promise<void> {
    if (isTag) {
      // Invalidate all keys with this tag
      const tagKey = `tag:${keyOrTag}`;
      const keys = await cache['client'].smembers(tagKey);
      if (keys.length > 0) {
        await cache.del(keys);
      }
      await cache.del(tagKey);
    } else {
      // Invalidate single key
      await cache.del(keyOrTag);
    }
  }

  async invalidateTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.invalidate(tag, true);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    await cache.delPattern(pattern);
  }
}

export const queryCache = new QueryCache();

// Helper to create typed cache keys
export function createCacheKey(
  prefix: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(':');
  
  return `${prefix}:${filteredParams || 'all'}`;
}

