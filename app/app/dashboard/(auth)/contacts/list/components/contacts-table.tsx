'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2, Mail, Phone, Star } from 'lucide-react';
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
import type { ApiResponse, Contact } from '@/lib/api/types';

interface ContactsTableProps {
  data?: ApiResponse<Contact[]>;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onContactClick: (contact: Contact) => void;
}

export function ContactsTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onContactClick,
}: ContactsTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const contacts = data?.data || [];
  const pagination = data?.pagination;

  if (contacts.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">No contacts found</p>
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                key={contact.id}
                onClick={() => onContactClick(contact)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {contact.firstName} {contact.lastName}
                    </span>
                    {contact.isPrimary && (
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-3 text-muted-foreground" />
                    {contact.email}
                  </div>
                </TableCell>
                <TableCell>
                  {contact.phone ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-3 text-muted-foreground" />
                      {contact.phone}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {contact.company?.name || (
                    <span className="text-muted-foreground">Unknown</span>
                  )}
                </TableCell>
                <TableCell>
                  {contact.position || (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {contact.isPrimary ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Primary
                    </Badge>
                  ) : (
                    <Badge variant="outline">Regular</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(contact.createdAt), 'dd.MM.yyyy')}
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

