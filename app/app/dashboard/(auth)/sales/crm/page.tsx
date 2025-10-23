import { generateMeta } from "@/lib/utils";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  SummaryCards,
  ChartLeadSources,
  ChartLeadStatus,
  TableRecentLeads,
  TableTopPerformingAgents,
  TableLeadConversion,
  TableLeadActivities
} from "@/app/dashboard/(auth)/sales/crm/components";

export async function generateMetadata() {
  return generateMeta({
    title: "CRM Dashboard",
    description:
      "The CRM dashboard template provides a comprehensive interface for managing customer relationships, tracking leads, and monitoring sales performance to drive business growth.",
    canonical: "/sales/crm"
  });
}

export default function Page() {
  return (
    <>
      <div className="mb-4 flex flex-row items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">CRM Dashboard</h1>
        <div className="flex items-center space-x-2">
  
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="z-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="performance" disabled>
            Performance
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <SummaryCards />
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartLeadSources />
            </div>
            <ChartLeadStatus />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
            <TableRecentLeads />
            <TableTopPerformingAgents />
            <TableLeadConversion />
            <TableLeadActivities />
          </div>
        </TabsContent>
        <TabsContent value="leads">
          <TableRecentLeads />
        </TabsContent>
        <TabsContent value="performance">...</TabsContent>
      </Tabs>
    </>
  );
}
