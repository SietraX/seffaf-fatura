"use client"

import React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const totalPages = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1

  const renderPaginationItems = () => {
    const items = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => table.setPageIndex(i - 1)}
              isActive={currentPage === i}
              className="cursor-pointer hover:bg-muted"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            onClick={() => table.setPageIndex(0)}
            isActive={currentPage === 1}
            className="cursor-pointer hover:bg-muted"
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (showEllipsisStart) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Show current page and surrounding pages
      const start = Math.max(currentPage - 1, 2)
      const end = Math.min(currentPage + 1, totalPages - 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              onClick={() => table.setPageIndex(i - 1)}
              isActive={currentPage === i}
              className="cursor-pointer hover:bg-muted"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (showEllipsisEnd) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => table.setPageIndex(totalPages - 1)}
            isActive={currentPage === totalPages}
            className="cursor-pointer hover:bg-muted"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => table.previousPage()} 
                className={`cursor-pointer hover:bg-muted ${!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}`}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext 
                onClick={() => table.nextPage()} 
                className={`cursor-pointer hover:bg-muted ${!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}