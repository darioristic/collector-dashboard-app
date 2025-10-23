# B2B Business Management Platform - Moduli

## Pregled

Ova platforma obuhvata četiri glavna poslovna modula sa kompletnom REST API podrškom, event-driven arhitekturom i modernim frontend interfejsom.

## 📦 Moduli

### 1. **Offer Service** (Ponude)
Kreiranje, uređivanje i odobravanje ponuda. Automatska konverzija u narudžbine.

**Endpointi:**
- `GET /api/v1/offers` - Lista svih ponuda
- `GET /api/v1/offers/:id` - Detalji ponude
- `POST /api/v1/offers` - Kreiranje nove ponude
- `PUT /api/v1/offers/:id` - Ažuriranje ponude
- `POST /api/v1/offers/:id/approve` - Odobravanje ponude → kreira Order
- `POST /api/v1/offers/:id/reject` - Odbijanje ponude
- `POST /api/v1/offers/:id/send` - Slanje ponude klijentu

**Statusi:** `DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`

**Frontend:** `/dashboard/sales/offers`

---

### 2. **Order Service** (Narudžbine)
Kreiranje narudžbina ručno ili iz prihvaćenih ponuda. Praćenje ispunjenja i dostave.

**Endpointi:**
- `GET /api/v1/orders` - Lista narudžbina
- `GET /api/v1/orders/:id` - Detalji narudžbine
- `POST /api/v1/orders` - Kreiranje narudžbine
- `PUT /api/v1/orders/:id` - Ažuriranje narudžbine
- `POST /api/v1/orders/:id/confirm` - Potvrda narudžbine
- `POST /api/v1/orders/:id/fulfill` - Označavanje kao ispunjeno → kreira Delivery
- `POST /api/v1/orders/:id/cancel` - Otkazivanje narudžbine

**Statusi:** `DRAFT`, `CONFIRMED`, `FULFILLED`, `CANCELLED`

**Frontend:** `/dashboard/sales/orders`

---

### 3. **Delivery Service** (Dostave)
Upravljanje logistikom i praćenje dostava.

**Endpointi:**
- `GET /api/v1/deliveries` - Lista dostava
- `GET /api/v1/deliveries/:id` - Detalji dostave
- `POST /api/v1/deliveries` - Kreiranje dostave
- `PUT /api/v1/deliveries/:id` - Ažuriranje dostave
- `POST /api/v1/deliveries/:id/mark-delivered` - Označavanje kao dostavljeno
- `POST /api/v1/deliveries/:id/sign` - Potpisivanje dostave → kreira Invoice

**Statusi:** `PREPARED`, `DELIVERED`, `SIGNED`

**Frontend:** `/dashboard/operations/deliveries`

---

### 4. **Invoice Service** (Fakture)
Izdavanje, prijem i upravljanje fakturama (Issued, Received, CreditNote, Proforma).

**Endpointi:**
- `GET /api/v1/invoices` - Lista faktura
- `GET /api/v1/invoices/:id` - Detalji fakture
- `POST /api/v1/invoices` - Kreiranje fakture
- `PUT /api/v1/invoices/:id` - Ažuriranje fakture
- `POST /api/v1/invoices/:id/send` - Slanje fakture
- `POST /api/v1/invoices/:id/pay` - Označavanje kao plaćeno
- `POST /api/v1/invoices/:id/cancel` - Otkazivanje fakture

**Tipovi:** `ISSUED`, `RECEIVED`, `CREDIT_NOTE`, `PROFORMA`

**Statusi:** `DRAFT`, `SENT`, `PAID`, `OVERDUE`, `CANCELLED`

**Frontend:** `/dashboard/finance/invoices`

---

## 🔄 Event-Driven Architecture

Sistem koristi interni Pub/Sub mehanizam za komunikaciju između servisa.

### Event Flow

```
Offer.Accepted → Order.Created
Order.Fulfilled → Delivery.Created
Delivery.Signed → Invoice.Created
```

### Implementacija

Svi eventi se čuvaju u `domain_events` tabeli za audit i replay:

```typescript
{
  eventId: string,
  eventType: string,
  aggregateId: string,
  aggregateType: string,
  payload: object,
  occurredAt: Date
}
```

**Event Bus:** NATS (opciono, radi i bez njega)

**Event Subscriber:** `/lib/events/event-subscriber.ts`

---

## 🗄️ Database Schema

