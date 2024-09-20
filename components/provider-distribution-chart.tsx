'use client'

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useBillData } from '@/contexts/BillDataContext';

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042'];

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

  const total = processedData.reduce((sum, item) => sum + item.value, 0);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} (${((value as number / total) * 100).toFixed(2)}%)`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}