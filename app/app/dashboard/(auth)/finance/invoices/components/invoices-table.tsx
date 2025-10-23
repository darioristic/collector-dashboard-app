'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, DollarSign, Calendar, User, FileText, Eye, Download, Send, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableLoader } from '@/components/ui/standard-loader';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  useSendInvoice, 
  usePayInvoice, 
  useCancelInvoice, 
  useDownloadInvoicePDF 
} from '@/hooks/use-invoices';

interface Invoice {
  id: string;
  invoiceNo: string;
  type: string;
  status: string;
  customer?: { name: string };
  total: number;
  currency: string;
  issueDate: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

interface InvoicesTableProps {
  data?: { data: Invoice[]; pagination: any };
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onInvoiceClick: (invoice: Invoice) => void;
}

export function InvoicesTable({
  data,
  isLoading,
  currentPage,
  onPageChange,
  onInvoiceClick,
}: InvoicesTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const sendInvoice = useSendInvoice();
  const payInvoice = usePayInvoice();
  const cancelInvoice = useCancelInvoice();
  const downloadPDF = useDownloadInvoicePDF();

  const getStatusVariant = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'warning' | 'info' | 'success' | 'destructive' | 'outline'> = {
      DRAFT: 'secondary',
      SENT: 'info',
      PAID: 'success',
      OVERDUE: 'warning',
      CANCELLED: 'destructive',
    };
    return variants[status] || 'secondary';
  };

  const getTypeVariant = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'warning' | 'info' | 'success' | 'destructive' | 'outline'> = {
      ISSUED: 'info',
      RECEIVED: 'default',
      CREDIT_NOTE: 'warning',
      PROFORMA: 'secondary',
    };
    return variants[type] || 'outline';
  };

  const handleSend = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await sendInvoice.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Invoice sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invoice',
        variant: 'destructive',
      });
    }
  };

  const handlePay = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await payInvoice.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Invoice marked as paid',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark invoice as paid',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await cancelInvoice.mutateAsync({ id });
      toast({
        title: 'Success',
        description: 'Invoice cancelled successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel invoice',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadPDF = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await downloadPDF.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'PDF downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <TableLoader message="Loading invoices..." />;
  }

  const invoices = data?.data || [];
  const pagination = data?.pagination;

  if (invoices.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">No invoices found</p>
        <p className="text-xs text-muted-foreground">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow
                key={invoice.id}
                onClick={() => onInvoiceClick(invoice)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <span className="font-medium">{invoice.invoiceNo}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-3 text-muted-foreground" />
                    {invoice.customer?.name || (
                      <span className="text-muted-foreground">Unknown</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="size-3 text-muted-foreground" />
                    <span className="font-medium">
                      {invoice.currency} {invoice.total}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getTypeVariant(invoice.type)}>
                    {invoice.type.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-3 text-muted-foreground" />
                    {format(new Date(invoice.issueDate), 'dd.MM.yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-3 text-muted-foreground" />
                    {invoice.dueDate ? format(new Date(invoice.dueDate), 'dd.MM.yyyy') : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/finance/invoices/${invoice.id}`)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="size-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDownloadPDF(invoice.id, e)}
                      disabled={downloadPDF.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <Download className="size-4" />
                    </Button>
                    
                    {invoice.status === 'DRAFT' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleSend(invoice.id, e)}
                          className="h-8 w-8 p-0"
                        >
                          <Send className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleCancel(invoice.id, e)}
                          className="h-8 w-8 p-0"
                        >
                          <XCircle className="size-4" />
                        </Button>
                      </>
                    )}
                    
                    {(invoice.status === 'SENT' || invoice.status === 'OVERDUE') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handlePay(invoice.id, e)}
                        className="h-8 w-8 p-0"
                      >
                        <DollarSign className="size-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total}{' '}
            total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