### Offer
```prisma
model Offer {
  id          String       @id @default(uuid())
  offerNo     String       @unique
  companyId   String
  customerId  String
  items       Json
  subtotal    Decimal
  tax         Decimal
  total       Decimal
  currency    String
  validUntil  DateTime
  status      OfferStatus
  notes       String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

### Order
```prisma
model Order {
  id          String      @id @default(uuid())
  orderNo     String      @unique
  offerId     String?
  companyId   String
  customerId  String
  items       Json
  subtotal    Decimal
  tax         Decimal
  total       Decimal
  currency    String
  status      OrderStatus
  notes       String?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Delivery
```prisma
model Delivery {
  id            String         @id @default(uuid())
  deliveryNo    String         @unique
  orderId       String
  deliveryDate  DateTime
  items         Json
  status        DeliveryStatus
  notes         String?
  signedBy      String?
  signedAt      DateTime?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}
```

### Invoice
```prisma
model Invoice {
  id          String        @id @default(uuid())
  invoiceNo   String        @unique
  companyId   String
  customerId  String
  deliveryId  String?
  items       Json
  subtotal    Decimal
  tax         Decimal
  total       Decimal
  currency    String
  type        InvoiceType
  status      InvoiceStatus
  issueDate   DateTime      @default(now())
  dueDate     DateTime
  paidAt      DateTime?
  notes       String?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

---

## 🚀 Setup Instructions

### 1. Database Migration

```bash
cd app
npx prisma migrate dev --name add_business_modules
```

### 2. Seed Data

```bash
npx prisma db seed
```

Ovo kreira:
- 25 kompanija
- 24 kontakata
- 5 relacija
- 5 ponuda
- 4 narudžbine
- 2 dostave
- 3 fakture

### 3. Start Event Subscriber (Optional)

Za automatsku kreaciju Order → Delivery → Invoice:

```typescript
import { eventSubscriber } from '@/lib/events/event-subscriber';

// U server startup ili API route
await eventSubscriber.start();
```

### 4. Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
NATS_URL="nats://localhost:4222" # Optional
```

---

## 🎨 Frontend Components

### Custom Hooks

- `useOffers()` - Lista i upravljanje ponudama
- `useOrders()` - Lista i upravljanje narudžbinama
- `useDeliveries()` - Lista i upravljanje dostavama
- `useInvoices()` - Lista i upravljanje fakturama

### Primer korišćenja

```tsx
import { useOffers, useApproveOffer } from '@/hooks/use-offers';

function OffersPage() {
  const { data, isLoading } = useOffers({ page: 1, status: 'SENT' });
  const approveOffer = useApproveOffer();

  const handleApprove = async (id: string) => {
    await approveOffer.mutateAsync(id);
  };

  // ... render
}
```

---

## 🔐 Authentication

Svi endpointi su zaštićeni JWT autentifikacijom:

```typescript
const authResult = await AuthMiddleware.authenticate(request);
```

---

## 📊 Best Practices

### PostgreSQL Optimizacije

1. **Indeksi:** Već definisani u schema.prisma
   - `status`, `companyId`, `customerId`
   - `validUntil`, `dueDate`, `deliveryDate`

2. **Connection Pooling:** Koristite PgBouncer ili Supavisor

3. **Prepared Statements:** Aktivno preko Prisma

4. **Partial Indexes:**
```sql
CREATE INDEX idx_active_orders ON orders (status) WHERE status IN ('DRAFT', 'CONFIRMED');
```

### Redis Caching (Preporuka)

```typescript
// Cache frequent reads
const cachedOffers = await redis.get(`offers:${companyId}`);
if (!cachedOffers) {
  const offers = await offerService.listOffers({ companyId });
  await redis.setex(`offers:${companyId}`, 300, JSON.stringify(offers));
}
```

---

## 📝 API Response Format

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2025-10-21T12:00:00Z"
  }
}
```

---

## 🧪 Testing

```bash
# API Testing
curl -X GET http://localhost:3000/api/v1/offers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create Offer
curl -X POST http://localhost:3000/api/v1/offers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "companyId": "...",
    "customerId": "...",
    "items": [...],
    "subtotal": 1000,
    "tax": 200,
    "total": 1200,
    "currency": "EUR",
    "validUntil": "2025-12-31"
  }'
```

---

## 🎯 Next Steps

1. **Implementirati UI forme** za kreiranje/editovanje entiteta
2. **PDF Export** za fakture i ponude
3. **Email notifikacije** pri statusnim promenama
4. **Dashboard Analytics** - grafikoni i izveštaji
5. **Bulk Operations** - masovne akcije
6. **Advanced Filtering** - kompleksna pretraga

---

## 📚 Arhitektura

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Offer     │───▶│   Order     │───▶│  Delivery   │───▶│   Invoice   │
│  Service    │    │  Service    │    │  Service    │    │  Service    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                   │                   │                   │
      └───────────────────┴───────────────────┴───────────────────┘
                              │
                       ┌──────▼──────┐
                       │  Event Bus  │
                       │   (NATS)    │
                       └─────────────┘
                              │
                       ┌──────▼──────┐
                       │ DomainEvent │
                       │   Table     │
                       └─────────────┘
```

---

## 💡 Support

Za pitanja i podršku:
- Email: support@example.com
- Docs: http://localhost:3000/docs
- GitHub: https://github.com/your-repo

---

**Verzija:** 1.0.0  
**Datum:** October 2025  
**Autor:** Dario Ristic

