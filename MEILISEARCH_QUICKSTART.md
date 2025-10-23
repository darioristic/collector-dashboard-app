# Meilisearch Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check
```bash
# Check Bun
bun --version  # Should be v1.0+

# Check PostgreSQL
psql --version  # Should be running

# Check if ports are available
lsof -i :7700  # Meilisearch (should be empty)
lsof -i :4222  # NATS (should be empty)
```

## Step 1: Install Services (2 minutes)

### macOS
```bash
# Install Meilisearch
brew install meilisearch

# Install NATS
brew install nats-server
```

### Docker (Alternative)
```bash
# Create docker-compose.yml
cat > docker-compose.search.yml << 'EOF'
version: '3.8'
services:
  meilisearch:
    image: getmeili/meilisearch:v1.10
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: masterKey
    volumes:
      - meilisearch_data:/meili_data

  nats:
    image: nats:latest
    ports:
      - "4222:4222"
      - "8222:8222"

volumes:
  meilisearch_data:
EOF

# Start services
docker-compose -f docker-compose.search.yml up -d
```

## Step 2: Configure Environment (30 seconds)

Add to `app/.env.local`:
```bash
# Meilisearch Configuration
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey

# NATS Configuration (if not already present)
NATS_URL=nats://localhost:4222

# Database should already be configured
# DATABASE_URL=postgresql://...
```

## Step 3: Start Services (1 minute)

### Option A: Native
```bash
# Terminal 1 - Start Meilisearch
meilisearch --master-key=masterKey

# Terminal 2 - Start NATS
nats-server

# Keep these running...
```

### Option B: Docker
```bash
# Already running from Step 1 if you used Docker
docker-compose -f docker-compose.search.yml ps
```

## Step 4: Initialize Meilisearch (30 seconds)

```bash
cd app

# Create indexes and sync existing data
bun run init:meilisearch
```

You should see:
```
🚀 Initializing Meilisearch indexes...
Creating indexes and configuring settings...
✅ Created Meilisearch index: offers
✅ Configured index offers
✅ Created Meilisearch index: orders
✅ Configured index orders
✅ Created Meilisearch index: deliveries
✅ Configured index deliveries
✅ Created Meilisearch index: invoices
✅ Configured index invoices

📊 Reindexing all data...
✅ Reindexed X offers
✅ Reindexed X orders
✅ Reindexed X deliveries
✅ Reindexed X invoices

✅ Meilisearch initialization complete!
```

## Step 5: Start Workers (30 seconds)

In a new terminal:
```bash
cd app
bun run workers:meilisearch
```

You should see:
```
🚀 Starting Meilisearch workers...
✅ Offer subscriber connected to NATS
✅ Order subscriber connected to NATS
✅ Delivery subscriber connected to NATS
✅ Invoice subscriber connected to NATS
✅ All Meilisearch subscribers started
```

Keep this terminal running.

## Step 6: Start Your App (30 seconds)

In a new terminal:
```bash
cd app
bun run dev
```

## Step 7: Test Search (30 seconds)

### Test via API
```bash
# Test offers search
curl "http://localhost:3000/api/v1/offers/search?q=test" | jq

# Test orders search
curl "http://localhost:3000/api/v1/orders/search?q=" | jq

# Test with filters
curl "http://localhost:3000/api/v1/invoices/search?status=DRAFT" | jq
```

### Test in Browser
1. Open your app at `http://localhost:3000`
2. Navigate to any page with search
3. Start typing to see instant results!

## ✅ Success Checklist

- [ ] Meilisearch running on port 7700
- [ ] NATS running on port 4222
- [ ] Indexes created (run init:meilisearch)
- [ ] Workers running (bun run workers:meilisearch)
- [ ] App running on port 3000
- [ ] Search API returns results

## Usage Examples

### Quick Test Component

