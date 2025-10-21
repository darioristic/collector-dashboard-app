import Link from "next/link";
import {
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  EditIcon,
  Package,
  Pencil,
  Printer,
  Truck,
  Cpu,
  Database,
  Zap,
  Building2,
  Settings,
  Gpu,
  Save,
  Share2,
  Shield,
  ShieldCheck,
  Activity,
  Headphones
} from "lucide-react";
import { generateMeta } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type VPSStatus = "active" | "suspended" | "maintenance" | "offline";

interface VPSService {
  id: number;
  date: string;
  status: VPSStatus;
  customer: {
    name: string;
    email: string;
    company: string;
  };
  specs: {
    id: number;
    name: string;
    value: string;
    unit?: string;
  }[];
  price: string;
  type: string;
  icon: string;
  product_name: string;
}

// Function to get icon component based on icon name
const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Cpu,
    Database,
    Zap,
    Building2,
    Settings,
    Gpu,
    Save,
    Share2,
    Shield,
    ShieldCheck,
    Activity,
    Headphones
  };
  
  const IconComponent = iconMap[iconName || ''] || Cpu;
  return <IconComponent className="h-6 w-6 text-muted-foreground" />;
};

export async function generateMetadata() {
  return generateMeta({
    title: "VPS Service Detail",
    description:
      "View and manage your VPS service details. Access comprehensive VPS information, specifications, and management options.",
    canonical: "/pages/orders/vps"
  });
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock data - in real app this would come from API
  const vpsService: VPSService = {
    id: parseInt(id),
    date: "Dec 15, 2024",
    status: "active",
    customer: {
      name: "TechStart Inc.",
      email: "admin@techstart.com",
      company: "TechStart Inc."
    },
    specs: [
      { id: 1, name: "CPU Cores", value: "4", unit: "cores" },
      { id: 2, name: "RAM", value: "8", unit: "GB" },
      { id: 3, name: "Storage", value: "100", unit: "GB SSD" },
      { id: 4, name: "Bandwidth", value: "1000", unit: "GB" },
      { id: 5, name: "Operating System", value: "Ubuntu 22.04 LTS" },
      { id: 6, name: "Location", value: "Frankfurt, Germany" }
    ],
    price: "$9.99",
    type: "VPS Plan",
    icon: "Cpu",
    product_name: "Basic VPS - Ubuntu 22.04"
  };

  const statusSteps: Record<VPSStatus, string> = {
    active: "Active",
    suspended: "Suspended",
    maintenance: "Maintenance",
    offline: "Offline"
  };

  const currentStep = statusSteps[vpsService.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/pages/orders">
            <ChevronLeft className="h-4 w-4" />
            Back to VPS Services
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-2xl font-bold tracking-tight">VPS Service #{vpsService.id}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* VPS Service Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted">
                {getIconComponent(vpsService.icon)}
              </div>
              <div>
                <div className="text-lg font-semibold">{vpsService.product_name}</div>
                <div className="text-sm text-muted-foreground">{vpsService.type}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Status</div>
                <Badge variant={vpsService.status === "active" ? "default" : "secondary"}>
                  {currentStep}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Monthly Price</div>
                <div className="text-lg font-semibold">{vpsService.price}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Deployed Date</div>
              <div>{vpsService.date}</div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Company</div>
              <div className="font-semibold">{vpsService.customer.company}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Contact Person</div>
              <div className="font-semibold">{vpsService.customer.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Email</div>
              <div className="text-muted-foreground">{vpsService.customer.email}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VPS Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>VPS Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Specification</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vpsService.specs.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell className="font-medium">{spec.name}</TableCell>
                  <TableCell>
                    {spec.value} {spec.unit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button>
          <EditIcon className="mr-2 h-4 w-4" />
          Edit VPS
        </Button>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Details
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
