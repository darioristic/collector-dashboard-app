"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Send, 
  Edit, 
  Mail, 
  Copy, 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  MapPin,
  Phone,
  Mail as MailIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  CreditCard,
  QrCode
} from "lucide-react";
import { DocumentTimeline } from "@/components/ui/document-timeline";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDocumentEvents } from "@/hooks/use-document-events";

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isPrintMode, setIsPrintMode] = useState(false);
  const id = params.id as string;
  
  const { data: offerData, isLoading } = useQuery({
    queryKey: ['offer', id],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${id}?type=offer`);
      if (!response.ok) throw new Error('Failed to fetch offer');
      return response.json();
    },
    enabled: !!id,
  });
  
  const { data: eventsData } = useDocumentEvents(id, 'offer');
  
  const offer = offerData?.data;
  const events = eventsData?.data || [];
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Offer Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested offer could not be found.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: "secondary" as const, icon: Edit, label: "Draft" },
      SENT: { variant: "info" as const, icon: Send, label: "Sent" },
      ACCEPTED: { variant: "success" as const, icon: CheckCircle, label: "Accepted" },
      REJECTED: { variant: "destructive" as const, icon: XCircle, label: "Rejected" },
      EXPIRED: { variant: "warning" as const, icon: Clock, label: "Expired" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy');
  };

  const items = Array.isArray(offer.items) ? offer.items : [];
  const subtotal = offer.subtotal || 0;
  const tax = offer.tax || 0;
  const total = offer.total || 0;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isPrintMode ? 'print-mode' : ''}`}>
      {/* Print Mode Styles */}
      <style jsx global>{`
        @media print {
          .print-mode {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-before: always;
          }
        }
      `}</style>

      {/* Header Actions */}
      <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Offers
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Offer Details
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsPrintMode(!isPrintMode)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              {isPrintMode ? 'Exit Print' : 'Print View'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Send className="h-4 w-4" />
              Send
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Document Content */}
          <div className="lg:col-span-2">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8">
                {/* Document Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {offer.company?.name || 'Company Name'}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {offer.company?.address || 'Company Address'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          OFFER
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {offer.offerNo}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(offer.createdAt)}
                      </p>
                      <div className="mt-2">
                        {getStatusBadge(offer.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parties Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Issuer */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                      From
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {offer.company?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {offer.company?.address}
                        </span>
                      </div>
                      {offer.company?.email && (
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {offer.company.email}
                          </span>
                        </div>
                      )}
                      {offer.company?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {offer.company.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                      To
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {offer.customer?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {offer.customer?.address}
                        </span>
                      </div>
                      {offer.customer?.email && (
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {offer.customer.email}
                          </span>
                        </div>
                      )}
                      {offer.customer?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {offer.customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="mb-8" />

                {/* Line Items Table */}
                <div className="mb-8">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Item</TableHead>
                        <TableHead className="w-[15%] text-right">Quantity</TableHead>
                        <TableHead className="w-[15%] text-right">Unit Price</TableHead>
                        <TableHead className="w-[15%] text-right">Tax</TableHead>
                        <TableHead className="w-[15%] text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.name || item.description || 'Item'}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity || 1}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unitPrice || item.price || 0, offer.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency((item.unitPrice || item.price || 0) * (item.tax || 0) / 100, offer.currency)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency((item.unitPrice || item.price || 0) * (item.quantity || 1), offer.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatCurrency(subtotal, offer.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatCurrency(tax, offer.currency)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatCurrency(total, offer.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {offer.notes && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                      Notes
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {offer.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Valid Until */}
                {offer.validUntil && (
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wide">
                      Offer Validity
                    </h3>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Valid until: {formatDate(offer.validUntil)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <QrCode className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Scan QR code for offer details
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          or visit offer portal
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Copy className="h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email Client
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Timeline Sidebar */}
          <div className="lg:col-span-1">
            <DocumentTimeline 
              events={events.length > 0 ? events : [
                {
                  id: '1',
                  timestamp: offer.createdAt,
                  action: 'Created',
                  user: 'Dario Ristić',
                  details: 'Offer created'
                },
                ...(offer.status === 'SENT' ? [{
                  id: '2',
                  timestamp: offer.updatedAt,
                  action: 'Sent to client',
                  user: 'System',
                  details: `Sent to ${offer.customer?.name}`
                }] : []),
                ...(offer.status === 'ACCEPTED' ? [{
                  id: '3',
                  timestamp: offer.updatedAt,
                  action: 'Accepted by client',
                  user: offer.customer?.name || 'Client',
                  details: `Offer accepted for ${formatCurrency(offer.total, offer.currency)}`
                }] : []),
              ]}
              documentType="offer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
