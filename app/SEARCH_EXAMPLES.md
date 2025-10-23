# Search Examples and Integration Guide

## Frontend Search Components

### Basic Search Example

```tsx
'use client';

import { useState } from 'react';
import { useSearchOffers } from '@/hooks/use-offers';
import { useDebounce } from '@/hooks/use-debounce';

export function OfferSearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useSearchOffers({
    query: debouncedQuery,
    page: 1,
    limit: 20,
  });

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search offers..."
      />
      
      {isLoading && <p>Searching...</p>}
      
      {data?.data.map(offer => (
        <div key={offer.id}>
          <h3>{offer.offerNo}</h3>
          <p>{offer.customerName}</p>
          <p>{offer.total} {offer.currency}</p>
        </div>
      ))}
    </div>
  );
}
```

### Advanced Search with Filters

```tsx
'use client';

import { useState } from 'react';
import { useSearchOrders } from '@/hooks/use-orders';
import type { OrderStatus } from '@prisma/client';

export function OrderSearchWithFilters() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const [companyId, setCompanyId] = useState<string | undefined>();
  
  const { data, isLoading, error } = useSearchOrders({
    query,
    status,
    companyId,
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search orders..."
      />
      
      <select 
        value={status || ''}
        onChange={(e) => setStatus(e.target.value as OrderStatus || undefined)}
      >
        <option value="">All Statuses</option>
        <option value="DRAFT">Draft</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="FULFILLED">Fulfilled</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      <div>
        <p>Found {data?.pagination.total} results</p>
        {data?.data.map(order => (
          <div key={order.id}>
            <h3>{order.orderNo}</h3>
            <span>{order.status}</span>
            <p>{order.customerName}</p>
            <p>{order.total} {order.currency}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Search with Pagination

```tsx
'use client';

import { useState } from 'react';
import { useSearchInvoices } from '@/hooks/use-invoices';

export function InvoiceSearchWithPagination() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useSearchInvoices({
    query,
    page,
    limit,
    sortBy: 'issueDate',
    sortOrder: 'desc',
  });

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1); // Reset to first page on new search
        }}
        placeholder="Search invoices..."
      />

      {data?.data.map(invoice => (
        <div key={invoice.id}>
          <h3>{invoice.invoiceNo}</h3>
          <p>{invoice.customerName}</p>
          <p>{invoice.total} {invoice.currency}</p>
          <span>{invoice.status}</span>
        </div>
      ))}

      <div>
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={!data?.pagination.hasPrev}
        >
          Previous
        </button>
        
        <span>
          Page {data?.pagination.page} of {data?.pagination.totalPages}
        </span>
        
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data?.pagination.hasNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Real-time Search with Debouncing

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchDeliveries } from '@/hooks/use-deliveries';
import { useDebounce } from '@/hooks/use-debounce';

export function DeliveryRealTimeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  
  // Debounce search input to avoid too many requests
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useSearchDeliveries({
    query: debouncedSearchTerm,
    limit: 20,
  });

  useEffect(() => {
    if (data?.data) {
      setResults(data.data);
    }
  }, [data]);

  return (
    <div>
      <div className="relative">
        <input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search deliveries..."
          className="w-full"
        />
        {isLoading && <span className="loader">Searching...</span>}
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map(delivery => (
            <div key={delivery.id} className="result-item">
              <h4>{delivery.deliveryNo}</h4>
              <p>Order: {delivery.orderNo}</p>
              <p>Customer: {delivery.customerName}</p>
              <p>Status: {delivery.status}</p>
              {delivery.signedBy && <p>Signed by: {delivery.signedBy}</p>}
            </div>
          ))}
        </div>
      )}
      
      {searchTerm && !isLoading && results.length === 0 && (
        <p>No deliveries found</p>
      )}
    </div>
  );
}
```

## Backend API Usage Examples

### cURL Examples

```bash
# Basic search
curl "http://localhost:3000/api/v1/offers/search?q=acme"

# Search with filters
curl "http://localhost:3000/api/v1/orders/search?q=urgent&status=CONFIRMED&companyId=abc123"

# Search with sorting
curl "http://localhost:3000/api/v1/invoices/search?q=&sortBy=total&sortOrder=desc&limit=10"

# Paginated search
curl "http://localhost:3000/api/v1/deliveries/search?q=signed&page=2&limit=20"

# Complex filter combination
curl "http://localhost:3000/api/v1/offers/search?q=test&status=SENT&customerId=xyz789&sortBy=validUntil&sortOrder=asc"
```

### JavaScript/TypeScript Fetch Examples

```typescript
// Basic search
async function searchOffers(query: string) {
  const response = await fetch(
    `/api/v1/offers/search?q=${encodeURIComponent(query)}`
  );
  return response.json();
}

