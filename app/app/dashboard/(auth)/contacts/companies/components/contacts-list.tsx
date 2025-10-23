'use client';

import { useState } from 'react';
import { Mail, Phone, Plus, Edit, Trash2, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ContactFormDialog } from './contact-form-dialog';
import { useContacts, useDeleteContact } from '@/hooks/use-contacts';
import type { Contact } from '@/lib/api/types';

interface ContactsListProps {
  companyId: string;
}

export function ContactsList({ companyId }: ContactsListProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const { data, isLoading } = useContacts({ companyId });
  const deleteContact = useDeleteContact();

  const contacts = data?.data || [];

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const handleDelete = () => {
    if (contactToDelete) {
      deleteContact.mutate(contactToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setContactToDelete(null);
        },
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTimeout(() => setSelectedContact(null), 300);
  };

  if (isLoading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Company Contacts</h3>
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <User className="mx-auto mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No contacts yet</p>
          <Button size="sm" variant="ghost" onClick={() => setIsFormOpen(true)} className="mt-2">
            Add your first contact
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.isPrimary && (
                    <Badge variant="secondary" className="gap-1">
                      <Star className="size-3 fill-current" />
                      Primary
                    </Badge>
                  )}
                </div>

                {contact.position && (
                  <p className="text-sm text-muted-foreground">{contact.position}</p>
                )}

                <div className="flex flex-wrap gap-3 text-sm">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Mail className="size-3" />
                      {contact.email}
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Phone className="size-3" />
                      {contact.phone}
                    </a>
                  )}
                </div>

                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(contact)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setContactToDelete(contact);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ContactFormDialog
        companyId={companyId}
        contact={selectedContact}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {contactToDelete?.firstName}{' '}
              {contactToDelete?.lastName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

