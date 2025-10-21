# API Documentation

## Overview

This document describes the REST APIs for all microservices in the financial platform. Each service follows RESTful principles and uses JSON for data exchange.

## Authentication

All APIs require authentication using JWT tokens:

```http
Authorization: Bearer <jwt_token>
```

### Token Structure
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "roles": ["admin", "user"],
  "permissions": ["offers:read", "orders:write"],
  "exp": 1640995200,
  "iat": 1640908800
}
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req-123"
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Offers Service API

**Base URL**: `http://localhost:3001/api/v1`

### Create Offer
```http
POST /offers
Content-Type: application/json

{
  "customerId": "customer-123",
  "validUntil": "2024-02-15T23:59:59Z",
  "items": [
    {
      "productId": "product-456",
      "quantity": 10,
      "unitPrice": 99.99,
      "discount": {
        "type": "percentage",
        "value": 10
      }
    }
  ],
  "notes": "Special pricing for bulk order"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "offer-789",
    "offerNumber": "OFF-2024-001",
    "customerId": "customer-123",
    "status": "draft",
    "validUntil": "2024-02-15T23:59:59Z",
    "items": [...],
    "totals": {
      "subtotal": 899.91,
      "discount": 89.99,
      "tax": 80.99,
      "total": 890.91
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get Offer
```http
GET /offers/{offerId}
```

### Update Offer
```http
PUT /offers/{offerId}
Content-Type: application/json

{
  "items": [...],
  "notes": "Updated notes"
}
```

### Approve Offer
```http
POST /offers/{offerId}/approve
Content-Type: application/json

{
  "approvedBy": "user-123",
  "notes": "Approved by management"
}
```

### List Offers
```http
GET /offers?page=1&limit=20&status=draft&customerId=customer-123
```

## Orders Service API

**Base URL**: `http://localhost:3002/api/v1`

### Create Order
```http
POST /orders
Content-Type: application/json

{
  "offerId": "offer-789",
  "customerId": "customer-123",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "paymentMethod": "credit_card",
  "notes": "Rush delivery requested"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "order-456",
    "orderNumber": "ORD-2024-001",
    "offerId": "offer-789",
    "customerId": "customer-123",
    "status": "pending",
    "items": [...],
    "shippingAddress": {...},
    "billingAddress": {...},
    "totals": {
      "subtotal": 890.91,
      "shipping": 25.00,
      "tax": 91.59,
      "total": 1007.50
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Order Status
```http
PUT /orders/{orderId}/status
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Inventory confirmed"
}
```

### Reserve Inventory
```http
POST /orders/{orderId}/reserve-inventory
```

### Get Order
```http
GET /orders/{orderId}
```

### List Orders
```http
GET /orders?page=1&limit=20&status=confirmed&customerId=customer-123
```

## Delivery Notes Service API

**Base URL**: `http://localhost:3003/api/v1`

### Create Delivery Note
```http
POST /delivery-notes
Content-Type: application/json

{
  "orderId": "order-456",
  "shippingDetails": {
    "carrier": "UPS",
    "trackingNumber": "1Z999AA1234567890",
    "estimatedDelivery": "2024-01-18T17:00:00Z",
    "shippingMethod": "ground"
  },
  "items": [
    {
      "orderItemId": "order-item-123",
      "quantity": 10,
      "serialNumbers": ["SN001", "SN002", ...]
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "delivery-note-789",
    "deliveryNoteNumber": "DN-2024-001",
    "orderId": "order-456",
    "status": "in_transit",
    "shippingDetails": {...},
    "items": [...],
    "createdAt": "2024-01-15T10:30:00Z",
    "shippedAt": "2024-01-15T14:00:00Z"
  }
}
```

### Update Delivery Status
```http
PUT /delivery-notes/{deliveryNoteId}/status
Content-Type: application/json

{
  "status": "delivered",
  "deliveredAt": "2024-01-18T15:30:00Z",
  "deliveredBy": "John Doe",
  "notes": "Delivered to reception"
}
```

### Get Delivery Note
```http
GET /delivery-notes/{deliveryNoteId}
```

### List Delivery Notes
```http
GET /delivery-notes?page=1&limit=20&status=delivered&orderId=order-456
```

## Invoices Service API

**Base URL**: `http://localhost:3004/api/v1`

