import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ApplicationType } from "@/types/ApplicationType"

export const description = "A bar chart"

const chartConfig = {
  application: {
    label: "Dossiers",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function ChartBarDefault({data, title}: {data?: ApplicationType[], title?: string}) {
    const chartData = data ? data.map(application => ({
        month: new Date(application.createdAt).toLocaleString("default", { month: "long" }),
        application: 1,
    })) : []

    //group chartData by month and sum application values
    const groupedData = chartData.reduce((acc, curr) => {
        const existing = acc.find(item => item.month === curr.month);
        if (existing) {
            existing.application += curr.application;
        } else {
            acc.push(curr);
        }
        return acc;
    }, [] as { month: string, application: number }[])
  
    return (
    <Card className="md:w-100 w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 h-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={groupedData} >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="application" fill="var(--chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        
        <div className="leading-none text-muted-foreground">
          Nouveaux dossiers par mois
        </div>
      </CardFooter>
    </Card>
  )
}
