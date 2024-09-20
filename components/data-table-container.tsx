"use client"

import React from 'react'
import { useBillData } from '@/contexts/BillDataContext'
import { columns } from "@/components/data-table-columns"
import { DataTable } from "@/components/data-table"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"

export function DataTableContainer() {
  const { billData } = useBillData()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedGBPackage, setSelectedGBPackage] = useState<number | null>(null)

  const providers = useMemo(() => Array.from(new Set(billData.map(bill => bill.provider_name))), [billData])

  const filteredByProvider = useMemo(() => 
    selectedProvider ? billData.filter(bill => bill.provider_name === selectedProvider) : billData,
    [billData, selectedProvider]
  )

  const gbPackages = useMemo(() => {
    const packages = selectedProvider
      ? Array.from(new Set(filteredByProvider.map(bill => bill.gigabyte_package)))
      : Array.from(new Set(billData.map(bill => bill.gigabyte_package)));
    return packages.sort((a, b) => a - b);
  }, [billData, filteredByProvider, selectedProvider])

  const filteredData = useMemo(() => 
    filteredByProvider.filter(bill => 
      selectedGBPackage ? bill.gigabyte_package === selectedGBPackage : true
    ),
    [filteredByProvider, selectedGBPackage]
  )

  const handleProviderChange = (provider: string | null) => {
    setSelectedProvider(provider)
    setSelectedGBPackage(null)  // Reset GB package selection when provider changes
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex space-x-2 mb-2">
          <Button
            variant={selectedProvider === null ? "default" : "outline"}
            onClick={() => handleProviderChange(null)}
          >
            All Providers
          </Button>
          {providers.map(provider => (
            <Button
              key={provider}
              variant={selectedProvider === provider ? "default" : "outline"}
              onClick={() => handleProviderChange(provider)}
            >
              {provider}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button
            variant={selectedGBPackage === null ? "default" : "outline"}
            onClick={() => setSelectedGBPackage(null)}
          >
            All GB Packages
          </Button>
          {gbPackages.map(gb => (
            <Button
              key={gb}
              variant={selectedGBPackage === gb ? "default" : "outline"}
              onClick={() => setSelectedGBPackage(gb)}
            >
              {gb} GB
            </Button>
          ))}
        </div>
      </div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}