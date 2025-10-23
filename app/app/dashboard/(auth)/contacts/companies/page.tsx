'use client';

import { useState } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CompaniesTable } from './components/companies-table';
import { CompanyDrawer } from './components/company-drawer';
import { CompanyFormDialog } from './components/company-form-dialog';
import { useCompanies } from '@/hooks/use-companies';
import { useDebounce } from '@/hooks/use-debounce';
import type { Company, CompanyType } from '@/lib/api/types';

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<CompanyType | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const filters = {
    page: currentPage,
    limit: 20,
    ...(debouncedSearch && { name: debouncedSearch }),
    ...(typeFilter !== 'ALL' && { type: typeFilter as CompanyType }),
  };

  const { data, isLoading } = useCompanies(filters);

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedCompany(null), 300);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
            <Building2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
            <p className="text-sm text-muted-foreground">
              Manage your business relationships
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, tax number, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as CompanyType | 'ALL')}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="SUPPLIER">Supplier</SelectItem>
            <SelectItem value="PARTNER">Partner</SelectItem>
            <SelectItem value="INTERNAL">Internal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card">
        <CompaniesTable
          data={data}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onCompanyClick={handleCompanyClick}
        />
      </div>

      {/* Company Drawer */}
      {selectedCompany && (
        <CompanyDrawer
          company={selectedCompany}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}

      {/* Create Company Dialog */}
      <CompanyFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}

