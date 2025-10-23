'use client';

import { useState } from 'react';
import { FileText, Plus, Search, Trash2, Send, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OffersTable } from './components/offers-table';
import { OfferDrawer } from './components/offer-drawer';
import { 
  useOffers, 
  useSearchOffers,
  useBulkOfferAction 
} from '@/hooks/use-offers';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

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

export default function OffersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const shouldUseSearch = debouncedSearch || statusFilter !== 'ALL';
  
  const { data: listData, isLoading: isListLoading } = useOffers({ 
    page: currentPage, 
    limit: 20 
  });
  
  const { data: searchData, isLoading: isSearchLoading } = useSearchOffers({
    query: debouncedSearch,
    status: statusFilter !== 'ALL' ? statusFilter as any : undefined,
    page: currentPage,
    limit: 20,
  });
  
  const data = shouldUseSearch ? searchData : listData;
  const isLoading = shouldUseSearch ? isSearchLoading : isListLoading;

  const bulkAction = useBulkOfferAction();

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedOffer(null), 300);
  };

  const handleBulkSend = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await bulkAction.mutateAsync({ ids: selectedIds, action: 'send' });
      toast({
        title: 'Success',
        description: `${selectedIds.length} offers sent successfully`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send offers',
        variant: 'destructive',
      });
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await bulkAction.mutateAsync({ ids: selectedIds, action: 'approve' });
      toast({
        title: 'Success',
        description: `${selectedIds.length} offers approved successfully`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve offers',
        variant: 'destructive',
      });
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await bulkAction.mutateAsync({ ids: selectedIds, action: 'reject' });
      toast({
        title: 'Success',
        description: `${selectedIds.length} offers rejected successfully`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject offers',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await bulkAction.mutateAsync({ ids: selectedIds, action: 'delete' });
      toast({
        title: 'Success',
        description: `${selectedIds.length} offers deleted successfully`,
      });
      setSelectedIds([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete offers',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Offers</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your sales offers
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkSend}
              >
                <Send className="mr-2 size-4" />
                Send ({selectedIds.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkApprove}
              >
                <CheckCircle className="mr-2 size-4" />
                Approve ({selectedIds.length})
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleBulkReject}
              >
                <XCircle className="mr-2 size-4" />
                Reject ({selectedIds.length})
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 size-4" />
                Delete ({selectedIds.length})
              </Button>
            </>
          )}
          <Button onClick={() => router.push('/dashboard/sales/offers/new')} size="sm">
            <Plus className="mr-2 size-4" />
            Create Offer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by offer number, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card">
        <OffersTable
          data={data}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onOfferClick={handleOfferClick}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Offer Drawer */}
      {selectedOffer && (
        <OfferDrawer
          offer={selectedOffer}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}
    </div>
  );
}

