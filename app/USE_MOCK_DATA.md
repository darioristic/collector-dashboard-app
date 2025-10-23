# 🚀 Brzi Start sa Mock Podacima (BEZ Baze!)

## ✅ Instant rešenje - Vidi podatke ODMAH!

Ako vidiš "No companies found", koristi **mock podatke**:

### Korak 1: Otvori aplikaciju

```bash
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run dev
```

### Korak 2: Aktiviraj mock podatke

U browseru:

1. Otvori: `http://localhost:3000/dashboard/contacts/companies`
2. Otvori Console (F12)
3. Unesi:

```javascript
// Aktiviraj mock podatke
localStorage.setItem('use_mock_data', 'true');

// Refresh stranicu
location.reload();
```

### 🎉 Gotovo!

Sada vidiš **25 kompanija** i **24 kontakta** - sve radi **bez baze**!

---

## 📊 Mock Podaci

### 25 Kompanija:
- ✅ TechCorp Solutions (Belgrade, RS) - CUSTOMER
- ✅ Global Imports LLC (Novi Sad, RS) - SUPPLIER
- ✅ Innovation Partners (Niš, RS) - PARTNER
- ✅ Retail Masters Inc (Kragujevac, RS) - CUSTOMER
- ✅ Manufacturing Plus (Subotica, RS) - SUPPLIER
- ✅ Digital Solutions Group (Zagreb, HR) - CUSTOMER
- ✅ Supply Chain Experts (Ljubljana, SI) - SUPPLIER
- ✅ Strategic Ventures (Sarajevo, BA) - PARTNER
- ... i još 17 kompanija!

Lokacije: Belgrade, Novi Sad, Niš, Kragujevac, Subotica, Zagreb, Ljubljana, Sarajevo, Podgorica, Skopje

### 24 Kontakta:
- ✅ Marko Petrović (TechCorp Solutions) - CEO
- ✅ Ana Jovanović (Global Imports) - Sales Manager
- ✅ Nikola Nikolić (Innovation Partners) - CTO
- ✅ Jelena Đorđević (Retail Masters) - Marketing Director
- ... i još 20 kontakata!

Svi sa:
- Email adresama
- Telefonima
- Pozicijama
- Departmanima
- Tagovima
- Primary status

---

## 🎯 Šta možeš da radiš:

### ✅ Sve radi normalno:
- Pregledaj sve kompanije
- Pretražuj po imenu
- Filtriraj po tipu
- Klikni kompaniju za detalje
- Vidi sve kontakte kompanije
- Pregledaj listu svih kontakata
- Filtriraj kontakte po kompaniji

### ⚠️ Ograničenja (mock mode):
- ❌ CRUD operacije (Create/Edit/Delete) NE rade
- ❌ Podaci se resetuju nakon refresh-a
- ❌ Nema perzistencije
- ❌ Nema event publishing-a

**Mock mode je samo za pregled UI-a!**

---

## 🔄 Prelazak na Real Bazu

Kada budeš spreman za pravu bazu:

### 1. Isključi mock mode

U browser console:
```javascript
localStorage.removeItem('use_mock_data');
location.reload();
```

### 2. Podesi pravu bazu

Sledi instrukcije iz `QUICK_SETUP.md`:

```bash
# 1. Kreiraj .env fajl
cd /Users/darioristic/Cursor/collector-dashboard-app/app
cat > .env << 'EOF'
DATABASE_URL="postgresql://TVOJ_USER:TVOJA_LOZINKA@localhost:5432/collector_crm"
NATS_URL="nats://localhost:4222"
JWT_SECRET="dev-secret"
SERVICE_TOKEN_SECRET="dev-service-secret"
NODE_ENV="development"
EOF

# 2. Kreiraj bazu
createdb collector_crm

# 3. Push schema
bun run db:push

# 4. Seed podacima
bun run db:seed

# 5. Generiši token
bun run generate:user-token test test@test.com ADMIN

# 6. U browseru postavi token
localStorage.setItem('auth_token', 'PASTE_TOKEN_HERE');
location.reload();
```

---

## 🎓 FAQ

### Kako proverim da li koristim mock?

U browser console:
```javascript
console.log('Mock mode:', localStorage.getItem('use_mock_data') === 'true');
```

### Mogu li da koristim oba?

Da! Prebacuj se lako:

```javascript
// Mock data
localStorage.setItem('use_mock_data', 'true');

// Real data
localStorage.removeItem('use_mock_data');

// Refresh
location.reload();
```

### Hoću da dodam više mock podataka

Edit fajl: `/Users/darioristic/Cursor/collector-dashboard-app/app/lib/mock-data.ts`

Dodaj nove kompanije/kontakte u arrays.

---

## ✨ Summary

**Mock mode ti omogućava da:**
- ✅ Odmah vidiš UI sa podacima
- ✅ Testirajš pretragu i filtere
- ✅ Vidiš kako sve izgleda
- ✅ **BEZ** potrebe za bazom!

**Aktivacija** (copy-paste u browser console):
```javascript
localStorage.setItem('use_mock_data', 'true');
location.reload();
```

Gotovo! 🎉

