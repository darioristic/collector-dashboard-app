# Contacts List Page - Documentation

## ✅ Novo Kreirano

Kompletna **Contacts List** stranica sa Swiss-minimal dizajnom!

## 📁 Struktura

```
app/dashboard/(auth)/contacts/
├── companies/              # Companies stranica (već postojeća)
│   ├── page.tsx
│   └── components/
└── list/                   # 🆕 NOVA Contacts stranica
    ├── page.tsx
    └── components/
        ├── contacts-table.tsx
        └── contact-drawer.tsx
```

## 🎯 Features

### 1. **Contacts Table Page** (`/dashboard/contacts/list`)

**Funkcionalnosti**:
- ✅ **Tabela sa svim kontaktima** - Prikazuje sve kontakte iz svih kompanija
- ✅ **Debounced Search** - Pretraga po imenu ili email-u (500ms delay)
- ✅ **Company Filter** - Filtriraj kontakte po kompaniji (dropdown)
- ✅ **Pagination** - 20 kontakata po stranici
- ✅ **Click to View** - Klikni red za detalje
- ✅ **Add Contact** - Dugme za kreiranje novog kontakta

**Kolone u tabeli**:
1. **Name** - Ime i prezime (sa ⭐ za primary kontakte)
2. **Email** - Sa mail ikonom
3. **Phone** - Sa phone ikonom (ili "—" ako nema)
4. **Company** - Ime kompanije
5. **Position** - Pozicija u kompaniji
6. **Status** - Primary/Regular badge
7. **Created** - Datum kreiranja

### 2. **Contact Drawer** (Right-side)

**Sekcije**:

#### Status
- Primary Contact badge (ako je primary)
- Active status badge

#### Contact Information
- ✉️ Email (klikabilni mailto link)
- 📞 Phone (klikabilni tel link)

#### Company
- Klikabilni card sa informacijama o kompaniji
- Link ka Companies stranici

#### Position & Department
- Prikaz pozicije i departmana (ako postoje)

#### Tags
- Prikazuje sve tagove kontakta

#### Notes
- Prikazuje beleške o kontaktu

#### Metadata
- Created date
- Last updated date

**Akcije u Drawer-u**:
- ✏️ Edit - Otvara formu za izmenu
- 🗑️ Delete - Briše kontakt (sa konfirmacijom)
- ✖️ Close - Zatvara drawer

### 3. **Contact Form Dialog**

Koristi postojeću formu iz `companies/components/contact-form-dialog.tsx`:
- Kreiranje novog kontakta
- Izmena postojećeg
- Validacija sa Zod
- React Hook Form
- Toast notifikacije

## 🎨 Design

### Swiss Minimal Style
- Čiste linije i granice
- Muted paleta boja
- Ikone za vizuelnu reprezentaciju
- Konzistentan spacing
- Minimalan clutter

### Responsive
- **Mobile**: 320px+ (stack layout)
- **Tablet**: 768px+ (optimizovano)
- **Desktop**: 1024px+ (full layout)

### Color Coding

**Status Badges**:
- 🔵 Primary: Plavi badge sa zvezdicom
- ⚪ Regular: Outline badge

## 🔗 Navigation

### Sidebar
```
🏢 Contacts [NEW]
  ├── Companies [NEW]
  ├── Contacts List [NEW] ← Nova stranica
  └── Relationships
```

### URLs
- **Contacts List**: `/dashboard/contacts/list`
- **Companies**: `/dashboard/contacts/companies`

## 🚀 Quick Start

### 1. Pokreni aplikaciju
```bash
cd app
bun run dev
```

### 2. Otvori Contacts List
```
http://localhost:3000/dashboard/contacts/list
```

### 3. Test funkcionalnosti
1. ✅ Pretraži kontakte po imenu
2. ✅ Filtriraj po kompaniji
3. ✅ Klikni kontakt za detalje
4. ✅ Edit kontakt informacije
5. ✅ Dodaj novi kontakt
6. ✅ Obriši kontakt

## 📊 API Integracija

### React Query Hooks
```typescript
// Fetch svi kontakti sa filterima
const { data, isLoading } = useContacts({
  page: 1,
  limit: 20,
  name: 'John',           // Search query
  companyId: 'uuid'       // Filter by company
});

// Kreiranje kontakta
const createContact = useCreateContact();
createContact.mutate({
  companyId: 'uuid',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  // ...
});

// Update kontakta
const updateContact = useUpdateContact();
updateContact.mutate({
  id: 'contact-uuid',
  data: { position: 'CEO' }
});

// Brisanje kontakta
const deleteContact = useDeleteContact();
deleteContact.mutate('contact-uuid');
```

### Cache Invalidation
Automatski invalidira:
- `['contacts']` - Lista kontakata
- `['companies']` - Lista kompanija (jer utiče na brojač kontakata)

## 🎯 Use Cases

### 1. Pregled svih kontakata
```
Otvorite: /dashboard/contacts/list
Vidite sve kontakte iz svih kompanija
```

