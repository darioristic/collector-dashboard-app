'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateInvoice } from '@/hooks/use-invoices';
import { useCompanies } from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';

const invoiceItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  taxRate: z.number().min(0).max(100).default(0),
  total: z.number(),
});

const invoiceFormSchema = z.object({
  invoiceNo: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  customerId: z.string().min(1, 'Customer is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discount: z.number().min(0).optional(),
  vatRate: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  paymentDetails: z.string().optional(),
});

type InvoiceFormValues = {
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  customerId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    taxRate: number;
    total: number;
  }[];
  discount?: number;
  vatRate: number;
  taxRate: number;
  notes?: string;
  paymentDetails?: string;
};

export default function CreateInvoicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const createInvoice = useCreateInvoice();
  const { data: companiesData } = useCompanies({ type: 'CUSTOMER' });

  const [items, setItems] = useState([
    { productId: '', productName: '', quantity: 1, price: 0, taxRate: 0, total: 0 }
  ]);

  const form = useForm<InvoiceFormValues>({
    defaultValues: {
      invoiceNo: `INV-${String(Date.now()).slice(-4)}`,
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      customerId: '',
      items: [{ productId: '', productName: '', quantity: 1, price: 0, taxRate: 0, total: 0 }],
      discount: 0,
      vatRate: 0,
      taxRate: 0,
      notes: '',
      paymentDetails: '',
    },
  });

  const addItem = () => {
    const newItems = [...items, { productId: '', productName: '', quantity: 1, price: 0, taxRate: 0, total: 0 }];
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      form.setValue('items', newItems);
    }
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total for this item
    if (field === 'quantity' || field === 'price' || field === 'taxRate') {
      const item = newItems[index];
      const subtotal = item.quantity * item.price;
      const tax = subtotal * (item.taxRate / 100);
      newItems[index].total = subtotal + tax;
    }
    
    setItems(newItems);
    form.setValue('items', newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    const discountRate = form.getValues('discount') || 0;
    return subtotal * (discountRate / 100);
  };

  const calculateVAT = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const vatRate = form.getValues('vatRate') || 0;
    return (subtotal - discount) * (vatRate / 100);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const taxRate = form.getValues('taxRate') || 0;
    return (subtotal - discount) * (taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const vat = calculateVAT();
    const tax = calculateTax();
    return subtotal - discount + vat + tax;
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      const invoiceData = {
        companyId: 'current-company-id', // This should come from auth context
        customerId: data.customerId,
        items: data.items.map(item => ({
          productId: item.productId || `product-${Date.now()}`,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.taxRate,
          total: item.total,
        })),
        subtotal: calculateSubtotal(),
        tax: calculateVAT() + calculateTax(),
        total: calculateTotal(),
        currency: 'EUR',
        type: 'ISSUED' as const,
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        notes: data.notes,
      };

      await createInvoice.mutateAsync(invoiceData);
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      });
      router.push('/dashboard/finance/invoices');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    }
  };

  const companies = companiesData?.data || [];

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Create Invoice</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a new invoice for your customer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()} disabled={createInvoice.isPending}>
              Cancel
            </Button>
            <Button onClick={() => form.handleSubmit(onSubmit)()} disabled={createInvoice.isPending}>
              {createInvoice.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                'Create Invoice'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(); }} className="space-y-6">
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white">
                Invoice
                <Button variant="ghost" size="sm">
                  <MoreVertical className="size-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invoice Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice No</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* From/To Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">From</h3>
                  <div className="space-y-2 text-sm">
                    <div className="font-medium">Cloud Native d.o.o.</div>
                    <div>Trg Nikole Pasica 7</div>
                    <div>office@cloud.com</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">To</h3>
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                              {companies.map((company) => (
                                <SelectItem key={company.id} value={company.id}>
                                  {company.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="size-4 mr-2" />
                    Add item
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm border-b">
                    <div className="col-span-4">Product Name</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Tax Rate</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                      <div className="col-span-4">
                        <Input
                          placeholder="Product name"
                          value={item.productName}
                          onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={item.taxRate}
                          onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          €{item.total.toFixed(2)}
                        </span>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>€{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className="w-16 h-8 text-xs"
                        value={form.watch('discount') || 0}
                        onChange={(e) => form.setValue('discount', parseFloat(e.target.value) || 0)}
                      />
                      <span>€{calculateDiscount().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>VAT ({form.watch('vatRate') || 0}%)</span>
                    <span>€{calculateVAT().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax ({form.watch('taxRate') || 0}%)</span>
                    <span>€{calculateTax().toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>€{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Payment Details</h3>
                  <FormField
                    control={form.control}
                    name="paymentDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Bank details, payment instructions..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <h3 className="font-medium mb-3 text-gray-900 dark:text-white">Note</h3>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Additional notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