### Create Invoice
```http
POST /invoices
Content-Type: application/json

{
  "deliveryNoteId": "delivery-note-789",
  "paymentTerms": {
    "type": "net_30",
    "days": 30,
    "discountDays": 10,
    "discountPercentage": 2
  },
  "dueDate": "2024-02-17T23:59:59Z",
  "notes": "Payment terms: Net 30"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "invoice-123",
    "invoiceNumber": "INV-2024-001",
    "deliveryNoteId": "delivery-note-789",
    "status": "pending",
    "items": [...],
    "totals": {
      "subtotal": 890.91,
      "tax": 71.27,
      "total": 962.18
    },
    "paymentTerms": {...},
    "dueDate": "2024-02-17T23:59:59Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Record Payment
```http
POST /invoices/{invoiceId}/payments
Content-Type: application/json

{
  "amount": 962.18,
  "paymentMethod": "bank_transfer",
  "paymentDate": "2024-01-20T10:30:00Z",
  "reference": "TXN-123456",
  "notes": "Full payment received"
}
```

### Get Invoice
```http
GET /invoices/{invoiceId}
```

### List Invoices
```http
GET /invoices?page=1&limit=20&status=pending&customerId=customer-123
```

## Customer & Company Registry API

**Base URL**: `http://localhost:3007/api/v1`

### Create Customer
```http
POST /customers
Content-Type: application/json

{
  "name": "Acme Corporation",
  "legalName": "Acme Corporation Ltd.",
  "taxId": "123456789",
  "registrationNo": "REG-2024-001",
  "type": "company",
  "address": {
    "street": "123 Business St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "contacts": [
    {
      "type": "primary",
      "name": "John Doe",
      "email": "john@acme.com",
      "phone": "+1-555-0123"
    }
  ],
  "bankAccounts": [
    {
      "bankName": "First National Bank",
      "accountNumber": "1234567890",
      "routingNumber": "021000021",
      "currency": "USD"
    }
  ],
  "isTenant": true
}
```

### Get Customer
```http
GET /customers/{customerId}
```

### Search Customers
```http
GET /customers/search?query=acme&type=company&page=1&limit=20
```

## Payment Service API

**Base URL**: `http://localhost:3008/api/v1`

### Process Payment
```http
POST /payments
Content-Type: application/json

{
  "invoiceId": "invoice-123",
  "customerId": "customer-456",
  "amount": 962.18,
  "currency": "USD",
  "paymentMethod": {
    "type": "credit_card",
    "details": {
      "cardNumber": "4111111111111111",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cvv": "123",
      "holderName": "John Doe"
    }
  },
  "reference": "TXN-123456"
}
```

### Get Payment
```http
GET /payments/{paymentId}
```

### Refund Payment
```http
POST /payments/{paymentId}/refund
Content-Type: application/json

{
  "amount": 100.00,
  "reason": "Product return",
  "reference": "REF-789"
}
```

## Accounting Service API

**Base URL**: `http://localhost:3009/api/v1`

### Post Transaction
```http
POST /transactions
Content-Type: application/json

{
  "tenantId": "tenant-123",
  "accountId": "account-456",
  "debit": 1000.00,
  "credit": 0.00,
  "currency": "USD",
  "description": "Invoice payment received",
  "reference": "INV-2024-001"
}
```

### Get General Ledger
```http
GET /ledger?tenantId=tenant-123&from=2024-01-01&to=2024-01-31&accountId=account-456
```

## Core Platform Service API

**Base URL**: `http://localhost:3010/api/v1`

### Create Object Definition
```http
POST /objects
Content-Type: application/json

{
  "name": "Offer",
  "label": "Offer",
  "pluralLabel": "Offers",
  "description": "Customer offers and quotations",
  "tenantId": "tenant-123",
  "fields": [
    {
      "name": "customerId",
      "label": "Customer",
      "type": "lookup",
      "referenceTo": "Customer",
      "required": true
    },
    {
      "name": "offerNumber",
      "label": "Offer Number",
      "type": "text",
      "required": true,
      "unique": true
    },
    {
      "name": "customDiscountReason",
      "label": "Custom Discount Reason",
      "type": "text",
      "isCustom": true,
      "description": "Reason for custom discount"
    }
  ],
  "relationships": [
    {
      "name": "OfferItems",
      "type": "master_detail",
      "parentObject": "Offer",
      "childObject": "OfferItem"
    }
  ]
}
```

