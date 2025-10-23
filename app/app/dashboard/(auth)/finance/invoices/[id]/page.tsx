"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Bell,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Download,
  ChevronUp,
  ChevronDown,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useInvoice } from "@/hooks/use-invoices";

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isActivityExpanded, setIsActivityExpanded] = useState(true);
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [internalNote, setInternalNote] = useState("");
  const id = params.id as string;
  
  const { data: invoiceData, isLoading } = useInvoice(id);
  
  const invoice = invoiceData?.data;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested invoice could not be found.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string = 'RSD') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      SENT: 'bg-blue-100 text-blue-800',
      PAID: 'bg-green-100 text-green-800',
      OVERDUE: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  const invoiceLink = `https://app.midday.ai/i/eyJhbGciOiJIUzI1N...`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Invoices
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            {/* Top Header Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white text-sm font-bold">C</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">Comtrade System Integration</h1>
                  </div>
                </div>
                <Badge className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status === 'SENT' ? 'Unpaid' : invoice.status}
                </Badge>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  RSD {formatCurrency(invoice.total)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Remind
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due date</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Issue date</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Invoice no.</span>
                  <span className="text-sm font-medium text-gray-900">{invoice.invoiceNo}</span>
                </div>
              </div>
            </div>

            {/* Invoice Link Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900">Invoice link</div>
                <div className="flex items-center gap-2">
                  <Input 
                    value={invoiceLink} 
                    readOnly 
                    className="flex-1 bg-gray-50 border-gray-200"
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
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Activity</span>
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
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm text-gray-900">Created</span>
                    <span className="text-sm text-gray-500 ml-auto">{formatDate(invoice.createdAt)}, 17:27</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 border-2 border-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-900">Paid</span>
                  </div>
                </div>
              )}
            </div>

            {/* Internal Note Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Internal note</span>
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
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
