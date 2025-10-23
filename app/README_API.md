# CRM API Documentation

## Overview

This CRM API provides comprehensive endpoints for managing companies, contacts, and relationships between entities. The API supports both public endpoints (for frontend/external consumption) and internal endpoints (for service-to-service communication) with event publishing via NATS.

## Architecture

- **Framework**: Next.js 15 API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Event Bus**: NATS for event-driven communication
- **Authentication**: JWT tokens for users, Service tokens for internal APIs
- **Validation**: Zod schemas

## Setup Instructions

### 1. Install Dependencies

```bash
cd app
bun install
```

### 2. Configure Environment Variables

Create a `.env` file in the `app` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/collector_crm?schema=public"

# NATS Event Bus
NATS_URL="nats://localhost:4222"

# JWT Secrets (change in production!)
JWT_SECRET="your-secure-jwt-secret-key"
SERVICE_TOKEN_SECRET="your-secure-service-token-secret"

# API Configuration
API_VERSION="v1"
NODE_ENV="development"
```

### 3. Set Up PostgreSQL Database

```bash
# Create database
createdb collector_crm

# Or using psql
psql -U postgres
CREATE DATABASE collector_crm;
```

### 4. Run Database Migrations

```bash
# Generate Prisma client
bunx prisma generate

# Create database schema
bunx prisma db push

# Or use migrations
bunx prisma migrate dev --name init
```

### 5. Set Up NATS Server

#### Using Docker:
```bash
docker run -d --name nats -p 4222:4222 -p 8222:8222 nats:latest
```

#### Using Homebrew (macOS):
```bash
brew install nats-server
nats-server
```

#### Using Binary:
Download from https://nats.io/download/

### 6. Start the Development Server

```bash
bun run dev
```

The API will be available at: `http://localhost:3000/api/v1`

## API Endpoints

### Public Endpoints (Require JWT Bearer Token)

#### Companies

**List Companies**
```http
GET /api/v1/companies?page=1&limit=20&name=acme&type=CUSTOMER&country=US
Authorization: Bearer <jwt_token>
```

**Get Company by ID**
```http
GET /api/v1/companies/{id}
Authorization: Bearer <jwt_token>
```

**Search Companies**
```http
GET /api/v1/companies/search?query=acme&limit=10
Authorization: Bearer <jwt_token>
```

#### Contacts

**List Contacts**
```http
GET /api/v1/contacts?page=1&limit=20&companyId={uuid}&name=john
Authorization: Bearer <jwt_token>
```

**Get Contact by ID**
```http
GET /api/v1/contacts/{id}
Authorization: Bearer <jwt_token>
```

#### Relationships

**List Relationships**
```http
GET /api/v1/relationships?companyId={uuid}&relationType=CUSTOMER&status=ACTIVE
Authorization: Bearer <jwt_token>
```

**Get Relationship by ID**
```http
GET /api/v1/relationships/{id}
Authorization: Bearer <jwt_token>
```

### Internal Endpoints (Require Service Token)

#### Companies

**Create Company**
```http
POST /api/v1/internal/companies
X-Service-Token: <service_token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "type": "CUSTOMER",
  "taxNumber": "123456789",
  "registrationNumber": "REG-2024-001",
  "email": "info@acme.com",
  "phone": "+1-555-0123",
  "website": "https://acme.com",
  "address": "123 Business St",
  "city": "New York",
  "country": "US",
  "postalCode": "10001",
  "notes": "Important customer"
}
```

**Update Company**
```http
PUT /api/v1/internal/companies/{id}
X-Service-Token: <service_token>
Content-Type: application/json

{
  "email": "new-email@acme.com",
  "phone": "+1-555-9999"
}
```

**Delete Company**
```http
DELETE /api/v1/internal/companies/{id}
X-Service-Token: <service_token>
```

#### Contacts

**Create Contact**
```http
POST /api/v1/internal/contacts
X-Service-Token: <service_token>
Content-Type: application/json

{
  "companyId": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@acme.com",
  "phone": "+1-555-0123",
  "position": "CEO",
  "department": "Executive",
  "tags": ["decision_maker", "primary"],
  "isPrimary": true,
  "notes": "Primary contact"
}
```

**Update Contact**
```http
PUT /api/v1/internal/contacts/{id}
X-Service-Token: <service_token>
Content-Type: application/json

{
  "position": "Chief Executive Officer",
  "phone": "+1-555-9999"
}
```

**Delete Contact**
```http
DELETE /api/v1/internal/contacts/{id}
X-Service-Token: <service_token>
```

#### Relationships

**Create Relationship**
```http
POST /api/v1/internal/relationships
X-Service-Token: <service_token>
Content-Type: application/json

{
  "sourceCompanyId": "uuid",
  "targetCompanyId": "uuid",
  "relationType": "CUSTOMER",
  "status": "ACTIVE"
}
```

