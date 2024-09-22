"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillData } from "@/contexts/BillDataContext"
import { getTimeAgo } from "@/utils/timeAgo"

export const columns: ColumnDef<BillData>[] = [
  {
    accessorKey: "provider_name",
    header: "Operatör",
    sortingFn: (rowA, rowB, columnId) => {
      return (rowA.getValue(columnId) as string).localeCompare(rowB.getValue(columnId) as string);
    },
  },
  {
    accessorKey: "gigabyte_package",
    header: "GB",
    sortingFn: (rowA, rowB, columnId) => {
      return (rowA.getValue(columnId) as number) - (rowB.getValue(columnId) as number);
    },
  },
  {
    accessorKey: "voice_call_limit",
    header: "Dakika",
    sortingFn: (rowA, rowB, columnId) => {
      return (rowA.getValue(columnId) as number) - (rowB.getValue(columnId) as number);
    },
  },
  {
    accessorKey: "sms_limit",
    header: "SMS",
    sortingFn: (rowA, rowB, columnId) => {
      return (rowA.getValue(columnId) as number) - (rowB.getValue(columnId) as number);
    },
  },
  {
    accessorKey: "bill_price",
    header: "Tarife Ücreti",
    sortingFn: (rowA, rowB, columnId) => {
      return (rowA.getValue(columnId) as number) - (rowB.getValue(columnId) as number);
    },
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
    accessorKey: "contract_start_month_turkish",
    header: "Başlangıç Ayı",
  },
  {
    accessorKey: "updated_at",
    header: "Güncelleme Tarihi",
    sortingFn: (rowA, rowB, columnId) => {
      return new Date(rowA.getValue(columnId) as string).getTime() - new Date(rowB.getValue(columnId) as string).getTime();
    },
    cell: ({ row }) => {
      const date = row.getValue("updated_at") as string
      return getTimeAgo(date)
    },
  },
]

// You may need to update your BillData type to include the new field:
export interface BillData {
  // ... other fields ...
  contract_start_month: number;
  contract_start_month_turkish: string;
  // ... other fields ...
}