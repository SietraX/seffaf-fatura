"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useBillData } from "@/contexts/BillDataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

    const providerTotals: Record<string, { billSum: number; count: number }> =
      {};

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Ortalama Tarife Ücretleri</CardTitle>
        <div className="flex space-x-1">
          {gbPackages.map((gb) => (
            <Button
              key={gb}
              variant={selectedGB === gb ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGB(gb)}
            >
              {gb}GB
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="provider_name" />
            <YAxis
              domain={[0, maxBillPrice]}
              tickFormatter={(value) => `${value.toFixed(0)} TL`}
            />
            <Tooltip
              formatter={(value: number) => [
                `${value.toFixed(2)} TL`,
                "Average Bill",
              ]}
              labelFormatter={(label) => `Provider: ${label}`}
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
