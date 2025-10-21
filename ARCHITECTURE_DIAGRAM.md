# Updated Architecture Diagram

## Complete Microservices Architecture with Shared Services

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    API Gateway Layer                                                  │
│                              (Kong/Envoy - Load Balancing)                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Event Bus (RabbitMQ)                                               │
│                               + Redis Cache Layer                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                    │
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                          Core Services                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Offers    │    │   Orders    │    │   Delivery  │    │   Invoices  │
│   Service   │    │   Service   │    │    Notes    │    │   Service   │
│   :3001     │    │   :3002     │    │   Service   │    │   :3004     │
│             │    │             │    │   :3003     │    │             │
│ • Quotations│    │ • Processing│    │ • Shipping  │    │ • Billing   │
│ • Pricing   │    │ • Fulfillment│   │ • Tracking  │    │ • Payment   │
│ • Approval  │    │ • Inventory │    │ • Confirmation│  │ • Collection│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        Shared Services                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Customer   │    │  Payment    │    │ Accounting  │    │   Core      │
│  Registry   │    │  Service    │    │  Service    │    │ Platform    │
│  Service    │    │   :3008     │    │   :3009     │    │  Service    │
│   :3007     │    │             │    │             │    │   :3010     │
│             │    │ • Payments  │    │ • GL        │    │             │
│ • Master Data│   │ • Refunds   │    │ • COA       │    │ • Metadata  │
│ • Validation│    │ • Gateways  │    │ • Reports   │    │ • Objects   │
│ • Lookup    │    │ • Bank APIs │    │ • Posting   │    │ • Fields    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      Business Services                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        CRM Service                                                   │
│                                        :3011                                                         │
│                                                                                                     │
│ • Lead Management                                                                                   │
│ • Sales Pipeline                                                                                    │
│ • Customer Interactions                                                                             │
│ • Tasks & Activities                                                                                │
│ • Sales Forecasting                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Supporting Services                                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐
│   Audit     │    │Notification │
│   Service   │    │  Service    │
│   :3005     │    │   :3006     │
│             │    │             │
│ • Event Store│   │ • Emails    │
│ • Compliance│    │ • SMS       │
│ • Replay    │    │ • Templates │
│ • Reports   │    │ • Tracking  │
└─────────────┘    └─────────────┘
       │                   │
       └───────────────────┘
                           │
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Data Layer                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │
│  financial_ │    │  financial_ │    │  financial_ │    │  financial_ │    │  financial_ │
│   offers    │    │   orders    │    │delivery_notes│   │  invoices   │    │  customers  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │    │ PostgreSQL  │
│  financial_ │    │  financial_ │    │  financial_ │    │  financial_ │    │  financial_ │
│  payments   │    │  accounting │    │   audit     │    │notifications│    │  platform   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

┌─────────────┐
│ PostgreSQL  │
│  financial_ │
│     crm     │
└─────────────┘
```

## Service Communication Flow

```
Offer Creation → Order Processing → Delivery → Invoice → Payment
      │                │               │          │         │
      ▼                ▼               ▼          ▼         ▼
  [Events]         [Events]        [Events]   [Events]  [Events]
      │                │               │          │         │
      └────────────────┼───────────────┼──────────┼─────────┘
                       │               │          │
                       ▼               ▼          ▼
                 Customer Registry ← Payment Service → Accounting Service
                       │               │          │
                       ▼               ▼          ▼
                   [Lookup APIs]   [Payment APIs] [GL APIs]
```

## Data Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Customer  │───▶│   Offer     │───▶│   Order     │───▶│   Delivery  │
│  Registry   │    │  Service    │    │  Service    │    │   Service   │
│             │    │             │    │             │    │             │
│ • Validation│    │ • Creation  │    │ • Processing│    │ • Shipping  │
│ • Master Data│   │ • Pricing   │    │ • Fulfillment│   │ • Tracking  │
│ • Lookup    │    │ • Approval  │    │ • Inventory │    │ • Confirmation│
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
                           ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Invoice   │───▶│  Payment    │───▶│ Accounting  │
│  Service    │    │  Service    │    │  Service    │
│             │    │             │    │             │
│ • Billing   │    │ • Processing│    │ • GL        │
│ • Tax Calc  │    │ • Gateways  │    │ • Posting   │
│ • Collection│    │ • Refunds   │    │ • Reports   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Audit Service                           │
│                                                         │
│ • Event Store                                          │
│ • Compliance Reports                                    │
│ • Event Replay                                          │
│ • Audit Trail                                           │
└─────────────────────────────────────────────────────────┘
```

## Port Allocation

| Service | Port | Database | Purpose |
|---------|------|----------|---------|
| Offers Service | 3001 | financial_offers | Quotations and pricing |
| Orders Service | 3002 | financial_orders | Order processing |
| Delivery Notes Service | 3003 | financial_delivery_notes | Shipping and logistics |
| Invoices Service | 3004 | financial_invoices | Billing and invoicing |
| Audit Service | 3005 | financial_audit | Event store and compliance |
| Notification Service | 3006 | financial_notifications | Email and SMS notifications |
| Customer Registry Service | 3007 | financial_customers | Customer master data |
| Payment Service | 3008 | financial_payments | Payment processing |
| Accounting Service | 3009 | financial_accounting | General ledger |
| Core Platform Service | 3010 | financial_platform | Object & metadata registry |
| CRM Service | 3011 | financial_crm | Customer relationship management |

## Event Flow

```
Customer Registry Events:
- CustomerCreated, CustomerUpdated, CustomerSuspended

Core Business Events:
- OfferCreated → OrderCreated → DeliveryNoteCreated → InvoiceCreated → PaymentReceived

Payment Events:
- PaymentProcessed, PaymentFailed, RefundProcessed, ChargebackReceived

Accounting Events:
- TransactionPosted, GLUpdated, ReportGenerated

Platform Events:
- ObjectCreated, FieldAdded, LayoutUpdated, SchemaChanged

CRM Events:
- LeadCreated, LeadConverted, OpportunityCreated, OpportunityClosed, ActivityCreated, TaskCompleted

Audit Events:
- EventStored, ComplianceCheck, AuditReportGenerated
```

## Integration Points

```
External Systems:
├── CRM Systems (Customer data sync)
├── Payment Gateways (Stripe, PayPal, etc.)
├── Bank APIs (Transaction reconciliation)
├── Shipping Carriers (UPS, FedEx, etc.)
├── Tax Services (Tax calculation)
└── Accounting Systems (SAP, QuickBooks, etc.)

Internal Systems:
├── Customer Registry (Master data)
├── Payment Service (Payment processing)
├── Accounting Service (Financial posting)
├── Core Platform Service (Metadata & objects)
├── CRM Service (Sales pipeline & customer interactions)
├── Audit Service (Event store)
└── Notification Service (Communications)
```
