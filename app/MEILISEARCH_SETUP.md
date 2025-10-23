# Meilisearch Integration Setup Guide

## Overview

This application integrates Meilisearch for real-time full-text search across Offers, Orders, Deliveries, and Invoices. The system uses an event-driven architecture with NATS for automatic synchronization between PostgreSQL and Meilisearch.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Next.js   │────▶│  PostgreSQL  │────▶│ Event Publisher│
│   App       │     │  (Prisma)    │     │    (NATS)    │
└─────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │ Event Subscribers│
                                         │  (Workers)   │
                                         └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │ Meilisearch  │
                                         │   Indexes    │
                                         └──────────────┘
```

## Prerequisites

1. **Meilisearch Server** (v1.10+)
2. **NATS Server** (v2.10+)
3. **PostgreSQL** (v15+)
4. **Bun** runtime

## Installation

### 1. Install Meilisearch

#### macOS (via Homebrew)
```bash
brew install meilisearch
```

#### Docker
```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY=masterKey \
  -v "$(pwd)/meili_data:/meili_data" \
  getmeili/meilisearch:v1.10
```

#### Linux/Windows
Download from: https://www.meilisearch.com/docs/learn/getting_started/installation

### 2. Install NATS Server

#### macOS (via Homebrew)
```bash
brew install nats-server
```

#### Docker
```bash
docker run -d \
  --name nats \
  -p 4222:4222 \
  -p 8222:8222 \
  nats:latest
```

### 3. Configure Environment Variables

Add to your `.env.local`:

```bash
# Meilisearch Configuration
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=masterKey

# NATS Configuration
NATS_URL=nats://localhost:4222

# Database (already configured)
DATABASE_URL=postgresql://...
```

## Setup Instructions

### Step 1: Start Required Services

```bash
# Terminal 1 - Start NATS
nats-server

# Terminal 2 - Start Meilisearch
meilisearch --master-key=masterKey

# Terminal 3 - Start PostgreSQL (if not running)
# Already running via your setup
```

### Step 2: Initialize Meilisearch Indexes

This creates all indexes and performs initial data synchronization:

```bash
cd app
bun run init:meilisearch
```

This script will:
- Connect to Meilisearch
- Create indexes: `offers`, `orders`, `deliveries`, `invoices`
- Configure searchable, filterable, and sortable attributes
- Sync all existing data from PostgreSQL to Meilisearch

### Step 3: Start Event Workers

Event workers listen to NATS events and automatically sync changes to Meilisearch:

```bash
bun run workers:meilisearch
```

Keep this running in a separate terminal or as a background service.

### Step 4: Start Your Application

```bash
bun run dev
```

## Index Configuration

### Offers Index

**Searchable Attributes:**
- `offerNo`, `companyName`, `customerName`, `customerEmail`, `notes`

**Filterable Attributes:**
- `companyId`, `customerId`, `status`, `currency`

**Sortable Attributes:**
- `total`, `validUntil`, `createdAt`, `updatedAt`

### Orders Index

**Searchable Attributes:**
- `orderNo`, `offerNo`, `companyName`, `customerName`, `customerEmail`, `notes`

**Filterable Attributes:**
- `companyId`, `customerId`, `status`, `currency`, `offerId`

**Sortable Attributes:**
- `total`, `createdAt`, `updatedAt`

### Deliveries Index

**Searchable Attributes:**
- `deliveryNo`, `orderNo`, `companyName`, `customerName`, `customerEmail`, `signedBy`, `notes`

**Filterable Attributes:**
- `companyId`, `customerId`, `orderId`, `status`

**Sortable Attributes:**
- `deliveryDate`, `createdAt`, `updatedAt`

### Invoices Index

**Searchable Attributes:**
- `invoiceNo`, `orderNo`, `deliveryNo`, `companyName`, `customerName`, `customerEmail`, `notes`

**Filterable Attributes:**
- `companyId`, `customerId`, `deliveryId`, `type`, `status`, `currency`

**Sortable Attributes:**
- `total`, `issueDate`, `dueDate`, `createdAt`, `updatedAt`

## API Usage

### Search Endpoints

All search endpoints follow the same pattern:

```
GET /api/v1/{resource}/search?q={query}&{filters}
```

#### Example: Search Offers

```bash
# Full-text search
curl "http://localhost:3000/api/v1/offers/search?q=acme"

