'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateCompany, useUpdateCompany } from '@/hooks/use-companies';
import type { Company, CompanyType } from '@/lib/api/types';

const companySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['CUSTOMER', 'SUPPLIER', 'PARTNER', 'INTERNAL']),
  taxNumber: z.string().min(1, 'Tax number is required'),
  registrationNumber: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
  company?: Company;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyFormDialog({
  company,
  isOpen,
  onClose,
}: CompanyFormDialogProps) {
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();

  const isEditMode = !!company;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      type: 'CUSTOMER',
      taxNumber: '',
      registrationNumber: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        type: company.type,
        taxNumber: company.taxNumber,
        registrationNumber: company.registrationNumber || '',
        email: company.email || '',
        phone: company.phone || '',
        website: company.website || '',
        address: company.address,
        city: company.city,
        country: company.country,
        postalCode: company.postalCode || '',
        notes: company.notes || '',
      });
    } else {
      form.reset({
        name: '',
        type: 'CUSTOMER',
        taxNumber: '',
        registrationNumber: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        notes: '',
      });
    }
  }, [company, form]);

  const onSubmit = (data: CompanyFormValues) => {
    if (isEditMode) {
      updateCompany.mutate(
        { id: company.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createCompany.mutate(data, {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Company' : 'Create New Company'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update company information'
              : 'Add a new company to your CRM'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Company Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="SUPPLIER">Supplier</SelectItem>
                        <SelectItem value="PARTNER">Partner</SelectItem>
                        <SelectItem value="INTERNAL">Internal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="REG-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="info@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 8900" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Address</h3>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Business St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="US" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this company..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createCompany.isPending || updateCompany.isPending}
              >
                {(createCompany.isPending || updateCompany.isPending) && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

