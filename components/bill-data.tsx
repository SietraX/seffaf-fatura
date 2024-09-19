'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

interface BillData {
  provider_name: string;
  bill_price: number;
  gigabyte_package: number;
}

export default function BillData() {
  const { userId } = useAuth()
  const [data, setData] = useState<BillData[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!userId) return

      const response = await fetch('/api/get-bill-data')
      if (response.ok) {
        const billData = await response.json()
        setData(billData)
      }
    }

    fetchData()
  }, [userId])

  return (
    <div>
      {data.map((bill, index) => (
        <div key={index}>
          <p>Provider: {bill.provider_name}</p>
          <p>Price: {bill.bill_price}</p>
          <p>Data: {bill.gigabyte_package}GB</p>
        </div>
      ))}
    </div>
  )
}