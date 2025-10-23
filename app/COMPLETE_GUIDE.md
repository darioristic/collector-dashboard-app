# 📖 Kompletan Vodič - CRM System

## ✅ Šta je Sve Kreirano

### 🎯 Backend (API + Events):
- ✅ PostgreSQL database schema (Prisma)
- ✅ REST API endpoints (public + internal)
- ✅ NATS event publishing
- ✅ JWT authentication
- ✅ Service tokens
- ✅ Audit trail (domain events)

### 🎨 Frontend (UI):
- ✅ **3 kompletne stranice**:
  1. Companies
  2. Contacts List
  3. Relationships

- ✅ React Query state management
- ✅ Swiss-minimal design
- ✅ Responsive (mobile/tablet/desktop)
- ✅ CRUD forms sa validacijom
- ✅ Toast notifications
- ✅ Mock data mode

---

## 🗺️ NAVIGACIJA - Kako Pristupiti Stranicama

### Način 1: Sidebar Navigation (Glavni način)

```
Otvori aplikaciju → Pogledaj LEVI sidebar → Pronađi:

┌────────────────────────────────┐
│ 📊 Sales & Business            │
│                                │
│   📈 Dashboard                 │
│   🏢 Contacts        [NEW] ◄── KLIKNI OVDE!
│      ├─ Companies     [NEW]    │
│      ├─ Contacts List [NEW]    │
│      └─ Relationships [NEW]    │
└────────────────────────────────┘
```

**Koraci**:
1. Otvori: http://localhost:3000
2. Sidebar je sa **leve strane**
3. Scroll do sekcije **"Sales & Business"**
4. **Klikni "Contacts"** → Otvara dropdown
5. Klikni bilo koju od 3 opcije

### Način 2: Direktni URL-ovi

Jednostavno otvori u browseru:

```bash
# Companies stranica
http://localhost:3000/dashboard/contacts/companies

# Contacts List stranica
http://localhost:3000/dashboard/contacts/list

# Relationships stranica
http://localhost:3000/dashboard/contacts/relationships
```

---

## 📊 Tri Stranice - Detaljan Pregled

### 1️⃣ Companies (`/dashboard/contacts/companies`)

**Vizuelni Prikaz**:
```
┌─────────────────────────────────────────────────┐
│ 🏢 Companies                  [+ Add Company]   │
├─────────────────────────────────────────────────┤
│ [🔍 Search...]  [Filter: All Types ▼]           │
├─────────────────────────────────────────────────┤
│ Name              Type      Tax#      City      │
│ TechCorp         Customer  TC00123   Belgrade   │
│ Global Imports   Supplier  GI00234   Novi Sad   │
│ ...                                              │
└─────────────────────────────────────────────────┘
```

**Akcije**:
- Search po imenu, tax number-u, zemlji
- Filter po tipu (Customer/Supplier/Partner/Internal)
- Klikni red → Otvara drawer
- Pagination (Previous/Next)

**Drawer (kada klikneš kompaniju)**:
- Tab 1: **Info** - Svi detalji kompanije
- Tab 2: **Contacts** - Lista kontakata (sa CRUD)
- Tab 3: **Relationships** - Veze sa drugim kompanijama

### 2️⃣ Contacts List (`/dashboard/contacts/list`)

**Vizuelni Prikaz**:
```
┌─────────────────────────────────────────────────┐
│ 👥 Contacts                   [+ Add Contact]   │
├─────────────────────────────────────────────────┤
│ [🔍 Search...]  [Filter: All Companies ▼]       │
├─────────────────────────────────────────────────┤
│ Name           Email             Company        │
│ ⭐ Marko P.    marko@tech.com    TechCorp       │
│ Ana J.         ana@global.com    Global Imports │
│ ...                                             │
└─────────────────────────────────────────────────┘
```

**Akcije**:
- Search po imenu ili email-u
- Filter po kompaniji
- ⭐ = Primary contact
- Klikni red → Otvara drawer
- Pagination

**Drawer (kada klikneš kontakt)**:
- Status (Primary/Active)
- Contact info (email, phone)
- Company card (klikabilno)
- Position & Department
- Tags
- Notes

### 3️⃣ Relationships (`/dashboard/contacts/relationships`)

**Vizuelni Prikaz**:
```
┌─────────────────────────────────────────────────┐
│ 🔗 Relationships          [+ Add Relationship]  │
├─────────────────────────────────────────────────┤
│ [Table View] [Network View]  [Type▼] [Status▼] │
├─────────────────────────────────────────────────┤
│                                                 │
│ Table View:                                     │
│ Source → Target         Type        Status      │
│ TechCorp → Global       SUPPLIER    ACTIVE      │
│                                                 │
│ Network View:                                   │
│ [Stats] [Distribution] [Hubs] [Grid]            │
└─────────────────────────────────────────────────┘
```

**Dva Mode-a**:
- **Table View**: Lista relacija sa detaljima
- **Network View**: Vizualna mreža sa statistikama

**Network View sekcije**:
1. **Stats**: Total connections, Connected companies, Active relationships
2. **Distribution**: % po tipu relacije (Customer/Supplier/Partner)
3. **Hubs**: Najkonektovanije kompanije
4. **Grid**: Sve kompanije u mreži

---

## 🎮 How to Use (Korak po Korak)

### Scenario 1: Pregledaj Kompanije

```
1. Sidebar → Contacts → Companies
2. Vidiš 25 kompanija
3. Search "Belgrade" → Filtrira kompanije
4. Filter "Customer" → Samo customers
5. Klikni "TechCorp Solutions"
6. Drawer se otvara → Vidi sve info
7. Tab "Contacts" → Vidi kontakte
8. Tab "Relationships" → Vidi veze
```

