"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillData } from "@/contexts/BillDataContext"
import { getTimeAgo } from "@/utils/timeAgo"

export const columns: ColumnDef<BillData>[] = [
  {
    accessorKey: "provider_name",
    header: "Provider",
  },
  {
    accessorKey: "gigabyte_package",
    header: "GB Package",
  },
  {
    accessorKey: "voice_call_limit",
    header: "Voice Call Limit",
  },
  {
    accessorKey: "sms_limit",
    header: "SMS Limit",
  },
  {
    accessorKey: "bill_price",
    header: "Bill Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("bill_price"))
      const formatted = new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "contract_start_month",
    header: "Contract Start Month",
    cell: ({ row }) => {
      const month = row.getValue("contract_start_month") as number
      const date = new Date(2000, month - 1, 1)
      return date.toLocaleString('default', { month: 'long' })
    },
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as string
      return getTimeAgo(date)
    },
  },
]