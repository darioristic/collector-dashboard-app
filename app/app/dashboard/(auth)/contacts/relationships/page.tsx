'use client';

import { useState } from 'react';
import { Network, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RelationshipsTable } from './components/relationships-table';
import { RelationshipsNetwork } from './components/relationships-network';
import { RelationshipFormDialog } from './components/relationship-form-dialog';
import { useRelationships } from '@/hooks/use-relationships';
import { useCompanies } from '@/hooks/use-companies';
import { useDebounce } from '@/hooks/use-debounce';
import type { RelationType, RelationStatus } from '@/lib/api/types';

export default function RelationshipsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RelationType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<RelationStatus | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'network'>('table');

  const debouncedSearch = useDebounce(searchQuery, 500);

  const filters = {
    page: currentPage,
    limit: 20,
    ...(typeFilter !== 'ALL' && { relationType: typeFilter }),
    ...(statusFilter !== 'ALL' && { status: statusFilter }),
  };

  const { data, isLoading } = useRelationships(filters);
  const { data: companiesData } = useCompanies({ limit: 100 });

  const relationships = data?.data || [];
  const companies = companiesData?.data || [];

  return (
    <div className="flex h-full flex-col gap-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
            <Network className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Relationships
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage connections between companies
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Add Relationship
        </Button>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'network')}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="network">Network View</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="flex gap-2">
            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as RelationType | 'ALL')}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="SUPPLIER">Supplier</SelectItem>
                <SelectItem value="PARTNER">Partner</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as RelationStatus | 'ALL')
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table View */}
        <TabsContent value="table" className="mt-6">
          <div className="overflow-hidden rounded-lg border bg-card">
            <RelationshipsTable
              data={data}
              isLoading={isLoading}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </TabsContent>

        {/* Network View */}
        <TabsContent value="network" className="mt-6">
          <div className="overflow-hidden rounded-lg border bg-card p-6">
            <RelationshipsNetwork
              relationships={relationships}
              companies={companies}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Relationship Dialog */}
      <RelationshipFormDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}

