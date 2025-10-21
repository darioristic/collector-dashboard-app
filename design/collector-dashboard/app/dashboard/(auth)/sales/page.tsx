import { generateMeta } from "@/lib/utils";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BalanceCard,
  TaxCard,
  IncomeCard,
  ExpenseCard,
  BestSellingProducts,
  TableOrderStatus,
  RevenueChart
} from "@/app/dashboard/(auth)/sales/components";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export async function generateMetadata() {
  return generateMeta({
    title: "Sales & CRM Dashboard",
    description:
      "A comprehensive sales and CRM dashboard for managing sales data, customer relationships, and customer analytics. Built with shadcn/ui, Tailwind CSS, Next.js.",
    canonical: "/sales"
  });
}

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Sales & CRM Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="grow">
    
          </div>
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="z-10">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="crm">CRM</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="gap-4 space-y-4 md:grid md:grid-cols-2 lg:space-y-0 xl:grid-cols-8">
            <div className="md:col-span-4">
              <RevenueChart />
            </div>
            <div className="md:col-span-4">
              <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <BalanceCard />
                <IncomeCard />
                <ExpenseCard />
                <TaxCard />
              </div>
            </div>
          </div>
          <div className="gap-4 space-y-4 lg:space-y-0 xl:grid xl:grid-cols-3">
            <div className="xl:col-span-1">
              <BestSellingProducts />
            </div>
            <div className="xl:col-span-2">
              <TableOrderStatus />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Total Leads</span>
              </div>
              <div className="mt-2 text-2xl font-bold">1,234</div>
              <div className="text-xs text-muted-foreground">+12% from last month</div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Active Deals</span>
              </div>
              <div className="mt-2 text-2xl font-bold">89</div>
              <div className="text-xs text-muted-foreground">+5% from last month</div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              <div className="mt-2 text-2xl font-bold">23.4%</div>
              <div className="text-xs text-muted-foreground">+2.1% from last month</div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              <div className="mt-2 text-2xl font-bold">$45.2K</div>
              <div className="text-xs text-muted-foreground">+18% from last month</div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold">Recent Activities</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">New lead added: John Doe</span>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">Deal closed: Project Alpha</span>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm">Follow-up scheduled: Sarah Smith</span>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold">Pipeline Overview</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Qualified</span>
                  <span className="text-sm font-medium">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Proposal</span>
                  <span className="text-sm font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Negotiation</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Closed Won</span>
                  <span className="text-sm font-medium">8</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Total Customers</span>
              </div>
              <div className="mt-2 text-2xl font-bold">2,847</div>
              <div className="text-xs text-muted-foreground">+8% from last month</div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">New Customers</span>
              </div>
              <div className="mt-2 text-2xl font-bold">156</div>
              <div className="text-xs text-muted-foreground">+12% from last month</div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">Customer Satisfaction</span>
              </div>
              <div className="mt-2 text-2xl font-bold">4.8/5</div>
              <div className="text-xs text-muted-foreground">+0.2 from last month</div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-sm font-medium">Retention Rate</span>
              </div>
              <div className="mt-2 text-2xl font-bold">94.2%</div>
              <div className="text-xs text-muted-foreground">+1.5% from last month</div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold">Top Customers</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enterprise Corp</span>
                  <span className="text-sm font-medium">$125K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tech Solutions</span>
                  <span className="text-sm font-medium">$89K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Global Industries</span>
                  <span className="text-sm font-medium">$67K</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-semibold">Customer Growth</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Q1 2024</span>
                  <span className="text-sm font-medium">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Q2 2024</span>
                  <span className="text-sm font-medium">+22%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Q3 2024</span>
                  <span className="text-sm font-medium">+18%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
