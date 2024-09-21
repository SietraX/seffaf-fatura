'use client'

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useBillData } from '@/contexts/BillDataContext';

const colors = {
  'Turkcell': '#ffc658',
  'Vodafone': '#ff8042',
  'Türk Telekom': '#0088fe',
  'Netgsm': '#00c49f'
};

const gbPackages = [10, 15, 20, 25, 30, 40, 50];

export default function BillChart() {
  const { billData, isLoading, error } = useBillData();
  const [selectedGB, setSelectedGB] = useState<number>(10);

  const processedData = useMemo(() => {
    if (!billData.length) return [];

    const filteredData = billData.filter(item => item.gigabyte_package === selectedGB);
    
    const providerTotals: Record<string, { billSum: number; count: number }> = {};
    
    filteredData.forEach(bill => {
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
    return Math.max(...processedData.map(item => item.averageBill), 100);
  }, [processedData]);

  const gbOptions = useMemo(() => {
    const options = Array.from(new Set(billData.map(bill => bill.gigabyte_package))).sort((a, b) => a - b);
    return options;
  }, [billData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Mobile Bill Comparison</h2>
      <div className="flex mb-4">
        <div className="mr-4">
          <h3 className="text-lg font-semibold mb-2">Select GB Package:</h3>
          <div className="flex flex-col space-y-2">
            {gbPackages.map((gb) => (
              <button
                key={gb}
                onClick={() => setSelectedGB(gb)}
                className={`px-4 py-2 rounded ${
                  selectedGB === gb ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {gb} GB
              </button>
            ))}
          </div>
        </div>
        <div className="w-full max-w-3xl">
          <ResponsiveContainer width="100%" height={400}>
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
                label={{ value: 'Average Bill (TL)', angle: -90, position: 'insideLeft' }}
                domain={[0, maxBillPrice]}
                tickFormatter={(value) => `${value.toFixed(0)} TL`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} TL`, 'Average Bill']}
                labelFormatter={(label) => `Provider: ${label}`}
              />
              <Legend />
              <Bar dataKey="averageBill" fill="#8884d8" name="Average Bill">
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.provider_name as keyof typeof colors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}