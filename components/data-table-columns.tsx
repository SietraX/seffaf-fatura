"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillData } from "@/contexts/BillDataContext"

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
]