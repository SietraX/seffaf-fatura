import React from 'react'
import { CustomCard } from '@/components/ui/custom-card'

export function CardContainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <CustomCard
        title="Total Submissions"
        content={<div className="text-4xl font-bold">2,420</div>}
        footer={<div className="text-sm text-muted-foreground">+20.1% from last month</div>}
      />
      <CustomCard
        title="Average Bill"
        content={<div className="text-4xl font-bold">₺204.32</div>}
        footer={<div className="text-sm text-muted-foreground">+₺24.32 from last month</div>}
      />
      <CustomCard
        title="Lowest Bill"
        content={<div className="text-4xl font-bold">₺89.90</div>}
        footer={<div className="text-sm text-muted-foreground">Türk Telekom - 10GB</div>}
      />
      <CustomCard
        title="Highest Bill"
        content={<div className="text-4xl font-bold">₺359.90</div>}
        footer={<div className="text-sm text-muted-foreground">Turkcell - 50GB</div>}
      />
    </div>
  )
}