### Add Custom Field
```http
POST /objects/{objectName}/fields
Content-Type: application/json

{
  "name": "customDiscountReason",
  "label": "Custom Discount Reason",
  "type": "picklist",
  "isCustom": true,
  "picklistValues": [
    {"label": "Bulk Order", "value": "bulk_order"},
    {"label": "Loyal Customer", "value": "loyal_customer"},
    {"label": "Seasonal Promotion", "value": "seasonal_promotion"}
  ]
}
```

### Get Object Metadata
```http
GET /objects/{objectName}/metadata
```

### Update Field Definition
```http
PUT /objects/{objectName}/fields/{fieldName}
Content-Type: application/json

{
  "label": "Updated Field Label",
  "required": true,
  "helpText": "Additional help text for users"
}
```

### Create Layout
```http
POST /objects/{objectName}/layouts
Content-Type: application/json

{
  "name": "Standard Layout",
  "sections": [
    {
      "title": "Offer Information",
      "columns": 2,
      "fields": [
        {
          "fieldName": "offerNumber",
          "required": true,
          "readOnly": false,
          "width": 1
        },
        {
          "fieldName": "customerId",
          "required": true,
          "readOnly": false,
          "width": 1
        }
      ]
    },
    {
      "title": "Custom Fields",
      "columns": 1,
      "fields": [
        {
          "fieldName": "customDiscountReason",
          "required": false,
          "readOnly": false,
          "width": 1
        }
      ]
    }
  ],
  "isDefault": true
}
```

### Get Object Schema
```http
GET /objects/{objectName}/schema
```

**Response**:
```json
{
  "success": true,
  "data": {
    "objectName": "Offer",
    "label": "Offer",
    "pluralLabel": "Offers",
    "fields": [
      {
        "name": "id",
        "label": "ID",
        "type": "text",
        "required": true,
        "unique": true,
        "isSystem": true
      },
      {
        "name": "customerId",
        "label": "Customer",
        "type": "lookup",
        "referenceTo": "Customer",
        "required": true,
        "isSystem": false
      },
      {
        "name": "customDiscountReason",
        "label": "Custom Discount Reason",
        "type": "picklist",
        "picklistValues": [
          {"label": "Bulk Order", "value": "bulk_order"},
          {"label": "Loyal Customer", "value": "loyal_customer"}
        ],
        "isCustom": true,
        "isSystem": false
      }
    ],
    "relationships": [
      {
        "name": "OfferItems",
        "type": "master_detail",
        "childObject": "OfferItem"
      }
    ],
    "layouts": [
      {
        "name": "Standard Layout",
        "sections": [...]
      }
    ]
  }
}
```

## CRM Service API

**Base URL**: `http://localhost:3011/api/v1`

### Create Lead
```http
POST /leads
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "company": "Acme Corporation",
  "title": "CEO",
  "source": "website",
  "status": "new",
  "ownerId": "user-123",
  "assignedTo": "user-456"
}
```

### Update Lead Status
```http
PUT /leads/{leadId}/status
Content-Type: application/json

{
  "status": "qualified",
  "score": 85,
  "notes": "Lead has budget and decision authority"
}
```

### Convert Lead to Opportunity
```http
POST /leads/{leadId}/convert
Content-Type: application/json

{
  "opportunityName": "Acme Corp - Software License",
  "expectedValue": 50000,
  "expectedCloseDate": "2024-03-15",
  "stage": "qualification",
  "ownerId": "user-456"
}
```

### Create Opportunity
```http
POST /opportunities
Content-Type: application/json

{
  "name": "Enterprise Software License",
  "customerId": "customer-789",
  "stage": "proposal",
  "probability": 75,
  "expectedValue": 75000,
  "expectedCloseDate": "2024-02-28",
  "ownerId": "user-456",
  "description": "Enterprise license for 100 users",
  "source": "existing_customer"
}
```

### Update Opportunity Stage
```http
PUT /opportunities/{opportunityId}/stage
Content-Type: application/json

{
  "stage": "negotiation",
  "probability": 80,
  "notes": "Price negotiation in progress"
}
```

