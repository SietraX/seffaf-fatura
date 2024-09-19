'use client' // Add this line to make it a Client Component

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '@clerk/nextjs'

interface BillData {
  provider_name: string;
  bill_price: number;
  gigabyte_package: number;
}

export default function BillChart() {
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

  const maxBillPrice = data.length > 0 ? Math.max(...data.map(bill => bill.bill_price)) : 100

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="provider_name" />
        <YAxis domain={[0, maxBillPrice]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="bill_price" fill="#8884d8" />
        <Bar dataKey="gigabyte_package" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}