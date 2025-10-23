'use client';

import { useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ContactsTable } from './components/contacts-table';
import { ContactDrawer } from './components/contact-drawer';
import { ContactFormDialog } from '../companies/components/contact-form-dialog';
import { useContacts } from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
import { useDebounce } from '@/hooks/use-debounce';
import type { Contact } from '@/lib/api/types';

export default function ContactsListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const filters = {
    page: currentPage,
    limit: 20,
    ...(debouncedSearch && { name: debouncedSearch }),
    ...(companyFilter !== 'ALL' && { companyId: companyFilter }),
  };

  const { data: contactsData, isLoading } = useContacts(filters);
  const { data: companiesData } = useCompanies({ limit: 100 });

  const companies = companiesData?.data || [];

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedContact(null), 300);
  };

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Contacts</h1>
            <p className="text-sm text-muted-foreground">
              Manage all your business contacts
            </p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="mr-2 size-4" />
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={companyFilter}
          onValueChange={(value) => setCompanyFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Companies</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-lg border bg-card">
        <ContactsTable
          data={contactsData}
          isLoading={isLoading}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onContactClick={handleContactClick}
        />
      </div>

      {/* Contact Drawer */}
      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      )}

      {/* Create Contact Dialog */}
      <ContactFormDialog
        companyId={companies[0]?.id || ''}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
}

