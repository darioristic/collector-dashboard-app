# Standardized Loading System

This document explains the standardized loading system implemented across the application.

## Overview

The loading system provides:
- **NextTopLoader** - Default dashboard template loader (already configured)
- **Standardized loader components** for consistent UI across all pages
- **Table-specific loaders** for data loading states

## Components

### 1. StandardLoader Components
Located at: `app/components/ui/standard-loader.tsx`

- `StandardLoader` - Base loader with multiple variants (spinner, dots, pulse)
- `TableLoader` - Pre-configured loader for table components
- `PageLoader` - Pre-configured loader for full pages
- `InlineLoader` - Small loader for buttons and inline components

### 2. NextTopLoader (Default)
Located in: `app/app/layout.tsx` (line 51)

The default dashboard template loader that handles page navigation and route changes automatically.

## Usage Examples

### Table Loading

```tsx
import { TableLoader } from '@/components/ui/standard-loader';

export function MyTable({ data, isLoading }) {
  if (isLoading) {
    return <TableLoader message="Loading table data..." />;
  }
  
  return <table>...</table>;
}
```

### Page Loading

```tsx
import { PageLoader } from '@/components/ui/standard-loader';

export default function MyPage() {
  const { data, isLoading } = useMyData();
  
  if (isLoading) {
    return <PageLoader message="Loading page..." />;
  }
  
  return <div>Your content</div>;
}
```

### Button Loading State

```tsx
import { InlineLoader } from '@/components/ui/standard-loader';

export function MyButton({ isLoading, onClick }) {
  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? <InlineLoader size="sm" /> : 'Submit'}
    </Button>
  );
}
```

## Migration Guide

### Before (Old Pattern)
```tsx
// Old way - inconsistent loading UI
if (isLoading) {
  return (
    <div className="flex h-[400px] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
```

### After (New Pattern)
```tsx
// New way - standardized loading UI
import { TableLoader } from '@/components/ui/standard-loader';

export function MyComponent() {
  const { data, isLoading } = useMyData();
  
  if (isLoading) {
    return <TableLoader message="Loading data..." />;
  }
  
  return <div>Content</div>;
}
```

## Benefits

1. **Consistency** - All loading states look and behave the same
2. **User Experience** - NextTopLoader provides smooth page transitions
3. **Developer Experience** - Simple, reusable components
4. **Maintainability** - Centralized loader components
5. **Accessibility** - Proper loading indicators and screen reader support

## Implementation Status

✅ **Completed:**
- StandardLoader components
- Updated offers page and table
- Updated invoices page and table
- Updated orders page
- Removed duplicate loading logic

🔄 **In Progress:**
- Updating remaining pages (contacts, deliveries, etc.)

## Files Modified

- `app/components/ui/standard-loader.tsx` - New loader components
- `app/app/dashboard/(auth)/sales/offers/page.tsx` - Updated to use new system
- `app/app/dashboard/(auth)/sales/offers/components/offers-table.tsx` - Updated loader
- `app/app/dashboard/(auth)/finance/invoices/page.tsx` - Updated to use new system
- `app/app/dashboard/(auth)/finance/invoices/components/invoices-table.tsx` - Updated loader
- `app/app/dashboard/(auth)/sales/orders/page.tsx` - Updated to use new system

## Notes

- **NextTopLoader** handles page navigation loading automatically
- **TableLoader** is used for data loading within components
- **No global loading state** - each component manages its own loading state
- **Consistent styling** across all loader components
