'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { MoreVertical, Plus, Trash2, X, Search, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Custom Input with subtle styling
const SubtleInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm transition-colors",
          "focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200",
          "dark:border-gray-600 dark:bg-gray-800 dark:focus:border-gray-400 dark:focus:ring-gray-700",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
SubtleInput.displayName = "SubtleInput";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCreateInvoice } from '@/hooks/use-invoices';
import { useCompanies, useCreateCompany } from '@/hooks/use-companies';
import { useToast } from '@/hooks/use-toast';
import { CompanyFormDialog } from '@/app/dashboard/(auth)/contacts/companies/components/company-form-dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface CreateInvoiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvoiceDrawer({ isOpen, onClose }: CreateInvoiceDrawerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createInvoice = useCreateInvoice();
  const createCompany = useCreateCompany();
  const { data: companiesData } = useCompanies({ type: 'CUSTOMER' });
  
  // Get current user's company data (assuming first company is the user's company)
  const currentCompany = companiesData?.data?.[0];

  const [items, setItems] = useState([
    { productId: '', productName: '', quantity: 1, price: 0, taxRate: 0, total: 0 }
  ]);
  
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [companySearch, setCompanySearch] = useState('');
  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false);
  const [isCreateCompanyDrawerOpen, setIsCreateCompanyDrawerOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // Company form state
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    contactPerson: '',
    registrationNumber: '',
    notes: '',
    // Details section
    addressLine1: '',
    addressLine2: '',
    city: '',
    country: '',
    stateProvince: '',
    zipCode: '',
    expenseTags: '',
    vatNumber: ''
  });
  
  const currencies = [
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'RSD', name: 'Serbian Dinar', symbol: 'RSD' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Mark', symbol: 'KM' },
    { code: 'MKD', name: 'Macedonian Denar', symbol: 'MKD' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
  ];

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

  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    return currency?.symbol || '€';
  };

  const handleCreateCompany = () => {
    setIsCreateCompanyDrawerOpen(true);
    setIsCompanySelectOpen(false);
  };

  const handleCompanyCreated = async () => {
    // Validate required fields
    if (!companyFormData.name || !companyFormData.email || !companyFormData.phone) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields (*)',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCompany.mutateAsync({
        name: companyFormData.name,
        type: 'CUSTOMER',
        email: companyFormData.email,
        phone: companyFormData.phone,
        website: companyFormData.website,
        address: companyFormData.addressLine1,
        city: companyFormData.city,
        country: companyFormData.country,
        taxNumber: companyFormData.vatNumber,
        registrationNumber: companyFormData.registrationNumber,
        notes: companyFormData.notes,
      });
      
      toast({
        title: 'Success',
        description: 'Company created successfully',
      });
      
      // Set the newly created company as selected customer
      const newCompany = {
        id: 'new-company-id', // This should come from the API response
        name: companyFormData.name,
        email: companyFormData.email,
        phone: companyFormData.phone,
        website: companyFormData.website,
        address: companyFormData.addressLine1,
        city: companyFormData.city,
        country: companyFormData.country,
        taxNumber: companyFormData.vatNumber,
        registrationNumber: companyFormData.registrationNumber,
        notes: companyFormData.notes,
      };
      
      setSelectedCustomer(newCompany);
      form.setValue('customerId', 'new-company-id');
      setCompanySearch(companyFormData.name);
      setIsCompanySelectOpen(false);
      
      setIsCreateCompanyDrawerOpen(false);
      setCompanyFormData({
        name: '',
        email: '',
        phone: '',
        website: '',
        contactPerson: '',
        registrationNumber: '',
        notes: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        stateProvince: '',
        zipCode: '',
        expenseTags: '',
        vatNumber: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create company',
        variant: 'destructive',
      });
    }
  };

  const handleCancelCompany = () => {
    setIsCreateCompanyDrawerOpen(false);
      setCompanyFormData({
        name: '',
        email: '',
        phone: '',
        website: '',
        contactPerson: '',
        registrationNumber: '',
        notes: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        stateProvince: '',
        zipCode: '',
        expenseTags: '',
        vatNumber: ''
      });
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
        currency: selectedCurrency,
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
      onClose();
      router.push('/dashboard/finance/invoices');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create invoice',
        variant: 'destructive',
      });
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCompanySelectOpen) {
        const target = event.target as Element;
        if (!target.closest('.company-select-container')) {
          setIsCompanySelectOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCompanySelectOpen]);
  
  const companies = companiesData?.data || [];
  
  // Filter companies based on search
  const filteredCompanies = companies.filter((company: any) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    company.email?.toLowerCase().includes(companySearch.toLowerCase()) ||
    company.taxNumber?.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[210mm] max-w-[210mm] p-0 [&>button]:hidden mt-[15px] mb-[15px] h-[calc(100vh-30px)] bg-white dark:bg-[#1A1818] border-gray-200 dark:border-gray-800 border overflow-y-auto" style={{ width: '210mm', maxWidth: '210mm' }}>
        <SheetTitle className="sr-only">Create Invoice</SheetTitle>

        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: '297mm' }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" style={{ minHeight: '297mm' }}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white text-xl">
                    <span>Invoice</span>
                    <div className="flex items-center gap-2">
                      <img 
                        src="/logo.png" 
                        alt="Company Logo" 
                        className="h-9 w-auto"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="focus:outline-none focus:ring-0">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {currencies.map((currency) => (
                            <DropdownMenuItem 
                              key={currency.code} 
                              onClick={() => setSelectedCurrency(currency.code)}
                              className={selectedCurrency === currency.code ? 'bg-accent' : ''}
                            >
                              {currency.code} - {currency.symbol}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-700 dark:text-gray-300">Invoice No</Label>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-md text-gray-900 dark:text-white font-medium">
                        {form.getValues('invoiceNo')}
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-gray-700 dark:text-gray-300">Issue Date</Label>
                          <FormControl>
                            <SubtleInput type="date" {...field}  />
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
                          <Label className="text-gray-700 dark:text-gray-300">Due Date</Label>
                          <FormControl>
                            <SubtleInput type="date" {...field}  />
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
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {currentCompany?.name || 'Your Company Name'}
                        </div>
                        <div>{currentCompany?.address || 'Your Company Address'}</div>
                        <div>{currentCompany?.city || 'City'}, {currentCompany?.country || 'Country'}</div>
                        <div>Tax ID: {currentCompany?.taxNumber || 'Your Tax ID'}</div>
                        {currentCompany?.registrationNumber && (
                          <div>Company ID: {currentCompany.registrationNumber}</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-3 text-gray-900 dark:text-white">To</h3>
                      
                      {selectedCustomer ? (
                        // Show selected customer details
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="font-medium text-gray-900 dark:text-white relative">
                            {selectedCustomer.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-4 w-4 p-0"
                              onClick={() => {
                                setSelectedCustomer(null);
                                setCompanySearch('');
                                form.setValue('customerId', '');
                                setIsCompanySelectOpen(false);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          {selectedCustomer.address && <div>{selectedCustomer.address}</div>}
                          {selectedCustomer.city && selectedCustomer.country && (
                            <div>{selectedCustomer.city}, {selectedCustomer.country}</div>
                          )}
                          {selectedCustomer.taxNumber && <div>Tax ID: {selectedCustomer.taxNumber}</div>}
                          {selectedCustomer.registrationNumber && (
                            <div>Company ID: {selectedCustomer.registrationNumber}</div>
                          )}
                        </div>
                      ) : (
                        // Show search input
                        <FormField
                          control={form.control}
                          name="customerId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative company-select-container">
                                  <SubtleInput
                                    placeholder="Search customer..."
                                    value={companySearch}
                                    onChange={(e) => {
                                      setCompanySearch(e.target.value);
                                      setIsCompanySelectOpen(true);
                                    }}
                                    onFocus={() => setIsCompanySelectOpen(true)}
                                  />
                                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  
                                  {isCompanySelectOpen && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                      {filteredCompanies.length > 0 ? (
                                        filteredCompanies.map((company: any) => (
                                          <div
                                            key={company.id}
                                            className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm"
                                            onClick={() => {
                                              field.onChange(company.id);
                                              setCompanySearch(company.name);
                                              setSelectedCustomer(company);
                                              setIsCompanySelectOpen(false);
                                            }}
                                          >
                                            <div className="font-medium text-gray-900 dark:text-white">{company.name}</div>
                                            {company.email && (
                                              <div className="text-gray-500 dark:text-gray-400">{company.email}</div>
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                          No companies found
                                        </div>
                                      )}
                                      
                                      {/* Always show Create New Company option */}
                                      <div className="border-t border-gray-200 dark:border-gray-700">
                                        <div
                                          className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center gap-2"
                                          onClick={handleCreateCompany}
                                        >
                                          <PlusCircle className="h-4 w-4 text-blue-500" />
                                          <span className="text-blue-500">Create new company</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
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

                    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 font-medium text-sm text-gray-900 dark:text-white">
                        <div className="col-span-4">Product Name</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-center">Tax Rate</div>
                        <div className="col-span-2 text-right">Total</div>
                      </div>
                      
                      {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 dark:border-gray-800 last:border-b-0">
                          <div className="col-span-4">
                            <SubtleInput
                              placeholder="Product name"
                              value={item.productName}
                              onChange={(e) => updateItem(index, 'productName', e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <SubtleInput
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2">
                            <SubtleInput
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.price}
                              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2">
                            <SubtleInput
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={item.taxRate}
                              onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {getCurrencySymbol()}{item.total.toFixed(2)}
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
                      <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                        <span>Subtotal</span>
                        <span>{getCurrencySymbol()}{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                        <span>Discount</span>
                        <div className="flex items-center gap-2">
                          <SubtleInput
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            className="w-16 h-8 text-xs"
                            value={form.watch('discount') || 0}
                            onChange={(e) => form.setValue('discount', parseFloat(e.target.value) || 0)}
                          />
                          <span>{getCurrencySymbol()}{calculateDiscount().toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                        <span>VAT ({form.watch('vatRate') || 0}%)</span>
                        <span>{getCurrencySymbol()}{calculateVAT().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-900 dark:text-white">
                        <span>Tax ({form.watch('taxRate') || 0}%)</span>
                        <span>{getCurrencySymbol()}{calculateTax().toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                        <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                          <span>Total</span>
                          <span>{getCurrencySymbol()}{calculateTotal().toFixed(2)}</span>
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
                              <SubtleInput 
                                placeholder="Bank details, payment instructions..." 
                                {...field} 
                              />
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
                              <SubtleInput 
                                placeholder="Additional notes..." 
                                {...field} 
                              />
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

      </SheetContent>
      
      {/* Create Company Drawer */}
      <Drawer open={isCreateCompanyDrawerOpen} onOpenChange={(open) => {
        if (!open) {
          // Only allow closing via Cancel button
          return;
        }
        setIsCreateCompanyDrawerOpen(open);
      }} direction="right">
        <DrawerContent className="w-[147mm] max-w-[147mm] p-0 [&>button]:hidden mt-[15px] mb-[15px] h-[calc(100vh-30px)] bg-white dark:bg-[#1A1818] border-gray-200 dark:border-gray-800 border overflow-y-auto" style={{ width: '147mm', maxWidth: '147mm' }}>
          <DrawerHeader>
            <DrawerTitle className="text-xl text-gray-900 dark:text-white">Create New Company</DrawerTitle>
          </DrawerHeader>
          
          <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: '297mm' }}>
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" style={{ minHeight: '297mm' }}>
              <CardContent className="space-y-6 pt-6">
                {/* Company Form */}
                <div className="space-y-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300 font-medium">Company Name *</Label>
                    <SubtleInput
                      placeholder="Acme Corporation"
                      value={companyFormData.name}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                    <SubtleInput
                      type="email"
                      placeholder="acme@example.com"
                      value={companyFormData.email}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Phone</Label>
                    <SubtleInput
                      placeholder="+1 (555) 123-4567"
                      value={companyFormData.phone}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  {/* Website */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Website</Label>
                    <SubtleInput
                      placeholder="acme.com"
                      value={companyFormData.website}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  
                  {/* Contact Person */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Contact person</Label>
                    <SubtleInput
                      placeholder="John Doe"
                      value={companyFormData.contactPerson}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                    />
                  </div>
                  
                  {/* Registration Number */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Registration Number</Label>
                    <SubtleInput
                      placeholder="REG123456"
                      value={companyFormData.registrationNumber}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    />
                  </div>
                  
                  {/* Details Section */}
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Details</h3>
                      {isDetailsExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    
                    {isDetailsExpanded && (
                      <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        {/* Search for an address */}
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Search for an address</Label>
                          <SubtleInput
                            placeholder="Search for an address"
                            value={companyFormData.addressLine1}
                            onChange={(e) => setCompanyFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                          />
                        </div>
                        
                        {/* Address Line 1 */}
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Address Line 1</Label>
                          <SubtleInput
                            placeholder="123 Main St"
                            value={companyFormData.addressLine1}
                            onChange={(e) => setCompanyFormData(prev => ({ ...prev, addressLine1: e.target.value }))}
                          />
                        </div>
                        
                        {/* Address Line 2 */}
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Address Line 2</Label>
                          <SubtleInput
                            placeholder="Suite 100"
                            value={companyFormData.addressLine2}
                            onChange={(e) => setCompanyFormData(prev => ({ ...prev, addressLine2: e.target.value }))}
                          />
                        </div>
                        
                        {/* Country & City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">Country</Label>
                            <Select value={companyFormData.country} onValueChange={(value) => setCompanyFormData(prev => ({ ...prev, country: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="GB">United Kingdom</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="RS">Serbia</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">City</Label>
                            <SubtleInput
                              placeholder="New York"
                              value={companyFormData.city}
                              onChange={(e) => setCompanyFormData(prev => ({ ...prev, city: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        {/* State/Province & ZIP Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">State / Province</Label>
                            <SubtleInput
                              placeholder="NY"
                              value={companyFormData.stateProvince}
                              onChange={(e) => setCompanyFormData(prev => ({ ...prev, stateProvince: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-gray-700 dark:text-gray-300">ZIP Code / Postal Code</Label>
                            <SubtleInput
                              placeholder="10001"
                              value={companyFormData.zipCode}
                              onChange={(e) => setCompanyFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        {/* Expense Tags */}
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Expense Tags</Label>
                          <div className="space-y-1">
                            <SubtleInput
                              placeholder="Select tags"
                              value={companyFormData.expenseTags}
                              onChange={(e) => setCompanyFormData(prev => ({ ...prev, expenseTags: e.target.value }))}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Tags help categorize and track customer expenses.
                            </p>
                          </div>
                        </div>
                        
                        {/* Tax ID / VAT Number */}
                        <div className="space-y-2">
                          <Label className="text-gray-700 dark:text-gray-300">Tax ID / VAT Number</Label>
                          <SubtleInput
                            placeholder="Enter VAT number"
                            value={companyFormData.vatNumber}
                            onChange={(e) => setCompanyFormData(prev => ({ ...prev, vatNumber: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Note</Label>
                    <Textarea
                      placeholder="Additional notes about the company..."
                      value={companyFormData.notes}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelCompany}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCompanyCreated}
                     disabled={!companyFormData.name || !companyFormData.email || !companyFormData.phone}
                  >
                    Create Company
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </DrawerContent>
      </Drawer>
    </Sheet>
  );
}
