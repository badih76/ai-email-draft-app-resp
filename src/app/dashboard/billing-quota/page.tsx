'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Copy, Save } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from 'react';
import LoadingGif from '@/../public/loading.gif';
import { IBillingTransaction } from '@/lib/interfaces';
import fetchAndCreateTransactionsCards from '@/lib/fetchSavedTransactions';
import { TDraftElementsCategory } from '@/data/types';
import { transactionsColumns } from '@/lib/tables-defs';

// const transactions: IBillingTransaction[] = [
//     {  
//         date: '2025-01-10',
//         type: "Invoice"
//     },
//     {
//         date: '2025-01-12',
//         type: "Payment"
//     },
//     {  
//         date: '2025-02-10',
//         type: "Invoice"
//     },
//     {
//         date: '2025-02-12',
//         type: "Payment"
//     }
// ]

// Define the shape of the user input state

export default function BillingPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const [ transactions, setTransactions ] = useState<IBillingTransaction[]>([]);

    const { user, isLoading } = useKindeBrowserClient();
    const [ userDisplayName, setUserDisplayName ] = useState<string>('');
    const [rowSelection, setRowSelection] = React.useState({});
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
  
    const table = useReactTable({
        data: transactions,
        columns: transactionsColumns,
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
  
//   useEffect(() => {
//     // console.log('User: ', user);
//     setUserDisplayName(user?.email ?? 'No found');
//   }, [ isLoading ]);

  useEffect(() => {
    const fetchTransactions = async (desData: { userId: string, count: number }) => {
      const transactions: IBillingTransaction[] = await fetchAndCreateTransactionsCards(desData, TDraftElementsCategory.FULL) as IBillingTransaction[];
      setTransactions(prev => ([...transactions]))
    }

    if (!isLoading) {
      console.log('isLoading: ', isLoading)
      setUserDisplayName(user?.email ?? 'No found');
    //   setUserId(user!.id);
      const desData = { userId: user!.id, count: 0 };
      fetchTransactions(desData);
      setDataFetched(true);
    }
  }, [isLoading])
  
  
  // const data = dataString ? JSON.parse(dataString) : null;
  
    const [isMyLoading, setIsLoading] = useState(false);
    const [ dataFetched, setDataFetched ] = useState<boolean>(false);
  

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Billing & Quota
        </h1>

        <div className='w-full'>
            <Tabs defaultValue='billing' className='w-full text-2xl'>
                <TabsList>
                    <TabsTrigger value="billing" 
                        className='w-[200px] text-xl'>
                            Billing
                    </TabsTrigger>
                    <TabsTrigger value="transactions" 
                        className='w-[200px] text-xl'>
                            Transactions
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="billing" className='w-full'>
                    <div className="w-full">
                        {/* -------------------- Input Form Card -------------------- */}
                        <Card className="shadow-xl dark:bg-gray-800">
                        <CardHeader className="border-b dark:border-gray-700">
                            <CardTitle className="text-xl text-indigo-600">Current Billing Cycle</CardTitle>
                            {/* <CardDescription>Define the relationship and what you need to communicate.</CardDescription> */}
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className='flex flex-row gap-4'>
                                    <div className='ml-4'> 
                                        <Label className='text-indigo-600 text-xl'>Due Amount:</Label>
                                    </div>
                                    <div className='mr-4'>
                                        <Label className='text-black text-xl font-medium'>$0</Label>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-4'>
                                    <div className='ml-4'> 
                                        <Label className='text-indigo-600 text-xl'>Due Date:</Label>
                                    </div>
                                    <div className='mr-4'>
                                        <Label className='text-black text-xl font-medium'>10-10-2025</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Tone Input */}
                            <div className="space-y-2">
                            <Label htmlFor="tone" className='text-indigo-600'>Current Plan</Label>
                            <Select 
                                // onValueChange={(value) => setDraft(prev => ({...prev, tone: value}))} 
                                disabled={isMyLoading}>
                                <SelectTrigger id="tone">
                                <SelectValue placeholder="Select the desired plan" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="Free">Free Plan</SelectItem>
                                <SelectItem value="Plus">Plus Plan - $4.99 / Month</SelectItem>
                                <SelectItem value="Pro">Pro Plan - $19.99 / Month</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>

                            {/* Generate Button (with loading state) */}
                            <Button 
                                // onClick={handleGenerate} 
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white transition duration-200"
                                disabled={isMyLoading}
                            >
                                {isMyLoading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Drafting Email...</>
                                ) : (
                                    'Generate Email Draft'
                                )}
                            </Button>
                        </CardContent>
                        </Card>        
                    </div>
                </TabsContent>
                <TabsContent value="transactions">
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
                                    colSpan={transactionsColumns.length}
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
                                    {row.getVisibleCells().map((cell) => {
                                        // console.log("Cell: ", cell.column.columnDef.cell);
                                        console.log("Cell: ", cell);
                                        console.log("getContext: ", cell.getContext());
                                        console.log(table.getRowModel().rows.length, dataFetched);
                                        return <TableCell key={cell.id}>
                                            {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                            )}
                                        </TableCell>
                                    })}
                                </TableRow>
                                ))
                            )}
                            </TableBody>
                        </Table>
                        </div>
                </TabsContent>
            </Tabs>
        </div>

      

      
    </div>
  );
}