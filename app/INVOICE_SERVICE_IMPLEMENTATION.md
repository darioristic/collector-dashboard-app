# Invoice Service - Kompletna Implementacija

## Pregled

Kompletan Invoice Service sistem implementiran prema specifikaciji sa svim traženim funkcionalnostima.

## ✅ Implementirane Funkcionalnosti

### 1. Invoice Model (Prisma)
- ✅ invoiceNo (string, unique) - auto-generisan
- ✅ companyId, customerId (references)
- ✅ items[] (JSON field - linked to offer/order/delivery items)
- ✅ subtotal, tax, total, currency (Decimal fields)
- ✅ issueDate, dueDate (DateTime fields)
- ✅ status (enum: Draft, Sent, Paid, Overdue, Cancelled)
- ✅ type (enum: Issued, Received, CreditNote, Proforma)
- ✅ deliveryId (optional reference)
- ✅ paidAt (optional DateTime)

### 2. Business Logic (Service Layer)

**File:** `lib/services/invoice.service.ts`

- ✅ `createInvoice()` - Kreira novu fakturu
- ✅ `createFromOrder()` - Auto-generiše fakturu iz order-a
- ✅ `createFromDelivery()` - Auto-generiše fakturu iz delivery-a (signed deliveries only)
- ✅ `updateInvoice()` - Ažurira fakturu
- ✅ `sendInvoice()` - Menja status u SENT
- ✅ `payInvoice()` - Menja status u PAID + postavlja paidAt
- ✅ `cancelInvoice()` - Menja status u CANCELLED
- ✅ `checkAndMarkOverdue()` - Auto-overdue logika (dueDate < today && status = SENT)
- ✅ Bulk operacije (send, pay, cancel)
- ✅ Event publishing za sve akcije

### 3. PDF Generation

**File:** `lib/services/pdf-generator.service.ts`

- ✅ Generisanje profesionalnog PDF-a sa:
  - Invoice header (tip, broj)
  - Company info (From)
  - Customer info (To)
  - Datumi (issue, due, paid)
  - Tabela stavki (description, quantity, price, tax, total)
  - Subtotal, Tax, Total
  - Status badge
  - Notes
  - Footer sa timestamp-om

### 4. QR Code Generation

**File:** `lib/services/qr-generator.service.ts`

- ✅ `generateInvoiceQR()` - eInvoice QR kod sa JSON podacima
- ✅ `generatePaymentQR()` - SEPA payment QR kod (BCD format)
- ✅ Format opcije: base64 ili buffer
- ✅ Podaci uključuju: invoiceNo, issuer, customer, iznose, datume

### 5. API Routes

**Osnovni CRUD:**
- `GET /api/v1/invoices` - Lista faktura (sa filtrima)
- `GET /api/v1/invoices/:id` - Pojedinačna faktura
- `POST /api/v1/invoices` - Kreiranje nove fakture
- `PUT /api/v1/invoices/:id` - Ažuriranje fakture

**Akcije:**
- `POST /api/v1/invoices/:id/send` - Slanje fakture
- `POST /api/v1/invoices/:id/pay` - Plaćanje fakture
- `POST /api/v1/invoices/:id/cancel` - Otkazivanje fakture

**Nove funkcionalnosti:**
- `GET /api/v1/invoices/:id/pdf` - Download PDF-a
- `GET /api/v1/invoices/:id/qrcode` - QR kod (invoice ili payment)
- `POST /api/v1/invoices/create-from-order` - Kreiranje iz order-a
- `POST /api/v1/invoices/create-from-delivery` - Kreiranje iz delivery-a
- `GET /api/v1/invoices/search` - Meilisearch pretraga
- `POST /api/v1/invoices/bulk` - Bulk akcije
- `POST /api/v1/invoices/check-overdue` - Ručna overdue provera

**Cron endpoint:**
- `GET /api/cron/check-overdue` - Za automatski cron job (zaštićen CRON_SECRET)

### 6. React Hooks

**File:** `hooks/use-invoices.ts`

- ✅ `useInvoices()` - Lista faktura
- ✅ `useInvoice()` - Pojedinačna faktura
- ✅ `useSearchInvoices()` - Pretraga
- ✅ `useCreateInvoice()` - Kreiranje
- ✅ `useUpdateInvoice()` - Ažuriranje
- ✅ `useSendInvoice()` - Slanje
- ✅ `usePayInvoice()` - Plaćanje
- ✅ `useCancelInvoice()` - Otkazivanje
- ✅ `useBulkInvoiceAction()` - Bulk akcije
- ✅ `useDownloadInvoicePDF()` - Download PDF-a
- ✅ `useGetInvoiceQRCode()` - QR kod
- ✅ `useCreateInvoiceFromOrder()` - Iz order-a
- ✅ `useCreateInvoiceFromDelivery()` - Iz delivery-a

### 7. Frontend Page

**File:** `app/dashboard/(auth)/finance/invoices/page.tsx`

