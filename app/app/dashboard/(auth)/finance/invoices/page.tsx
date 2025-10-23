'use client';

import { useState } from 'react';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvoicesTable } from './components/invoices-table';
import { InvoiceDrawer } from './components/invoice-drawer';
import CreateInvoiceDrawer from './components/create-invoice-drawer';
import { 
  useInvoices, 
  useSearchInvoices
} from '@/hooks/use-invoices';
import { useDebounce } from '@/hooks/use-debounce';

interface Invoice {
  id: string;
  invoiceNo: string;
  type: string;
  status: string;
  customer?: { name: string };
  total: number;
  currency: string;
  issueDate: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const shouldUseSearch = debouncedSearch || statusFilter !== 'ALL' || typeFilter !== 'ALL';
  
  const { data: listData, isLoading: isListLoading } = useInvoices({ 
    page: currentPage, 
    limit: 20 
  });
  
  const { data: searchData, isLoading: isSearchLoading } = useSearchInvoices({
    query: debouncedSearch,
    status: statusFilter !== 'ALL' ? statusFilter as any : undefined,
    type: typeFilter !== 'ALL' ? typeFilter as any : undefined,
    page: currentPage,
    limit: 20,
  });
  
  const data = shouldUseSearch ? searchData : listData;
  const isLoading = shouldUseSearch ? isSearchLoading : isListLoading;

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedInvoice(null), 300);
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
            <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Manage issued and received invoices
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDrawerOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by invoice number, customer..."
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
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="ISSUED">Issued</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="CREDIT_NOTE">Credit Note</SelectItem>
            <SelectItem value="PROFORMA">Proforma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card">
        <InvoicesTable
          data={data}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onInvoiceClick={handleInvoiceClick}
        />
      </div>

      {/* Invoice Drawer */}
      {selectedInvoice && (
        <InvoiceDrawer
          invoice={selectedInvoice}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}

      {/* Create Invoice Drawer */}
      <CreateInvoiceDrawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
      />
    </div>
  );
}