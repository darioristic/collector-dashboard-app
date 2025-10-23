# Quick Start Guide - CRM API

This guide will help you set up and run the CRM API in under 5 minutes.

## Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- PostgreSQL installed and running
- NATS server (optional for event publishing)

## Step-by-Step Setup

### 1. Copy Environment Variables

```bash
cd app
cp .env.example .env
```

### 2. Configure Database

Edit `.env` and set your PostgreSQL connection:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/collector_crm?schema=public"
```

### 3. Create Database

```bash
createdb collector_crm
```

Or using psql:
```sql
CREATE DATABASE collector_crm;
```

### 4. Set Up Database Schema

```bash
bun run db:generate
bun run db:push
```

### 5. Start NATS (Optional)

If you want event publishing:

```bash
# Using Docker
docker run -d --name nats -p 4222:4222 nats:latest

# Or using Homebrew
brew install nats-server
nats-server
```

If you skip NATS, events will be logged but not published (no errors).

### 6. Start Development Server

```bash
bun run dev
```

Server will start at: http://localhost:3000

## Testing the API

### Generate Test Tokens

**Generate a user token:**
```bash
bun run generate:user-token user-123 admin@example.com ADMIN
```

**Generate a service token:**
```bash
bun run generate:service-token invoicing-service companies:read companies:write contacts:read
```

### Test Public Endpoint

```bash
# Replace YOUR_USER_TOKEN with the token generated above
curl -H "Authorization: Bearer YOUR_USER_TOKEN" \
  http://localhost:3000/api/v1/companies
```

### Test Internal Endpoint (Create Company)

```bash
# Replace YOUR_SERVICE_TOKEN with the token generated above
curl -X POST \
  -H "X-Service-Token: YOUR_SERVICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "type": "CUSTOMER",
    "taxNumber": "123456789",
    "address": "123 Test St",
    "city": "Test City",
    "country": "US"
  }' \
  http://localhost:3000/api/v1/internal/companies
```

### Get the Created Company

```bash
# Use the company ID from the response above
curl -H "Authorization: Bearer YOUR_USER_TOKEN" \
  http://localhost:3000/api/v1/companies/{COMPANY_ID}
```

## Available Endpoints

### Public APIs (Require User JWT Token)

- `GET /api/v1/companies` - List companies
- `GET /api/v1/companies/{id}` - Get company
- `GET /api/v1/companies/search?query=acme` - Search companies
- `GET /api/v1/contacts` - List contacts
- `GET /api/v1/contacts/{id}` - Get contact
- `GET /api/v1/relationships` - List relationships
- `GET /api/v1/relationships/{id}` - Get relationship

### Internal APIs (Require Service Token)

- `POST /api/v1/internal/companies` - Create company
- `PUT /api/v1/internal/companies/{id}` - Update company
- `DELETE /api/v1/internal/companies/{id}` - Delete company
- `POST /api/v1/internal/contacts` - Create contact
- `PUT /api/v1/internal/contacts/{id}` - Update contact
- `DELETE /api/v1/internal/contacts/{id}` - Delete contact
- `POST /api/v1/internal/relationships` - Create relationship
- `PUT /api/v1/internal/relationships/{id}` - Update relationship
- `DELETE /api/v1/internal/relationships/{id}` - Delete relationship
- `POST /api/v1/internal/sync` - Bulk sync companies

## Database Management

### View Database

```bash
bun run db:studio
```

Opens Prisma Studio at http://localhost:5555

### Create Migration

```bash
bun run db:migrate
```

### Reset Database

```bash
bunx prisma migrate reset
```

## Monitoring Events

### Subscribe to All Events

```bash
nats sub ">"
```

### Subscribe to Specific Events

```bash
# Company events only
nats sub "company.*"

# Contact events only
nats sub "contact.*"
```

## Troubleshooting

### Database Connection Error

Check your `DATABASE_URL` in `.env` and ensure PostgreSQL is running:

```bash
pg_isready
```

### NATS Connection Warning

If you see NATS warnings but don't need events, you can ignore them. The API will work without NATS.

To suppress warnings, set in `.env`:
```env
NATS_URL=""
```

### Port Already in Use

Change the port in Next.js:

```bash
PORT=3001 bun run dev
```

## Next Steps

- Read full documentation: `README_API.md`
- Explore database schema: `prisma/schema.prisma`
- Check architecture docs: `../docs/ARCHITECTURE.md`

## Common Use Cases

### Create a Customer with Contact

```bash
# 1. Create company
COMPANY_ID=$(curl -X POST \
  -H "X-Service-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","type":"CUSTOMER","taxNumber":"999","address":"123 St","city":"NYC","country":"US"}' \
  http://localhost:3000/api/v1/internal/companies | jq -r '.data.id')

# 2. Create contact
curl -X POST \
  -H "X-Service-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"companyId\":\"$COMPANY_ID\",\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@acme.com\",\"isPrimary\":true}" \
  http://localhost:3000/api/v1/internal/contacts
```

### Create Relationship Between Companies

```bash
curl -X POST \
  -H "X-Service-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceCompanyId": "COMPANY_A_ID",
    "targetCompanyId": "COMPANY_B_ID",
    "relationType": "SUPPLIER",
    "status": "ACTIVE"
  }' \
  http://localhost:3000/api/v1/internal/relationships
```

## Support

Need help? Check these resources:

1. API Documentation: `README_API.md`
2. Architecture: `../docs/ARCHITECTURE.md`
3. Example requests: Use the cURL examples above
4. Database schema: `prisma/schema.prisma`

Happy coding! 🚀

