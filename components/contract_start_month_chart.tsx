"use client"

import React, { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useBillData } from '@/contexts/BillDataContext'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#FF6663'];

interface MonthlyData {
  month: string;
  monthIndex: number;
  [key: string]: string | number; // Allow any string key with number value
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow-md text-xs">
        <p className="font-bold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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
      <CardHeader className="flex-shrink-0 py-2">
        <CardTitle className="text-sm sm:text-base">Sözleşme Başlangıç Tarihi</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pr-2 pl-2">
        <div className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[200px]"> {/* Responsive height */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                wrapperStyle={{ zIndex: 100 }}
              />
              {providers.map((provider, index) => (
                <Bar 
                  key={provider} 
                  dataKey={provider} 
                  stackId="a" 
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
