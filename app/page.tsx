'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import BillChart from '@/components/bill-chart'
import { useAuth } from '@clerk/nextjs'
import { SubmitBillButton } from '@/components/submit-bill-button'

// Remove this import
// import { Navbar } from '@/components/navbar'

import { XAxis, YAxis } from 'recharts';
XAxis.defaultProps = { ...XAxis.defaultProps, allowDuplicatedCategory: false };
YAxis.defaultProps = { ...YAxis.defaultProps, allowDecimals: false };

interface BillData {
  provider_name: string;
  bill_price: number;
  gigabyte_package: number;
}

const gbPackages = [10, 15, 20, 25, 30, 40, 50];
const providers = ['Turkcell', 'Vodafone', 'Türk Telekom', 'Netgsm'];

export default function HomePage() {
  const [data, setData] = useState<BillData[]>([]);
  const [selectedGB, setSelectedGB] = useState<number>(10); // Default to 10GB
  const [error, setError] = useState<string | null>(null);
  const [maxBillPrice, setMaxBillPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from('user_bills')
          .select('provider_name, bill_price, gigabyte_package')
          .order('provider_name');

        if (error) {
          throw new Error(error.message);
        }

        const validatedData = (data || []).filter((item): item is BillData => 
          typeof item.provider_name === 'string' &&
          typeof item.bill_price === 'number' &&
          typeof item.gigabyte_package === 'number'
        );

        setData(validatedData);
        
        const max = Math.max(...validatedData.map(item => item.bill_price));
        setMaxBillPrice(max);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processedData = processChartData(data, selectedGB);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Fatura
      </h1>
      <div className="flex mb-4">
        <div className="mr-4">
          <h2 className="text-lg font-semibold mb-2">Select GB Package:</h2>
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
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : processedData.length > 0 ? (
            <BillChart data={processedData} maxBillPrice={maxBillPrice} />
          ) : (
            <p>No data available for the selected GB package.</p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <SubmitBillButton />
      </div>
      {!isSignedIn && (
        <p className="mt-4 text-gray-600">
          Sign in to submit your own bill information.
        </p>
      )}
    </div>
  );
}

function processChartData(data: BillData[], selectedGB: number) {
  const filteredData = data.filter(item => item.gigabyte_package === selectedGB);
  
  const averageBills = filteredData.reduce((acc: Record<string, { total: number; count: number }>, curr) => {
    if (!acc[curr.provider_name]) {
      acc[curr.provider_name] = { total: 0, count: 0 };
    }
    acc[curr.provider_name].total += curr.bill_price;
    acc[curr.provider_name].count++;
    return acc;
  }, {});

  return providers.map(provider => ({
    provider_name: provider,
    averageBill: averageBills[provider] ? averageBills[provider].total / averageBills[provider].count : 0
  }));
}