# Search with filters
curl "http://localhost:3000/api/v1/offers/search?q=offer&status=SENT&companyId=123"

# Search with sorting
curl "http://localhost:3000/api/v1/offers/search?q=&sortBy=total&sortOrder=desc"

# Paginated search
curl "http://localhost:3000/api/v1/offers/search?q=test&page=2&limit=10"
```

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Search query | `q=acme+corp` |
| `companyId` | string | Filter by company | `companyId=uuid` |
| `customerId` | string | Filter by customer | `customerId=uuid` |
| `status` | string | Filter by status | `status=SENT` |
| `type` | string | Filter by type (invoices) | `type=ISSUED` |
| `page` | number | Page number | `page=1` |
| `limit` | number | Results per page | `limit=20` |
| `sortBy` | string | Sort field | `sortBy=total` |
| `sortOrder` | string | Sort direction | `sortOrder=desc` |

## React Hooks Usage

### Search Offers

```tsx
import { useSearchOffers } from '@/hooks/use-offers';

function OffersSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading, error } = useSearchOffers({
    query: searchQuery,
    status: 'SENT',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search offers..."
      />
      
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      {data?.data.map(offer => (
        <div key={offer.id}>
          {offer.offerNo} - {offer.customerName}
        </div>
      ))}
    </div>
  );
}
```

### Available Search Hooks

- `useSearchOffers(params)` - Search offers
- `useSearchOrders(params)` - Search orders
- `useSearchDeliveries(params)` - Search deliveries
- `useSearchInvoices(params)` - Search invoices

## Event Flow

### 1. Create Offer Example

```
User creates offer in UI
  ↓
Next.js API route
  ↓
offerService.createOffer()
  ↓
Prisma creates record in PostgreSQL
  ↓
eventPublisher.publishAndStore()
  ↓
Event stored in domain_events table
  ↓
Event published to NATS (topic: offer.created)
  ↓
OfferSubscriber receives event
  ↓
offerIndexService.indexOffer()
  ↓
Document indexed in Meilisearch
```

### 2. Search Offers Example

```
User types in search box
  ↓
React component calls useSearchOffers()
  ↓
API: GET /api/v1/offers/search?q=...
  ↓
offerIndexService.search()
  ↓
Meilisearch returns results
  ↓
Results displayed in UI
```

## Maintenance Tasks

### Reindex All Data

If data gets out of sync:

```bash
bun run init:meilisearch
```

### Check Meilisearch Health

```bash
curl http://localhost:7700/health
```

### View Index Stats

```bash
curl http://localhost:7700/indexes/offers/stats \
  -H "Authorization: Bearer masterKey"
```

### Clear an Index

```bash
curl -X DELETE http://localhost:7700/indexes/offers/documents \
  -H "Authorization: Bearer masterKey"
```

## Production Deployment

### 1. Managed Meilisearch

Use Meilisearch Cloud: https://www.meilisearch.com/cloud

Update `.env`:
```bash
MEILISEARCH_HOST=https://your-instance.meilisearch.io
MEILISEARCH_API_KEY=your-production-key
```

### 2. Self-Hosted Meilisearch

#### Docker Compose

```yaml
version: '3.8'
services:
  meilisearch:
    image: getmeili/meilisearch:v1.10
    ports:
      - "7700:7700"
    environment:
      MEILI_MASTER_KEY: ${MEILISEARCH_API_KEY}
      MEILI_ENV: production
    volumes:
      - meilisearch_data:/meili_data
    restart: unless-stopped

volumes:
  meilisearch_data:
