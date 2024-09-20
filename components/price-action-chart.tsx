"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBillData } from '@/contexts/BillDataContext'

const chartConfig: ChartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PriceActionChart() {
  const { billData, isLoading, error } = useBillData()
  const [selectedGB, setSelectedGB] = useState<string>('')
  const [timeRange, setTimeRange] = useState('all')

  const gbOptions = useMemo(() => {
    const uniqueGBs = Array.from(new Set(billData.map(bill => bill.gigabyte_package))).sort((a, b) => a - b)
    return uniqueGBs.map(gb => gb.toString())
  }, [billData])

  const mostSelectedGB = useMemo(() => {
    const gbCounts = billData.reduce((acc, bill) => {
      acc[bill.gigabyte_package] = (acc[bill.gigabyte_package] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    const entries = Object.entries(gbCounts)
    if (entries.length === 0) return null

    return entries.reduce((a, b) => 
      gbCounts[Number(a[0])] > gbCounts[Number(b[0])] ? a : b
    )[0]
  }, [billData])

  useEffect(() => {
    if (mostSelectedGB && !selectedGB) {
      setSelectedGB(mostSelectedGB)
    }
  }, [mostSelectedGB, selectedGB])

  const timeRanges = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' },
    { value: 'all', label: 'All time' },
  ]

  const filteredData = useMemo(() => {
    if (!selectedGB) return []

    const now = new Date()
    const timeFilter = timeRange === 'all' ? 0 : parseInt(timeRange) * 24 * 60 * 60 * 1000
    const filteredBills = billData.filter(bill => 
      bill.gigabyte_package.toString() === selectedGB &&
      (timeRange === 'all' || new Date(bill.updated_at).getTime() > now.getTime() - timeFilter)
    )

    return filteredBills.map(bill => ({
      date: new Date(bill.updated_at).toISOString().split('T')[0],
      price: bill.bill_price,
      provider: bill.provider_name,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [billData, selectedGB, timeRange])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (billData.length === 0) return <div>No data available</div>

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
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timeRanges.map(range => (
              <SelectItem key={range.value} value={range.value} className="rounded-lg">
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  {Array.from(new Set(filteredData.map(item => item.provider))).map((provider, index) => (
                    <linearGradient key={provider} id={`fill${provider}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={`hsl(${index * 137.5 % 360}, 70%, 50%)`}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={`hsl(${index * 137.5 % 360}, 70%, 50%)`}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis
                  tickFormatter={(value) => `₺${value}`}
                  domain={['auto', 'auto']}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                {Array.from(new Set(filteredData.map(item => item.provider))).map((provider, index) => (
                  <Area
                    key={provider}
                    type="monotone"
                    dataKey="price"
                    name={provider as string}
                    data={filteredData.filter(item => item.provider === provider)}
                    fill={`url(#fill${provider})`}
                    stroke={`hsl(${index * 137.5 % 360}, 70%, 50%)`}
                  />
                ))}
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div>No data available for the selected filters</div>
        )}
      </CardContent>
    </Card>
  )
}