'use client'

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BillData {
  provider_name: string;
  bill_price: number;
  gigabyte_package: number;
}

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

const gbPackages = [10, 15, 20, 25, 30, 40, 50];
const providers = ['Turkcell', 'Vodafone', 'Türk Telekom', 'Netgsm'];

export default function BillChart() {
  const [rawData, setRawData] = useState<BillData[]>([]);
  const [data, setData] = useState<ChartData[]>([]);
  const [selectedGB, setSelectedGB] = useState<number>(10);
  const [maxBillPrice, setMaxBillPrice] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/get-bill-data');
        if (response.ok) {
          const billData: BillData[] = await response.json();
          setRawData(billData);
          processChartData(billData, selectedGB);
        } else {
          console.error('Error fetching data:', await response.text());
          setError('Failed to fetch data. Please try again later.');
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    processChartData(rawData, selectedGB);
  }, [selectedGB, rawData]);

  const processChartData = (rawData: BillData[], selectedGB: number) => {
    const filteredData = rawData.filter(item => item.gigabyte_package === selectedGB);
    
    const providerTotals: Record<string, { billSum: number; count: number }> = {};
    
    filteredData.forEach(bill => {
      if (!providerTotals[bill.provider_name]) {
        providerTotals[bill.provider_name] = { billSum: 0, count: 0 };
      }
      providerTotals[bill.provider_name].billSum += bill.bill_price;
      providerTotals[bill.provider_name].count++;
    });

    const result = providers.map(provider => ({
      provider_name: provider,
      averageBill: providerTotals[provider] ? providerTotals[provider].billSum / providerTotals[provider].count : 0,
    }));

    setData(result);
    setMaxBillPrice(calculateMax(result, 'averageBill'));
  };

  const calculateMax = (chartData: ChartData[], key: keyof ChartData): number => {
    const max = Math.max(...chartData.map(item => Number(item[key])), 100);
    return max;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available for the chart.</div>;
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
                formatter={(value: number) => [`${value.toFixed(2)} TL`, 'Average Bill']}
                labelFormatter={(label) => `Provider: ${label}`}
              />
              <Legend />
              <Bar dataKey="averageBill" fill="#8884d8" name="Average Bill">
                {data.map((entry, index) => (
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