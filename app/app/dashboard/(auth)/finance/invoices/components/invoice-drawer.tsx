'use client';

import { format } from 'date-fns';
import { X, Bell, MoreHorizontal, ExternalLink, Copy, Download, ChevronUp, ChevronDown, Edit, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { useDocumentEvents } from '@/hooks/use-document-events';
import { usePayInvoice, useInvoice, useMarkAsUnpaid } from '@/hooks/use-invoices';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoiceNo: string;
  type: string;
  status: string;
  company?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  customer?: { 
    name: string;
    email?: string;
    phone?: string;
    company?: { name: string };
  };
  total: number;
  currency: string;
  issueDate: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
  description?: string;
}

interface InvoiceDrawerProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceDrawer({ invoice, isOpen, onClose }: InvoiceDrawerProps) {
  const [isActivityExpanded, setIsActivityExpanded] = useState(true);
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [internalNote, setInternalNote] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isHoveringPaid, setIsHoveringPaid] = useState(false);
  
  // Fetch fresh invoice data to ensure we have the latest status and paidAt
  const { data: freshInvoiceData } = useInvoice(invoice.id);
  const freshInvoice = freshInvoiceData?.data || invoice;
  
  // Fetch real events from the database
  const { data: eventsData } = useDocumentEvents(invoice.id, 'invoice');
  const events = eventsData?.data || [];
  
  // Invoice actions
  const payInvoice = usePayInvoice();
  const markAsUnpaid = useMarkAsUnpaid();
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      SENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  const invoiceLink = `${window.location.origin}/dashboard/finance/invoices/${freshInvoice.id}`;

  const handleMarkAsPaid = async (paidAt?: Date) => {
    try {
      await payInvoice.mutateAsync({ id: freshInvoice.id, paidAt });
      toast({
        title: 'Success',
        description: 'Invoice marked as paid successfully',
      });
      setIsDatePickerOpen(false);
      setSelectedDate(undefined);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as paid',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsUnpaid = async () => {
    try {
      await markAsUnpaid.mutateAsync(freshInvoice.id);
      toast({
        title: 'Success',
        description: 'Invoice marked as unpaid successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as unpaid',
        variant: 'destructive',
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      handleMarkAsPaid(date);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[420px] sm:w-[525px] sm:max-w-[525px] p-0 [&>button]:hidden mt-[15px] mb-[15px] h-[calc(100vh-30px)] bg-white dark:bg-[#1A1818] border-gray-200 dark:border-gray-800 border">
        <SheetTitle className="sr-only">Invoice Details</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {freshInvoice.company?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {freshInvoice.company?.name || 'Company Name'}
                  </h1>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="size-4" />
              </Button>
            </div>

            {/* Status Badge */}
            <div className="flex justify-end mb-4">
              <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(freshInvoice.status)}`}>
                {freshInvoice.status === 'SENT' ? 'Unpaid' : freshInvoice.status}
              </Badge>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {freshInvoice.currency} {formatCurrency(freshInvoice.total)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Remind
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              {freshInvoice.status === 'PAID' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200"
                  onMouseEnter={() => setIsHoveringPaid(true)}
                  onMouseLeave={() => setIsHoveringPaid(false)}
                  onClick={handleMarkAsUnpaid}
                  disabled={markAsUnpaid.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  {isHoveringPaid ? 'Mark as unpaid' : 'Paid'}
                </Button>
              ) : (
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      disabled={payInvoice.isPending}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark as paid
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Invoice Details */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Due date</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{freshInvoice.dueDate ? formatDate(freshInvoice.dueDate) : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Issue date</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(freshInvoice.issueDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Invoice no.</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{freshInvoice.invoiceNo}</span>
                </div>
              </div>
            </div>

            {/* Invoice Link Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Invoice link</div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={invoiceLink} 
                    readOnly 
                    className="flex-1 bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                  />
                  <Button variant="outline" size="sm" className="p-2">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Activity Section */}
            <div className="relative p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Activity</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={() => setIsActivityExpanded(!isActivityExpanded)}
                  >
                    {isActivityExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {isActivityExpanded && (
                <div className="relative space-y-4">
                  {/* Continuous Timeline Line */}
                  <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
                  
                  {events.length > 0 ? (
                    events.map((event: any, index: number) => (
                      <div key={event.id} className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-6 h-6 z-10">
                          <div className={`w-2 h-2 rounded-full ${
                            event.action === 'Created' ? 'bg-gray-400' :
                            event.action === 'Payment received' ? 'bg-green-400' :
                            event.action === 'Sent to client' ? 'bg-blue-400' :
                            'bg-gray-300'
                          }`}></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{event.action}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                          {format(new Date(event.timestamp), 'dd.MM, HH:mm')}
                        </span>
                      </div>
                    ))
                  ) : (
                    // Fallback to basic events if no events from API
                    <>
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-6 h-6 z-10">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">Created</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                          {format(new Date(freshInvoice.createdAt), 'dd.MM, HH:mm')}
                        </span>
                      </div>
                      {freshInvoice.status === 'PAID' && freshInvoice.paidAt && (
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center w-6 h-6 z-10">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">Paid</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
                            {format(new Date(freshInvoice.paidAt), 'dd.MM, HH:mm')}
                          </span>
                        </div>
                      )}
                      {freshInvoice.status !== 'PAID' && (
                        <div className="flex items-center gap-3">
                          <div className="relative flex items-center justify-center w-6 h-6 z-10">
                            <div className="w-2 h-2 border-2 border-gray-300 rounded-full"></div>
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">Paid</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Internal Note Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Internal note</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1"
                    onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                  >
                    {isNoteExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {isNoteExpanded && (
                <div className="space-y-3">
                  <Input 
                    placeholder="Add internal note..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