### Create Activity
```http
POST /activities
Content-Type: application/json

{
  "type": "call",
  "subject": "Follow-up call with prospect",
  "description": "Discuss pricing and timeline",
  "relatedTo": {
    "type": "opportunity",
    "id": "opportunity-123"
  },
  "ownerId": "user-456",
  "dueDate": "2024-01-20T14:00:00Z",
  "priority": "high"
}
```

### Record Customer Interaction
```http
POST /interactions
Content-Type: application/json

{
  "customerId": "customer-789",
  "type": "call",
  "channel": "phone",
  "subject": "Product demo call",
  "description": "Demonstrated key features and answered questions",
  "outcome": "positive",
  "ownerId": "user-456",
  "duration": 1800,
  "occurredAt": "2024-01-15T10:30:00Z"
}
```

### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Send proposal to Acme Corp",
  "description": "Prepare and send detailed proposal",
  "assignedTo": "user-456",
  "relatedTo": {
    "type": "opportunity",
    "id": "opportunity-123"
  },
  "dueDate": "2024-01-25T17:00:00Z",
  "priority": "high",
  "type": "proposal"
}
```

### Get Sales Pipeline
```http
GET /pipeline?ownerId=user-456&stage=qualification,proposal,negotiation
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalValue": 250000,
    "totalCount": 15,
    "stages": [
      {
        "stage": "qualification",
        "count": 5,
        "value": 75000,
        "opportunities": [...]
      },
      {
        "stage": "proposal",
        "count": 7,
        "value": 125000,
        "opportunities": [...]
      },
      {
        "stage": "negotiation",
        "count": 3,
        "value": 50000,
        "opportunities": [...]
      }
    ]
  }
}
```

### Get Sales Forecast
```http
GET /forecasts?period=2024-Q1&type=monthly
```

### Get Customer Interaction History
```http
GET /customers/{customerId}/interactions?from=2024-01-01&to=2024-01-31
```

### Get Lead Analytics
```http
GET /analytics/leads?period=2024-Q1&groupBy=source
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "conversionRate": 23.5,
    "sources": [
      {
        "source": "website",
        "count": 45,
        "conversionRate": 28.9
      },
      {
        "source": "referral",
        "count": 32,
        "conversionRate": 34.4
      }
    ]
  }
}
```

## Audit Service API

**Base URL**: `http://localhost:3005/api/v1`

### Get Audit Trail
```http
GET /audit?aggregateId=offer-123&aggregateType=Offer&from=2024-01-01&to=2024-01-31
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "event-456",
      "aggregateId": "offer-123",
      "aggregateType": "Offer",
      "eventType": "OfferCreated",
      "eventData": {...},
      "metadata": {...},
      "occurredAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Replay Events
```http
POST /audit/replay
Content-Type: application/json

{
  "aggregateId": "offer-123",
  "fromEvent": "event-456",
  "toEvent": "event-789"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `NOT_FOUND` | Resource not found |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `CONFLICT` | Resource conflict (e.g., duplicate) |
| `BUSINESS_RULE_VIOLATION` | Business rule violation |
| `EXTERNAL_SERVICE_ERROR` | External service unavailable |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

API rate limits are enforced per user and endpoint:

- **Standard endpoints**: 1000 requests per hour
- **Heavy operations**: 100 requests per hour
- **Bulk operations**: 10 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

Services can send webhooks for important events:

### Webhook Payload
```json
{
  "eventType": "offer.approved",
  "eventId": "event-123",
  "aggregateId": "offer-789",
  "data": {...},
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "sha256=..."
}
```

### Supported Events
- `offer.created`, `offer.approved`, `offer.rejected`
- `order.created`, `order.confirmed`, `order.shipped`
- `delivery.created`, `delivery.shipped`, `delivery.delivered`
- `invoice.created`, `invoice.paid`, `invoice.overdue`

## SDKs and Client Libraries

Official client libraries are available for:
- **JavaScript/TypeScript**: `@financial/api-client`
- **Python**: `financial-api-client`
- **Java**: `financial-api-client-java`
- **C#**: `Financial.ApiClient`

Example usage:
```typescript
import { FinancialApiClient } from '@financial/api-client';

const client = new FinancialApiClient({
  baseUrl: 'https://api.financial.com',
  apiKey: 'your-api-key'
});

const offer = await client.offers.create({
  customerId: 'customer-123',
  items: [...]
});
```
