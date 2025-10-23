# Cache System Documentation

## Overview

Kompletna Redis cache implementacija sa automatskim invalidiranjem, rate limiting-om, i session management-om.

## Struktura

```
lib/cache/
├── redis.ts                 # Redis client i osnovni cache operacije
├── rate-limiter.ts          # Rate limiting logika
├── session.ts               # Session management
└── query-cache.ts           # Query caching wrapper

lib/middleware/
└── rate-limit.ts           # Rate limiting middleware

lib/services/cached/
├── company.cached.service.ts
├── contact.cached.service.ts
├── relationship.cached.service.ts
└── index.ts
```

## Quick Start

### 1. Basic Cache Operations

```typescript
import { cache, CacheKeys, CacheTTL } from '@/lib/cache/redis';

// Get
const company = await cache.get<Company>(CacheKeys.company(id));

// Set
await cache.set(CacheKeys.company(id), company, CacheTTL.MEDIUM);

// Delete
await cache.del(CacheKeys.company(id));

// Delete pattern
await cache.delPattern('companies:*');

// Exists
const exists = await cache.exists(CacheKeys.company(id));

// Increment (for counters)
const count = await cache.incr('visitors', CacheTTL.LONG);
```

### 2. Query Cache

```typescript
import { queryCache, createCacheKey } from '@/lib/cache/query-cache';

const result = await queryCache.wrap(
  async () => {
    // Expensive operation
    return await prisma.company.findMany({
      include: { contacts: true }
    });
  },
  {
    key: createCacheKey('companies', { include: 'contacts' }),
    ttl: CacheTTL.MEDIUM,
    tags: ['companies'],
  }
);

// Invalidate by tag
await queryCache.invalidateTags(['companies']);

// Invalidate by key
await queryCache.invalidate('companies:all');

// Invalidate by pattern
await queryCache.invalidatePattern('companies:*');
```

### 3. Cached Services

```typescript
import { 
  cachedCompanyService,
  cachedContactService,
  cachedRelationshipService 
} from '@/lib/services/cached';

// Automatically cached + invalidated
const company = await cachedCompanyService.getCompany(id);
const companies = await cachedCompanyService.listCompanies({ page: 1 });

// Updates auto-invalidate
await cachedCompanyService.updateCompany(id, data);
```

### 4. Rate Limiting

```typescript
import { withRateLimit, withAuthRateLimit } from '@/lib/middleware/rate-limit';

// Basic rate limiting (60 req/min)
async function handleGET(request: Request) {
  // Your logic
  return Response.json({ data: [] });
}

export const GET = withRateLimit(handleGET);

// Auth rate limiting (5 attempts/15min)
export const POST = withAuthRateLimit(handleLogin);

// Custom rate limiter
import { RateLimiter } from '@/lib/cache/rate-limiter';

const limiter = new RateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
});

const result = await limiter.check(userId);
if (!result.allowed) {
  return Response.json(
    { error: 'Too many requests' },
    { status: 429 }
  );
}
```

### 5. Session Management

```typescript
import { sessionManager } from '@/lib/cache/session';

// Create session
const session = await sessionManager.create({
  token: jwtToken,
  userId: user.id,
  email: user.email,
  role: user.role,
  metadata: { ip: request.headers.get('x-forwarded-for') },
});

// Get session
const session = await sessionManager.get(token);
if (!session) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

// Refresh session
await sessionManager.refresh(token);

// Delete session (logout)
await sessionManager.delete(token);

// Multi-device management
const userSessions = await sessionManager.getUserSessions(userId);
await sessionManager.deleteUserSessions(userId); // Logout from all devices
```

## Advanced Usage

### Hash Operations (for complex objects)

```typescript
// Store user preferences
await cache.hset('user:prefs', userId, preferences, CacheTTL.VERY_LONG);

// Get user preferences
const prefs = await cache.hget<Preferences>('user:prefs', userId);

// Get all preferences
const allPrefs = await cache.hgetall<Preferences>('user:prefs');

// Delete user preferences
await cache.hdel('user:prefs', userId);
```

### List Operations (for queues)

```typescript
// Add to queue
await cache.lpush('email:queue', JSON.stringify(emailData));

// Process queue
const item = await cache.rpop('email:queue');

// View queue
const items = await cache.lrange('email:queue', 0, 10);
```

### Pub/Sub (for real-time updates)

```typescript
// Publisher
await cache.publish('company:updates', {
  type: 'created',
  companyId: company.id,
});

// Subscriber
cache.subscribe('company:updates', (message) => {
  console.log('Company update:', message);
  // Trigger UI refresh, webhook, etc.
});
```

## Cache Keys

Pre-definisani cache ključevi:

```typescript
import { CacheKeys } from '@/lib/cache/redis';

CacheKeys.company(id)              // "company:{id}"
CacheKeys.companies(filters)       // "companies:{filters}"
CacheKeys.contact(id)              // "contact:{id}"
CacheKeys.contacts(companyId)      // "contacts:company:{companyId}"
CacheKeys.relationship(id)         // "relationship:{id}"
CacheKeys.relationships(companyId) // "relationships:company:{companyId}"
CacheKeys.session(token)           // "session:{token}"
CacheKeys.rateLimit(key)          // "ratelimit:{key}"
```

