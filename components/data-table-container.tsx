"use client"

import React from 'react'
import { useBillData } from '@/contexts/BillDataContext'
import { columns } from "@/components/data-table-columns"
import { DataTable } from "@/components/data-table"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DataTableContainer() {
  const { billData } = useBillData()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const providers = Array.from(new Set(billData.map(bill => bill.provider_name)))

  const filteredData = selectedProvider
    ? billData.filter(bill => bill.provider_name === selectedProvider)
    : billData

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        <Button
          variant={selectedProvider === null ? "default" : "outline"}
          onClick={() => setSelectedProvider(null)}
        >
          All Providers
        </Button>
        {providers.map(provider => (
          <Button
            key={provider}
            variant={selectedProvider === provider ? "default" : "outline"}
            onClick={() => setSelectedProvider(provider)}
          >
            {provider}
          </Button>
        ))}
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}