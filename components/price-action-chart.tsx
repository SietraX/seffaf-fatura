"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBillData } from "@/contexts/BillDataContext";
import { median } from "d3-array";

const chartConfig: ChartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const turkishMonths = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

export function PriceActionChart() {
  const { billData, isLoading, error } = useBillData();
  const [selectedGB, setSelectedGB] = useState<string>("");
  const [timeRange, setTimeRange] = useState("6");

  const gbOptions = useMemo(() => {
    const uniqueGBs = Array.from(
      new Set(billData.map((bill) => bill.gigabyte_package))
    ).sort((a, b) => a - b);
    return uniqueGBs.map((gb) => gb.toString());
  }, [billData]);

  const mostSelectedGB = useMemo(() => {
    const gbCounts = billData.reduce((acc, bill) => {
      acc[bill.gigabyte_package] = (acc[bill.gigabyte_package] || 0) + 1;
      return acc as Record<number, number>;
    }, {} as Record<number, number>);

    const entries = Object.entries(gbCounts);
    if (entries.length === 0) return null;

    return entries.reduce((a, b) =>
      gbCounts[Number(a[0])] > gbCounts[Number(b[0])] ? a : b
    )[0];
  }, [billData]);

  useEffect(() => {
    if (mostSelectedGB && !selectedGB) {
      setSelectedGB(mostSelectedGB);
    }
  }, [mostSelectedGB, selectedGB]);

  const timeRanges = [
    { value: "6", label: "Son 6 ay" },
    { value: "12", label: "Son 12 ay" },
  ];

  const filteredData = useMemo(() => {
    if (!selectedGB) return [];

    const now = new Date();
    const timeFilterMonths = parseInt(timeRange);
    const timeFilterMs = timeFilterMonths * 30 * 24 * 60 * 60 * 1000;

    const filteredBills = billData.filter((bill) => {
      const contractDate = new Date(bill.contract_start_date);
      return (
        bill.gigabyte_package.toString() === selectedGB &&
        contractDate.getTime() > now.getTime() - timeFilterMs
      );
    });

    const groupedByMonthAndProvider = filteredBills.reduce((acc, bill) => {
      const date = new Date(bill.contract_start_date);
      const monthYear = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }
      if (!acc[monthYear][bill.provider_name]) {
        acc[monthYear][bill.provider_name] = [];
      }
      acc[monthYear][bill.provider_name].push(bill.bill_price);
      return acc;
    }, {} as Record<string, Record<string, number[]>>);

    const providers = Array.from(
      new Set(filteredBills.map((bill) => bill.provider_name))
    );

    const result = Object.entries(groupedByMonthAndProvider)
      .map(([monthYear, providerData]) => {
        const entry: any = { date: monthYear };
        providers.forEach((provider) => {
          entry[provider] = providerData[provider]
            ? median(providerData[provider])
            : null;
        });
        return entry;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    // Generate all months for the selected time range
    const relevantMonths = Array.from({ length: timeFilterMonths }, (_, i) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - timeFilterMonths + i + 1,
        1
      );
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    });

    // Fill in missing months and ensure all providers have entries
    const filledResult = relevantMonths.map((monthYear) => {
      const existingData = result.find((item) => item.date === monthYear) || {
        date: monthYear,
      };
      return {
        ...existingData,
        ...providers.reduce(
          (acc, provider) => ({
            ...acc,
            [provider]: existingData[provider] ?? null,
          }),
          {}
        ),
      };
    });

    // Fill null values with closest non-null value (forward and backward fill)
    providers.forEach((provider) => {
      let lastNonNullValue: number | null = null;
      for (let i = 0; i < filledResult.length; i++) {
        if (filledResult[i][provider] !== null) {
          lastNonNullValue = filledResult[i][provider];
        } else if (lastNonNullValue !== null) {
          filledResult[i][provider] = lastNonNullValue;
        }
      }
      // Handle case where first values are null (backward fill)
      lastNonNullValue = null;
      for (let i = filledResult.length - 1; i >= 0; i--) {
        if (filledResult[i][provider] !== null) {
          lastNonNullValue = filledResult[i][provider];
        } else if (lastNonNullValue !== null) {
          filledResult[i][provider] = lastNonNullValue;
        }
      }
    });

    return filledResult;
  }, [billData, selectedGB, timeRange]);

  if (isLoading) return <div>Loading price action chart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (billData.length === 0) return <div>No data available</div>;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
        <CardTitle className="text-base">Fiyat Değişim Grafiği</CardTitle>
        <div className="flex space-x-2">
          <Select value={selectedGB} onValueChange={setSelectedGB}>
            <SelectTrigger className="w-[100px]" aria-label="Select GB package">
              <SelectValue placeholder="Select GB" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {gbOptions.map((gb) => (
                <SelectItem key={gb} value={gb}>
                  {gb} GB
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]" aria-label="Select time range">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-0 overflow-hidden max-h-[30vh] pr-12 pl-6 pb-4">
        {filteredData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  {Array.from(
                    new Set(billData.map((bill) => bill.provider_name))
                  ).map((provider, index) => (
                    <linearGradient
                      key={provider}
                      id={`fill${provider}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
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
                    const [year, month] = value.split("-");
                    const monthIndex = parseInt(month) - 1;
                    return `${turkishMonths[monthIndex]} ${year.slice(2)}`;
                  }}
                  interval="preserveEnd"
                  minTickGap={30}
                />
                <YAxis
                  tickFormatter={(value) => `₺${value.toFixed(0)}`}
                  domain={["auto", "auto"]}
                  label={{
                    value: "Fiyat (₺)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const [year, month] = value.split("-");
                        return `${turkishMonths[parseInt(month) - 1]} ${year}`;
                      }}
                      indicator="dot"
                    />
                  }
                />
                {Array.from(
                  new Set(billData.map((bill) => bill.provider_name))
                ).map((provider, index) => (
                  <Area
                    key={provider}
                    type="monotone"
                    dataKey={provider}
                    name={provider}
                    fill={`url(#fill${provider})`}
                    stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                    connectNulls
                  />
                ))}
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No data available for the selected filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
