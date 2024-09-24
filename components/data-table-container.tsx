'use client'

import React, { useState, useMemo } from "react"
import { useBillData } from "@/contexts/BillDataContext"
import { columns } from "@/components/data-table-columns"
import { DataTable } from "@/components/data-table"
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
import { translateMonthToTurkish } from "@/utils/translateMonth"

export function DataTableContainer() {
  const { billData } = useBillData()
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedGBPackage, setSelectedGBPackage] = useState<number | null>(null)

  const providers = useMemo(
    () => Array.from(new Set(billData.map((bill) => bill.provider_name))),
    [billData]
  );

  const filteredByProvider = useMemo(
    () =>
      selectedProvider
        ? billData.filter((bill) => bill.provider_name === selectedProvider)
        : billData,
    [billData, selectedProvider]
  );

  const gbPackages = useMemo(() => {
    const packages = selectedProvider
      ? Array.from(
          new Set(billData.filter(bill => bill.provider_name === selectedProvider)
            .map((bill) => bill.gigabyte_package))
        )
      : Array.from(new Set(billData.map((bill) => bill.gigabyte_package)));
    return packages.sort((a, b) => a - b);
  }, [billData, selectedProvider]);

  const filteredData = useMemo(
    () =>
      filteredByProvider.filter((bill) =>
        selectedGBPackage ? bill.gigabyte_package === selectedGBPackage : true
      ),
    [filteredByProvider, selectedGBPackage]
  );

  const translatedData = useMemo(() => {
    return filteredData.map(bill => ({
      ...bill,
      contract_start_month_turkish: translateMonthToTurkish(bill.contract_start_month)
    }))
  }, [filteredData])

  const handleProviderChange = (provider: string | null) => {
    setSelectedProvider(provider);
    
    if (provider) {
      // Get GB packages for the selected provider
      const providerGBPackages = Array.from(
        new Set(billData.filter(bill => bill.provider_name === provider)
          .map(bill => bill.gigabyte_package))
      );
      
      // Check if the currently selected GB package is available for the new provider
      if (selectedGBPackage && !providerGBPackages.includes(selectedGBPackage)) {
        setSelectedGBPackage(null);
      }
    }
  };

  return (
    <div>    
      <Card className="w-full h-full">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 flex-shrink-0 p-4">
          <div>
            <CardTitle className="text-xl font-bold">Fatura Detayları</CardTitle>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Select
              value={selectedGBPackage?.toString() ?? "all"}
              onValueChange={(value) =>
                setSelectedGBPackage(value === "all" ? null : Number(value))
              }
            >
              <SelectTrigger className="w-full sm:w-[160px]" aria-label="Select GB package">
                <SelectValue placeholder="Bütün GB Paketleri" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Bütün GB Paketleri</SelectItem>
                {gbPackages.map((gb) => (
                  <SelectItem key={gb} value={gb.toString()}>
                    {gb} GB
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedProvider ?? "all"}
              onValueChange={(value) =>
                handleProviderChange(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[160px]" aria-label="Select provider">
                <SelectValue placeholder="Bütün Operatörler" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Bütün Operatörler</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-4">
          <div className="h-full">
            <DataTable columns={columns} data={translatedData} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}