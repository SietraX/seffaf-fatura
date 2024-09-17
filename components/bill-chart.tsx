'use client'

import { useState } from 'react'
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

interface BillData {
  provider: string;
  [key: string]: number | string;
}

interface BillChartProps {
  data: BillData[];
}

const chartOptions = [
  { key: 'averageBill', label: 'Ortalama Fatura' },
  { key: 'internetUsage', label: 'İnternet Kullanımı' },
  { key: 'callMinutes', label: 'Arama Dakikaları' },
]

const chartConfig: ChartConfig = {
  averageBill: {
    label: "Ortalama Fatura",
    color: "hsl(var(--chart-1))",
  },
  internetUsage: {
    label: "İnternet Kullanımı",
    color: "hsl(var(--chart-2))",
  },
  callMinutes: {
    label: "Arama Dakikaları",
    color: "hsl(var(--chart-3))",
  },
}

export default function BillChart({ data }: BillChartProps) {
  const [activeOption, setActiveOption] = useState(chartOptions[0].key)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sağlayıcıya Göre Karşılaştırma</CardTitle>
        <CardDescription>Mobil Hizmet Sağlayıcıları - {new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2">
            {chartOptions.map((option) => (
              <Button
                key={option.key}
                onClick={() => setActiveOption(option.key)}
                variant={activeOption === option.key ? "default" : "outline"}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex-grow">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="provider"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey={activeOption} fill={`var(--color-${activeOption})`} radius={8}>
                    <LabelList
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trend: Yükseliş %5.2 <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Son 6 ayın verilerine göre karşılaştırma
        </div>
      </CardFooter>
    </Card>
  )
}