"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
    { value: "6", label: "Last 6 months" },
    { value: "12", label: "Last 12 months" },
  ];

  const filteredData = useMemo(() => {
    if (!selectedGB) return [];

    const now = new Date();
    const timeFilter = parseInt(timeRange) * 30 * 24 * 60 * 60 * 1000; // Convert months to milliseconds

    const filteredBills = billData.filter((bill) => {
      const contractDate = new Date(bill.contract_start_date);
      const isSelected =
        bill.gigabyte_package.toString() === selectedGB &&
        contractDate.getTime() > now.getTime() - timeFilter;

      return isSelected;
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

    // Fill in gaps with previous median values and handle null values
    const filledResult = result.reduce((acc, curr, index) => {
      if (index === 0) {
        acc.push(curr);
        return acc;
      }

      const prevDate = new Date(acc[acc.length - 1].date);
      const currDate = new Date(curr.date);
      const monthDiff =
        (currDate.getFullYear() - prevDate.getFullYear()) * 12 +
        currDate.getMonth() -
        prevDate.getMonth();

      // Fill in missing months
      for (let i = 1; i < monthDiff; i++) {
        const fillerDate = new Date(
          prevDate.getFullYear(),
          prevDate.getMonth() + i,
          1
        );
        const fillerEntry = {
          date: `${fillerDate.getFullYear()}-${String(
            fillerDate.getMonth() + 1
          ).padStart(2, "0")}`,
          ...acc[acc.length - 1],
        };
        delete fillerEntry.date;
        acc.push(fillerEntry);
      }

      // Add current month data
      acc.push(curr);

      return acc;
    }, [] as any[]);

    // Fill null values with closest non-null value
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (billData.length === 0) return <div>No data available</div>;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Price Action Chart</CardTitle>
          <CardDescription>
            Showing median price per month for selected GB package across
            providers
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
            {gbOptions.map((gb) => (
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
            {timeRanges.map((range) => (
              <SelectItem
                key={range.value}
                value={range.value}
                className="rounded-lg"
              >
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
            <AreaChart data={filteredData} width={686} height={400}>
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
                  return `${new Date(
                    parseInt(year),
                    parseInt(month) - 1
                  ).toLocaleString("default", { month: "short" })} ${year}`;
                }}
                interval="preserveEnd"
                minTickGap={30}
              />
              <YAxis
                tickFormatter={(value) => `₺${value.toFixed(2)}`}
                domain={["auto", "auto"]}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return new Date(
                        parseInt(year),
                        parseInt(month) - 1
                      ).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      });
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
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div>No data available for the selected filters</div>
        )}
      </CardContent>
    </Card>
  );
}
