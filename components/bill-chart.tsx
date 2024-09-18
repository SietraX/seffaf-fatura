'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  provider_name: string;
  averageBill: number;
}

interface BillChartProps {
  data: ChartData[];
  maxBillPrice: number;
}

const colors = {
  'Turkcell': '#ffc658',
  'Vodafone': '#ff8042',
  'Türk Telekom': '#0088fe',
  'Netgsm': '#00c49f'
};

const BillChart: React.FC<BillChartProps> = ({ data, maxBillPrice }) => {
  if (!data || data.length === 0) {
    return <div>No data available for the chart.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
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
          formatter={(value: number) => `${value.toFixed(2)} TL`} 
          labelFormatter={(label) => `Provider: ${label}`}
        />
        <Legend />
        {data.map((entry) => (
          <Bar 
            key={entry.provider_name}
            dataKey="averageBill"
            name={entry.provider_name}
            fill={colors[entry.provider_name as keyof typeof colors]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BillChart;