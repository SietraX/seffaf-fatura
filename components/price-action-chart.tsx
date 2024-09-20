"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useBillData } from "@/contexts/BillDataContext"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  price: {
    label: "Price",
  },
  Turkcell: {
    label: "Turkcell",
    color: "hsl(var(--chart-1))",
  },
  Vodafone: {
    label: "Vodafone",
    color: "hsl(var(--chart-2))",
  },
  "Türk Telekom": {
    label: "Türk Telekom",
    color: "hsl(var(--chart-3))",
  },
  Netgsm: {
    label: "Netgsm",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function PriceActionChart() {
  const { billData } = useBillData()
  const [selectedGB, setSelectedGB] = React.useState("")

  const gbOptions = Array.from(new Set(billData.map(bill => bill.gigabyte_package.toString())))

  const chartData = React.useMemo(() => {
    if (!selectedGB) return []

    const startDate = new Date(billData[0].contract_start_month)
    const monthsData = []

    for (let i = 0; i < 24; i++) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
      const monthData = {
        date: currentDate.toISOString().slice(0, 7),
        Turkcell: 0,
        Vodafone: 0,
        "Türk Telekom": 0,
        Netgsm: 0,
      }

      billData.forEach(bill => {
        if (bill.gigabyte_package.toString() === selectedGB) {
          monthData[bill.provider_name] = bill.bill_price
        }
      })

      monthsData.push(monthData)
    }

    return monthsData
  }, [billData, selectedGB])

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Price Action Chart</CardTitle>
          <CardDescription>
            Showing price history for selected GB package across providers
          </CardDescription>
        </div>
        <Select value={selectedGB} onValueChange={setSelectedGB}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select GB package"
          >
            <SelectValue placeholder="Select GB" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {gbOptions.map(gb => (
              <SelectItem key={gb} value={gb} className="rounded-lg">
                {gb} GB
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `₺${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              type="monotone"
              dataKey="Turkcell"
              stroke={chartConfig.Turkcell.color}
              fill={chartConfig.Turkcell.color}
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="Vodafone"
              stroke={chartConfig.Vodafone.color}
              fill={chartConfig.Vodafone.color}
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="Türk Telekom"
              stroke={chartConfig["Türk Telekom"].color}
              fill={chartConfig["Türk Telekom"].color}
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="Netgsm"
              stroke={chartConfig.Netgsm.color}
              fill={chartConfig.Netgsm.color}
              fillOpacity={0.1}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}