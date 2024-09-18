import { createSupabaseClient } from '@/lib/supabase'
import BillChart from '@/components/bill-chart'
import { auth } from '@clerk/nextjs/server'

interface BillData {
  provider_name: string;
  bill_price: number;
}

export default async function HomePage() {
  try {
    const { userId } = auth();
    const isAuthenticated = !!userId;
    console.log('User authenticated:', isAuthenticated);

    const supabase = await createSupabaseClient(!isAuthenticated);
    const { data, error } = await supabase
      .from('user_bills')
      .select('provider_name, bill_price')
      .order('provider_name');

    if (error) {
      console.error('Error fetching data:', error);
      return <div>Error loading data: {error.message}</div>;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Fatura
        </h1>
        {data && data.length > 0 ? (
          <BillChart data={processChartData(data)} />
        ) : (
          <p>No bill data available yet. Be the first to contribute!</p>
        )}
        {!isAuthenticated && (
          <p className="mt-4 text-gray-600">
            Sign in to submit your own bill information.
          </p>
        )}
        {/* Other components */}
      </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return <div>An unexpected error occurred: {(error as Error).message}</div>;
  }
}

function processChartData(data: BillData[]) {
  const averageBills = data.reduce((acc: Record<string, { total: number; count: number }>, curr) => {
    if (!acc[curr.provider_name]) {
      acc[curr.provider_name] = { total: 0, count: 0 };
    }
    acc[curr.provider_name].total += curr.bill_price;
    acc[curr.provider_name].count++;
    return acc;
  }, {});

  return Object.entries(averageBills).map(([provider_name, { total, count }]) => ({
    provider_name,
    averageBill: total / count
  }));
}
