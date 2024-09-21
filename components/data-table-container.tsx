"use client"

import React, { useState, useMemo } from 'react'
import { useBillData } from '@/contexts/BillDataContext'
import { columns } from "@/components/data-table-columns"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    setSelectedGBPackage(null)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="text-2xl font-bold">Bill Data</CardTitle>
          <CardDescription>
            View and filter mobile plan bills
          </CardDescription>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Select 
            value={selectedGBPackage?.toString() ?? "all"} 
            onValueChange={(value) => setSelectedGBPackage(value === "all" ? null : Number(value))}
          >
            <SelectTrigger className="w-[160px] rounded-md" aria-label="Select GB package">
              <SelectValue placeholder="All GB Packages" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="all">All GB Packages</SelectItem>
              {gbPackages.map(gb => (
                <SelectItem key={gb} value={gb.toString()}>{gb} GB</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedProvider ?? "all"} onValueChange={(value) => handleProviderChange(value === "all" ? null : value)}>
            <SelectTrigger className="w-[160px] rounded-md" aria-label="Select provider">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider} value={provider}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filteredData} />
      </CardContent>
    </Card>
  )
}