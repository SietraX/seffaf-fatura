import React from 'react'
import { SubmitBillButton } from '@/components/submit-bill-button'

export function SubmitBillContainer() {
  return (
    <div className="text-center my-12">
      <h2 className="text-3xl font-bold mb-4">Empower Others with Your Bill Data!</h2>
      <p className="mb-6">Click here to share your bill and help create transparency in mobile pricing:</p>
      <SubmitBillButton />
    </div>
  )
}