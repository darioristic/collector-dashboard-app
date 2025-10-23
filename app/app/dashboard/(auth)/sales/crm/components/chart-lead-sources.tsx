"use client";

import * as React from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

const chartData = [
  { source: "Website", leads: 450, fill: "var(--chart-1)" },
  { source: "Social Media", leads: 320, fill: "var(--chart-2)" },
  { source: "Email Campaign", leads: 280, fill: "var(--chart-3)" },
  { source: "Referrals", leads: 180, fill: "var(--chart-4)" },
  { source: "Direct", leads: 150, fill: "var(--chart-5)" }
];

const chartConfig = {
  Website: {
    label: "Website",
    color: "var(--chart-1)"
  },
  "Social Media": {
    label: "Social Media", 
    color: "var(--chart-2)"
  },
  "Email Campaign": {
    label: "Email Campaign",
    color: "var(--chart-3)"
  },
  Referrals: {
    label: "Referrals",
    color: "var(--chart-4)"
  },
  Direct: {
    label: "Direct",
    color: "var(--chart-5)"
  }
} satisfies ChartConfig;

type ChartConfigKeys = keyof typeof chartConfig;

export function ChartLeadSources() {
  const totalLeads = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.leads, 0);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Sources</CardTitle>
        <CardDescription>Distribution of leads by source</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie 
              data={chartData} 
              dataKey="leads" 
              nameKey="source" 
              innerRadius={60} 
              strokeWidth={5}
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground font-display text-2xl"
              >
                {totalLeads.toLocaleString()}
              </text>
              <text
                x="50%"
                y="50%"
                dy={24}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm"
              >
                Total Leads
              </text>
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.source} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm text-muted-foreground">
                {item.source}: {item.leads}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
