import { NextResponse } from 'next/server';
import { rateLimiters, getClientId, RateLimiter } from '@/lib/cache/rate-limiter';

export interface RateLimitMiddlewareOptions {
  limiter?: RateLimiter;
  keyGenerator?: (request: Request) => string;
  handler?: (result: { allowed: boolean; remaining: number; resetAt: Date; limit: number }) => Response | null;
}

export function withRateLimit(
  handler: (request: Request, context?: { params?: Record<string, string> }) => Promise<Response>,
  options: RateLimitMiddlewareOptions = {}
) {
  return async (request: Request, context?: { params?: Record<string, string> }) => {
    const limiter = options.limiter || rateLimiters.api;
    const keyGenerator = options.keyGenerator || getClientId;
    
    try {
      const key = keyGenerator(request);
      const result = await limiter.check(key);

      // Add rate limit headers
      const headers = new Headers();
      headers.set('X-RateLimit-Limit', result.limit.toString());
      headers.set('X-RateLimit-Remaining', result.remaining.toString());
      headers.set('X-RateLimit-Reset', result.resetAt.toISOString());

      if (!result.allowed) {
        const response = options.handler?.(result) || NextResponse.json(
          {
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retryAfter: result.resetAt,
          },
          { status: 429, headers }
        );
        return response;
      }

      // Call the original handler
      const response = await handler(request, context);
      
      // Add rate limit headers to successful response
      for (const [key, value] of headers.entries()) {
        response.headers.set(key, value);
      }
      
      return response;
    } catch (error) {
      console.error('Rate limit middleware error:', error);
      // Continue without rate limiting on error
      return handler(request, context);
    }
  };
}

// Specific rate limit wrappers
export function withAuthRateLimit(
  handler: (request: Request, context?: { params?: Record<string, string> }) => Promise<Response>
) {
  return withRateLimit(handler, {
    limiter: rateLimiters.auth,
    keyGenerator: (request) => {
      const clientId = getClientId(request);
      const url = new URL(request.url);
      return `auth:${clientId}:${url.pathname}`;
    },
  });
}

export function withSearchRateLimit(
  handler: (request: Request, context?: { params?: Record<string, string> }) => Promise<Response>
) {
  return withRateLimit(handler, {
    limiter: rateLimiters.search,
  });
}

export function withUploadRateLimit(
  handler: (request: Request, context?: { params?: Record<string, string> }) => Promise<Response>
) {
  return withRateLimit(handler, {
    limiter: rateLimiters.upload,
  });
}

export function withHeavyRateLimit(
  handler: (request: Request, context?: { params?: Record<string, string> }) => Promise<Response>
) {
  return withRateLimit(handler, {
    limiter: rateLimiters.heavy,
  });
}

