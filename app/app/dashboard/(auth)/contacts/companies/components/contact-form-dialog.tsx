'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, X } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateContact, useUpdateContact } from '@/hooks/use-contacts';
import type { Contact } from '@/lib/api/types';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  isPrimary: z.boolean(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormDialogProps {
  companyId: string;
  contact?: Contact | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContactFormDialog({
  companyId,
  contact,
  isOpen,
  onClose,
}: ContactFormDialogProps) {
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();

  const isEditMode = !!contact;
  const [tagInput, setTagInput] = useState('');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      tags: [],
      notes: '',
      isPrimary: false,
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone || '',
        position: contact.position || '',
        department: contact.department || '',
        tags: contact.tags || [],
        notes: contact.notes || '',
        isPrimary: contact.isPrimary,
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: '',
        tags: [],
        notes: '',
        isPrimary: false,
      });
    }
  }, [contact, form]);

  const onSubmit = (data: ContactFormValues) => {
    if (isEditMode) {
      updateContact.mutate(
        { id: contact.id, data },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createContact.mutate(
        { ...data, companyId },
        {
          onSuccess: () => {
            form.reset();
            onClose();
          },
        }
      );
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Contact' : 'Add New Contact'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update contact information'
              : 'Add a new contact for this company'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} />
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Executive" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                    {(form.watch('tags') || []).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {(form.watch('tags') || []).map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(index)}
                              className="ml-1 rounded-full hover:bg-black/20"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrimary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Primary Contact</FormLabel>
                    <FormDescription>
                      Mark as the main contact for this company
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about this contact..."
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
                disabled={createContact.isPending || updateContact.isPending}
              >
                {(createContact.isPending || updateContact.isPending) && (
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

