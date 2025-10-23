'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ApiResponse, Company } from '@/lib/api/types';

interface CompaniesTableProps {
  data?: ApiResponse<Company[]>;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onCompanyClick: (company: Company) => void;
}

const TYPE_COLORS = {
  CUSTOMER: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  SUPPLIER: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  PARTNER: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  INTERNAL: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export function CompaniesTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onCompanyClick,
}: CompaniesTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const companies = data?.data || [];
  const pagination = data?.pagination;

  if (companies.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">No companies found</p>
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
              <TableHead className="w-16">#</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Tax Number</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Contacts</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company, index) => {
              const rowNumber = (currentPage - 1) * 20 + index + 1;
              return (
                <TableRow
                  key={company.id}
                  onClick={() => onCompanyClick(company)}
                  className="cursor-pointer"
                >
                  <TableCell className="text-muted-foreground text-center">
                    {rowNumber}
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={TYPE_COLORS[company.type]}
                  >
                    {company.type.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {company.taxNumber}
                </TableCell>
                <TableCell>{company.city}</TableCell>
                <TableCell className="uppercase">{company.country}</TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {company.contacts?.length || 0}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(company.createdAt), 'dd.MM.yyyy')}
                </TableCell>
              </TableRow>
              );
            })}
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

