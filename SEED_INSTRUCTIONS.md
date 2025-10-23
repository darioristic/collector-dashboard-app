# Database Seed Instructions

## Kreiranje test podataka (25 kompanija + 24 kontakta)

### Korak 1: Pripremi .env fajl

Kreir aj `.env` fajl u `app/` folderu sa sledećim sadržajem:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/collector_crm?schema=public"
NATS_URL="nats://localhost:4222"
JWT_SECRET="dev-jwt-secret-key"
SERVICE_TOKEN_SECRET="dev-service-token-secret"
API_VERSION="v1"
NODE_ENV="development"
```

**Napomena**: Promeni `postgres:postgres` u USERNAME:PASSWORD za tvoju PostgreSQL bazu.

### Korak 2: Kreiraj bazu

```bash
# Ako već nije kreirana
createdb collector_crm

# Ili preko psql
psql -U postgres
CREATE DATABASE collector_crm;
\q
```

### Korak 3: Push Prisma schema

```bash
cd app
bun run db:push
```

### Korak 4: Pokreni seed script

```bash
bun run db:seed
```

## Alternativno - Manuelno pokretanje

Ako `bun run db:seed` ne radi, možeš da pokreneš direktno:

```bash
cd app

# Postavi DATABASE_URL i pokreni
DATABASE_URL="postgresql://TVOJ_USER:TVOJA_LOZINKA@localhost:5432/collector_crm" bun run prisma/seed.ts
```

## Šta će biti kreirano?

### 25 Kompanija:
- TechCorp Solutions (Belgrade, RS) - CUSTOMER
- Global Imports LLC (Novi Sad, RS) - SUPPLIER  
- Innovation Partners (Niš, RS) - PARTNER
- Retail Masters Inc (Kragujevac, RS) - CUSTOMER
- Manufacturing Plus (Subotica, RS) - SUPPLIER
- Digital Solutions Group (Zagreb, HR) - CUSTOMER
- Supply Chain Experts (Ljubljana, SI) - SUPPLIER
- Strategic Ventures (Sarajevo, BA) - PARTNER
- Enterprise Systems Ltd (Podgorica, ME) - CUSTOMER
- Logistics Pro (Skopje, MK) - SUPPLIER
- ... i još 15 kompanija

Svaka kompanija ima:
- ✅ Jedinstveni tax number
- ✅ Email adresu
- ✅ Telefon
- ✅ Adresu i grad
- ✅ Notes

### 24 Kontakta:
Po 1 Primary kontakt za prvih 24 kompanije:
- Ime i prezime (srpska imena)
- Email (based on kompanija)
- Telefon (+381...)
- Pozicija (CEO, CTO, CFO, Manager...)
- Department
- Tags (vip, decision_maker, technical, itd.)
- Notes

### 5 Relationships:
Random relacije između kompanija (SUPPLIER, CUSTOMER, PARTNER).

## Provera

Nakon seed-a:

```bash
# Otvori Prisma Studio
bun run db:studio

# Ili direktno u browseru
http://localhost:3000/dashboard/contacts/companies
http://localhost:3000/dashboard/contacts/list
```

## Troubleshooting

### Greška: "Environment variable not found: DATABASE_URL"

**Rešenje**: Kreiraj `.env` fajl u `app/` folderu sa DATABASE_URL.

### Greška: "User was denied access"

**Rešenje**: 
1. Proveri da li je PostgreSQL pokrenut: `pg_isready`
2. Proveri username/password u DATABASE_URL
3. Proveri da li baza postoji: `psql -l | grep collector_crm`

### Greška: "database does not exist"

**Rešenje**: Kreiraj bazu prvo:
```bash
createdb collector_crm
```

### Brisanje i ponovno kreiranje podataka

Seed script prvo briše sve postojeće podatke, pa kreira nove. Možeš ga pokrenuti više puta bez brige.

```bash
bun run db:seed
```

## Struktura podataka

```
25 Companies
  ├── 8 CUSTOMER (klijenti)
  ├── 9 SUPPLIER (dobavljači)
  └── 8 PARTNER (partneri)

24 Contacts
  └── Po 1 primary kontakt za prvih 24 kompanije

5 Relationships
  └── Random veze između kompanija
```

## Korisni comandovi

```bash
# Generiši Prisma client
bun run db:generate

# Otvori database u browseru
bun run db:studio

# Resetuj bazu
bunx prisma migrate reset

# Seed ponovo
bun run db:seed
```

---

Seed script je spreman! Samo trebaš da:
1. Kreiraj .env fajl
2. Kreiraj bazu
3. Pokreni `bun run db:seed`

Gotovo! 🎉