## Cache TTL

Pre-definisane TTL vrijednosti:

```typescript
import { CacheTTL } from '@/lib/cache/redis';

CacheTTL.SHORT      // 60s (1 min)
CacheTTL.MEDIUM     // 300s (5 min)
CacheTTL.LONG       // 3600s (1 hour)
CacheTTL.VERY_LONG  // 86400s (24 hours)
CacheTTL.SESSION    // 604800s (7 days)
```

## Best Practices

### 1. Cache Invalidation

```typescript
// ✅ Good: Invalidate specific keys
await cache.del(CacheKeys.company(id));
await cache.del(CacheKeys.contacts(companyId));

// ✅ Good: Invalidate by pattern for related data
await cache.delPattern(`companies:*`);

// ❌ Bad: Never flush entire cache in production
await cache.flush(); // Only for development
```

### 2. TTL Selection

```typescript
// ✅ Good: Short TTL for frequently changing data
await cache.set(CacheKeys.companies('active'), companies, CacheTTL.SHORT);

// ✅ Good: Long TTL for static data
await cache.set('countries', countries, CacheTTL.VERY_LONG);

// ❌ Bad: Long TTL for dynamic data
await cache.set(CacheKeys.companies('all'), companies, CacheTTL.VERY_LONG);
```

### 3. Error Handling

```typescript
// ✅ Good: Cache errors should not break app
const cached = await cache.get<Company>(key);
if (cached) {
  return cached;
}

// Fallback to database
const company = await prisma.company.findUnique({ where: { id } });
await cache.set(key, company, CacheTTL.MEDIUM);
return company;

// Cache service already handles errors gracefully
```

### 4. Graceful Degradation

```typescript
// Cache service automatically degrades gracefully
try {
  const cached = await cache.get(key);
  if (cached) return cached;
} catch (error) {
  // Falls back to database automatically
  console.error('Cache error, falling back to DB:', error);
}

// Always fetch from database as fallback
return await fetchFromDatabase();
```

## Monitoring

### Redis CLI Commands

```bash
# Connect
redis-cli

# Check all keys
KEYS *

# Get specific key
GET "company:some-uuid"

# Check key TTL
TTL "company:some-uuid"

# Get key type
TYPE "company:some-uuid"

# Monitor in real-time
MONITOR

# Get memory info
INFO memory

# Get stats
INFO stats

# Flush database (DANGER!)
FLUSHDB
```

### Programmatic Monitoring

```typescript
import { cache } from '@/lib/cache/redis';

// Get Redis info
const info = await cache.info();
console.log(info);

// Check specific stats
const lines = info.split('\n');
const memoryUsed = lines.find(l => l.startsWith('used_memory_human'));
const hitRate = lines.find(l => l.startsWith('keyspace_hits'));
```

## Performance Tips

1. **Use connection pooling** - Redis client automatski handluje connection pooling
2. **Batch operations** - Koristi pipeline za multiple operacije
3. **Avoid KEYS in production** - Koristi SCAN umesto KEYS za pattern matching
4. **Set appropriate TTLs** - Kraće TTL za često mijenjane podatke
5. **Monitor memory** - Postavi `maxmemory` i `maxmemory-policy`
6. **Use hash for related data** - Bolje performanse za grupne podatke

## Troubleshooting

### Cache not working

```typescript
// Test connection
import { redis } from '@/lib/cache/redis';
await redis.ping(); // Should return "PONG"

// Check keys
const keys = await redis.keys('*');
console.log('Keys:', keys);

// Test set/get
await cache.set('test', { value: 'works' }, 60);
const test = await cache.get('test');
console.log('Test:', test);
```

### Memory issues

```bash
# Check memory usage
redis-cli INFO memory

# Set max memory
redis-cli CONFIG SET maxmemory 256mb
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Clear specific pattern
redis-cli --scan --pattern "companies:*" | xargs redis-cli DEL
```

### Performance issues

```bash
# Check slow log
redis-cli SLOWLOG GET 10

# Monitor commands
redis-cli MONITOR

# Check latency
redis-cli --latency
```

## Testing

```typescript
// Test cache service
import { cache, CacheKeys } from '@/lib/cache/redis';

async function testCache() {
  const key = CacheKeys.company('test-id');
  const data = { id: 'test-id', name: 'Test Company' };
  
  // Set
  await cache.set(key, data, 60);
  console.log('✓ Set cache');
  
  // Get
  const cached = await cache.get(key);
  console.assert(cached?.name === 'Test Company', 'Get cache failed');
  console.log('✓ Get cache');
  
  // Exists
  const exists = await cache.exists(key);
  console.assert(exists === true, 'Exists check failed');
  console.log('✓ Exists check');
  
  // Delete
  await cache.del(key);
  const deleted = await cache.get(key);
  console.assert(deleted === null, 'Delete failed');
  console.log('✓ Delete cache');
  
  console.log('All tests passed! ✓');
}

testCache();
```

