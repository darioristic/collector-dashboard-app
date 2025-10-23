'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Edit,
  Trash2,
  X,
  Star,
} from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { ContactFormDialog } from '../../companies/components/contact-form-dialog';
import { useDeleteContact } from '@/hooks/use-contacts';
import type { Contact } from '@/lib/api/types';
import Link from 'next/link';

interface ContactDrawerProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactDrawer({ contact, isOpen, onClose }: ContactDrawerProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteContact = useDeleteContact();

  const handleDelete = () => {
    deleteContact.mutate(contact.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        onClose();
      },
    });
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} direction="right">
        <DrawerContent className="h-full w-full sm:max-w-2xl">
          <DrawerHeader className="flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/50">
                <User className="size-5" />
              </div>
              <div>
                <DrawerTitle className="text-xl">
                  {contact.firstName} {contact.lastName}
                </DrawerTitle>
                <p className="text-sm text-muted-foreground">{contact.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="size-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Status Badge */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Status</h3>
                <div className="flex gap-2">
                  {contact.isPrimary && (
                    <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <Star className="size-3 fill-current" />
                      Primary Contact
                    </Badge>
                  )}
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="grid gap-4">
                <h3 className="text-sm font-medium">Contact Information</h3>
                
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>

                {contact.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="size-4 text-muted-foreground" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>

              <Separator />

              {/* Company Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Company</h3>
                {contact.company ? (
                  <Link
                    href={`/dashboard/contacts/companies`}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <Building2 className="size-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{contact.company.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contact.company.city}, {contact.company.country}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <p className="text-sm text-muted-foreground">No company assigned</p>
                )}
              </div>

              {/* Position & Department */}
              {(contact.position || contact.department) && (
                <>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {contact.position && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
                          <Briefcase className="size-4 text-muted-foreground" />
                          Position
                        </h3>
                        <p className="text-sm">{contact.position}</p>
                      </div>
                    )}
                    {contact.department && (
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Department</h3>
                        <p className="text-sm">{contact.department}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-3 text-sm font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {contact.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Notes */}
              {contact.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Notes</h3>
                    <p className="text-sm text-muted-foreground">{contact.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p>{format(new Date(contact.createdAt), 'dd.MM.yyyy')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p>{format(new Date(contact.updatedAt), 'dd.MM.yyyy')}</p>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Edit Dialog */}
      <ContactFormDialog
        companyId={contact.companyId}
        contact={contact}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contact.firstName}{' '}
              {contact.lastName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteContact.isPending}
            >
              {deleteContact.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

