"use client"

import React, { useMemo } from 'react'
import { CustomCard } from '@/components/ui/custom-card'
import { useBillData } from '@/contexts/BillDataContext'
import ProviderDistributionChart from '@/components/provider-distribution-chart'

export function CardContainer() {
  const { billData, isLoading, error } = useBillData()

  const stats = useMemo(() => {
    if (!billData.length) return { total: 0, last30Days: 0, last24Hours: 0, prev30Days: 0, prevDay: 0 }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

    return billData.reduce((acc, bill) => {
      const billDate = new Date(bill.updated_at)
      acc.total++
      if (billDate >= thirtyDaysAgo) acc.last30Days++
      if (billDate >= sixtyDaysAgo && billDate < thirtyDaysAgo) acc.prev30Days++
      if (billDate >= oneDayAgo) acc.last24Hours++
      if (billDate >= twoDaysAgo && billDate < oneDayAgo) acc.prevDay++
      return acc
    }, { total: 0, last30Days: 0, last24Hours: 0, prev30Days: 0, prevDay: 0 })
  }, [billData])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const percentChange30Days = stats.prev30Days === 0 
    ? stats.last30Days > 0 ? 100 : 0
    : ((stats.last30Days - stats.prev30Days) / stats.prev30Days * 100).toFixed(1)
  const percentChange24Hours = stats.prevDay === 0
    ? stats.last24Hours > 0 ? 100 : 0
    : ((stats.last24Hours - stats.prevDay) / stats.prevDay * 100).toFixed(1)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <CustomCard
        title="Total Submissions"
        content={<div className="text-4xl font-bold">{stats.total}</div>}
        footer={<div className="text-sm text-muted-foreground">All time submissions</div>}
      />
      <CustomCard
        title="Submissions Last 30 Days"
        content={<div className="text-4xl font-bold">{stats.last30Days}</div>}
        footer={
          <div className={`text-sm ${Number(percentChange30Days) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentChange30Days}% from previous month
          </div>
        }
      />
      <CustomCard
        title="Submissions Last 24 Hours"
        content={<div className="text-4xl font-bold">{stats.last24Hours}</div>}
        footer={
          <div className={`text-sm ${Number(percentChange24Hours) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentChange24Hours}% from previous day
          </div>
        }
      />
      <CustomCard
        title="Provider Distribution"
        content={<ProviderDistributionChart />}
      />
    </div>
  )
}