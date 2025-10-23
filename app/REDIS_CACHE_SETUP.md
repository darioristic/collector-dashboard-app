# Redis Cache & PostgreSQL Optimization Setup

Kompletan setup za maksimalne performanse sa Redis cache-om i PostgreSQL optimizacijama.

## 📦 Instalacija

### 1. PostgreSQL Setup

PostgreSQL je već konfigurisan. Za maksimalne performanse:

```bash
# Omogući pg_stat_statements ekstenziju
psql -U postgres -d collector_crm -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"

# Verifikuj da je omogućena
psql -U postgres -d collector_crm -c "SELECT * FROM pg_stat_statements LIMIT 1;"
```

**postgresql.conf optimizacije:**
```ini
# Memory Settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB

# Connection Pooling
max_connections = 100

# Query Planning
random_page_cost = 1.1  # Za SSD
effective_io_concurrency = 200

# Monitoring
shared_preload_libraries = 'pg_stat_statements'
pg_stat_statements.track = all
```

### 2. Redis Setup

```bash
# Instalacija (macOS)
brew install redis

# Pokreni Redis
brew services start redis

# Verifikuj da Redis radi
redis-cli ping  # Trebalo bi da vrati PONG
```

**redis.conf optimizacije:**
```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
save ""  # Disable persistence za cache (opcionalno)
```

### 3. Prisma Migracije

```bash
# Generiši Prisma klijenta sa novim optimizacijama
bun run db:generate

# Kreiraj migraciju za nove indexes
bun run db:migrate

# Ili push direktno (development)
bun run db:push
```

## 🚀 Connection Pooling

### Opcija 1: PgBouncer (Recommended)

```bash
# Instalacija
brew install pgbouncer

# pgbouncer.ini
[databases]
collector_crm = host=localhost port=5432 dbname=collector_crm

[pgbouncer]
listen_port = 6432
listen_addr = 127.0.0.1
auth_type = md5
auth_file = /usr/local/etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 100
default_pool_size = 25
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3
```

**Update .env:**
```env
DATABASE_URL="postgresql://user:password@localhost:6432/collector_crm?schema=public"
DATABASE_URL_UNPOOLED="postgresql://user:password@localhost:5432/collector_crm?schema=public"
```

### Opcija 2: Supavisor (Supabase)

Ako koristiš Supabase, oni imaju built-in connection pooling:

```env
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"
```

## 📚 Korišćenje Cache Servisa

### Basic Usage

```typescript
import { cache, CacheKeys, CacheTTL } from '@/lib/cache/redis';

// Get/Set
const company = await cache.get<Company>(CacheKeys.company(id));
await cache.set(CacheKeys.company(id), company, CacheTTL.MEDIUM);

// Delete
await cache.del(CacheKeys.company(id));

// Pattern delete
await cache.delPattern('companies:*');
```

### Cached Services

Koristi cached servise umesto običnih za automatsko cache-iranje:

```typescript
// ❌ Staro (bez cache)
import { companyService } from '@/lib/services/company.service';

// ✅ Novo (sa cache)
import { cachedCompanyService } from '@/lib/services/cached';

// Automatski cache-ira rezultate
const company = await cachedCompanyService.getCompany(id);
const companies = await cachedCompanyService.listCompanies({ page: 1, limit: 20 });
```

### Custom Query Cache

```typescript
import { queryCache, createCacheKey } from '@/lib/cache/query-cache';

const result = await queryCache.wrap(
  async () => {
    // Spor query
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

// Invalidacija
await queryCache.invalidateTags(['companies']);
```

## 🛡️ Rate Limiting

### API Route Protection

```typescript
// app/api/v1/companies/route.ts
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(request: Request) {
  // Your logic
  return Response.json({ data: [] });
}

export const GET = withRateLimit(handleGET);
```

### Custom Rate Limiters

```typescript
import { withAuthRateLimit, withSearchRateLimit, withUploadRateLimit } from '@/lib/middleware/rate-limit';

// Auth endpoints (strože)
export const POST = withAuthRateLimit(handleLogin);

// Search endpoints
export const GET = withSearchRateLimit(handleSearch);

// Upload endpoints
export const POST = withUploadRateLimit(handleUpload);
```

### Custom Rate Limiter

