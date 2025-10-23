# Cache Migration Guide

Step-by-step vodič za migraciju na cached servise.

## Faza 1: Setup (30 min)

### 1.1 Pokreni Redis

```bash
# macOS
brew install redis
brew services start redis
redis-cli ping  # Should return PONG

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
redis-cli ping

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 1.2 Update Environment Variables

```bash
# .env.local
REDIS_URL="redis://localhost:6379"
```

### 1.3 Pokreni Database Migracije

```bash
# Generate Prisma client sa novim indexima
bun run db:generate

# Push schema changes
bun run db:push

# Ili kreiraj migraciju (production)
bun run db:migrate
```

### 1.4 Verifikuj Setup

```bash
# Test Redis connection
redis-cli ping

# Test Prisma
bun run db:studio
```

## Faza 2: Migracija API Ruta (1-2 sata)

### 2.1 Companies API

**Before:**
```typescript
// app/api/v1/companies/route.ts
import { companyService } from '@/lib/services/company.service';

export async function GET(request: Request) {
  const companies = await companyService.listCompanies({ page: 1 });
  return Response.json(companies);
}
```

**After:**
```typescript
// app/api/v1/companies/route.ts
import { cachedCompanyService } from '@/lib/services/cached';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const companies = await cachedCompanyService.listCompanies({ page });
  return Response.json(companies);
}

export const GET = withRateLimit(handleGET);

async function handlePOST(request: Request) {
  const data = await request.json();
  const company = await cachedCompanyService.createCompany(data);
  return Response.json(company);
}

export const POST = withRateLimit(handlePOST);
```

### 2.2 Single Company API

```typescript
// app/api/v1/companies/[id]/route.ts
import { cachedCompanyService } from '@/lib/services/cached';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const company = await cachedCompanyService.getCompany(params.id);
  if (!company) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json(company);
}

export const GET = withRateLimit(handleGET);

async function handlePUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const company = await cachedCompanyService.updateCompany(params.id, data);
  return Response.json(company);
}

export const PUT = withRateLimit(handlePUT);

async function handleDELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const company = await cachedCompanyService.deleteCompany(params.id);
  return Response.json(company);
}

export const DELETE = withRateLimit(handleDELETE);
```

### 2.3 Contacts API

```typescript
// app/api/v1/contacts/route.ts
import { cachedContactService } from '@/lib/services/cached';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const companyId = url.searchParams.get('companyId');
  
  const contacts = companyId
    ? await cachedContactService.getContactsByCompany(companyId)
    : await cachedContactService.listContacts({ page: 1 });
    
  return Response.json(contacts);
}

export const GET = withRateLimit(handleGET);
```

### 2.4 Relationships API

```typescript
// app/api/v1/relationships/route.ts
import { cachedRelationshipService } from '@/lib/services/cached';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const companyId = url.searchParams.get('companyId');
  
  const relationships = companyId
    ? await cachedRelationshipService.getCompanyRelationships(companyId)
    : await cachedRelationshipService.listRelationships({ page: 1 });
    
  return Response.json(relationships);
}

export const GET = withRateLimit(handleGET);
```

### 2.5 Auth API (Striktno Rate Limiting)

```typescript
// app/api/v1/auth/login/route.ts
import { withAuthRateLimit } from '@/lib/middleware/rate-limit';
import { sessionManager } from '@/lib/cache/session';

async function handlePOST(request: Request) {
  const { email, password } = await request.json();
  
  // Verify credentials
  const user = await verifyUser(email, password);
  
  // Create JWT token
  const token = createJWT(user);
  
  // Store session in Redis
  await sessionManager.create({
    token,
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  
  return Response.json({ token, user });
}

export const POST = withAuthRateLimit(handlePOST);
```

## Faza 3: Migracija Frontend Hooks (30 min)

### 3.1 Update React Query Hooks

React Query već ima caching, ali možeš dodati optimistic updates:

```typescript
// hooks/use-companies.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/v1/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.setQueryData(['company', data.id], data);
    },
  });
}
```

## Faza 4: Testing (1 sat)

### 4.1 Test Cache Behavior

```bash
# Start app
bun run dev

# Monitor Redis
redis-cli MONITOR

# Make requests and verify caching
curl http://localhost:3000/api/v1/companies

# Check Redis keys
redis-cli KEYS '*'

# Check specific key
redis-cli GET "company:some-uuid"
```

### 4.2 Test Rate Limiting

```bash
# Test rate limit
for i in {1..70}; do 
  curl -w "%{http_code}\n" http://localhost:3000/api/v1/companies
done

# Should see 429 after ~60 requests
```

### 4.3 Test Cache Invalidation

```typescript
// Create test script: scripts/test-cache.ts
import { cachedCompanyService } from '@/lib/services/cached';
import { cache, CacheKeys } from '@/lib/cache/redis';

