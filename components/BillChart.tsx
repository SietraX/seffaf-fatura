'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BillChartProps {
  data: Array<{ provider: string; averageBill: number }>
}

export default function BillChart({ data }: BillChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="provider" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="averageBill" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}