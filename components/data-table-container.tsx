"use client"

import React from 'react'
import { useBillData } from '@/contexts/BillDataContext'
import { columns } from "@/components/data-table-columns"
import { DataTable } from "@/components/data-table"

export function DataTableContainer() {
  const { billData, isLoading, error } = useBillData()

  if (isLoading) return <div>Loading table data...</div>
  if (error) return <div>Error loading table data: {error}</div>

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={billData} />
    </div>
  )
}