"use client"

import React, { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useBillData } from '@/contexts/BillDataContext'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#FF6663'];

interface MonthlyData {
  month: string;
  monthIndex: number;
  [key: string]: string | number; // Allow any string key with number value
}

export function ContractStartMonthChart() {
  const { billData, isLoading, error } = useBillData();

  const chartData = useMemo(() => {
    if (!billData.length) return [];

    const monthlyData: MonthlyData[] = Array(12).fill(0).map((_, index) => ({
      month: new Date(0, index).toLocaleString('default', { month: 'short' }),
      monthIndex: index + 1,
    }));

    const providerSet = new Set(billData.map(bill => bill.provider_name));
    const providers = Array.from(providerSet);

    // Initialize provider counts
    providers.forEach(provider => {
      monthlyData.forEach(data => {
        data[provider] = 0;
      });
    });

    billData.forEach(bill => {
      const monthIndex = bill.contract_start_month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex][bill.provider_name] = (monthlyData[monthIndex][bill.provider_name] as number) + 1;
      }
    });

    return monthlyData.sort((a, b) => a.monthIndex - b.monthIndex);
  }, [billData]);

  if (isLoading) return <div>Loading contract start month distribution...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!chartData.length) return <div>No contract start month data available.</div>;

  const providers = Object.keys(chartData[0]).filter(key => key !== 'month' && key !== 'monthIndex');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Contract Start Month Distribution</CardTitle>
        <CardDescription>Number of contracts starting each month by provider</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {providers.map((provider, index) => (
              <Bar key={provider} dataKey={provider} stackId="a" fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
