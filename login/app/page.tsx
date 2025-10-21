import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Midday Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="grow">
            {/* Future: Date picker or filters */}
          </div>
          <Button>
            <Download />
            <span className="hidden lg:inline">Download</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <div className="h-2 w-2 rounded-full bg-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="gap-4 space-y-4 md:grid md:grid-cols-2 lg:space-y-0 xl:grid-cols-8">
            <div className="md:col-span-4">
              <Card>
        <CardHeader>
                  <CardTitle>Revenue Chart</CardTitle>
                  <CardDescription>Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Chart placeholder - Revenue data visualization
                  </div>
                </CardContent>
              </Card>
              </div>
            
            <div className="md:col-span-4">
              <div className="col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="space-y-1">
                    <CardDescription>Total Balance</CardDescription>
                    <div className="font-display text-2xl lg:text-3xl">$103,045</div>
                    <div className="flex items-center text-xs">
                      <span className="font-medium text-green-500">+3.6%</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="space-y-1">
                    <CardDescription>Total Income</CardDescription>
                    <div className="font-display text-2xl lg:text-3xl">$78,000</div>
                    <div className="flex items-center text-xs">
                      <span className="font-medium text-green-500">+2.5%</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="space-y-1">
                    <CardDescription>Total Expenses</CardDescription>
                    <div className="font-display text-2xl lg:text-3xl">$25,045</div>
                    <div className="flex items-center text-xs">
                      <span className="font-medium text-red-500">+1.2%</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                  </CardHeader>
                </Card>
                
                <Card>
                  <CardHeader className="space-y-1">
                    <CardDescription>Tax Amount</CardDescription>
                    <div className="font-display text-2xl lg:text-3xl">$8,500</div>
                    <div className="flex items-center text-xs">
                      <span className="font-medium text-blue-500">+0.8%</span>
                      <span className="text-muted-foreground ml-1">from last month</span>
            </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="gap-4 space-y-4 lg:space-y-0 xl:grid xl:grid-cols-3">
            <div className="xl:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Product A</span>
                      <span className="text-sm font-medium">$12,345</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Product B</span>
                      <span className="text-sm font-medium">$8,901</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Product C</span>
                      <span className="text-sm font-medium">$5,678</span>
                    </div>
              </div>
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest order status updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Order #1234</span>
                      <span className="text-sm font-medium text-green-500">Completed</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Order #1235</span>
                      <span className="text-sm font-medium text-blue-500">Processing</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Order #1236</span>
                      <span className="text-sm font-medium text-yellow-500">Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <div className="h-2 w-2 rounded-full bg-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45.2K</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
                <CardDescription>Sales pipeline status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                <div className="h-2 w-2 rounded-full bg-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <div className="h-2 w-2 rounded-full bg-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+1.5% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Highest value customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>Quarterly growth metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
        </CardContent>
        </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
  );
}