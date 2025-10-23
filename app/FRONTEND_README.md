# CRM Frontend Documentation

## Overview

A modern, Swiss-minimal design CRM frontend built with Next.js 15, React Query, and shadcn/ui. Features include real-time data synchronization, inline CRUD operations, and responsive layouts.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React Query** | Data fetching and caching |
| **React Hook Form** | Form management |
| **Zod** | Schema validation |
| **shadcn/ui** | UI component library |
| **Tailwind CSS** | Styling |
| **Sonner** | Toast notifications |
| **date-fns** | Date formatting |

## Features

### ✅ Companies Management
- **Data Table** with pagination, search, and filters
- **Debounced Search** (500ms delay)
- **Type Filters**: Customer, Supplier, Partner, Internal
- **Click to View**: Open company details in drawer
- **Responsive**: Tablet and desktop layouts

### ✅ Company Drawer
- **Three Tabs**:
  1. **Information**: View all company details
  2. **Contacts**: Manage company contacts
  3. **Relationships**: View related companies
- **Inline Actions**: Edit and delete buttons
- **Swiss Design**: Clean, minimal interface

### ✅ CRUD Operations
- **Create/Edit Companies**: Full form with validation
- **Create/Edit Contacts**: With tags and primary contact flag
- **Delete Operations**: Confirmation dialogs
- **Real-time Updates**: React Query cache invalidation
- **Toast Notifications**: Success and error messages

## File Structure

```
app/
├── app/dashboard/(auth)/crm/companies/
│   ├── page.tsx                      # Main companies page
│   └── components/
│       ├── companies-table.tsx       # Data table with pagination
│       ├── company-drawer.tsx        # Company details drawer
│       ├── company-form-dialog.tsx   # Create/edit company form
│       ├── contacts-list.tsx         # Contacts management
│       ├── contact-form-dialog.tsx   # Create/edit contact form
│       └── relationships-list.tsx    # Relationships view
├── hooks/
│   ├── use-companies.ts              # Companies React Query hooks
│   ├── use-contacts.ts               # Contacts React Query hooks
│   ├── use-relationships.ts          # Relationships React Query hooks
│   └── use-debounce.ts               # Debounce hook for search
├── lib/api/
│   ├── client.ts                     # API client with fetch wrapper
│   └── types.ts                      # TypeScript types
└── providers/
    └── query-provider.tsx            # React Query configuration
```

## Getting Started

### 1. Set Up Backend

First, ensure your backend API is running:

```bash
# Terminal 1: Start NATS (optional)
docker run -d --name nats -p 4222:4222 nats:latest

# Terminal 2: Set up database
cd app
cp .env.example .env
# Edit .env with your database credentials
bun run db:push

# Terminal 3: Start backend
bun run dev
```

### 2. Generate Test Token

For testing the frontend, generate a JWT token:

```bash
cd app
bun run generate:user-token user-123 admin@example.com ADMIN
```

Copy the generated token.

### 3. Set Token in Frontend

Open the app in your browser and run in console:

```javascript
// Set token for API calls
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE');

// Or use the API client directly
import { apiClient } from '@/lib/api/client';
apiClient.setToken('YOUR_TOKEN_HERE');
```

### 4. Access the CRM

Navigate to: `http://localhost:3000/dashboard/contacts/companies`

## Usage Guide

### Viewing Companies

1. Navigate to `/dashboard/contacts/companies`
2. Use search bar to filter by name, tax number, or country
3. Use type dropdown to filter by company type
4. Click any row to open company details

### Creating a Company

1. Click "Add Company" button (top right)
2. Fill in the required fields:
   - Company Name *
   - Type *
   - Tax Number *
   - Address *
   - City *
   - Country *
3. Optionally add:
   - Registration number
   - Contact info (email, phone, website)
   - Postal code
   - Notes
4. Click "Create"

### Editing a Company

1. Click on a company in the table
2. In the drawer, click edit icon (top right)
3. Modify fields as needed
4. Click "Update"

### Managing Contacts

1. Open company drawer
2. Switch to "Contacts" tab
3. Click "Add Contact" to create new contact
4. Fill in contact details:
   - First Name * / Last Name *
   - Email *
   - Phone, Position, Department (optional)
   - Tags (press Enter to add)
   - Primary Contact toggle
5. Click "Create"

### Viewing Relationships

1. Open company drawer
2. Switch to "Relationships" tab
3. View all company relationships
4. See relationship type and status
5. Delete relationships if needed

## API Integration

### API Client

The API client (`lib/api/client.ts`) handles:
- Authentication headers
- Request/response transformation
- Error handling
- Type safety

```typescript
// Example usage
import { apiClient } from '@/lib/api/client';

// Set token
apiClient.setToken('your-jwt-token');

// Make requests
const response = await apiClient.get('/companies', { page: 1, limit: 20 });
```

### React Query Hooks

All data fetching uses React Query hooks:

