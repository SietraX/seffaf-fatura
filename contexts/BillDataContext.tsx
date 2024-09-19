"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BillData {
  provider_name: string;
  bill_price: number;
  gigabyte_package: number;
}

interface BillDataContextType {
  billData: BillData[];
  isLoading: boolean;
  error: string | null;
}

const BillDataContext = createContext<BillDataContextType | undefined>(undefined);

export function BillDataProvider({ children }: { children: React.ReactNode }) {
  const [billData, setBillData] = useState<BillData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/get-bill-data');
        if (response.ok) {
          const data: BillData[] = await response.json();
          setBillData(data);
        } else {
          setError('Failed to fetch bill data.');
        }
      } catch (error) {
        setError('An error occurred while fetching bill data.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

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