### Scenario 2: Pronađi Kontakt

```
1. Sidebar → Contacts → Contacts List
2. Vidiš 24 kontakta
3. Search "marko" → Pronalazi Marka Petrovića
4. Ili filter po kompaniji → Izaberi "TechCorp"
5. Klikni kontakt → Drawer sa svim info
6. Vidi company card → Klikni → Ide na kompaniju
```

### Scenario 3: Vizualizuj Mrežu

```
1. Sidebar → Contacts → Relationships
2. Klikni "Network View" tab
3. Vidiš:
   - 10 total connections
   - 15 connected companies
   - 9 active relationships
4. Scroll → "Most Connected Companies"
5. Vidiš koje kompanije imaju najviše veza
6. "Relationships by Type" → Distribucija
```

### Scenario 4: Filtriraj Relationships

```
1. Relationships stranica
2. Filter "Type" → "Supplier"
3. Filter "Status" → "Active"
4. Vidiš samo aktivne supplier relacije
5. Switch na "Network View" → Vizualizacija
```

---

## 🔄 Mock Data Mode

### Aktivacija (AUTOMATSKI):

Kada otvoriš bilo koju stranicu BEZ podataka:

**POJAVLJUJE SE ŽUTI BANNER**:
```
┌────────────────────────────────────────────────┐
│ ⚠️ No Data Found                              │
│                                                │
│ Database is not configured or empty.          │
│ Would you like to use sample data?            │
│                                                │
│         [Load 25 Sample Companies]             │ ← KLIKNI!
└────────────────────────────────────────────────┘
```

**Klikni dugme** → Instant podaci!

### Deaktivacija:

Kada je mock aktivan, videćeš **PLAVI BANNER**:
```
┌────────────────────────────────────────────────┐
│ ℹ️ Mock Data Mode Active                       │
│                                                │
│ Using 25 sample companies and 24 contacts.    │
│                                                │
│         [Switch to Database]                   │ ← Prebaci na bazu
└────────────────────────────────────────────────┘
```

---

## 🎨 Color Legend

### Company Types:
- 🔵 **CUSTOMER** (Kupac): Plavi
- 🟣 **SUPPLIER** (Dobavljač): Ljubičasti
- 🟢 **PARTNER** (Partner): Zeleni
- ⚪ **INTERNAL** (Interni): Sivi

### Relationship Types:
- 🔵 **CUSTOMER relation**: Plavi
- 🟣 **SUPPLIER relation**: Ljubičasti
- 🟢 **PARTNER relation**: Zeleni

### Status:
- ✅ **ACTIVE**: Zeleni
- ⚪ **INACTIVE**: Sivi

### Badges:
- 🟡 **[NEW]**: Žuti - Nova funkcionalnost
- ⭐ **Primary**: Plavi - Primary kontakt

---

## 📁 Folder Struktura (za developere)

```
app/dashboard/(auth)/contacts/
├── companies/              # Companies stranica
│   ├── page.tsx
│   └── components/
│       ├── companies-table.tsx
│       ├── company-drawer.tsx
│       ├── company-form-dialog.tsx
│       ├── contacts-list.tsx
│       ├── contact-form-dialog.tsx
│       └── relationships-list.tsx
│
├── list/                   # Contacts List stranica
│   ├── page.tsx
│   └── components/
│       ├── contacts-table.tsx
│       └── contact-drawer.tsx
│
└── relationships/          # Relationships stranica
    ├── page.tsx
    └── components/
        ├── relationships-table.tsx
        ├── relationships-network.tsx
        └── relationship-form-dialog.tsx
```

---

## 🚀 Kompletna Setup Komanda

Ako hoćeš sve od nule:

```bash
# 1. Pokreni server
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run dev

# 2. Otvori browser
open http://localhost:3000/dashboard/contacts/companies

# 3. U browser console (F12)
localStorage.setItem('use_mock_data', 'true');
location.reload();

# 4. Koristi aplikaciju!
```

---

## 📚 Dokumentacija

| Fajl | Sadržaj |
|------|---------|
| **README_START_HERE.md** | ⚡ Brzi start (ovaj fajl) |
| **COMPLETE_GUIDE.md** | 📖 Kompletan vodič |
| **FINAL_SETUP_INSTRUCTIONS.md** | 🔧 Setup instrukcije |
| **TEST_NAVIGATION.md** | 🧪 Test navigacije |
| **RELATIONSHIPS_PAGE_DOCS.md** | 🔗 Relationships docs |
| **CONTACTS_PAGE_README.md** | 👥 Contacts docs |
| **FRONTEND_README.md** | 🎨 Frontend dokumentacija |
| **README_API.md** | 🔌 API dokumentacija |

---

## 🎯 TL;DR (Too Long; Didn't Read)

```
1. cd app && bun run dev
2. Open: http://localhost:3000/dashboard/contacts/companies
3. Refresh (F5)
4. Klikni žuti banner dugme: "Load 25 Sample Companies"
5. Gotovo! Vidiš sve podatke!

Navigacija:
- Sidebar → Contacts → [Companies | Contacts List | Relationships]
```

---

**SVE RADI! Sidebar navigation je aktivna. Sve tri stranice su dostupne!** 🎉

Ako i dalje ne vidiš "Contacts" u sidebaru:
1. **Hard refresh**: Cmd+Shift+R
2. **Restart dev server**
3. **Proveri da je sidebar otvoren** (nije collapsed)

Sada možeš slobodno koristiti CRM sistem! 🚀

