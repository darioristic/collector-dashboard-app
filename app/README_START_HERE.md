# 🚀 POČNI OVDE - CRM System

## ⚡ Brzi Start (2 minuta)

### Korak 1: Pokreni aplikaciju

```bash
cd /Users/darioristic/Cursor/collector-dashboard-app/app
bun run dev
```

Čekaj dok se ne pokrene server (biće poruka: "Ready on http://localhost:3000")

### Korak 2: Otvori u browseru

```
http://localhost:3000/dashboard/contacts/companies
```

### Korak 3: Učitaj mock podatke

Videćeš **ŽUTI BANNER** sa tekstom "No Data Found"

**KLIKNI DUGME**: "Load 25 Sample Companies"

### Korak 4: Gotovo! 🎉

Sada vidiš:
- ✅ 25 kompanija
- ✅ 24 kontakta
- ✅ 10 relationships
- ✅ Sve funkcioniše!

---

## 🗺️ Navigacija u Aplikaciji

### Sidebar - Leva strana

```
📊 Sales & Business
  ├── Dashboard
  ├── 🏢 Contacts [NEW] ← KLIKNI OVDE!
  │   ├── Companies [NEW]
  │   ├── Contacts List [NEW]
  │   └── Relationships [NEW]
  ├── Finance
  ├── CRM
  └── ...
```

### Kako navigirati:

1. **Sidebar je sa leve strane**
2. Pronađi **"Contacts"** sa [NEW] badge-om (žuti)
3. **Klikni na "Contacts"** → Otvara se dropdown
4. Vidiš 3 opcije:
   - **Companies** - Lista svih kompanija
   - **Contacts List** - Lista svih kontakata
   - **Relationships** - Mreža veza

---

## 📄 Tri Stranice:

### 1. Companies (`/dashboard/contacts/companies`)

**Šta vidiš**:
- Tabela sa 25 kompanija
- Search bar (pretraga po imenu/tax/zemlji)
- Type filter (Customer/Supplier/Partner)
- Pagination

**Šta možeš**:
- Klikni red → Otvara drawer sa detaljima
- Vidi kontakte kompanije
- Vidi relationships kompanije

### 2. Contacts List (`/dashboard/contacts/list`)

**Šta vidiš**:
- Tabela sa 24 kontakta
- Search bar (pretraga po imenu/email)
- Company filter (filtriraj po kompaniji)
- Primary contact označeno sa ⭐

**Šta možeš**:
- Klikni red → Otvara drawer sa detaljima
- Vidi sve info o kontaktu
- Klik na kompaniju → Ide na company

### 3. Relationships (`/dashboard/contacts/relationships`)

**Šta vidiš**:
- **Table View**: Lista relacija (Source → Target)
- **Network View**: Vizualna mreža sa statistikama

**Features**:
- Filter po tipu (Supplier/Customer/Partner)
- Filter po statusu (Active/Inactive)
- Statistics cards
- Most connected companies
- Distribution charts

---

## 🎨 Mock Data (Automatski učitano)

### 25 Kompanija:
- 8 Customers (kupci)
- 9 Suppliers (dobavljači)
- 8 Partners (partneri)

**Lokacije**: Belgrade, Novi Sad, Niš, Kragujevac, Subotica, Zagreb, Ljubljana, Sarajevo, Podgorica, Skopje

### 24 Kontakta:
- Po 1 primary kontakt za prvih 24 kompanije
- Srpska imena: Marko, Ana, Nikola, Jelena...
- Pozicije: CEO, CTO, Sales Manager, Marketing Director...
- Svi sa email-om, telefonom, tagovima

### 10 Relationships:
- TechCorp → Global Imports (SUPPLIER)
- Innovation Partners → TechCorp (PARTNER)
- ... još 8

---

## 🔍 Ako Sidebar Ne Pokazuje Contacts:

### Opcija 1: Scroll nadole

Sidebar može biti dug - scroll nadole do "Sales & Business" sekcije.

### Opcija 2: Otvori sidebar (ako je collapsed)

Sidebar može biti collapsed (samo ikone). Klikni:
- **Hamburger menu** (tri linije)
- **Ili strelica** da se otvori

### Opcija 3: Hard Refresh

```
Cmd + Shift + R (Mac)
Ctrl + Shift + R (Windows)
```

