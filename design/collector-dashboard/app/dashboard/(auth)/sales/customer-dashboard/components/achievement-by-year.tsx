"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

export function AchievementByYear() {
  return (
    <Card className="xl:col-span-1">
      <CardHeader>
        <CardTitle>Customer Growth by Year</CardTitle>
        <CardDescription>
          You acquired more customers per month on average this year than last year.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid auto-rows-min gap-2">
          <div className="flex items-baseline gap-1 text-2xl leading-none font-semibold tabular-nums">
            2,847
            <span className="text-muted-foreground text-xs font-normal">customers</span>
          </div>
          <ChartContainer
            config={{
              steps: {
                label: "Steps",
                color: "var(--chart-1)"
              }
            }}
            className="aspect-auto h-[32px] w-full">
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
              }}
              data={[
                {
                  date: "2024",
                  steps: 2847
                }
              ]}>
              <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={32}>
                <LabelList
                  position="insideLeft"
                  dataKey="date"
                  offset={8}
                  fontSize={12}
                  fill="var(--primary-foreground)"
                />
              </Bar>
              <YAxis dataKey="date" type="category" tickCount={1} hide />
              <XAxis dataKey="steps" type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="grid auto-rows-min gap-2">
          <div className="flex items-baseline gap-1 text-2xl leading-none font-semibold tabular-nums">
            2,156
            <span className="text-muted-foreground text-xs font-normal">customers</span>
          </div>
          <ChartContainer
            config={{
              steps: {
                label: "Steps",
                color: "var(--chart-2)"
              }
            }}
            className="aspect-auto h-[32px] w-full">
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
              }}
              data={[
                {
                  date: "2023",
                  steps: 2156
                }
              ]}>
              <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={32}>
                <LabelList
                  position="insideLeft"
                  dataKey="date"
                  offset={8}
                  fontSize={12}
                  fill="var(--primary-foreground)"
                />
              </Bar>
              <YAxis dataKey="date" type="category" tickCount={1} hide />
              <XAxis dataKey="steps" type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="grid auto-rows-min gap-2">
          <div className="flex items-baseline gap-1 text-2xl leading-none font-semibold tabular-nums">
            1,892
            <span className="text-muted-foreground text-xs font-normal">customers</span>
          </div>
          <ChartContainer
            config={{
              steps: {
                label: "Steps",
                color: "var(--chart-3)"
              }
            }}
            className="aspect-auto h-[32px] w-full">
            <BarChart
              accessibilityLayer
              layout="vertical"
              margin={{
                left: 0,
                top: 0,
                right: 0,
                bottom: 0
              }}
              data={[
                {
                  date: "2022",
                  steps: 1892
                }
              ]}>
              <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={32}>
                <LabelList
                  position="insideLeft"
                  dataKey="date"
                  offset={8}
                  fontSize={12}
                  fill="var(--primary-foreground)"
                />
              </Bar>
              <YAxis dataKey="date" type="category" tickCount={1} hide />
              <XAxis dataKey="steps" type="number" hide />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
