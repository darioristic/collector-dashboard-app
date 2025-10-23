import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, ArrowRight } from "lucide-react";

export default function DocumentPreviewDemo() {
  const sampleDocuments = [
    {
      id: "inv-001",
      type: "invoice" as const,
      number: "INV-2025-001",
      status: "PAID",
      customer: "T-2 d.o.o.",
      total: 2400.00,
      currency: "EUR",
      date: "2025-01-15"
    },
    {
      id: "off-001", 
      type: "offer" as const,
      number: "OFF-2025-001",
      status: "SENT",
      customer: "Cloud Native LLC",
      total: 1800.00,
      currency: "EUR",
      date: "2025-01-10"
    },
    {
      id: "inv-002",
      type: "invoice" as const,
      number: "INV-2025-002", 
      status: "OVERDUE",
      customer: "Tech Solutions Inc.",
      total: 3200.00,
      currency: "EUR",
      date: "2025-01-05"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { variant: "secondary" as const, label: "Draft" },
      SENT: { variant: "info" as const, label: "Sent" },
      PAID: { variant: "success" as const, label: "Paid" },
      OVERDUE: { variant: "warning" as const, label: "Overdue" },
      CANCELLED: { variant: "destructive" as const, label: "Cancelled" },
      ACCEPTED: { variant: "success" as const, label: "Accepted" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
      EXPIRED: { variant: "warning" as const, label: "Expired" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    
    return (
      <Badge variant={config.variant}>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Document Preview Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Click on any document to view the Swiss-style preview page
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleDocuments.map((doc) => (
            <Card key={doc.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {doc.type === 'invoice' ? 'Invoice' : 'Offer'}
                    </CardTitle>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {doc.number}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Customer
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {doc.customer}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Total Amount
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(doc.total, doc.currency)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Date
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(doc.date).toLocaleDateString('sr-RS')}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Link href={`/dashboard/documents/preview/${doc.id}?type=${doc.type}`}>
                      <Button className="w-full gap-2">
                        <Eye className="h-4 w-4" />
                        View Preview
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Features Implemented
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    ✅ Swiss Design Principles
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Clean, minimal layout with generous whitespace</li>
                    <li>• Grid-based asymmetric design</li>
                    <li>• Neutral gray palette with blue accents</li>
                    <li>• Typography-focused with clear hierarchy</li>
                    <li>• No shadows or gradients</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    ✅ Enterprise Features
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Responsive design for all screen sizes</li>
                    <li>• Print-friendly A4 layout</li>
                    <li>• Dark mode support</li>
                    <li>• Document timeline with event history</li>
                    <li>• QR code integration for payments</li>
                    <li>• Status badges with appropriate colors</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    ✅ B2B Workflow
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Company and customer information display</li>
                    <li>• Line items table with proper formatting</li>
                    <li>• Currency formatting (EUR/RSD)</li>
                    <li>• Payment terms and due dates</li>
                    <li>• Notes section for terms</li>
                    <li>• Quick actions (Edit, Send, Download)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    ✅ Technical Implementation
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Next.js 14 App Router</li>
                    <li>• TypeScript for type safety</li>
                    <li>• Tailwind CSS for styling</li>
                    <li>• shadcn/ui components</li>
                    <li>• React Query for data fetching</li>
                    <li>• Proper error handling and loading states</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