### Opcija 4: Direktni URL-ovi

Uvek možeš direktno otvoriti:
- `http://localhost:3000/dashboard/contacts/companies`
- `http://localhost:3000/dashboard/contacts/list`
- `http://localhost:3000/dashboard/contacts/relationships`

---

## 📊 Vizualni Vodič

### Kako izgleda sidebar (otvoren):

```
┌─────────────────────────────┐
│ T-2 Cloud Dashboard     ▼   │
├─────────────────────────────┤
│ 📊 Sales & Business         │
│                             │
│   📈 Dashboard              │
│   🏢 Contacts       [NEW]   │ ← OVDE!
│   💰 Finance                │
│   👥 CRM                    │
│   🛍️ Products               │
│   📁 Management             │
│                             │
│ 📥 Inbox                    │
│   💬 Chat                   │
│   ✉️ Mail                   │
└─────────────────────────────┘
```

### Kada klikneš "Contacts":

```
┌─────────────────────────────┐
│ 📊 Sales & Business         │
│                             │
│   📈 Dashboard              │
│ ▼ 🏢 Contacts       [NEW]   │ ← Otvoren dropdown
│     Companies       [NEW]   │ ← Klikni za companies
│     Contacts List   [NEW]   │ ← Klikni za contacts
│     Relationships   [NEW]   │ ← Klikni za relationships
│   💰 Finance                │
└─────────────────────────────┘
```

---

## 🎯 Quick Navigation Tips:

### Direktni Links (Copy-Paste):

```
Companies:
http://localhost:3000/dashboard/contacts/companies

Contacts List:
http://localhost:3000/dashboard/contacts/list

Relationships:
http://localhost:3000/dashboard/contacts/relationships
```

### Keyboard Shortcuts (in sidebar):

- **Strelica gore/dole**: Navigate kroz menu
- **Enter**: Otvori link
- **Esc**: Zatvori dropdown

---

## 📱 Mobile/Tablet:

Na manjim ekranima:
- Sidebar je **collapsed** (hamburger menu)
- Klikni **☰** (tri linije) da otvoriš
- Klikni "Contacts" → dropdown
- Klikni opciju koju želiš

---

## 🎨 Visual Indicators:

- **[NEW]** badge: Nova funkcionalnost (zeleni)
- **Highlighted**: Trenutna stranica (background color)
- **Dropdown arrow**: Klikni za više opcija
- **Icons**: Vizualna pomoć

---

## ✅ Sve Tri Stranice:

| Stranica | URL | Features |
|----------|-----|----------|
| **Companies** | `/dashboard/contacts/companies` | 25 kompanija, search, filters |
| **Contacts List** | `/dashboard/contacts/list` | 24 kontakta, search, company filter |
| **Relationships** | `/dashboard/contacts/relationships` | 10 relacija, table/network view |

---

## 🆘 Problem Solving:

### Ne vidim "Contacts" u sidebaru?

1. **Hard refresh**: Cmd+Shift+R
2. **Restart server**: Ctrl+C pa `bun run dev`
3. **Check sidebar**: Scroll nadole do "Sales & Business"

### Sidebar pokazuje samo ikone?

Sidebar je u "icon mode":
- Klikni **strelicu** ili **hamburger** da se otvori
- Ili **hover** preko "Contacts" ikone → pojavi se dropdown

### [NEW] badge nije zelen?

To je OK - može biti žut ili zelen zavisno od teme.

---

## 🎉 Final Checklist:

- [ ] Dev server je pokrenut (`bun run dev`)
- [ ] Browser: `http://localhost:3000/dashboard/contacts/companies`
- [ ] Kliknuo "Load 25 Sample Companies" dugme
- [ ] Sidebar pokazuje "Contacts" sa [NEW]
- [ ] Mogu da kliknem na svaku od 3 opcije
- [ ] Sve stranice prikazuju podatke

---

## 💡 Pro Tip:

**Bookmark-uj sve tri stranice** za brz pristup:

```
⭐ Companies
⭐ Contacts List  
⭐ Relationships
```

Ili koristi browser **Back/Forward** dugmad za navigaciju.

---

**Sve tri stranice su 100% funkcionaline i dostupne!** 🚀

Ako i dalje imaš problem, reci mi tačno šta vidiš i pomožiću ti dalje!

