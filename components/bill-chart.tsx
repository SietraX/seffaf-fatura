"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useBillData } from "@/contexts/BillDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const colors = {
  Turkcell: "#ffc658",
  Vodafone: "#ff8042",
  "Türk Telekom": "#0088fe",
  Netgsm: "#00c49f",
};

const gbPackages = [10, 15, 20, 25, 30, 40, 50];

export default function BillChart() {
  const { billData, isLoading, error } = useBillData();
  const [selectedGB, setSelectedGB] = useState<number>(10);

  const processedData = useMemo(() => {
    if (!billData.length) return [];

    const filteredData = billData.filter(
      (item) => item.gigabyte_package === selectedGB
    );

    const providerTotals: Record<string, { billSum: number; count: number }> = {};

    filteredData.forEach((bill) => {
      if (!providerTotals[bill.provider_name]) {
        providerTotals[bill.provider_name] = { billSum: 0, count: 0 };
      }
      providerTotals[bill.provider_name].billSum += bill.bill_price;
      providerTotals[bill.provider_name].count++;
    });

    const result = Object.entries(providerTotals).map(([provider, data]) => ({
      provider_name: provider,
      averageBill: data.count > 0 ? data.billSum / data.count : 0,
    }));

    return result;
  }, [billData, selectedGB]);

  const maxBillPrice = useMemo(() => {
    return Math.max(...processedData.map((item) => item.averageBill), 100);
  }, [processedData]);

  if (isLoading) {
    return <div>Loading bill chart...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
        <CardTitle className="text-base">Ortalama Tarife Ücretleri</CardTitle>
        <Select value={selectedGB.toString()} onValueChange={(value) => setSelectedGB(Number(value))}>
          <SelectTrigger className="w-[100px]" aria-label="Select GB package">
            <SelectValue placeholder="Select GB" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {gbPackages.map((gb) => (
              <SelectItem key={gb} value={gb.toString()}>
                {gb} GB
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-0 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{
              top: 20,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="provider_name" tick={{ fontSize: 10 }} />
            <YAxis
              domain={[0, maxBillPrice]}
              tickFormatter={(value) => `${value.toFixed(0)} TL`}
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toFixed(2)} TL`,
                "Ortalama Ücret",
              ]}
              labelFormatter={(label) => `Operatör: ${label}`}
            />
            <Bar dataKey="averageBill" fill="#8884d8" name="Average Bill">
              {processedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[entry.provider_name as keyof typeof colors]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
