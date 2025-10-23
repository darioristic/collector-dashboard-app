# ⚡ Quick Setup - Reši "No companies found"

## Problem
Aplikacija pokazuje "No companies found" jer:
1. ❌ `.env` fajl ne postoji
2. ❌ Baza nije povezana
3. ❌ Nema podataka u bazi

## ✅ Rešenje (5 minuta)

### Korak 1: Kreiraj `.env` fajl

U terminalu:

```bash
cd /Users/darioristic/Cursor/collector-dashboard-app/app

# Kreiraj .env fajl
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collector_crm?schema=public"
NATS_URL="nats://localhost:4222"
JWT_SECRET="dev-jwt-secret-key-change-in-production"
SERVICE_TOKEN_SECRET="dev-service-token-secret-change-in-production"
API_VERSION="v1"
NODE_ENV="development"
EOF
```

**⚠️ VAŽNO**: Ako tvoj PostgreSQL ima drugačiji username/password, promeni `postgres:postgres` deo!

### Korak 2: Kreiraj bazu podataka

```bash
# Proveri da li PostgreSQL radi
pg_isready

# Kreiraj bazu
createdb collector_crm

# Ili ako createdb ne radi:
psql -U postgres -c "CREATE DATABASE collector_crm;"
```

### Korak 3: Push Prisma schema

```bash
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run db:push
```

Očekivani output:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

### Korak 4: Popuni bazu podacima

```bash
bun run db:seed
```

Očekivani output:
```
🌱 Starting seed...
🧹 Cleaning existing data...
🏢 Creating 25 companies...
  ✓ Created: TechCorp Solutions
  ✓ Created: Global Imports LLC
  ... (još 23)

👥 Creating 24 contacts...
  ✓ Created: Marko Petrović
  ... (još 23)

✅ Seed completed!
```

### Korak 5: Generiši test token

```bash
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run generate:user-token test-user test@example.com ADMIN
```

Kopiraj token iz output-a!

### Korak 6: Pokreni aplikaciju

```bash
# Ako već nije pokrenuta
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run dev
```

### Korak 7: Postavi token u browser

1. Otvori: `http://localhost:3000/dashboard/contacts/companies`
2. Otvori console (F12)
3. Unesi:
   ```javascript
   localStorage.setItem('auth_token', 'PASTE_YOUR_TOKEN_HERE');
   ```
4. Refresh stranicu (F5)

## 🎉 Gotovo!

Sada bi trebalo da vidiš **25 kompanija** u tabeli!

---

## 🔍 Ako i dalje ne radi...

### Provera 1: Da li baza postoji?

```bash
psql -l | grep collector_crm
```

Ako ne postoji → vrati se na Korak 2.

### Provera 2: Da li su podaci u bazi?

```bash
# Otvori Prisma Studio
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run db:studio
```

Otvoriće se browser sa `http://localhost:5555`. Pogledaj tabele `Company` i `Contact`.

### Provera 3: Da li token radi?

U browser console:
```javascript
console.log(localStorage.getItem('auth_token'));
```

Ako je `null` → vrati se na Korak 5 i 7.

### Provera 4: Da li API radi?

Otvori u browseru:
```
http://localhost:3000/api/v1/companies
```

**Očekivano**: JSON sa greškom `UNAUTHORIZED` (jer nema headera).

**Ako vidiš 404**: Backend nije pokrenut → vrati se na Korak 6.

### Provera 5: Manual test API-ja

```bash
# Prvo generiši token
TOKEN=$(cd /Users/darioristic/Cursor/collector-dashboard-app/app && bun run generate:user-token test test@test.com ADMIN 2>&1 | grep -oE 'eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+' | head -1)

# Test API
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/companies
```

**Očekivano**: JSON sa listom kompanija.

---

## 🆘 Brza pomoć

### Greška: "pg_isready: command not found"

PostgreSQL nije instaliran ili nije u PATH-u.

**macOS**:
```bash
brew install postgresql
brew services start postgresql
```

**Linux**:
```bash
sudo apt-get install postgresql
sudo service postgresql start
```

### Greška: "database does not exist"

```bash
createdb collector_crm
```

### Greška: "role postgres does not exist"

Proveri koji user postoji:
```bash
psql -l
```

Onda promeni u `.env`:
```env
DATABASE_URL="postgresql://TVOJ_USER:LOZINKA@localhost:5432/collector_crm?schema=public"
```

### Greška u seed: "User was denied access"

Username/password u `.env` nisu tačni. Promeni ih!

---

## 📋 Kompletna komanda (copy-paste)

```bash
# Sve odjednom:
cd /Users/darioristic/Cursor/collector-dashboard-app/app && \
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collector_crm?schema=public"
NATS_URL="nats://localhost:4222"
JWT_SECRET="dev-jwt-secret"
SERVICE_TOKEN_SECRET="dev-service-token"
NODE_ENV="development"
EOF
createdb collector_crm 2>/dev/null || true && \
bun run db:push && \
bun run db:seed && \
echo "✅ Setup completed! Now:" && \
echo "1. Run: bun run dev" && \
echo "2. Run: bun run generate:user-token test test@test.com ADMIN" && \
echo "3. Copy token and set in browser console: localStorage.setItem('auth_token', 'TOKEN')" && \
echo "4. Open: http://localhost:3000/dashboard/contacts/companies"
```

---

Gotovo! 🚀

