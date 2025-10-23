'use client';

import { useState } from 'react';
import { useSearchOffers } from '@/hooks/use-offers';
import { useDebounce } from '@/hooks/use-debounce';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

export default function TestSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, error } = useSearchOffers({
    query: debouncedQuery,
    status: status as any,
    page,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-500',
      SENT: 'bg-blue-500',
      ACCEPTED: 'bg-green-500',
      REJECTED: 'bg-red-500',
      EXPIRED: 'bg-orange-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Meilisearch Integration</h1>
        <p className="text-muted-foreground">
          Test the search functionality with real-time results from Meilisearch
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Offers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by offer number, customer name, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Select value={status || 'all'} onValueChange={(value) => setStatus(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {searchQuery && (
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  Searching...
                </div>
              ) : (
                <>
                  Found <span className="font-medium">{data?.pagination.total || 0}</span> results
                  {" "}for "<span className="font-medium">{searchQuery}</span>"
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-600">
              <strong>Error:</strong> {error.message}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
        </div>
      )}

      {data && data.data.length > 0 && (
        <div className="space-y-4">
          {data.data.map((offer: any) => (
            <Card key={offer.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{offer.offerNo}</h3>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Customer:</strong> {offer.customerName}</p>
                      <p><strong>Company:</strong> {offer.companyName}</p>
                      <p><strong>Total:</strong> {offer.total.toLocaleString()} {offer.currency}</p>
                      <p><strong>Valid Until:</strong> {new Date(offer.validUntil).toLocaleDateString('sr-RS')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(offer.createdAt).toLocaleDateString('sr-RS')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data && data.data.length === 0 && searchQuery && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl">🔍</div>
            <div>
              <h3 className="text-lg font-semibold">No offers found</h3>
              <p className="text-muted-foreground mt-1">
                No offers match your search "{searchQuery}". Try adjusting your search or filters.
              </p>
            </div>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        </Card>
      )}

      {data && data.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!data.pagination.hasPrev}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={!data.pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* Debug Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <div><strong>Search Query:</strong> "{searchQuery}"</div>
          <div><strong>Status Filter:</strong> {status || 'none'}</div>
          <div><strong>Debounced Query:</strong> "{debouncedQuery}"</div>
          <div><strong>Current Page:</strong> {page}</div>
          <div><strong>Total Results:</strong> {data?.pagination.total || 0}</div>
          <div><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        </CardContent>
      </Card>
    </div>
  );
}