Create `app/app/test-search/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useSearchOffers } from '@/hooks/use-offers';
import { useDebounce } from '@/hooks/use-debounce';

export default function TestSearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useSearchOffers({
    query: debouncedQuery,
    limit: 10,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Search</h1>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search offers..."
        className="w-full p-2 border rounded"
      />

      {isLoading && <p className="mt-4">Searching...</p>}

      {data && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Found {data.pagination.total} results
          </p>
          {data.data.map((offer) => (
            <div key={offer.id} className="p-4 border rounded mb-2">
              <div className="font-bold">{offer.offerNo}</div>
              <div className="text-sm">{offer.customerName}</div>
              <div className="text-sm text-gray-600">
                {offer.total} {offer.currency}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

Visit: `http://localhost:3000/test-search`

## Common Commands

```bash
# Restart workers
cd app
pkill -f "meilisearch-workers"
bun run workers:meilisearch

# Reindex all data
bun run init:meilisearch

# Check Meilisearch health
curl http://localhost:7700/health

# Check indexes
curl http://localhost:7700/indexes -H "Authorization: Bearer masterKey"

# Check NATS
curl http://localhost:8222/varz
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 7700
lsof -ti:7700 | xargs kill -9

# Kill process on port 4222
lsof -ti:4222 | xargs kill -9
```

### Search Returns Nothing
```bash
# 1. Check Meilisearch is running
curl http://localhost:7700/health

# 2. Check indexes exist
curl http://localhost:7700/indexes -H "Authorization: Bearer masterKey"

# 3. Reindex data
cd app
bun run init:meilisearch
```

### Workers Not Syncing
```bash
# 1. Check workers are running
ps aux | grep meilisearch-workers

# 2. Check NATS is running
curl http://localhost:8222/varz

# 3. Restart workers
pkill -f "meilisearch-workers"
bun run workers:meilisearch
```

### TypeScript Errors
```bash
# Regenerate Prisma client
cd app
bunx prisma generate
```

## What Happens When You Search?

1. **User types** → Debounced input (300ms delay)
2. **React hook** → `useSearchOffers({ query: "test" })`
3. **API call** → `GET /api/v1/offers/search?q=test`
4. **Search service** → Queries Meilisearch
5. **Meilisearch** → Returns results in <50ms
6. **React Query** → Caches results
7. **Component** → Renders results

## What Happens When Data Changes?

1. **User creates offer** → `POST /api/v1/offers`
2. **Service** → Saves to PostgreSQL
3. **Event publisher** → Stores event in `domain_events`
4. **NATS** → Publishes `offer.created` event
5. **Worker** → Receives event
6. **Index service** → Syncs to Meilisearch
7. **Next search** → Returns updated results

## Production Checklist

Before going to production:

- [ ] Use Meilisearch Cloud or dedicated instance
- [ ] Set strong API keys
- [ ] Deploy workers as systemd service
- [ ] Set up monitoring and alerts
- [ ] Configure log aggregation
- [ ] Test failover scenarios
- [ ] Set up backups
- [ ] Load test search endpoints

## Next Steps

1. ✅ Basic setup complete
2. 📝 Read full documentation: `MEILISEARCH_SETUP.md`
3. 👀 Check examples: `SEARCH_EXAMPLES.md`
4. 🎨 Create search UI components
5. 🚀 Deploy to staging
6. 📊 Monitor and optimize

## Useful Links

- 📖 Full Setup Guide: `app/MEILISEARCH_SETUP.md`
- 💡 Code Examples: `app/SEARCH_EXAMPLES.md`
- 📋 Implementation Summary: `MEILISEARCH_IMPLEMENTATION.md`
- 🔍 Meilisearch Docs: https://www.meilisearch.com/docs
- 📨 NATS Docs: https://docs.nats.io/

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review logs from all services
3. Verify environment variables
4. Test each service independently
5. Check the full documentation

## Success! 🎉

If you can:
- ✅ Search via API and get results
- ✅ Create a new offer and see it in search
- ✅ Filter and sort results
- ✅ See workers processing events in logs

**You're all set!** The system is working correctly.

---

**Estimated Total Setup Time: 5 minutes** ⏱️

Your enterprise-grade search is ready to use! 🚀

