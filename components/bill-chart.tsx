'use client' // Add this line to make it a Client Component

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '@clerk/nextjs'

interface ChartData {
  provider_name: string;
  averageBill: number;
}

const colors = {
  'Turkcell': '#ffc658',
  'Vodafone': '#ff8042',
  'Türk Telekom': '#0088fe',
  'Netgsm': '#00c49f'
};

export default function BillChart() {
  const { userId } = useAuth()
  const [data, setData] = useState<ChartData[]>([])
  const [maxBillPrice, setMaxBillPrice] = useState(100)

  useEffect(() => {
    async function fetchData() {
      if (!userId) return

      const response = await fetch('/api/get-bill-data')
      if (response.ok) {
        const billData = await response.json()
        const processedData = processChartData(billData)
        setData(processedData)
        setMaxBillPrice(calculateMaxBillPrice(processedData))
      }
    }

    fetchData()
  }, [userId])

  const processChartData = (rawData: any[]): ChartData[] => {
    const providerTotals: { [key: string]: { sum: number; count: number } } = {}
    
    rawData.forEach(bill => {
      if (!providerTotals[bill.provider_name]) {
        providerTotals[bill.provider_name] = { sum: 0, count: 0 }
      }
      providerTotals[bill.provider_name].sum += bill.bill_price
      providerTotals[bill.provider_name].count++
    })

    return Object.entries(providerTotals).map(([provider, { sum, count }]) => ({
      provider_name: provider,
      averageBill: sum / count
    }))
  }

  const calculateMaxBillPrice = (chartData: ChartData[]): number => {
    return Math.max(...chartData.map(item => item.averageBill), 100)
  }

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
        <Bar 
          dataKey="averageBill"
          fill="#8884d8"
          name="Average Bill"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.provider_name as keyof typeof colors]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}