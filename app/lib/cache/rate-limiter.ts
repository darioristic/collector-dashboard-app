import { cache } from './redis';

export interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  limit: number;
}

export class RateLimiter {
  private options: Required<RateLimitOptions>;

  constructor(options: RateLimitOptions) {
    this.options = {
      ...options,
      skipSuccessfulRequests: options.skipSuccessfulRequests ?? false,
      skipFailedRequests: options.skipFailedRequests ?? false,
    };
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = this.options.windowMs;
    const windowStart = now - windowMs;

    // Use sorted set to track requests in time window
    const rateLimitKey = `ratelimit:${key}`;
    
    try {
      // Remove old entries outside the window
      await cache['client'].zremrangebyscore(rateLimitKey, 0, windowStart);

      // Count requests in current window
      const count = await cache['client'].zcard(rateLimitKey);

      // Check if limit exceeded
      const allowed = count < this.options.maxRequests;

      if (allowed) {
        // Add current request to sorted set
        await cache['client'].zadd(rateLimitKey, now, `${now}-${Math.random()}`);
        // Set expiration on key
        await cache['client'].expire(rateLimitKey, Math.ceil(windowMs / 1000));
      }

      const remaining = Math.max(0, this.options.maxRequests - count - 1);
      const resetAt = new Date(now + windowMs);

      return {
        allowed,
        remaining,
        resetAt,
        limit: this.options.maxRequests,
      };
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow request on error
      return {
        allowed: true,
        remaining: this.options.maxRequests,
        resetAt: new Date(now + windowMs),
        limit: this.options.maxRequests,
      };
    }
  }

  async reset(key: string): Promise<void> {
    const rateLimitKey = `ratelimit:${key}`;
    await cache.del(rateLimitKey);
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // API endpoints
  api: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  }),

  // Auth endpoints (stricter)
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  }),

  // Search endpoints (moderate)
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 searches per minute
  }),

  // Heavy operations (stricter)
  heavy: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  }),

  // File uploads
  upload: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 uploads per minute
  }),
};

// Helper to get client identifier from request
export function getClientId(request: Request): string {
  // Try to get from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Could also use user ID if authenticated
  // const userId = getUserIdFromRequest(request);
  // return userId || ip;
  
  return ip;
}

