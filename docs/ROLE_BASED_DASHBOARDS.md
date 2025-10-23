# Role-Based Dashboard Architecture

## Overview

Projekat koristi **Next.js App Router** sa **Route Groups** za implementaciju tri odvojena dashboarda za različite tipove korisnika.

## Struktura Foldera

```
app/dashboard/
├── (admin)/              # Admin Dashboard - Full Access
│   ├── layout.tsx        # Admin-specific layout with orange badge
│   └── home/
│       └── page.tsx      # Admin home page
│
├── (manager)/            # Manager Dashboard - Limited Access
│   ├── layout.tsx        # Manager-specific layout with blue badge
│   └── home/
│       └── page.tsx      # Manager home page
│
├── (employee)/           # Employee Dashboard - Standard Access
│   ├── layout.tsx        # Employee-specific layout with green badge
│   └── home/
│       └── page.tsx      # Employee home page
│
├── (auth)/               # Authenticated pages (existing)
│   └── ...               # Existing dashboard pages
│
└── (guest)/              # Public pages (login/register)
    └── login/v2/
        └── page.tsx
```

## Tipovi Korisnika

### 1. 🔧 **Admin** (Administrator)
- **Pristup**: Pun pristup svim funkcionalnostima
- **Dashboard**: `/dashboard/admin/home`
- **Badge Color**: Narandžasta (Orange)
- **Funkcionalnosti**:
  - User Management
  - System Settings
  - Analytics & Reports
  - Security & Audit
  - Database Management
  - API Configuration

### 2. 👔 **Manager** (Menadžer)
- **Pristup**: Ograničen pristup za upravljanje timom i projektima
- **Dashboard**: `/dashboard/manager/home`
- **Badge Color**: Plava (Blue)
- **Funkcionalnosti**:
  - Team Management
  - Project Overview
  - Performance Reports
  - Task Assignment
  - Budget Tracking
  - Resource Planning

### 3. 👤 **Employee** (Zaposleni)
- **Pristup**: Standardni pristup za zaposlene
- **Dashboard**: `/dashboard/employee/home`
- **Badge Color**: Zelena (Green)
- **Funkcionalnosti**:
  - My Tasks
  - Projects
  - Time Tracking
  - Team Collaboration
  - Documents
  - Performance

## Middleware i Role-Based Routing

Middleware (`/app/middleware.ts`) automatski:

1. **Detektuje user role** iz cookie-a `user_role`
2. **Redirect-uje na odgovarajući dashboard**:
   - Admin → `/dashboard/admin/home`
   - Manager → `/dashboard/manager/home`
   - Employee → `/dashboard/employee/home`
   - Guest → `/dashboard/login/v2`

3. **Zaštićuje rute** (access control):
   - Admin rute dostupne samo adminima
   - Manager rute dostupne managerima i adminima
   - Employee rute dostupne svim ulogovanim korisnicima

### Primeri Middleware Pravila

```typescript
// Admin može pristupiti svim rutama
if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
  return redirect to login
}

// Manager i Admin mogu pristupiti manager rutama
if (pathname.startsWith("/dashboard/manager") && 
    userRole !== "manager" && 
    userRole !== "admin") {
  return redirect to login
}

// Samo guest ne može pristupiti customer rutama
if (pathname.startsWith("/dashboard/customer") && userRole === "guest") {
  return redirect to login
}
```

## Kako Postaviti User Role

### U Browseru (Demo)

Otvori **Developer Console** i postavi cookie:

```javascript
// Set role as Admin
document.cookie = "user_role=admin; path=/";

// Set role as Manager
document.cookie = "user_role=manager; path=/";

// Set role as Employee
document.cookie = "user_role=employee; path=/";

// Clear role (Guest)
document.cookie = "user_role=; path=/; max-age=0";
```

Zatim refresh stranicu: `/` ili `/dashboard`

### U Login Stranici

Ažuriraj `/app/dashboard/(guest)/login/v2/page.tsx` da setuje cookie nakon login-a:

```typescript
// Nakon uspešnog login-a
const userRole = apiResponse.role; // "admin" | "manager" | "employee"

// Set cookie
document.cookie = `user_role=${userRole}; path=/; max-age=86400`;

// Redirect na odgovarajući dashboard
router.push(`/dashboard/${userRole}/home`);
```