### 2. Pronađi kontakt u određenoj kompaniji
```
1. Izaberi kompaniju iz dropdown-a
2. Lista se filtrira automatski
3. Klikni kontakt za detalje
```

### 3. Pretraži kontakt po email-u
```
1. Ukucaj email u search bar
2. Nakon 500ms filtrira se lista
3. Vidi rezultate u realnom vremenu
```

### 4. Dodaj novi kontakt
```
1. Klikni "Add Contact"
2. Popuni formu
3. Izaberi kompaniju
4. Označi kao Primary (opciono)
5. Dodaj tagove
6. Save
```

### 5. Izmeni kontakt
```
1. Klikni kontakt u tabeli
2. Otvara se drawer
3. Klikni Edit ikonicu
4. Izmeni podatke
5. Save
```

## 🔍 Filters & Search

### Search Bar
- Pretraga po: **ime**, **prezime**, **email**
- Debounce: 500ms (ne šalje API call pri svakom kucanju)
- Case-insensitive

### Company Filter
- Dropdown sa listom svih kompanija
- "All Companies" opcija za reset filtera
- Kombinuje se sa search-om

### Pagination
- 20 kontakata po stranici
- Previous/Next dugmad
- Prikazuje: "Page X of Y (Z total)"

## 📱 Responsive Behavior

### Desktop (1024px+)
- Full tabela sa svim kolonama
- Drawer sa desne strane (600px width)
- Svi filteri pored search bara

### Tablet (768px)
- Tabela scrollable horizontalno
- Drawer preko full screen-a
- Filteri stack vertikalno

### Mobile (320px+)
- Minimum kolone u tabeli
- Drawer full screen
- Sve interakcije touch-friendly

## 🎨 Customization

### Promena broja kontakata po stranici
```typescript
// page.tsx, line ~25
const filters = {
  page: currentPage,
  limit: 50, // Promeni sa 20 na 50
  // ...
};
```

### Dodavanje nove kolone u tabelu
```typescript
// contacts-table.tsx
<TableHead>Nova Kolona</TableHead>

// U TableBody:
<TableCell>{contact.novaVrednost}</TableCell>
```

### Promena boja
```typescript
// contacts-table.tsx
// Primary badge color
className="bg-blue-100 text-blue-700..."
// Promeni u:
className="bg-green-100 text-green-700..."
```

## ⚡ Performance

- **React Query Cache**: 60 sekundi stale time
- **Debounced Search**: 500ms delay
- **Pagination**: Učitava samo 20 po stranici
- **Lazy Components**: Drawer se mountuje samo kada je otvoren
- **Optimistic Updates**: Trenutni feedback na akcije

## 🐛 Troubleshooting

### Kontakti se ne prikazuju
1. Proveri da li postoje kontakti u bazi
2. Proveri token: `localStorage.getItem('auth_token')`
3. Otvori Network tab i vidi API response
4. Proveri konzolu za greške

### Filter ne radi
1. Proveri da li postoje kompanije u bazi
2. Refresh stranicu
3. Clear cache: React Query DevTools → Invalidate All

### Drawer se ne otvara
1. Proveri da li je `isDrawerOpen` state setovan
2. Vidi konzolu za JavaScript greške
3. Refresh stranicu

## 🎓 Tehnički detalji

### State Management
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [companyFilter, setCompanyFilter] = useState('ALL');
const [currentPage, setCurrentPage] = useState(1);
const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
```

### API Calls
- **GET /api/v1/contacts** - Lista kontakata
- **GET /api/v1/contacts/{id}** - Jedan kontakt
- **PUT /api/v1/internal/contacts/{id}** - Update
- **DELETE /api/v1/internal/contacts/{id}** - Delete

### TypeScript Types
- `Contact` - Interface za kontakt
- `ApiResponse<Contact[]>` - API response tip
- `ContactFilters` - Filter parametri

## 📦 Dependencies

- ✅ React Query - Data fetching
- ✅ React Hook Form - Forme
- ✅ Zod - Validacija
- ✅ date-fns - Formatiranje datuma
- ✅ Lucide React - Ikone
- ✅ shadcn/ui - UI komponente

## 🚀 Next Steps

### Moguća proširenja:
1. ☐ Export kontakata u CSV
2. ☐ Bulk operacije (označi više, obriši sve)
3. ☐ Advanced filteri (po poziciji, departmantu, tagovima)
4. ☐ Kanban view za kontakte
5. ☐ Email integration (pošalji email iz aplikacije)
6. ☐ Activity timeline (istorija interakcija)
7. ☐ Notes timeline za kontakt
8. ☐ Task management za kontakte

---

## ✅ Summary

**Nova Contacts List stranica** je kompletna, production-ready, i potpuno funkcionalna! 

**Features**:
- ✅ Prikaz svih kontakata
- ✅ Search i filteri
- ✅ CRUD operacije
- ✅ Swiss-minimal design
- ✅ Responsive layout
- ✅ Toast notifications
- ✅ Zero linter errors

**Pristup**: `http://localhost:3000/dashboard/contacts/list`

Uživaj u novoj stranici! 🎉

