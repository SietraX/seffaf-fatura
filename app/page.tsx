import { Suspense } from 'react'
import BillChart from '@/components/bill-chart'
import { SubmitBillButton } from '@/components/submit-bill-button'
import { CardContainer } from '@/components/card-container'
import ProviderDistributionChart from '@/components/provider-distribution-chart'
import { BillDataProvider } from '@/contexts/BillDataContext'
import { DataTableContainer } from '@/components/data-table-container'
import { PriceActionChart } from '@/components/price-action-chart'
import { GigabytePackageDistributionChart } from '@/components/gigabyte-package-distribution-chart'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BillDataProvider>
        <CardContainer />
        <Suspense fallback={<div>Loading bill chart...</div>}>
          <BillChart />
        </Suspense>
        <Suspense fallback={<div>Loading provider distribution chart...</div>}>
          <ProviderDistributionChart />
          <GigabytePackageDistributionChart />
        </Suspense>
        <Suspense fallback={<div>Loading bill data table...</div>}>
          <DataTableContainer />
        </Suspense>
        <Suspense fallback={<div>Loading price action chart...</div>}>
          <PriceActionChart />
        </Suspense>
        <Suspense fallback={<div>Loading submit bill button...</div>}>
          <SubmitBillButton />
        </Suspense>
      </BillDataProvider>
    </main>
  )
}
