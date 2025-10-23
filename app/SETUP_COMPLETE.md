# ✅ Setup Complete - Redis Cache & PostgreSQL Optimization

Uspješno si implementirao kompletan cache sistem sa Redis-om i PostgreSQL optimizacijama!

## 🎉 Šta je implementirano

### 1. PostgreSQL Optimizacije

✅ **Partial Indexes** za često korišćene upite:
- `idx_active_companies_type_country` - Companies by type and country
- `idx_active_contacts_primary` - Primary contacts
- `idx_relationships_source_active` - Active relationships
- `idx_active_offers` - Non-expired offers
- `idx_unpaid_invoices` - Unpaid invoices

✅ **Connection Pooling Setup**:
- Prisma optimizovana konfiguracija
- Support za PgBouncer/Supavisor
- Prepared statements
- Transaction batching

✅ **pg_stat_statements** ekstenzija za query monitoring

### 2. Redis Cache System

✅ **Cache Service** (`lib/cache/redis.ts`):
- Basic operations (get, set, del, exists)
- Hash operations (hget, hset, hgetall)
- List operations (lpush, rpop, lrange)
- Pub/Sub support
- Pattern matching
- Auto error handling

✅ **Query Cache** (`lib/cache/query-cache.ts`):
- Automatsko cache-iranje query rezultata
- Tag-based invalidation
- TTL management
- Cache key generator

✅ **Rate Limiting** (`lib/cache/rate-limiter.ts`):
- Sliding window algorithm
- Pre-configured limiters (API, Auth, Search, Upload)
- Middleware wrappers
- Client identification

✅ **Session Management** (`lib/cache/session.ts`):
- Redis-based sessions
- Multi-device support
- Session refresh
- Bulk operations

### 3. Cached Services

✅ **Cached Service Wrappers** (`lib/services/cached/`):
- `cachedCompanyService` - Company operations sa cachingom
- `cachedContactService` - Contact operations sa cachingom
- `cachedRelationshipService` - Relationship operations sa cachingom
- Automatsko cache invalidation

### 4. Middleware

✅ **Rate Limit Middleware** (`lib/middleware/rate-limit.ts`):
- `withRateLimit()` - General rate limiting
- `withAuthRateLimit()` - Strict auth limiting
- `withSearchRateLimit()` - Search endpoint limiting
- `withUploadRateLimit()` - Upload limiting

### 5. Dokumentacija

✅ Kompletna dokumentacija:
- `REDIS_CACHE_SETUP.md` - Detaljni setup i configuration guide
- `CACHE_MIGRATION_GUIDE.md` - Step-by-step migracija
- `lib/cache/README.md` - API dokumentacija
- `ENV_TEMPLATE.md` - Environment variables template

### 6. Testing Tools

✅ **Test Script** (`scripts/test-cache-setup.ts`):
- Redis connection test
- Basic cache operations test
- Query cache test
- Session manager test
- Rate limiter test
- Performance benchmarks

## 🚀 Kako pokrenuti

### 1. Instaliraj Redis

```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 2. Setup Environment Variables

```bash
# Dodaj u .env.local
REDIS_URL="redis://localhost:6379"
DATABASE_URL="postgresql://user:pass@localhost:5432/collector_crm?schema=public"
```

### 3. Pokreni Database Migracije

```bash
# Generate Prisma client sa novim optimizacijama
bun run db:generate

# Push schema changes (development)
bun run db:push

# Ili kreiraj migraciju (production)
bun run db:migrate
```

### 4. Testiraj Setup

```bash
# Pokreni test script
bun run test:cache

# Trebalo bi da vidiš sva zelena checkmarks ✅
```

### 5. Pokreni App

```bash
bun run dev
```

## 📖 Quick Usage Examples

### Koristi Cached Services u API rutama

```typescript
// app/api/v1/companies/route.ts
import { cachedCompanyService } from '@/lib/services/cached';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(request: Request) {
  const companies = await cachedCompanyService.listCompanies({ page: 1 });
  return Response.json(companies);
}

export const GET = withRateLimit(handleGET);
```

### Custom Cache

```typescript
import { cache, CacheKeys, CacheTTL } from '@/lib/cache/redis';