**Update Relationship**
```http
PUT /api/v1/internal/relationships/{id}
X-Service-Token: <service_token>
Content-Type: application/json

{
  "status": "INACTIVE"
}
```

**Delete Relationship**
```http
DELETE /api/v1/internal/relationships/{id}
X-Service-Token: <service_token>
```

#### Bulk Sync

**Sync Multiple Companies**
```http
POST /api/v1/internal/sync
X-Service-Token: <service_token>
Content-Type: application/json

{
  "companyIds": ["uuid1", "uuid2", "uuid3"],
  "includeContacts": true,
  "includeRelationships": true
}
```

## Authentication

### User Authentication (Public APIs)

Generate JWT token for users:

```typescript
import { jwtService } from '@/lib/auth/jwt';

const token = jwtService.signToken({
  sub: 'user-id',
  email: 'user@example.com',
  role: 'ADMIN'
});
```

### Service Authentication (Internal APIs)

Generate service token for microservices:

```typescript
import { jwtService } from '@/lib/auth/jwt';

const serviceToken = jwtService.signServiceToken({
  serviceName: 'invoicing-service',
  permissions: ['companies:read', 'companies:write', 'contacts:read']
});
```

## Event Publishing

All mutations (create/update/delete) automatically publish events to NATS:

### Company Events
- `company.created`
- `company.updated`
- `company.deleted`

### Contact Events
- `contact.created`
- `contact.updated`
- `contact.deleted`

### Relationship Events
- `relationship.created`
- `relationship.updated`
- `relationship.deleted`

### Event Structure

```json
{
  "eventType": "company.created",
  "aggregateId": "company-uuid",
  "aggregateType": "Company",
  "payload": {
    "companyId": "uuid",
    "name": "Acme Corp",
    "type": "CUSTOMER",
    "taxNumber": "123456789",
    "country": "US"
  },
  "metadata": {},
  "occurredAt": "2024-01-15T10:30:00.000Z"
}
```

### Subscribing to Events (Other Services)

```typescript
import { connect, StringCodec } from 'nats';

const nc = await connect({ servers: 'nats://localhost:4222' });
const sc = StringCodec();

const sub = nc.subscribe('company.*');

for await (const msg of sub) {
  const event = JSON.parse(sc.decode(msg.data));
  console.log('Received event:', event);
  
  // Process event
  if (event.eventType === 'company.created') {
    // Update local cache, trigger workflows, etc.
  }
}
```

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Success with Pagination

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (duplicate) |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

### Key Entities

- **Company**: Core entity for organizations
- **Contact**: People associated with companies
- **Relationship**: Links between companies
- **User**: Authentication and authorization
- **DomainEvent**: Event sourcing for audit trail

## Testing the API

### Using cURL

```bash
# Get list of companies
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/v1/companies

# Create a company
curl -X POST \
  -H "X-Service-Token: YOUR_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Corp","type":"CUSTOMER","taxNumber":"123456789","address":"123 St","city":"NYC","country":"US"}' \
  http://localhost:3000/api/v1/internal/companies
```

### Using Postman

Import the following collection structure:

1. **Public APIs**
   - GET Companies
   - GET Company by ID
   - GET Contacts
   - GET Contact by ID
   - GET Relationships

2. **Internal APIs**
   - POST Create Company
   - PUT Update Company
   - DELETE Delete Company
   - POST Create Contact
   - PUT Update Contact
   - POST Create Relationship
   - POST Bulk Sync

## Monitoring

### Database Queries

View Prisma queries in development:

```bash
# Set log level in prisma client
# See lib/prisma.ts
```

### NATS Events

Monitor NATS events:

```bash
# Subscribe to all events
nats sub ">"

# Subscribe to specific events
nats sub "company.*"
```

### Database Events

Query event store:

```sql
SELECT * FROM domain_events 
WHERE aggregate_type = 'Company' 
ORDER BY occurred_at DESC 
LIMIT 10;
```

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
NATS_URL=nats://production-nats:4222
JWT_SECRET=<strong-random-secret>
SERVICE_TOKEN_SECRET=<strong-random-secret>
```

### Database Migration

```bash
bunx prisma migrate deploy
```

### Security Checklist

- [ ] Change all default secrets
- [ ] Enable SSL for database
- [ ] Use TLS for NATS
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerting
- [ ] Enable request logging
- [ ] Implement backup strategy
- [ ] Set up database read replicas

## Support

For issues and questions, refer to:
- Architecture documentation: `/docs/ARCHITECTURE.md`
- API documentation: `/docs/API_DOCUMENTATION.md`
- CRM integration guide: `/docs/CRM_INTEGRATION.md`

