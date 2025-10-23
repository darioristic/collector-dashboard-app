# Relationships Page - Documentation

## 🎯 Koncept

**Relationships stranica** prikazuje mreže veza između kompanija - ko je čiji dobavljač, klijent ili partner.

## 🎨 Design Koncept

### Dva prikaza (View Modes):

#### 1. **Table View** (Klasični prikaz)
Tabelarni prikaz svih relacija sa kolonama:
- Source Company (sa ikonom i gradom)
- Strelica (→)
- Target Company (sa ikonom i gradom)
- Relation Type badge (SUPPLIER/CUSTOMER/PARTNER)
- Status badge (ACTIVE/INACTIVE)
- Created date
- Delete akcija

**Primer**:
```
TechCorp (Belgrade)  →  Global Imports (Novi Sad)  [SUPPLIER]  [ACTIVE]
Innovation Partners  →  TechCorp Solutions        [PARTNER]   [ACTIVE]
Retail Masters       →  Manufacturing Plus        [SUPPLIER]  [ACTIVE]
```

#### 2. **Network View** (Vizualna mreža)

Prikazuje:

**a) Statistics Cards** (Top):
- Total Connections (ukupan broj veza)
- Connected Companies (broj povezanih kompanija)
- Active Relationships (broj aktivnih veza)

**b) Relationship Stats by Type**:
Tri kartice sa:
- Broj relacija po tipu (CUSTOMER, SUPPLIER, PARTNER)
- Progress bar sa procentom
- Color-coded (plava, ljubičasta, zelena)

**c) Most Connected Companies** (Hubs):
Grid sa kompanijama koje imaju najviše veza:
- Naziv kompanije
- Broj konekcija
- Lista povezanih kompanija (prvih 5)
- "+X more" ako ima više od 5

**d) Company Network Overview**:
Grid sa svim povezanim kompanijama:
- Company card
- Broj konekcija
- Tip kompanije (color-coded ikona)

## 📁 Struktura

```
app/dashboard/(auth)/contacts/relationships/
├── page.tsx                          # Glavna stranica
└── components/
    ├── relationships-table.tsx       # Table view
    ├── relationships-network.tsx     # Network visualization
    └── relationship-form-dialog.tsx  # Create relationship form
```

## 🎯 Features

### 1. **Dual View Mode**
- 📊 Table View - Klasična tabela sa svim detaljima
- 🕸️ Network View - Vizualna reprezentacija mreže

### 2. **Filters**
- **Type Filter**: Filter po SUPPLIER, CUSTOMER, PARTNER
- **Status Filter**: Filter po ACTIVE, INACTIVE
- Kombinuje oba filtera

### 3. **Create Relationship**
- "Add Relationship" dugme (top-right)
- Form sa dropdown-ovima za:
  - Source Company (dropdown sa svim kompanijama)
  - Relation Type (SUPPLIER/CUSTOMER/PARTNER)
  - Target Company (filtriran - ne može izabrati istu kao source)
  - Status (ACTIVE/INACTIVE)
- Validacija: Ne može source === target

### 4. **Delete Relationship**
- Trash ikonica u tabeli
- Confirmation dialog
- Toast notifikacija

### 5. **Visual Design**

**Color Coding**:
- 🔵 Customer Relations: Plava
- 🟣 Supplier Relations: Ljubičasta
- 🟢 Partner Relations: Zelena
- ⚪ Internal: Siva

**Status**:
- ✅ Active: Zeleni badge
- ⚪ Inactive: Sivi badge

## 🎨 Network View - Details

### Statistics Section
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ Total           │  │ Connected       │  │ Active          │
│ Connections     │  │ Companies       │  │ Relationships   │
│                 │  │                 │  │                 │
│      10         │  │      15         │  │       9         │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Relationship Distribution
```
┌─────────────────────────────────────┐
│ CUSTOMER           4  [████████░░]  40%│
│ SUPPLIER           3  [██████░░░░]  30%│
│ PARTNER            3  [██████░░░░]  30%│
└─────────────────────────────────────┘
```

### Most Connected Companies
```
┌───────────────────────────────────────┐
│ 🏢 TechCorp Solutions                 │
│    3 connections                      │
│                                       │
│    → Global Imports (Novi Sad)        │
│    → Import Export Co (Zagreb)        │
│    → Innovation Partners (Niš)        │
└───────────────────────────────────────┘
```

### Company Network Grid
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 🏢 TechCorp │  │ 🏢 Global   │  │ 🏢 Innov.   │
│ 3 conn.     │  │ 2 conn.     │  │ 2 conn.     │
└─────────────┘  └─────────────┘  └─────────────┘
```

## 📊 Mock Data

### 10 Relationships kreiran:
1. TechCorp → Global Imports (SUPPLIER)
2. Innovation Partners → TechCorp (PARTNER)
3. Retail Masters → Manufacturing Plus (SUPPLIER)
4. Digital Solutions → Supply Chain (CUSTOMER)
5. Strategic Ventures → Enterprise Systems (PARTNER)
6. Logistics Pro → Business Partners (SUPPLIER)
7. Cloud Services → Hardware Supplies (CUSTOMER)
8. Consulting Group → Retail Chain (PARTNER) - INACTIVE
9. TechCorp → Import Export Co (SUPPLIER)
10. Tech Innovations → Distribution Network (CUSTOMER)

## 🔗 Sidebar Navigation

```
🏢 Contacts [NEW]
  ├── Companies
  ├── Contacts List
  └── Relationships [NEW] ← Nova stranica!
