# 🚀 Quick Start - Redis Cache (5 minuta)

Brzo podigni Redis cache u 5 koraka.

## 1️⃣ Instaliraj i pokreni Redis (1 min)

```bash
# macOS
brew install redis && brew services start redis

# Linux
sudo apt install redis-server && sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine

# Test
redis-cli ping  # Should return PONG ✅
```

## 2️⃣ Setup Environment (30 sec)

Dodaj u `.env.local`:

```env
REDIS_URL="redis://localhost:6379"
```

## 3️⃣ Pokreni Database Migracije (1 min)

```bash
cd /Users/darioristic/Cursor/collector-dashboard-app/app

# Generate Prisma client sa novim indexima
bun run db:generate

# Push schema changes
bun run db:push
```

## 4️⃣ Testiraj Setup (1 min)

```bash
# Pokreni test script
bun run test:cache
```

Trebalo bi da vidiš:
```
✅ Redis connection: PONG
✅ Cache set
✅ Cache get
✅ Cache delete
...
🎉 All tests passed!
```

## 5️⃣ Koristi u API rutama (2 min)

**Primjer - Companies API:**

```typescript
// app/api/v1/companies/route.ts
import { cachedCompanyService } from '@/lib/services/cached';
import { withRateLimit } from '@/lib/middleware/rate-limit';

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  
  // ⚡ Automatski cache-ira rezultate!
  const companies = await cachedCompanyService.listCompanies({ page });
  
  return Response.json(companies);
}

// 🛡️ Rate limiting automatski aktivan
export const GET = withRateLimit(handleGET);
```

**Prije:**
```typescript
import { companyService } from '@/lib/services/company.service';
const companies = await companyService.listCompanies({ page });
```

**Poslije:**
```typescript
import { cachedCompanyService } from '@/lib/services/cached';
const companies = await cachedCompanyService.listCompanies({ page });
```

## 🎉 Gotovo!

Sada imaš:
- ✅ Redis cache (10x brži upiti)
- ✅ Rate limiting (zaštita od spam-a)
- ✅ Session management (brže auth)
- ✅ Optimizovane database indexes

## 📊 Provjeri Performanse

```bash
# Prije cache
curl -w "%{time_total}s\n" http://localhost:3000/api/v1/companies
# ~200ms

# Sa cache (drugi poziv)
curl -w "%{time_total}s\n" http://localhost:3000/api/v1/companies
# ~20ms ⚡ 10x brže!
```

## 📚 Više Informacije

- **Kompletni Setup**: `REDIS_CACHE_SETUP.md`
- **Migracija Guide**: `CACHE_MIGRATION_GUIDE.md`  
- **API Docs**: `lib/cache/README.md`
- **Summary**: `SETUP_COMPLETE.md`

## 🐛 Problem?

```bash
# Redis ne radi?
redis-cli ping
brew services restart redis

# Database migration error?
bun run db:push --force-reset

# Cache ne radi?
bun run test:cache
```

## 💡 Pro Tips

1. **Migriraj rute postepeno** - Zamijeni servise jedan po jedan
2. **Prati cache hit rate** - Target je 70%+
3. **Koristi cached servise** - Automatska invalidacija
4. **Dodaj rate limiting** - Especially za auth endpoints

---

**Ready?** Pokreni app i uživaj u brzini! 🚀

```bash
bun run dev
```

