# 🧪 Test Navigacije - Provera Linkova

## Trenutna Struktura u Sidebaru

```
🏢 Contacts [NEW]
  ├── Companies        → /dashboard/contacts/companies
  ├── Contacts List    → /dashboard/contacts/list
  └── Relationships    → /dashboard/contacts/relationships
```

## ✅ Provera da SVE radi:

### Test 1: Direktni URL-ovi

Otvori u browseru:

```bash
# 1. Companies
http://localhost:3000/dashboard/contacts/companies

# 2. Contacts List
http://localhost:3000/dashboard/contacts/list

# 3. Relationships
http://localhost:3000/dashboard/contacts/relationships
```

**Svi trebaju da rade!**

### Test 2: Sidebar Navigation

1. Otvori: `http://localhost:3000/dashboard/contacts/companies`
2. Pogledaj sidebar na levoj strani
3. Klikni na "Contacts" (trebalo bi da vidiš dropdown)
4. Vidiš 3 opcije:
   - Companies [NEW]
   - Contacts List [NEW]
   - Relationships [NEW]
5. Klikni svaku pojedinačno

### Test 3: Mock Data Banner

1. Na bilo kojoj stranici klikni **"Load 25 Sample Companies"**
2. Podaci se učitavaju
3. Navigiraj između stranica:
   - Companies → Vidiš 25 kompanija
   - Contacts List → Vidiš 24 kontakta
   - Relationships → Vidiš 10 relacija

## 🔍 Ako sidebar ne prikazuje pravilno:

### Problem: Sidebar je collapsed (samo ikone)

**Rešenje**: Klikni na hamburger menu ili strelicu da se otvori

### Problem: Ne vidim "Contacts" opciju

**Rešenje**: 
1. Scroll sidebar nadole
2. "Contacts" je pod "Sales & Business" sekcijom
3. Između "Dashboard" i "Finance"

### Problem: Klik na link ne radi

**Rešenje**:
1. Hard refresh: Cmd+Shift+R (Mac) ili Ctrl+Shift+R (Windows)
2. Clear cache
3. Restart dev server:
   ```bash
   # Stop (Ctrl+C)
   # Start again
   cd /Users/darioristic/Cursor/collector-dashboard-app/app
   bun run dev
   ```

## 📋 Checklist

Proveri da sve radi:

- [ ] Sidebar prikazuje "Contacts" sa [NEW] badge-om
- [ ] Dropdown pokazuje 3 opcije (sve sa [NEW])
- [ ] Klik na "Companies" otvara Companies stranicu
- [ ] Klik na "Contacts List" otvara Contacts stranicu
- [ ] Klik na "Relationships" otvara Relationships stranicu
- [ ] Mock data banner se pojavljuje
- [ ] Klik na banner dugme učitava podatke
- [ ] Navigation između stranica radi
- [ ] Active state highlightuje trenutnu stranicu

## 🎯 Expected Behavior:

### Na Companies stranici:
- URL: `/dashboard/contacts/companies`
- Sidebar: "Companies" je highlighted
- Vidis 25 kompanija (ako je mock aktivan)

### Na Contacts List stranici:
- URL: `/dashboard/contacts/list`
- Sidebar: "Contacts List" je highlighted
- Vidis 24 kontakta (ako je mock aktivan)

### Na Relationships stranici:
- URL: `/dashboard/contacts/relationships`
- Sidebar: "Relationships" je highlighted
- Vidiš 10 relacija (ako je mock aktivan)
- Dva view mode-a: Table i Network

## 🚀 Quick Fix (ako ništa ne radi):

```bash
# Terminal:
cd /Users/darioristic/Cursor/collector-dashboard-app/app

# Kill existing server
pkill -f "next dev" 

# Start fresh
bun run dev

# Browser:
# 1. Hard refresh: Cmd+Shift+R
# 2. Open: http://localhost:3000/dashboard/contacts/companies
# 3. Console: localStorage.setItem('use_mock_data', 'true'); location.reload();
```

---

## ✅ Everything Should Work Now!

Sve tri stranice su aktivne i vidljive u sidebaru.

**Navigacija**: Sidebar → Contacts → [Companies | Contacts List | Relationships]

Enjoy! 🎉

