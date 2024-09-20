"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface BillData {
  provider_name: string;
  gigabyte_package: number;
  voice_call_limit: number;
  sms_limit: number;
  bill_price: number;
  contract_start_month: number;
  contract_start_date: string;
  updated_at: string;
}

interface BillDataContextType {
  billData: BillData[];
  isLoading: boolean;
  error: string | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const BillDataContext = createContext<BillDataContextType | undefined>(undefined);

export function BillDataProvider({ children }: { children: React.ReactNode }) {
  const [billData, setBillData] = useState<BillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();

    const subscription = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_bills'
        },
        (payload) => {
          fetchInitialData(); // Refetch all data when a change occurs
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_bills')
        .select('provider_name, gigabyte_package, voice_call_limit, sms_limit, bill_price, contract_start_month, contract_start_date, updated_at');

      if (error) throw error;

      setBillData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
      setIsLoading(false);
    }
  };

  return (
    <BillDataContext.Provider value={{ billData, isLoading, error }}>
      {children}
    </BillDataContext.Provider>
  );
}

export function useBillData() {
  const context = useContext(BillDataContext);
  if (context === undefined) {
    throw new Error('useBillData must be used within a BillDataProvider');
  }
  return context;
}