```typescript
// Fetching companies with filters
const { data, isLoading } = useCompanies({
  page: 1,
  limit: 20,
  name: 'Acme',
  type: 'CUSTOMER',
});

// Creating a company
const createCompany = useCreateCompany();
createCompany.mutate({
  name: 'New Company',
  type: 'CUSTOMER',
  // ... other fields
});

// Updating a company
const updateCompany = useUpdateCompany();
updateCompany.mutate({
  id: 'company-id',
  data: { name: 'Updated Name' },
});
```

### Cache Invalidation

React Query automatically:
- Invalidates affected queries after mutations
- Refetches data to stay in sync
- Shows loading states during operations

## Design Principles

### Swiss Minimal Design

- **Clean Lines**: Border-based separations
- **Typography**: Clear hierarchy with font weights
- **Spacing**: Consistent 4px grid system
- **Colors**: Muted palette with accent colors
- **No Clutter**: Essential elements only

### Responsive Layout

- **Mobile**: Stacked layout (320px+)
- **Tablet**: 2-column layout (768px+)
- **Desktop**: Full layout (1024px+)
- **Drawer**: Right-side on desktop, full-screen on mobile

### Performance

- **React Query Caching**: 1-minute stale time
- **Debounced Search**: 500ms delay
- **Pagination**: 20 items per page
- **Lazy Loading**: Components load on demand
- **Optimistic Updates**: Instant UI feedback

## Customization

### Changing Colors

Edit type/status colors in components:

```typescript
// companies-table.tsx
const TYPE_COLORS = {
  CUSTOMER: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  SUPPLIER: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  // ... add more
};
```

### Adjusting Pagination

Change default page size:

```typescript
// page.tsx
const filters = {
  page: currentPage,
  limit: 50, // Change from 20 to 50
  // ...
};
```

### Modifying Forms

Edit validation schemas:

```typescript
// company-form-dialog.tsx
const companySchema = z.object({
  name: z.string().min(3, 'Minimum 3 characters'), // Add custom validation
  // ...
});
```

## Troubleshooting

### Token Authentication Failed

**Problem**: API returns 401 Unauthorized

**Solution**:
```bash
# Generate new token
bun run generate:user-token user-123 admin@example.com ADMIN

# Set in browser console
localStorage.setItem('auth_token', 'NEW_TOKEN');
```

### Data Not Loading

**Problem**: Tables show "No companies found"

**Solutions**:
1. Check backend is running: `http://localhost:3000/api/v1/companies`
2. Check token is set correctly
3. Check network tab for errors
4. Verify database has data

### React Query Devtools

Open the devtools (bottom-left icon):
- View all queries and their status
- See cached data
- Manually refetch queries
- Debug stale/fresh states

### Form Validation Errors

**Problem**: Form won't submit

**Solutions**:
1. Check all required fields (* marked)
2. Verify email format
3. Check URL format for website
4. See red error messages under fields

## Development Tips

### Adding New Fields

1. Update Prisma schema
2. Update TypeScript types (`lib/api/types.ts`)
3. Update form schema
4. Add form field to dialog
5. Update table columns (optional)

### Custom Hooks

Create custom hooks for specific queries:

```typescript
// hooks/use-customer-companies.ts
export function useCustomerCompanies() {
  return useCompanies({
    type: 'CUSTOMER',
    limit: 100,
  });
}
```

### Toast Notifications

Add custom toasts:

```typescript
import { toast } from 'sonner';

toast.success('Action completed');
toast.error('Something went wrong');
toast.info('Information message');
toast.warning('Warning message');
```

## Testing

### Manual Testing Checklist

- [ ] Create new company
- [ ] Edit company details
- [ ] Delete company (with confirmation)
- [ ] Add contact to company
- [ ] Edit contact
- [ ] Delete contact
- [ ] Mark contact as primary
- [ ] Add tags to contact
- [ ] Search companies by name
- [ ] Filter by company type
- [ ] Navigate pages (pagination)
- [ ] View relationships
- [ ] Delete relationship
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Check dark mode compatibility

### API Testing

Use the browser network tab to verify:
- Requests use correct endpoints
- Auth headers are present
- Responses have correct structure
- Errors are handled gracefully

## Next Steps

### Potential Enhancements

1. **Export Data**: Add CSV/Excel export
2. **Bulk Operations**: Select multiple companies
3. **Advanced Filters**: Date ranges, custom fields
4. **Company Logo**: Upload and display
5. **Activity Feed**: Track changes and events
6. **Email Integration**: Send emails to contacts
7. **Import Data**: CSV import for companies
8. **Kanban View**: For relationship management

### Integration Ideas

- **Calendar**: Schedule meetings with contacts
- **Tasks**: Assign follow-ups
- **Notes**: Rich text notes per company
- **Files**: Document attachments
- **Analytics**: Dashboard with KPIs

## Support

For issues or questions:
1. Check backend logs: `bun run dev` output
2. Check browser console for errors
3. Use React Query Devtools for state inspection
4. Review API documentation: `README_API.md`

---

**Built with ❤️ using Next.js, React Query, and shadcn/ui**

