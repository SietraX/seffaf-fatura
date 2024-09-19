'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ChartData {
  provider_name: string;
  averageBill: number;
  averageGigabytes: number;
}

const colors = {
  'Turkcell': '#ffc658',
  'Vodafone': '#ff8042',
  'Türk Telekom': '#0088fe',
  'Netgsm': '#00c49f'
};

export default function BillChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [maxBillPrice, setMaxBillPrice] = useState(100)
  const [maxGigabytes, setMaxGigabytes] = useState(100)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/get-bill-data')
        console.log('API response status:', response.status);
        if (response.ok) {
          const billData = await response.json()
          console.log('Received bill data:', billData);
          const processedData = processChartData(billData)
          console.log('Processed chart data:', processedData);
          setData(processedData)
          setMaxBillPrice(calculateMax(processedData, 'averageBill'))
          setMaxGigabytes(calculateMax(processedData, 'averageGigabytes'))
        } else {
          console.error('Error fetching data:', await response.text());
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    }

    fetchData()
  }, [])

  const processChartData = (rawData: any[]): ChartData[] => {
    console.log('Processing raw data:', rawData);
    const providerTotals: { [key: string]: { billSum: number; gigabyteSum: number; count: number } } = {}
    
    rawData.forEach(bill => {
      if (!providerTotals[bill.provider_name]) {
        providerTotals[bill.provider_name] = { billSum: 0, gigabyteSum: 0, count: 0 }
      }
      providerTotals[bill.provider_name].billSum += bill.bill_price
      providerTotals[bill.provider_name].gigabyteSum += bill.gigabyte_package
      providerTotals[bill.provider_name].count++
    })

    const result = Object.entries(providerTotals).map(([provider, { billSum, gigabyteSum, count }]) => ({
      provider_name: provider,
      averageBill: billSum / count,
      averageGigabytes: gigabyteSum / count
    }))
    console.log('Processed chart data:', result);
    return result;
  }

  const calculateMax = (chartData: ChartData[], key: keyof ChartData): number => {
    const max = Math.max(...chartData.map(item => Number(item[key])), 100);
    console.log(`Calculated max ${key}:`, max);
    return max;
  }

  console.log('Rendering chart with data:', data);

  if (!data || data.length === 0) {
    console.log('No data available for the chart');
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
        <YAxis yAxisId="left" 
          label={{ value: 'Average Bill (TL)', angle: -90, position: 'insideLeft' }}
          domain={[0, maxBillPrice]}
          tickFormatter={(value) => `${value.toFixed(0)} TL`}
        />
        <YAxis yAxisId="right" orientation="right"
          label={{ value: 'Average Gigabytes', angle: 90, position: 'insideRight' }}
          domain={[0, maxGigabytes]}
          tickFormatter={(value) => `${value.toFixed(0)} GB`}
        />
        <Tooltip 
          formatter={(value: number, name: string) => [
            name === 'averageBill' ? `${value.toFixed(2)} TL` : `${value.toFixed(2)} GB`,
            name === 'averageBill' ? 'Average Bill' : 'Average Gigabytes'
          ]}
          labelFormatter={(label) => `Provider: ${label}`}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="averageBill" fill="#8884d8" name="Average Bill">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[entry.provider_name as keyof typeof colors]} />
          ))}
        </Bar>
        <Bar yAxisId="right" dataKey="averageGigabytes" fill="#82ca9d" name="Average Gigabytes" />
      </BarChart>
    </ResponsiveContainer>
  );
}