// Cache API response
const data = await cache.get(CacheKeys.company(id));
if (!data) {
  const fresh = await fetchFromDB(id);
  await cache.set(CacheKeys.company(id), fresh, CacheTTL.MEDIUM);
  return fresh;
}
return data;
```

### Session Management

```typescript
import { sessionManager } from '@/lib/cache/session';

// Create session after login
const session = await sessionManager.create({
  token: jwtToken,
  userId: user.id,
  email: user.email,
  role: user.role,
});

// Validate session
const session = await sessionManager.get(token);
if (!session) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Rate Limiting

```typescript
import { withAuthRateLimit } from '@/lib/middleware/rate-limit';

// Protect auth endpoints
export const POST = withAuthRateLimit(handleLogin);
```

## 📊 Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **List Companies** | ~200ms | ~20ms | **10x faster** |
| **Get Company** | ~50ms | ~5ms | **10x faster** |
| **Search** | ~300ms | ~30ms | **10x faster** |
| **DB Connections** | ~50 | ~10 | **80% reduction** |
| **Concurrent Users** | 100 | 1000+ | **10x more** |

## 🔍 Monitoring

### Check Redis Status

```bash
# Connection test
redis-cli ping

# View all keys
redis-cli KEYS '*'

# Monitor in real-time
redis-cli MONITOR

# Memory usage
redis-cli INFO memory

# Stats
redis-cli INFO stats
```

### Check Database Performance

```sql
-- Slow queries
SELECT 
  calls,
  mean_exec_time,
  query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Cache hit ratio
SELECT 
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

## 🎯 Next Steps

### Immediate (0-1 dan)

1. **Migrate API routes** to use cached services
   ```typescript
   // Replace
   import { companyService } from '@/lib/services/company.service';
   // With
   import { cachedCompanyService } from '@/lib/services/cached';
   ```

2. **Add rate limiting** to sensitive endpoints
   ```typescript
   export const POST = withAuthRateLimit(handleLogin);
   ```

3. **Test in development**
   ```bash
   bun run test:cache
   bun run dev
   ```

### Short-term (1-3 dana)

4. **Setup Connection Pooling** (PgBouncer)
   - Install PgBouncer
   - Configure connection pool
   - Update DATABASE_URL

5. **Enable pg_stat_statements**
   ```sql
   CREATE EXTENSION pg_stat_statements;
   ```

6. **Monitor performance**
   - Check slow queries
   - Monitor Redis hit rate
   - Track API response times

### Long-term (Opcionalno)

7. **Redis Cluster** za high availability
8. **Cache warming** strategy
9. **Monitoring dashboards** (Grafana)
10. **Auto-scaling** za Redis i Postgres

## 📚 Documentation Links

- **Setup Guide**: `REDIS_CACHE_SETUP.md`
- **Migration Guide**: `CACHE_MIGRATION_GUIDE.md`
- **API Docs**: `lib/cache/README.md`
- **Environment**: `ENV_TEMPLATE.md`

## 🐛 Troubleshooting

### Redis not connecting?

```bash
# Check if Redis is running
redis-cli ping

# Restart Redis
brew services restart redis

# Check logs
tail -f /usr/local/var/log/redis.log
```

### Database migration issues?

```bash
# Reset database (development only!)
bun run db:push --force-reset

# Or create fresh migration
bun run db:migrate
```

### Cache not working?

```typescript
// Test manually
import { cache } from '@/lib/cache/redis';
await cache.set('test', { works: true }, 60);
const test = await cache.get('test');
console.log('Cache test:', test);
```

## 💡 Tips

1. **Cache invalidation je kritičan** - Cached servisi automatski handluju, ali pazite u custom implementacijama
2. **TTL selection matters** - Koristi SHORT za liste, MEDIUM za single resources
3. **Monitor hit rate** - Target je 70%+ overall hit rate
4. **Graceful degradation** - Cache errors ne smiju breakati app (već implementirano)
5. **Test with load** - Koristite load testing tool (k6, Apache Bench) za realnu sliku

## 🎊 Zaključak

Sada imaš production-ready cache sistem koji će drastično poboljšati performanse! 

**Sledeći korak**: Migriraj API rute da koriste cached servise i uživaj u brzini! 🚀

---

**Questions?** Provjeri dokumentaciju ili pokreni test script:
```bash
bun run test:cache
```

**Happy caching!** 🎉