async function testCache() {
  const id = 'test-uuid';
  
  // 1. Get (should hit DB)
  console.time('First get');
  await cachedCompanyService.getCompany(id);
  console.timeEnd('First get');
  
  // 2. Get again (should hit cache)
  console.time('Second get');
  await cachedCompanyService.getCompany(id);
  console.timeEnd('Second get');
  
  // 3. Check cache exists
  const exists = await cache.exists(CacheKeys.company(id));
  console.log('Cache exists:', exists);
  
  // 4. Update (should invalidate)
  await cachedCompanyService.updateCompany(id, { name: 'Updated' });
  
  // 5. Check cache cleared
  const existsAfter = await cache.exists(CacheKeys.company(id));
  console.log('Cache exists after update:', existsAfter);
}

testCache();
```

```bash
bun run scripts/test-cache.ts
```

## Faza 5: Monitoring Setup (30 min)

### 5.1 PostgreSQL Monitoring

```sql
-- Create monitoring view
CREATE VIEW slow_queries AS
SELECT 
  calls,
  mean_exec_time,
  max_exec_time,
  total_exec_time,
  query
FROM pg_stat_statements
WHERE mean_exec_time > 100  -- queries > 100ms
ORDER BY mean_exec_time DESC;

-- Check regularly
SELECT * FROM slow_queries LIMIT 10;
```

### 5.2 Redis Monitoring Script

```typescript
// scripts/redis-monitor.ts
import { redis, cache } from '@/lib/cache/redis';

async function monitor() {
  const info = await cache.info();
  const lines = info.split('\n');
  
  const stats = {
    connected_clients: lines.find(l => l.startsWith('connected_clients')),
    used_memory_human: lines.find(l => l.startsWith('used_memory_human')),
    total_commands_processed: lines.find(l => l.startsWith('total_commands_processed')),
    keyspace_hits: lines.find(l => l.startsWith('keyspace_hits')),
    keyspace_misses: lines.find(l => l.startsWith('keyspace_misses')),
  };
  
  console.log('Redis Stats:', stats);
  
  // Calculate hit rate
  const hits = parseInt(stats.keyspace_hits.split(':')[1]);
  const misses = parseInt(stats.keyspace_misses.split(':')[1]);
  const hitRate = (hits / (hits + misses) * 100).toFixed(2);
  console.log(`Cache hit rate: ${hitRate}%`);
}

setInterval(monitor, 60000); // Every minute
monitor();
```

## Faza 6: Production Deployment

### 6.1 Pre-deployment Checklist

- [ ] Redis je stabilan i radi
- [ ] Backup plan ako Redis padne (graceful degradation)
- [ ] Environment variables su postavljene
- [ ] Database migracije su pokrenute
- [ ] Load testing je obavljen
- [ ] Monitoring je setup

### 6.2 Graceful Degradation

Cache servis već ima graceful degradation:

```typescript
// lib/cache/redis.ts već handluje errore
async get<T>(key: string): Promise<T | null> {
  try {
    // ... cache logic
  } catch (error) {
    console.error('Cache get error:', error);
    return null; // Vraća null, API će pozvati DB
  }
}
```

### 6.3 Production Environment Variables

```env
# Production .env
DATABASE_URL="postgresql://user:pass@prod-db:5432/db?connection_limit=20&pool_timeout=10"
DATABASE_URL_UNPOOLED="postgresql://user:pass@prod-db:5432/db"
REDIS_URL="redis://prod-redis:6379"
NODE_ENV="production"
```

## Performance Metrics

### Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| List Companies | ~200ms | ~20ms | 10x faster |
| Get Company | ~50ms | ~5ms | 10x faster |
| Search | ~300ms | ~30ms | 10x faster |
| DB Connections | ~50 | ~10 | 80% reduction |
| Server Load | 100% | 30% | 70% reduction |

### Cache Hit Rates (Target)

- Lists: 60-70% (manje zbog paginacije)
- Single resources: 80-90%
- Search: 50-60%
- Overall: 70%+

## Rollback Plan

Ako nešto pođe po zlu:

```bash
# 1. Iskljući Redis
brew services stop redis

# 2. Rollback koda
git revert HEAD

# 3. Rollback database
bun run db:migrate -- --rollback

# 4. Restart app
bun run dev
```

Ili samo koristi originalne servise privremeno:

```typescript
// Temporary fallback
import { companyService } from '@/lib/services/company.service'; // Umesto cached
```

## Troubleshooting

### Problem: Cache se ne invalidira

```typescript
// Debug invalidation
import { cache } from '@/lib/cache/redis';

await cache.del(CacheKeys.company(id));
await cache.delPattern('companies:*');
```

### Problem: Redis connection error

```typescript
// Check connection
redis-cli ping

// Restart Redis
brew services restart redis
```

### Problem: Sporiji performanse

```bash
# Check if indexes are created
psql -U postgres -d collector_crm -c "\d companies"

# Rebuild indexes
psql -U postgres -d collector_crm -c "REINDEX TABLE companies;"
```

## Next Steps

Nakon uspješne migracije:

1. **Setup monitoring dashboards** (Grafana + Prometheus)
2. **Configure backup strategy** za Redis (AOF/RDB)
3. **Implement cache warming** za često korišćene podatke
4. **Add more granular caching** za complex queries
5. **Setup Redis Cluster** za high availability

