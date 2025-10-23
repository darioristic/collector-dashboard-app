'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Edit,
  Trash2,
  X,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { CompanyFormDialog } from './company-form-dialog';
import { ContactsList } from './contacts-list';
import { RelationshipsList } from './relationships-list';
import { useDeleteCompany } from '@/hooks/use-companies';
import type { Company } from '@/lib/api/types';

interface CompanyDrawerProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDrawer({ company, isOpen, onClose }: CompanyDrawerProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteCompany = useDeleteCompany();

  const handleDelete = () => {
    deleteCompany.mutate(company.id, {
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
          <DrawerHeader className="relative border-b bg-linear-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/10 to-primary/5 shadow-sm">
                  <Building2 className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <DrawerTitle className="text-lg font-semibold tracking-tight text-foreground truncate">
                    {company.name}
                  </DrawerTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {company.taxNumber}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-medium ${
                        company.type === 'CUSTOMER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        company.type === 'SUPPLIER' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                        company.type === 'PARTNER' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {company.type.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <DrawerClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-muted transition-colors"
                >
                  <X className="size-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <Tabs defaultValue="info" className="flex-1">
            <div className="border-b bg-background/50 px-6 py-2">
              <TabsList className="h-12 bg-muted/50">
                <TabsTrigger value="info" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Information
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Contacts ({company.contacts?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="relationships" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">
                  Relationships
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="overflow-y-auto p-6">
              <TabsContent value="info" className="flex flex-col space-y-6 min-h-full">
                <div>
                  <h3 className="mb-3 text-sm font-medium">Company Type</h3>
                  <Badge variant="secondary">{company.type}</Badge>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <h3 className="text-sm font-medium">Contact Information</h3>
                  
                  {company.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <a
                        href={`mailto:${company.email}`}
                        className="text-primary hover:underline"
                      >
                        {company.email}
                      </a>
                    </div>
                  )}

                  {company.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <a
                        href={`tel:${company.phone}`}
                        className="text-primary hover:underline"
                      >
                        {company.phone}
                      </a>
                    </div>
                  )}

                  {company.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="size-4 text-muted-foreground" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Address</h3>
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <div>
                      <p>{company.address}</p>
                      <p>
                        {company.city}
                        {company.postalCode && `, ${company.postalCode}`}
                      </p>
                      <p>{company.country}</p>
                    </div>
                  </div>
                </div>

                {company.registrationNumber && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-1 text-sm font-medium">
                        Registration Number
                      </h3>
                      <p className="font-mono text-base font-semibold">{company.registrationNumber}</p>
                    </div>
                  </>
                )}

                {company.taxNumber && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-1 text-sm font-medium">
                        Tax ID
                      </h3>
                      <p className="font-mono text-base font-semibold">{company.taxNumber}</p>
                    </div>
                  </>
                )}

                {company.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-2 text-sm font-medium">Notes</h3>
                      <p className="text-sm text-muted-foreground">{company.notes}</p>
                    </div>
                  </>
                )}

                <Separator />

                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p>{format(new Date(company.createdAt), 'dd.MM.yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p>{format(new Date(company.updatedAt), 'dd.MM.yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditDialogOpen(true)}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contacts">
                <ContactsList companyId={company.id} />
              </TabsContent>

              <TabsContent value="relationships">
                <RelationshipsList companyId={company.id} />
              </TabsContent>
            </div>
          </Tabs>
        </DrawerContent>
      </Drawer>

      {/* Edit Dialog */}
      <CompanyFormDialog
        company={company}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{company.name}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteCompany.isPending}
            >
              {deleteCompany.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

