import { Suspense } from 'react'
import BillChart from '@/components/bill-chart'
import { SubmitBillButton } from '@/components/submit-bill-button'
import { CardContainer } from '@/components/card-container'
import ProviderDistributionChart from '@/components/provider-distribution-chart'
import { BillDataProvider } from '@/contexts/BillDataContext'
import { columns } from "@/components/data-table-columns"
import { DataTable } from "@/components/data-table"
import { useBillData } from '@/contexts/BillDataContext'

function BillDataTable() {
  const { billData, isLoading, error } = useBillData()

  if (isLoading) return <div>Loading table data...</div>
  if (error) return <div>Error loading table data: {error}</div>

  return <DataTable columns={columns} data={billData} />
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BillDataProvider>
        <CardContainer />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Suspense fallback={<div>Loading bill chart...</div>}>
            <BillChart />
          </Suspense>
          <Suspense fallback={<div>Loading provider distribution...</div>}>
            <ProviderDistributionChart />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading bill data table...</div>}>
          <BillDataTable />
        </Suspense>
      </BillDataProvider>
      <SubmitBillButton />
    </main>
  )
}
