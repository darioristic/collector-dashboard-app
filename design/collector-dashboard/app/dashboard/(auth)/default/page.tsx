import { generateMeta } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  SummaryCards,
  AchievementByYear,
  ChartProjectOverview,
  ChartProjectEfficiency,
  TableRecentProjects,
  Reminders,
  SuccessMetrics,
  Reports
} from "@/app/dashboard/(auth)/sales/customer-dashboard/components";

export async function generateMetadata() {
  return generateMeta({
    title: "Customer Analytics Dashboard",
    description:
      "The customer analytics dashboard provides a comprehensive interface for tracking customer interactions, satisfaction metrics, and relationship management to ensure customer success.",
    canonical: "/default"
  });
}

export default function Page() {
  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Customer Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
  
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="activities" disabled>
            Activities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <SummaryCards />
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartProjectOverview />
            </div>
            <SuccessMetrics />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
            <Reminders />
            <AchievementByYear />
            <ChartProjectEfficiency />
          </div>
          <TableRecentProjects />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
        <TabsContent value="activities">...</TabsContent>
      </Tabs>
    </>
  );
}