```typescript
import { RateLimiter } from '@/lib/cache/rate-limiter';

const customLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 min
  maxRequests: 100, // 100 req/min
});

const result = await customLimiter.check(userId);
if (!result.allowed) {
  return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
}
```

## 🔐 Session Management

```typescript
import { sessionManager } from '@/lib/cache/session';

// Kreiranje sesije
const session = await sessionManager.create({
  token: 'jwt-token',
  userId: user.id,
  email: user.email,
  role: user.role,
  metadata: { ip: '127.0.0.1' },
});

// Provera sesije
const session = await sessionManager.get(token);

// Refresh sesije
await sessionManager.refresh(token);

// Brisanje sesije
await sessionManager.delete(token);

// Multi-device management
const userSessions = await sessionManager.getUserSessions(userId);
await sessionManager.deleteUserSessions(userId); // Logout sa svih uređaja
```

## 📊 Monitoring

### PostgreSQL Query Performance

```sql
-- Top 10 najsporijih upita
SELECT 
  calls,
  mean_exec_time,
  max_exec_time,
  total_exec_time,
  query
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Cache hit ratio (trebalo bi da bude > 99%)
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

### Redis Monitoring

```bash
# Info
redis-cli info

# Memory usage
redis-cli info memory

# Stats
redis-cli info stats

# Monitor commands u realnom vremenu
redis-cli monitor
```

### Prisma Query Logging

```typescript
// lib/prisma.ts već ima logging uključen za development
// Provjeri slow queries u konzoli
```

## 🎯 Best Practices

### 1. Cache Invalidation Strategy

```typescript
// Uvek invalidiraj cache nakon update/delete operacija
await cachedCompanyService.updateCompany(id, data);
// Cache se automatski invalidira

// Za bulk operacije, invalidiraj pattern
await queryCache.invalidatePattern('companies:*');
```

### 2. TTL Selection

- **SHORT (1 min)**: Liste, search rezultati
- **MEDIUM (5 min)**: Pojedinačni resursi (company, contact)
- **LONG (1 hour)**: Statički podatci
- **SESSION (7 dana)**: Sesije

### 3. Database Query Optimization

```typescript
// ✅ Koristi partial indexes
await prisma.company.findMany({
  where: {
    type: 'CUSTOMER',
    country: 'Serbia',
    deletedAt: null, // Koristi idx_active_companies_type_country
  },
});

// ✅ Koristi select za specifična polja
await prisma.company.findMany({
  select: {
    id: true,
    name: true,
    type: true,
  },
});

// ✅ Koristi batch operations
import { batchWrite } from '@/lib/prisma';

await batchWrite([
  prisma.contact.create({ data: contact1 }),
  prisma.contact.create({ data: contact2 }),
]);
```

### 4. Transaction Management

```typescript
import { transaction } from '@/lib/prisma';

const result = await transaction(async (tx) => {
  const company = await tx.company.create({ data: companyData });
  const contact = await tx.contact.create({ data: { ...contactData, companyId: company.id } });
  return { company, contact };
});
```

## 🐛 Troubleshooting

### Redis Connection Issues

```bash
# Check Redis status
brew services list

# Test connection
redis-cli ping

# View logs
tail -f /usr/local/var/log/redis.log
```

### PostgreSQL Performance

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check locks
SELECT * FROM pg_locks;

-- Vacuum if needed
VACUUM ANALYZE;
```

### Cache Not Working

```typescript
// Debug mode
cache.get(key).then(console.log);

// Check Redis keys
redis-cli KEYS '*'

// Flush cache if needed (development only!)
await cache.flush();
```

## 📈 Expected Performance Improvements

- **Query speed**: 10-50x brži za cached data
- **Database load**: 60-80% redukcija
- **API response time**: 100-500ms → 10-50ms (cached)
- **Concurrent users**: 10x više istovremenih korisnika

## 🔄 Migration Checklist

- [x] Instaliran Redis
- [x] Dodati novi indexes u Prisma schema
- [x] Pokrenut `bun run db:migrate`
- [x] Ažuriran `.env` sa REDIS_URL
- [x] Uključen pg_stat_statements
- [ ] Setup connection pooling (opcionalno ali preporučeno)
- [ ] Zamijeniti servise sa cached verzijama u API rutama
- [ ] Dodati rate limiting na osjetljive rute
- [ ] Setup monitoring i alerting