```

### 3. Worker as Systemd Service

Create `/etc/systemd/system/meilisearch-workers.service`:

```ini
[Unit]
Description=Meilisearch Workers
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/bun run scripts/start-meilisearch-workers.ts
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable meilisearch-workers
sudo systemctl start meilisearch-workers
```

## Troubleshooting

### Issue: Search returns empty results

**Solution:**
1. Check Meilisearch is running: `curl http://localhost:7700/health`
2. Check indexes exist: `curl http://localhost:7700/indexes`
3. Reindex data: `bun run init:meilisearch`

### Issue: Data not syncing automatically

**Solution:**
1. Check NATS is running: `nats-server --version`
2. Check workers are running: `ps aux | grep meilisearch-workers`
3. Check event logs in domain_events table
4. Restart workers: `bun run workers:meilisearch`

### Issue: Slow search performance

**Solution:**
1. Check index size: Review number of documents
2. Optimize queries: Use filters before search
3. Increase Meilisearch resources
4. Use pagination

### Issue: Events not publishing

**Solution:**
1. Check NATS connection in logs
2. Verify NATS_URL in .env
3. Check domain_events table for stored events
4. Test NATS manually: `nats pub test "hello"`

## Scripts Reference

Add these to `package.json`:

```json
{
  "scripts": {
    "init:meilisearch": "bun run scripts/init-meilisearch.ts",
    "workers:meilisearch": "bun run scripts/start-meilisearch-workers.ts",
    "reindex:offers": "bun run scripts/reindex-offers.ts",
    "reindex:orders": "bun run scripts/reindex-orders.ts",
    "reindex:deliveries": "bun run scripts/reindex-deliveries.ts",
    "reindex:invoices": "bun run scripts/reindex-invoices.ts"
  }
}
```

## Performance Tuning

### Meilisearch Configuration

For production, tune Meilisearch settings:

```bash
meilisearch \
  --master-key=your-key \
  --max-indexing-memory=2gb \
  --max-indexing-threads=4 \
  --http-payload-size-limit=100mb
```

### Batch Indexing

For bulk operations, use batch indexing:

```typescript
const documents = await prisma.offer.findMany();
const chunks = chunkArray(documents, 1000);

for (const chunk of chunks) {
  await index.addDocuments(chunk);
}
```

## Multi-Tenancy

All indexes support multi-tenancy through `companyId` filtering:

```bash
# Search within specific company
curl "http://localhost:3000/api/v1/offers/search?q=test&companyId=company-123"
```

The filtering is automatically applied based on user context.

## Security

### API Key Management

1. **Development:** Use master key for simplicity
2. **Production:** Generate search-only keys per tenant

```bash
curl -X POST http://localhost:7700/keys \
  -H "Authorization: Bearer ${MEILI_MASTER_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Company ABC search key",
    "actions": ["search"],
    "indexes": ["offers", "orders", "deliveries", "invoices"],
    "expiresAt": null
  }'
```

### Rate Limiting

Implement rate limiting on search endpoints to prevent abuse.

## Monitoring

### Key Metrics to Monitor

1. **Meilisearch:**
   - Index size
   - Search latency
   - Indexing queue length

2. **Workers:**
   - Event processing rate
   - Failed sync count
   - Queue depth

3. **NATS:**
   - Message throughput
   - Subscription lag

### Logging

All services log to stdout with structured logging:

```
✅ Connected to Meilisearch at http://localhost:7700
📥 Processing offer event: offer.created uuid-123
✅ Indexed offer: OFF-12345678-001
```

## Support

For issues or questions:
1. Check logs: Meilisearch, NATS, Workers
2. Review domain_events table
3. Test with curl commands
4. Reindex if data is stale

## Additional Resources

- [Meilisearch Documentation](https://www.meilisearch.com/docs)
- [NATS Documentation](https://docs.nats.io/)
- [Event-Driven Architecture Guide](https://martinfowler.com/articles/201701-event-driven.html)

