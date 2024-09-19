import { Suspense } from 'react'
import BillChart from '@/components/bill-chart'
import { SubmitBillButton } from '@/components/submit-bill-button'
import { CardContainer } from '@/components/card-container'
import ProviderDistributionChart from '@/components/provider-distribution-chart'
import { BillDataProvider } from '@/contexts/BillDataContext'
import { DataTableContainer } from '@/components/data-table-container'

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
          <DataTableContainer />
        </Suspense>
      </BillDataProvider>
      <SubmitBillButton />
    </main>
  )
}
