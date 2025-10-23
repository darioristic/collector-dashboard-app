# Environment Variables Template

Kopiraj ovaj sadržaj u `.env.local` fajl.

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================

# Main database URL (za connection pooling)
# Za production: koristi PgBouncer/Supavisor port
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collector_crm?schema=public&connection_limit=20&pool_timeout=10"

# Direct database URL (za migracije i Prisma Studio)
# Koristi direktan postgres port (5432)
DATABASE_URL_UNPOOLED="postgresql://postgres:postgres@localhost:5432/collector_crm?schema=public"

# ============================================
# REDIS CONFIGURATION
# ============================================

# Local Redis
REDIS_URL="redis://localhost:6379"

# Remote Redis (production)
# REDIS_URL="redis://username:password@redis-host:6379"

# Redis Cluster (optional)
# REDIS_CLUSTER_NODES="redis-1:6379,redis-2:6379,redis-3:6379"

# ============================================
# JWT / AUTHENTICATION
# ============================================

# Promijeni ovu vrijednost u production!
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long-change-this-in-production"
JWT_EXPIRES_IN="7d"

# ============================================
# APPLICATION
# ============================================

NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# ============================================
# OPTIONAL: CONNECTION POOLING
# ============================================

# PgBouncer (ako ga koristiš)
# DATABASE_URL="postgresql://postgres:postgres@localhost:6432/collector_crm?schema=public"

# Supabase Pooler
# DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
# DATABASE_URL_UNPOOLED="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"

# ============================================
# OPTIONAL: MONITORING & ANALYTICS
# ============================================

# Google Analytics
NEXT_PUBLIC_GA_ID=""

# Sentry (error tracking)
# SENTRY_DSN=""
# SENTRY_AUTH_TOKEN=""

# ============================================
# OPTIONAL: EXTERNAL SERVICES
# ============================================

# Email
# SMTP_HOST=""
# SMTP_PORT=""
# SMTP_USER=""
# SMTP_PASSWORD=""

# File Storage (S3, etc.)
# AWS_ACCESS_KEY_ID=""
# AWS_SECRET_ACCESS_KEY=""
# AWS_REGION=""
# AWS_S3_BUCKET=""

# ============================================
# DEVELOPMENT ONLY
# ============================================

# Prisma
# PRISMA_LOG_QUERIES="true"
# PRISMA_LOG_INFO="true"

# Redis
# REDIS_LOG_COMMANDS="true"
```

## Production Checklist

Prije deploy-a u production, proveri:

- [ ] `JWT_SECRET` je promijenjen i siguran (minimum 32 karaktera)
- [ ] `DATABASE_URL` koristi connection pooling (PgBouncer/Supavisor)
- [ ] `REDIS_URL` pokazuje na production Redis instance
- [ ] `NODE_ENV` je postavljen na "production"
- [ ] Sensitive podatci NISU commited u Git
- [ ] Sve environment varijable su postavljene u hosting platformi

## Quick Setup

### 1. Lokalni Development

```bash
# Kopiraj template
cp ENV_TEMPLATE.md .env.local

# Uredi .env.local
# Promijeni samo hostname/port ako je potrebno

# Za default setup, ovo bi trebalo raditi:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collector_crm?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="dev-secret-change-in-production-minimum-32-chars"
```

### 2. Docker Setup

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/collector_crm?schema=public"

# Redis
REDIS_URL="redis://redis:6379"
```

### 3. Production (Vercel + Supabase + Redis Cloud)

```bash
# Supabase
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:6543/postgres?pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"

# Redis Cloud
REDIS_URL="rediss://default:[PASSWORD]@[HOST]:6379"

# JWT
JWT_SECRET="[GENERATE_SECURE_32_CHAR_STRING]"

# App
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://your-app.vercel.app"
```

## Generating Secure JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32

# Bun
bun -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

