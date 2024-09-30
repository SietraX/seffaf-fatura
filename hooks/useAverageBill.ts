import { useBillData } from '@/contexts/BillDataContext'
import { useMemo } from 'react'

export function useAverageBill() {
  const { billData, isLoading, error } = useBillData()

  const averageBill = useMemo(() => {
    if (isLoading || error || billData.length === 0) {
      return null
    }

    const totalBill = billData.reduce((sum, bill) => sum + bill.bill_price, 0)
    return Math.round(totalBill / billData.length)
  }, [billData, isLoading, error])

  return { averageBill, isLoading, error }
}