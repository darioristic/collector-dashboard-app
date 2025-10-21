"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import * as React from "react";

// Define the data type for our table
type Customer = {
  id: string;
  name: string;
  email: string;
  status: "active" | "premium" | "inactive" | "pending";
  joinDate: string;
  lastActive: string;
  totalSpent: number;
  satisfaction: number;
  manager: string;
};

// Sample data for the table
const data: Customer[] = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john.smith@email.com",
    status: "premium",
    joinDate: "2024-01-15",
    lastActive: "2025-01-15",
    totalSpent: 12500,
    satisfaction: 95,
    manager: "Sarah Johnson"
  },
  {
    id: "CUST-002",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    status: "active",
    joinDate: "2024-02-01",
    lastActive: "2025-01-10",
    totalSpent: 8500,
    satisfaction: 88,
    manager: "Michael Brown"
  },
  {
    id: "CUST-003",
    name: "Michael Chen",
    email: "m.chen@email.com",
    status: "premium",
    joinDate: "2023-11-10",
    lastActive: "2025-01-20",
    totalSpent: 22000,
    satisfaction: 100,
    manager: "David Wilson"
  },
  {
    id: "CUST-004",
    name: "Jessica Lee",
    email: "jessica.lee@email.com",
    status: "active",
    joinDate: "2024-01-05",
    lastActive: "2025-01-12",
    totalSpent: 6800,
    satisfaction: 92,
    manager: "Lisa Anderson"
  },
  {
    id: "CUST-005",
    name: "David Wilson",
    email: "d.wilson@email.com",
    status: "inactive",
    joinDate: "2024-02-15",
    lastActive: "2024-11-15",
    totalSpent: 3200,
    satisfaction: 65,
    manager: "Robert Taylor"
  },
  {
    id: "CUST-006",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    status: "active",
    joinDate: "2024-01-20",
    lastActive: "2025-01-18",
    totalSpent: 9500,
    satisfaction: 89,
    manager: "Jennifer Martinez"
  },
  {
    id: "CUST-007",
    name: "Robert Brown",
    email: "robert.b@email.com",
    status: "premium",
    joinDate: "2024-02-10",
    lastActive: "2025-01-14",
    totalSpent: 18500,
    satisfaction: 97,
    manager: "Thomas Clark"
  },
  {
    id: "CUST-008",
    name: "Amanda Taylor",
    email: "amanda.t@email.com",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2025-01-16",
    totalSpent: 7200,
    satisfaction: 85,
    manager: "Patricia Moore"
  },
  {
    id: "CUST-009",
    name: "Thomas Clark",
    email: "thomas.c@email.com",
    status: "pending",
    joinDate: "2025-01-01",
    lastActive: "2025-01-05",
    totalSpent: 0,
    satisfaction: 0,
    manager: "James Wilson"
  },
  {
    id: "CUST-010",
    name: "Lisa Anderson",
    email: "lisa.a@email.com",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2025-01-20",
    totalSpent: 11000,
    satisfaction: 91,
    manager: "Michelle Johnson"
  },
  {
    id: "CUST-011",
    name: "Kevin White",
    email: "kevin.w@email.com",
    status: "inactive",
    joinDate: "2024-02-20",
    lastActive: "2024-10-10",
    totalSpent: 4500,
    satisfaction: 72,
    manager: "Daniel Brown"
  },
  {
    id: "CUST-012",
    name: "Patricia Moore",
    email: "patricia.m@email.com",
    status: "premium",
    joinDate: "2024-01-05",
    lastActive: "2025-01-15",
    totalSpent: 28000,
    satisfaction: 98,
    manager: "Christopher Lee"
  },
  {
    id: "CUST-013",
    name: "James Wilson",
    email: "james.w@email.com",
    status: "active",
    joinDate: "2024-02-15",
    lastActive: "2025-01-12",
    totalSpent: 7800,
    satisfaction: 87,
    manager: "Jessica Taylor"
  },
  {
    id: "CUST-014",
    name: "Michelle Johnson",
    email: "michelle.j@email.com",
    status: "pending",
    joinDate: "2025-01-10",
    lastActive: "2025-01-12",
    totalSpent: 0,
    satisfaction: 0,
    manager: "Andrew Martin"
  },
  {
    id: "CUST-015",
    name: "Daniel Brown",
    email: "daniel.b@email.com",
    status: "active",
    joinDate: "2024-03-01",
    lastActive: "2025-01-15",
    totalSpent: 6200,
    satisfaction: 83,
    manager: "Stephanie Garcia"
  },
  {
    id: "CUST-016",
    name: "Christopher Lee",
    email: "chris.lee@email.com",
    status: "premium",
    joinDate: "2024-02-10",
    lastActive: "2025-01-18",
    totalSpent: 19500,
    satisfaction: 96,
    manager: "Brian Wilson"
  },
  {
    id: "CUST-017",
    name: "Jessica Taylor",
    email: "jessica.t@email.com",
    status: "inactive",
    joinDate: "2024-01-15",
    lastActive: "2024-09-15",
    totalSpent: 3800,
    satisfaction: 68,
    manager: "Amanda Lewis"
  },
  {
    id: "CUST-018",
    name: "Andrew Martin",
    email: "andrew.m@email.com",
    status: "active",
    joinDate: "2023-12-15",
    lastActive: "2025-01-20",
    totalSpent: 8900,
    satisfaction: 90,
    manager: "Kevin White"
  },
  {
    id: "CUST-019",
    name: "Stephanie Garcia",
    email: "stephanie.g@email.com",
    status: "active",
    joinDate: "2024-02-01",
    lastActive: "2025-01-14",
    totalSpent: 10500,
    satisfaction: 93,
    manager: "Lisa Anderson"
  },
  {
    id: "CUST-020",
    name: "Brian Wilson",
    email: "brian.w@email.com",
    status: "premium",
    joinDate: "2024-01-20",
    lastActive: "2025-01-16",
    totalSpent: 16500,
    satisfaction: 94,
    manager: "Robert Taylor"
  }
];

// Define the columns for our table
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Customer Name
          <ArrowUpDown className="size-3" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div>{row.getValue("email")}</div>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pending"
        | "active"
        | "premium"
        | "inactive";

      const statusClassMap: Record<typeof status, string> = {
        pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        premium: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        inactive: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      };

      return <Badge className={`capitalize ${statusClassMap[status]}`}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("joinDate"));
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastActive"));
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    accessorKey: "totalSpent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Spent
          <ArrowUpDown className="size-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalSpent"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount);

      return <div>{formatted}</div>;
    }
  },
  {
    accessorKey: "satisfaction",
    header: "Satisfaction",
    cell: ({ row }) => {
      const satisfaction = Number.parseInt(row.getValue("satisfaction"));

      return (
        <div className="w-full">
          <div className="flex items-center">
            <Progress value={satisfaction} />
            <span className="ml-2 text-xs">{satisfaction}/100</span>
          </div>
        </div>
      );
    }
  }
];

export function Reports() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 15
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="z-0 mt-0 flex items-center justify-start gap-3 lg:-mt-14 lg:justify-end">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Search customers..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-[250px] pl-8 md:w-[300px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between space-x-2">
        <div className="text-muted-foreground text-sm">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} customers
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