// Advanced search with filters
async function searchOrdersAdvanced(params: {
  query?: string;
  status?: string;
  companyId?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.append('q', params.query);
  if (params.status) searchParams.append('status', params.status);
  if (params.companyId) searchParams.append('companyId', params.companyId);
  if (params.page) searchParams.append('page', params.page.toString());

  const response = await fetch(`/api/v1/orders/search?${searchParams}`);
  return response.json();
}
```

## Search Use Cases

### 1. Global Search Bar

```tsx
export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'offers' | 'orders' | 'deliveries' | 'invoices'>('offers');

  const offersSearch = useSearchOffers({ query, limit: 5 });
  const ordersSearch = useSearchOrders({ query, limit: 5 });
  const deliveriesSearch = useSearchDeliveries({ query, limit: 5 });
  const invoicesSearch = useSearchInvoices({ query, limit: 5 });

  const currentSearch = {
    offers: offersSearch,
    orders: ordersSearch,
    deliveries: deliveriesSearch,
    invoices: invoicesSearch,
  }[selectedType];

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div>
        <button onClick={() => setSelectedType('offers')}>Offers</button>
        <button onClick={() => setSelectedType('orders')}>Orders</button>
        <button onClick={() => setSelectedType('deliveries')}>Deliveries</button>
        <button onClick={() => setSelectedType('invoices')}>Invoices</button>
      </div>
      {/* Render results */}
    </div>
  );
}
```

### 2. Customer-Specific Search

```tsx
export function CustomerDocuments({ customerId }: { customerId: string }) {
  const [query, setQuery] = useState('');

  const offers = useSearchOffers({ query, customerId });
  const orders = useSearchOrders({ query, customerId });
  const deliveries = useSearchDeliveries({ query, customerId });
  const invoices = useSearchInvoices({ query, customerId });

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search customer documents..."
      />
      
      <section>
        <h3>Offers ({offers.data?.pagination.total || 0})</h3>
        {/* Render offers */}
      </section>

      <section>
        <h3>Orders ({orders.data?.pagination.total || 0})</h3>
        {/* Render orders */}
      </section>

      <section>
        <h3>Deliveries ({deliveries.data?.pagination.total || 0})</h3>
        {/* Render deliveries */}
      </section>

      <section>
        <h3>Invoices ({invoices.data?.pagination.total || 0})</h3>
        {/* Render invoices */}
      </section>
    </div>
  );
}
```

### 3. Status Dashboard with Search

```tsx
export function StatusDashboard() {
  const [query, setQuery] = useState('');

  const draftOffers = useSearchOffers({ query, status: 'DRAFT' });
  const sentOffers = useSearchOffers({ query, status: 'SENT' });
  const acceptedOffers = useSearchOffers({ query, status: 'ACCEPTED' });

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>Draft ({draftOffers.data?.pagination.total || 0})</h3>
          {/* Render draft offers */}
        </div>
        
        <div>
          <h3>Sent ({sentOffers.data?.pagination.total || 0})</h3>
          {/* Render sent offers */}
        </div>
        
        <div>
          <h3>Accepted ({acceptedOffers.data?.pagination.total || 0})</h3>
          {/* Render accepted offers */}
        </div>
      </div>
    </div>
  );
}
```

### 4. Auto-Complete Search

```tsx
export function AutoCompleteSearch() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 200);

  const { data } = useSearchOffers({
    query: debouncedQuery,
    limit: 5,
  });

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(true);
        }}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        placeholder="Search..."
      />
      
      {showResults && data && data.data.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md mt-1">
          {data.data.map(offer => (
            <div
              key={offer.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // Handle selection
                setQuery(offer.offerNo);
                setShowResults(false);
              }}
            >
              <div className="font-medium">{offer.offerNo}</div>
              <div className="text-sm text-gray-600">{offer.customerName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Performance Tips

1. **Use Debouncing**: Always debounce search input to reduce API calls
2. **Limit Results**: Use appropriate `limit` parameter (10-20 for listings, 5 for autocomplete)
3. **Enable Conditionally**: Set `enabled: false` in useQuery when not needed
4. **Use Filters**: Apply filters before searching to reduce result set
5. **Cache Results**: React Query automatically caches results

## Testing Search

```typescript
// Test search endpoint
describe('Offer Search', () => {
  it('should search offers by query', async () => {
    const response = await fetch('/api/v1/offers/search?q=test');
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.pagination).toBeDefined();
  });

  it('should filter by status', async () => {
    const response = await fetch('/api/v1/offers/search?q=&status=SENT');
    const data = await response.json();
    
    expect(data.data.every((offer: any) => offer.status === 'SENT')).toBe(true);
  });
});
```

## Common Patterns

### Search Result Highlighting

```tsx
function highlightMatch(text: string, query: string) {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export function SearchResult({ offer, query }: { offer: any; query: string }) {
  return (
    <div>
      <h3 dangerouslySetInnerHTML={{ 
        __html: highlightMatch(offer.offerNo, query) 
      }} />
      <p dangerouslySetInnerHTML={{ 
        __html: highlightMatch(offer.customerName, query) 
      }} />
    </div>
  );
}
```

### Empty State

```tsx
export function SearchEmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-gray-600">
        No results found for "{query}"
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Try adjusting your search or filters
      </p>
    </div>
  );
}
```

### Loading State

```tsx
export function SearchLoadingState() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
```

