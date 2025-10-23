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
  FormDescription,
} from '@/components/ui/form';
import { useCreateRelationship } from '@/hooks/use-relationships';
import { useCompanies } from '@/hooks/use-companies';

const relationshipSchema = z.object({
  sourceCompanyId: z.string().min(1, 'Source company is required'),
  targetCompanyId: z.string().min(1, 'Target company is required'),
  relationType: z.enum(['SUPPLIER', 'CUSTOMER', 'PARTNER']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
}).refine((data) => data.sourceCompanyId !== data.targetCompanyId, {
  message: 'Source and target companies must be different',
  path: ['targetCompanyId'],
});

type RelationshipFormValues = z.infer<typeof relationshipSchema>;

interface RelationshipFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RelationshipFormDialog({
  isOpen,
  onClose,
}: RelationshipFormDialogProps) {
  const createRelationship = useCreateRelationship();
  const { data: companiesData } = useCompanies({ limit: 100 });

  const companies = companiesData?.data || [];

  const form = useForm<RelationshipFormValues>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      sourceCompanyId: '',
      targetCompanyId: '',
      relationType: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form]);

  const onSubmit = (data: RelationshipFormValues) => {
    createRelationship.mutate(data, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Relationship</DialogTitle>
          <DialogDescription>
            Link two companies together with a specific relationship type
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="sourceCompanyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Company *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name} ({company.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The company initiating the relationship
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="SUPPLIER">Supplier</SelectItem>
                      <SelectItem value="PARTNER">Partner</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How the source company relates to the target
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetCompanyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Company *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies
                        .filter((c) => c.id !== form.watch('sourceCompanyId'))
                        .map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name} ({company.city})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The company being related to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRelationship.isPending}>
                {createRelationship.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create Relationship
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

