'use client';

import { useState } from 'react';
import { useSearchOffers } from '@/hooks/use-offers';
import { SearchInput } from './SearchInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function OffersSearchExample() {
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Search Offers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by offer number, company, or customer..."
              className="flex-1"
            />
            
            <Select value={status} onValueChange={(value) => setStatus(value === 'all' ? undefined : value)}>
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

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error.message}
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Found {data.pagination.total} results
              </div>

              <div className="space-y-2">
                {data.data.map((offer) => (
                  <Card key={offer.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{offer.offerNo}</span>
                          <Badge className={getStatusColor(offer.status)}>
                            {offer.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Customer ID: {offer.customerId}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {offer.total.toLocaleString()} {offer.currency}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Valid until: {new Date(offer.validUntil).toLocaleDateString('sr-RS')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!data.pagination.hasPrev}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.pagination.hasNext}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