Funkcionalnosti:
- ✅ Lista svih faktura
- ✅ Search bar sa debounce
- ✅ Filteri (Status, Type)
- ✅ Bulk selection
- ✅ Bulk akcije (send, pay, cancel)
- ✅ Akcije po fakturi:
  - View details
  - Download PDF
  - Send
  - Mark as paid
  - Cancel
- ✅ Status i Type badge-ovi sa bojama
- ✅ Paginacija
- ✅ Responsive design

### 8. Auto-Overdue System

**Scheduled Job:**
- **File:** `scripts/check-overdue-invoices.ts`
- **Cron API:** `app/api/cron/check-overdue/route.ts`
- **NPM Script:** `bun run check-overdue`

**Setup opcije:**
1. **Vercel Cron** (production) - dodaj u `vercel.json`
2. **Local Cron** (development) - crontab
3. **Manual** - poziv API endpointa

**Dokumentacija:** `INVOICE_CRON_SETUP.md`

## 📦 Instalacije

```bash
bun add pdfkit qrcode @types/pdfkit @types/qrcode
```

## 🗄️ Database

Prisma model je već kreiran i spreman. Za migraciju:

```bash
bunx prisma migrate dev --name add_invoices
bunx prisma generate
```

## 🔐 Environment Variables

Dodaj u `.env.local`:

```env
# Za cron job zaštitu
CRON_SECRET=your-secure-random-secret-here
```

## 🚀 Usage

### Kreiranje fakture

```typescript
const invoice = await invoiceService.createInvoice({
  companyId: 'company-uuid',
  customerId: 'customer-uuid',
  items: [
    {
      name: 'Product 1',
      quantity: 2,
      price: 100,
      taxRate: 20
    }
  ],
  subtotal: 200,
  tax: 40,
  total: 240,
  currency: 'EUR',
  type: 'ISSUED',
  dueDate: new Date('2025-11-30'),
  notes: 'Payment terms: Net 30'
});
```

### Kreiranje iz order-a

```typescript
const invoice = await invoiceService.createFromOrder(
  orderId,
  new Date('2025-11-30') // due date
);
```

### Generisanje PDF-a

```typescript
const pdfBuffer = await invoiceService.generatePDF(invoiceId);
// API vraća PDF kao download
```

### Generisanje QR koda

```typescript
// Invoice QR (eInvoice data)
const qrCode = await invoiceService.generateQRCode(invoiceId, 'base64');

// Payment QR (SEPA)
const paymentQR = await invoiceService.generatePaymentQR(
  invoiceId,
  'DE89370400440532013000', // IBAN
  'COBADEFFXXX' // BIC
);
```

### Auto-overdue provera

```typescript
// Manual
const count = await invoiceService.checkAndMarkOverdue();

// Ili putem API
await fetch('/api/v1/invoices/check-overdue', { method: 'POST' });
```

## 📊 Business Rules

1. ✅ Invoice number se auto-generiše sa prefiksom prema tipu:
   - ISSUED → INV-XXXXXXXX-XXX
   - RECEIVED → REC-XXXXXXXX-XXX
   - CREDIT_NOTE → CN-XXXXXXXX-XXX
   - PROFORMA → PRO-XXXXXXXX-XXX

2. ✅ Samo SIGNED deliveries mogu generisati fakture

3. ✅ CANCELLED orders ne mogu generisati fakture

4. ✅ Auto-overdue: status = SENT && dueDate < today → status = OVERDUE

5. ✅ Paid invoice dobija `paidAt` timestamp

6. ✅ Svi događaji se publikuju kroz event system

## 🎨 Frontend Features

- Status colors: Draft (gray), Sent (blue), Paid (green), Overdue (orange), Cancelled (red)
- Type colors: Issued (blue), Received (purple), CreditNote (orange), Proforma (indigo)
- Real-time search sa Meilisearch
- Bulk selection i akcije
- PDF download direktno iz liste
- Responsive design sa mobile support

## 📝 Next Steps

1. Deploy na Vercel
2. Setup Vercel Cron job za auto-overdue
3. Dodati email notifikacije pri slanju fakture
4. Implementirati PDF email attachment
5. Dodati payment gateway integraciju
6. Dashboard statistike (total overdue, paid this month, etc.)

## 🔗 Related Files

- Service: `lib/services/invoice.service.ts`
- PDF: `lib/services/pdf-generator.service.ts`
- QR: `lib/services/qr-generator.service.ts`
- Hooks: `hooks/use-invoices.ts`
- Page: `app/dashboard/(auth)/finance/invoices/page.tsx`
- API: `app/api/v1/invoices/**`
- Cron: `scripts/check-overdue-invoices.ts`
- Schema: `prisma/schema.prisma`

## ✨ Conclusion

Kompletan Invoice Service sistem je implementiran prema svim specifikacijama sa dodatnim funkcionalnostima kao što su PDF generacija, QR kodovi, auto-overdue provera, i moderne frontend funkcionalnosti.

