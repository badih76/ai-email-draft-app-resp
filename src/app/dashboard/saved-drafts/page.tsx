'use client'
import { IDraft } from '@/lib/interfaces';
import fetchAndCreateDraftCards from '@/lib/fetchSavedDrafts';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import LoadingGif from '@/../public/loading.gif';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  // type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  // DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { TDraftElementsCategory, VDraftsTableColumns } from '@/data/types';
import { draftColumns } from '@/lib/tables-defs';


export default function SavedEmailDraftPage() {
  const [userId, setUserId] = useState<string>('');
  const { user, isLoading } = useKindeBrowserClient();

  const [ drafts, setDrafts ] = useState<IDraft[]>([]);
  const [ dataFetched, setDataFetched ] = useState<boolean>(false);

  useEffect(() => {
    const fetchDrafts = async (desData: { userId: string, count: number }) => {
      const tDrafts: IDraft[] = await fetchAndCreateDraftCards(desData, TDraftElementsCategory.FULL) as IDraft[];
      setDrafts(prev => ([...tDrafts]))
    }

    if (!isLoading) {
      console.log('isLoading: ', isLoading)
      setUserId(user!.id);
      const desData = { userId: user!.id, count: 0 };
      fetchDrafts(desData);
      console.log("Data: ", desData);
      setDataFetched(true);
    }
  }, [isLoading])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data: drafts,
    columns: draftColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Saved Email Drafts
        </h1>
      </div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter Drafts..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  console.log("Column.id: ", column.id);

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {VDraftsTableColumns[column.id]}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className='bg-indigo-400 text-white'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className='text-white'>
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
              {table.getRowModel().rows?.length == 0 && !dataFetched ? (
                <TableRow>
                  <TableCell
                    colSpan={draftColumns.length}
                    className="h-24 text-center"
                  >
                    <div className='w-full text-center flex flex-row justify-center items-center'>
                      {isLoading ?
                        <Image src={LoadingGif} alt={'Loading Data'} width={40} /> :
                        <span>No Results</span>
                      }

                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, i) => (
                  <TableRow className={i % 2 == 1 ? 'bg-indigo-100' : ''}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}