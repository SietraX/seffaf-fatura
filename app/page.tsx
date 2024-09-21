import { Suspense } from 'react'
import BillChart from '@/components/bill-chart'
import { CardContainer } from '@/components/card-container'
import { ProviderDistributionChart } from '@/components/provider-distribution-chart'
import { BillDataProvider } from '@/contexts/BillDataContext'
import { DataTableContainer } from '@/components/data-table-container'

import { PriceActionChart } from '@/components/price-action-chart'
import { GigabytePackageDistributionChart } from '@/components/gigabyte-package-distribution-chart'
import { SubmitBillContainer } from '@/components/submit-bill-container'
import { FAQ } from '@/components/faq'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <BillDataProvider>
      <main className="container mx-auto px-4 py-8">
        <CardContainer />
        <Suspense fallback={<div>Loading submit bill button...</div>}>
          <SubmitBillContainer />
        </Suspense>
        <Suspense fallback={<div>Loading bill chart...</div>}>
          <BillChart />
        </Suspense>
        <Suspense fallback={<div>Loading distribution charts...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProviderDistributionChart />
            <GigabytePackageDistributionChart />
          </div>
        </Suspense>
        <Suspense fallback={<div>Loading bill data table...</div>}>
          <DataTableContainer />
        </Suspense>
        <Suspense fallback={<div>Loading price action chart...</div>}>
          <div className='pt-4'>
            <PriceActionChart/>
          </div>
        </Suspense>
        <FAQ />
      </main>
      <Footer />
    </BillDataProvider>
  )
}
