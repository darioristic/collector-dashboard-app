'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2, DollarSign, Calendar, User, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableLoader } from '@/components/ui/standard-loader';
import { useBulkOfferAction } from '@/hooks/use-offers';

interface Offer {
  id: string;
  offerNo: string;
  status: string;
  customer?: { name: string };
  total: number;
  currency: string;
  validUntil?: string;
  createdAt: string;
}

interface OffersTableProps {
  data?: { data: Offer[]; pagination: any };
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onOfferClick: (offer: Offer) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function OffersTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onOfferClick,
  selectedIds,
  onSelectionChange,
}: OffersTableProps) {

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'warning' | 'info' | 'success' | 'destructive' | 'outline'> = {
      DRAFT: 'secondary',
      SENT: 'info',
      ACCEPTED: 'success',
      REJECTED: 'destructive',
      EXPIRED: 'warning',
    };
    return variants[status] || 'secondary';
  };

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    const offers = data?.data || [];
    if (selectedIds.length === offers.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(offers.map((o: Offer) => o.id));
    }
  };

  if (isLoading) {
    return <TableLoader message="Loading offers..." />;
  }

  const offers = data?.data || [];
  const pagination = data?.pagination;

  if (offers.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">No offers found</p>
        <p className="text-xs text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === offers.length && offers.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>#</TableHead>
              <TableHead>Offer No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer, index) => (
              <TableRow
                key={offer.id}
                onClick={() => onOfferClick(offer)}
                className="cursor-pointer"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(offer.id)}
                    onCheckedChange={() => toggleSelection(offer.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {(currentPage - 1) * 20 + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="font-medium">{offer.offerNo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-3 text-muted-foreground" />
                    {offer.customer?.name || (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="size-3 text-muted-foreground" />
                    <span className="font-medium">
                      {offer.currency} {offer.total}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(offer.status)}>
                    {offer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-3 text-muted-foreground" />
                    {offer.validUntil ? format(new Date(offer.validUntil), 'dd.MM.yyyy') : 'N/A'}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-3 text-muted-foreground" />
                    {format(new Date(offer.createdAt), 'dd.MM.yyyy')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{' '}
            total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
