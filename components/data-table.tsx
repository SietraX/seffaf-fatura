"use client";

import React, { useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 5,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      let newPageSize;
      if (height < 600) newPageSize = 6;
      else if (height < 800) newPageSize = 8;
      else if (height < 1000) newPageSize = 11;
      else newPageSize = 12;

      setPagination((prev) => ({ ...prev, pageSize: newPageSize }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      setSorting((old) => {
        const newSorting =
          typeof updater === "function" ? updater(old) : updater;

        // If the new sorting is empty, toggle the last sorted column
        if (newSorting.length === 0 && old.length > 0) {
          const lastSort = old[0];
          return [{ ...lastSort, desc: !lastSort.desc }];
        }

        return newSorting;
      });
    },
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const renderPaginationItems = () => {
    const items = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

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
    );

    if (showEllipsisStart) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show middle pages
    let startPage, endPage;
    if (currentPage <= 3) {
      startPage = 2;
      endPage = Math.min(3, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 2, 2);
      endPage = totalPages - 1;
    } else {
      startPage = currentPage;
      endPage = currentPage;
    }

    for (let i = startPage; i <= endPage; i++) {
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
      );
    }

    if (showEllipsisEnd) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if not the same as first page
    if (totalPages > 1) {
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
      );
    }

    return items;
  };

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table className="!overflow-hidden">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-xs sm:text-sm p-1 sm:p-2"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center"
                              : "",
                            onClick: () => {
                              header.column.toggleSorting();
                            },
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span className="ml-2">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : null}
                          </span>
                        </div>
                      )}
                    </TableHead>
                  );
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
                    <TableCell
                      key={cell.id}
                      className="text-xs sm:text-sm p-1 sm:p-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xs sm:text-sm"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Pagination className="pb-6">
          <PaginationContent>
            <PaginationItem>
              {canPreviousPage ? (
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  className={cn("cursor-pointer hover:bg-muted", "select-none")}
                >
                  Önceki
                </PaginationPrevious>
              ) : (
                <span className="opacity-50 cursor-not-allowed select-none px-4 py-2">
                  Önceki
                </span>
              )}
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              {canNextPage ? (
                <PaginationNext
                  onClick={() => table.nextPage()}
                  className={cn("cursor-pointer hover:bg-muted", "select-none")}
                >
                  Sonraki
                </PaginationNext>
              ) : (
                <span className="opacity-50 cursor-not-allowed select-none px-4 py-2">
                  Sonraki
                </span>
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