## Testiranje

### Test Admin Dashboard
```bash
# U browser console
document.cookie = "user_role=admin; path=/";
# Refresh: http://localhost:3000
# Trebalo bi da te redirect-uje na: /dashboard/admin/home
```

### Test Manager Dashboard
```bash
# U browser console
document.cookie = "user_role=manager; path=/";
# Refresh: http://localhost:3000
# Trebalo bi da te redirect-uje na: /dashboard/manager/home
```

### Test Employee Dashboard
```bash
# U browser console
document.cookie = "user_role=employee; path=/";
# Refresh: http://localhost:3000
# Trebalo bi da te redirect-uje na: /dashboard/employee/home
```

### Test Guest (No Role)
```bash
# U browser console
document.cookie = "user_role=; path=/; max-age=0";
# Refresh: http://localhost:3000
# Trebalo bi da te redirect-uje na: /dashboard/login/v2
```

## Dodavanje Novih Stranica

### Za Admin Dashboard
```bash
# Kreiraj novu stranicu
touch app/dashboard/(admin)/users/page.tsx

# URL će biti: /dashboard/admin/users
```

### Za Manager Dashboard
```bash
# Kreiraj novu stranicu
touch app/dashboard/(manager)/team/page.tsx

# URL će biti: /dashboard/manager/team
```

### Za Employee Dashboard
```bash
# Kreiraj novu stranicu
touch app/dashboard/(employee)/tasks/page.tsx

# URL će biti: /dashboard/employee/tasks
```

## Produkcijska Implementacija

### 1. JWT Token Authentication

Zameni cookie `user_role` sa JWT tokenom:

```typescript
// middleware.ts
function getUserRole(request: NextRequest): UserRole {
  const token = request.cookies.get("auth_token")?.value;
  
  if (!token) return "guest";
  
  try {
    const decoded = verifyJWT(token); // Koristi jose ili jsonwebtoken
    return decoded.role as UserRole;
  } catch {
    return "guest";
  }
}
```

### 2. API Integration

Kreiraj `/api/auth/login` endpoint:

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Validate credentials sa backend API
  const response = await fetch("YOUR_API/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  
  const { token, user } = await response.json();
  
  // Set secure HTTP-only cookie
  const cookieStore = cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 86400 // 24h
  });
  
  return Response.json({ user });
}
```

### 3. Server-Side Permission Checks

U svakoj stranici, proveri permissions na server-side:

```typescript
// app/dashboard/(admin)/users/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) {
    redirect("/dashboard/login/v2");
  }
  
  const user = await validateToken(token);
  
  if (user.role !== "admin") {
    redirect("/dashboard/login/v2");
  }
  
  // Render admin page
  return <>...</>;
}
```

## Best Practices

1. **Never trust client-side role checks** - Uvek validuj na server-side
2. **Use HTTP-only cookies** za JWT tokens
3. **Implement token refresh** za security
4. **Log access attempts** za audit trail
5. **Use Environment Variables** za API keys i secrets
6. **Implement rate limiting** za login endpoints

## URL Struktura

```
/                                    → Redirect based on role
/dashboard                           → Redirect based on role

/dashboard/login/v2                  → Login page (public)
/dashboard/register/v2               → Register page (public)

/dashboard/admin/home                → Admin home (admin only)
/dashboard/admin/*                   → Admin pages (admin only)

/dashboard/manager/home              → Manager home (manager + admin)
/dashboard/manager/*                 → Manager pages (manager + admin)

/dashboard/employee/home             → Employee home (authenticated)
/dashboard/employee/*                → Employee pages (authenticated)
```

## Zaključak

Ova arhitektura omogućava:
- ✅ Čistu separaciju dashboarda po role-u
- ✅ Automatski routing based on user role
- ✅ Built-in access control
- ✅ Skalabilnu strukturu za dodavanje novih stranica
- ✅ Type-safe TypeScript implementaciju
- ✅ Next.js App Router best practices

---

**Napomena**: Ova implementacija je demo verzija. Za produkciju, integriši sa pravim authentication sistemom (NextAuth.js, Auth0, Clerk, itd.)

