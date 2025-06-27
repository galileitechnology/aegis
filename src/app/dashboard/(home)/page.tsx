"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from '@/components/ui/chart'

const chartData = [
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
  { up: 1 },
]

const chartConfig = {
  up: {
    label: "Desktop",
    color: "#46C001",
  },
  down: {
    label: "Desktop",
    color: "#ff0000",
  },
} satisfies ChartConfig

export default function Page() {
  return (
    <ChartContainer config={chartConfig} className=" relative h-[200px] w-[800px] bg-[#5200ff] p-5">
      <BarChart accessibilityLayer data={chartData}>
        <XAxis
          dataKey="time"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Bar dataKey="up" fill="var(--color-up)" />
        <Bar dataKey="down" fill="var(--color-down)" />
      </BarChart>
    </ChartContainer>
  )
}