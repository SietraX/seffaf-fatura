import { Suspense } from 'react'
import BillChart from '@/components/bill-chart'
import { SubmitBillButton } from '@/components/submit-bill-button'

export default function Home() {
  return (
    <main>
      <h1>Home Page</h1>
      <SubmitBillButton />
      <Suspense fallback={<div>Loading chart...</div>}>
        <BillChart />
      </Suspense>
    </main>
  )
}
