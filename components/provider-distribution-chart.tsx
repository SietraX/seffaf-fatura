'use client'

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useBillData } from '@/contexts/BillDataContext';

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042'];
// const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042'];

export default function ProviderDistributionChart() {
  const { billData, isLoading, error } = useBillData();

  const processedData = useMemo(() => {
    if (!billData.length) return [];

    const providerCounts: Record<string, number> = {};
    billData.forEach(bill => {
      providerCounts[bill.provider_name] = (providerCounts[bill.provider_name] || 0) + 1;
    });

    return Object.entries(providerCounts).map(([provider_name, count]) => ({
      name: provider_name,
      value: count,
    }));
  }, [billData]);

  if (isLoading) {
    return <div>Loading provider distribution...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!processedData.length) {
    return <div>No provider distribution data available.</div>;
  }

  const total = processedData.reduce((sum, item) => sum + item.value, 0);  // Change this line

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Provider Distribution</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"  // Change this line
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} (${((value as number / total) * 100).toFixed(2)}%)`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}