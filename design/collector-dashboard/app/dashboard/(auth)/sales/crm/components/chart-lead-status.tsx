"use client";

import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
  { status: "New", count: 120, fill: "var(--chart-1)" },
  { status: "Contacted", count: 85, fill: "var(--chart-2)" },
  { status: "Qualified", count: 65, fill: "var(--chart-3)" },
  { status: "Proposal", count: 45, fill: "var(--chart-4)" },
  { status: "Negotiation", count: 30, fill: "var(--chart-5)" },
  { status: "Closed Won", count: 25, fill: "var(--chart-6)" },
  { status: "Closed Lost", count: 15, fill: "var(--chart-7)" }
];

const chartConfig = {
  New: {
    label: "New",
    color: "var(--chart-1)"
  },
  Contacted: {
    label: "Contacted",
    color: "var(--chart-2)"
  },
  Qualified: {
    label: "Qualified",
    color: "var(--chart-3)"
  },
  Proposal: {
    label: "Proposal",
    color: "var(--chart-4)"
  },
  Negotiation: {
    label: "Negotiation",
    color: "var(--chart-5)"
  },
  "Closed Won": {
    label: "Closed Won",
    color: "var(--chart-6)"
  },
  "Closed Lost": {
    label: "Closed Lost",
    color: "var(--chart-7)"
  }
} satisfies ChartConfig;

type ChartConfigKeys = keyof typeof chartConfig;

export function ChartLeadStatus() {
  const totalLeads = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Status</CardTitle>
        <CardDescription>Current status of all leads</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3]">
          <BarChart data={chartData}>
            <XAxis 
              dataKey="status" 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="count" 
              fill="var(--chart-1)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold">{totalLeads}</div>
          <div className="text-sm text-muted-foreground">Total Leads</div>
        </div>
      </CardContent>
    </Card>
  );
}