```

**URL**: `http://localhost:3000/dashboard/contacts/relationships`

## 🚀 Use Cases

### 1. Vizualizuj sve relacije
```
1. Otvori Relationships stranicu
2. Izaberi "Network View"
3. Vidi statistike i mrežu kompanija
```

### 2. Filtriraj po tipu
```
1. Izaberi "Supplier" iz Type filter-a
2. Vidi samo supplier relacije
3. Prebaci na "Customer" za customer relacije
```

### 3. Pronađi najkonektovanije kompanije
```
1. Network View
2. Scroll do "Most Connected Companies"
3. Vidi ko ima najviše veza
```

### 4. Kreiraj novu relaciju
```
1. Klikni "Add Relationship"
2. Izaberi Source Company (npr. TechCorp)
3. Izaberi Relation Type (npr. SUPPLIER)
4. Izaberi Target Company (npr. New Supplier)
5. Status: ACTIVE
6. Klikni "Create Relationship"
```

### 5. Obriši relaciju
```
1. Table View
2. Klikni trash ikonicu
3. Potvrdi u dialogu
4. Relacija obrisana
```

## 🎨 UI Elements

### Table View
- **Visual Flow**: Source → Arrow → Target
- **Company Cards**: Mini cards sa ikonom, nazivom, gradom
- **Type Badges**: Color-coded po tipu relacije
- **Status Badges**: Active/Inactive
- **Actions**: Delete dugme

### Network View
- **Legend**: Color explanation na vrhu
- **Stats Grid**: 3 kartice sa metrikama
- **Distribution Chart**: Progress bars sa %
- **Hub Cards**: Najveće mreže
- **Overview Grid**: Sve kompanije u mreži

## ⚡ Performance

- **React Query**: Cached 60s
- **Filters**: Real-time client-side filtering
- **Pagination**: 20 po stranici (Table view)
- **Lazy render**: Network View renderuje samo vidljive elemente

## 📱 Responsive

- **Mobile** (320px+): Stack layout, full-width cards
- **Tablet** (768px+): 2-column grid
- **Desktop** (1024px+): 3-column grid, full layout

## 🔍 Technical Details

### API Integration
```typescript
// Fetch relationships
const { data } = useRelationships({
  companyId: 'uuid',        // Optional filter
  relationType: 'SUPPLIER', // Optional filter
  status: 'ACTIVE',         // Optional filter
  page: 1,
  limit: 20,
});

// Create relationship
const createRelationship = useCreateRelationship();
createRelationship.mutate({
  sourceCompanyId: 'uuid1',
  targetCompanyId: 'uuid2',
  relationType: 'SUPPLIER',
  status: 'ACTIVE',
});

// Delete relationship
const deleteRelationship = useDeleteRelationship();
deleteRelationship.mutate('relationship-id');
```

### Mock Data
- `mockRelationships` u `lib/mock-data.ts`
- Mock API endpoint: `/api/v1/relationships/mock`
- Auto-aktivira se sa `localStorage.setItem('use_mock_data', 'true')`

## 🎯 Business Logic

### Relationship Types Explained

**SUPPLIER**: Source je klijent, Target je dobavljač
```
TechCorp  →[SUPPLIER]→  Global Imports
"TechCorp nabavlja od Global Imports"
```

**CUSTOMER**: Source je dobavljač, Target je klijent
```
Manufacturing  →[CUSTOMER]→  Retail Chain
"Manufacturing prodaje Retail Chain-u"
```

**PARTNER**: Partnerski odnos
```
Innovation  →[PARTNER]→  TechCorp
"Innovation i TechCorp su partneri"
```

## 🔄 Future Enhancements

Moguća proširenja:
- [ ] Interactive network diagram (D3.js ili React Flow)
- [ ] Drag-and-drop kreiranje relacija
- [ ] Bulk import relacija (CSV)
- [ ] Export network kao slika
- [ ] Relationship strength indicator
- [ ] Timeline prikaz (kada je kreirana)
- [ ] Notes per relationship
- [ ] Relationship history/audit log

## 🎓 Comparison

### Table View vs Network View

**Table View** - Najbolje za:
- ✅ Detaljne informacije
- ✅ Sortiranje i filtriranje
- ✅ Quick actions (delete)
- ✅ Pagination kroz veliki broj

**Network View** - Najbolje za:
- ✅ Vizualizacija strukture
- ✅ Pronalaženje hub kompanija
- ✅ Pattern recognition
- ✅ High-level overview

## 🛠️ Troubleshooting

### Ne vidim relacije

1. Aktiviraj mock data:
   ```javascript
   localStorage.setItem('use_mock_data', 'true');
   location.reload();
   ```

2. Proveri filtre (ALL / ALL)

### Network View je prazan

Check if data exists - možda nema povezanih kompanija.

### Create Relationship ne radi (mock mode)

Mock mode ne podržava CRUD - to je očekivano.
Za full funkcionalnost, podesi pravu bazu.

---

## ✅ Summary

**Relationships stranica** omogućava:
- 📊 **Table View**: Detaljan prikaz svih veza
- 🕸️ **Network View**: Vizualna mreža kompanija
- ➕ **Create**: Nova relacija između kompanija
- 🗑️ **Delete**: Ukloni relaciju
- 🔍 **Filter**: Po tipu i statusu
- 📱 **Responsive**: Mobile/Tablet/Desktop

**URL**: `http://localhost:3000/dashboard/contacts/relationships`

Uživaj u novoj stranici! 🚀

