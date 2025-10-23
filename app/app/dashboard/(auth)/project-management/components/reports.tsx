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
type VPSInstance = {
  id: string;
  name: string;
  customer: string;
  status: "active" | "completed" | "on-hold" | "cancelled";
  startDate: string;
  endDate: string;
  plan: number;
  spent: number;
  usage: number;
  admin: string;
};

// Sample data for the table
const data: VPSInstance[] = [
  {
    id: "VPS-001",
    name: "Ubuntu 22.04 Server",
    customer: "Acme Inc.",
    status: "active",
    startDate: "2025-01-15",
    endDate: "2025-04-30",
    plan: 12500,
    spent: 5200,
    usage: 42,
    admin: "John Smith"
  },
  {
    id: "VPS-002",
    name: "CentOS 8 Server",
    customer: "TechCorp",
    status: "active",
    startDate: "2025-02-01",
    endDate: "2025-06-15",
    plan: 35000,
    spent: 12800,
    usage: 36,
    admin: "Sarah Johnson"
  },
  {
    id: "VPS-003",
    name: "Debian 11 Server",
    customer: "GreenLife",
    status: "completed",
    startDate: "2024-11-10",
    endDate: "2025-01-20",
    plan: 8500,
    spent: 8500,
    usage: 100,
    admin: "Michael Brown"
  },
  {
    id: "VPS-004",
    name: "Windows Server 2022",
    customer: "Fashion Hub",
    status: "active",
    startDate: "2025-01-05",
    endDate: "2025-05-10",
    plan: 42000,
    spent: 18600,
    usage: 44,
    admin: "Emily Davis"
  },
  {
    id: "PRJ-005",
    name: "SEO Optimization",
    customer: "Local Bistro",
    status: "on-hold",
    startDate: "2025-02-15",
    endDate: "2025-04-15",
    plan: 4500,
    spent: 1200,
    usage: 27,
    admin: "David Wilson"
  },
  {
    id: "PRJ-006",
    name: "Content Marketing",
    customer: "EduTech",
    status: "active",
    startDate: "2025-01-20",
    endDate: "2025-07-20",
    plan: 18000,
    spent: 4500,
    usage: 25,
    admin: "Lisa Anderson"
  },
  {
    id: "PRJ-007",
    name: "CRM Implementation",
    customer: "Global Services",
    status: "active",
    startDate: "2025-02-10",
    endDate: "2025-05-30",
    plan: 28000,
    spent: 9800,
    usage: 35,
    admin: "Robert Taylor"
  },
  {
    id: "PRJ-008",
    name: "Social Media Campaign",
    customer: "FitLife Gym",
    status: "completed",
    startDate: "2024-12-01",
    endDate: "2025-02-28",
    plan: 7500,
    spent: 7500,
    usage: 100,
    admin: "Jennifer Martinez"
  },
  {
    id: "PRJ-009",
    name: "Product Launch",
    customer: "Innovate Tech",
    status: "active",
    startDate: "2025-03-01",
    endDate: "2025-04-15",
    plan: 15000,
    spent: 3200,
    usage: 21,
    admin: "Thomas Clark"
  },
  {
    id: "PRJ-010",
    name: "Office Redesign",
    customer: "Creative Studios",
    status: "on-hold",
    startDate: "2025-01-10",
    endDate: "2025-03-30",
    plan: 22000,
    spent: 8900,
    usage: 40,
    admin: "Amanda Lewis"
  },
  {
    id: "PRJ-011",
    name: "Data Migration",
    customer: "Finance Pro",
    status: "active",
    startDate: "2025-02-20",
    endDate: "2025-04-10",
    plan: 9500,
    spent: 4200,
    usage: 44,
    admin: "Kevin White"
  },
  {
    id: "PRJ-012",
    name: "Security Audit",
    customer: "SecureBank",
    status: "completed",
    startDate: "2025-01-05",
    endDate: "2025-02-15",
    plan: 12000,
    spent: 12000,
    usage: 100,
    admin: "Patricia Moore"
  },
  {
    id: "PRJ-013",
    name: "Video Production",
    customer: "Media House",
    status: "active",
    startDate: "2025-02-15",
    endDate: "2025-05-01",
    plan: 18500,
    spent: 7200,
    usage: 39,
    admin: "James Wilson"
  },
  {
    id: "PRJ-014",
    name: "HR System Upgrade",
    customer: "Corporate Inc.",
    status: "cancelled",
    startDate: "2025-01-10",
    endDate: "2025-04-10",
    plan: 14000,
    spent: 3500,
    usage: 25,
    admin: "Michelle Johnson"
  },
  {
    id: "PRJ-015",
    name: "Market Research",
    customer: "New Ventures",
    status: "active",
    startDate: "2025-03-01",
    endDate: "2025-05-15",
    plan: 8500,
    spent: 2100,
    usage: 25,
    admin: "Daniel Brown"
  },
  {
    id: "PRJ-016",
    name: "Cloud Migration",
    customer: "Tech Solutions",
    status: "active",
    startDate: "2025-02-10",
    endDate: "2025-06-30",
    plan: 32000,
    spent: 12800,
    usage: 40,
    admin: "Christopher Lee"
  },
  {
    id: "PRJ-017",
    name: "Training Program",
    customer: "Education First",
    status: "on-hold",
    startDate: "2025-01-15",
    endDate: "2025-03-15",
    plan: 6500,
    spent: 2600,
    usage: 40,
    admin: "Jessica Taylor"
  },
  {
    id: "PRJ-018",
    name: "Annual Report Design",
    customer: "Investment Group",
    status: "completed",
    startDate: "2024-12-15",
    endDate: "2025-02-28",
    plan: 9000,
    spent: 9000,
    usage: 100,
    admin: "Andrew Martin"
  },
  {
    id: "PRJ-019",
    name: "Customer Support Portal",
    customer: "Service Pro",
    status: "active",
    startDate: "2025-02-01",
    endDate: "2025-05-15",
    plan: 16500,
    spent: 6800,
    usage: 41,
    admin: "Stephanie Garcia"
  },
  {
    id: "PRJ-020",
    name: "Inventory System",
    customer: "Retail Chain",
    status: "active",
    startDate: "2025-01-20",
    endDate: "2025-04-30",
    plan: 21000,
    spent: 9450,
    usage: 45,
    admin: "Brian Wilson"
  }
];

// Define the columns for our table
const columns: ColumnDef<VPSInstance>[] = [
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
          VPS Instance
          <ArrowUpDown className="size-3" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <div>{row.getValue("customer")}</div>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as
        | "pending"
        | "active"
        | "completed"
        | "cancelled"
        | "on-hold";

      const statusClassMap: Record<typeof status, string> = {
        pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        completed: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        cancelled: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
        "on-hold": "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
      };

      return <Badge className={`capitalize ${statusClassMap[status]}`}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("startDate"));
      return <div>{date.toLocaleDateString('sr-RS')}</div>;
    }
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("endDate"));
      return <div>{date.toLocaleDateString('sr-RS')}</div>;
    }
  },
  {
    accessorKey: "plan",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0!"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Plan
          <ArrowUpDown className="size-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("plan"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(amount);

      return <div>{formatted}</div>;
    }
  },
  {
    accessorKey: "usage",
    header: "Resource Usage",
    cell: ({ row }) => {
      const progress = Number.parseInt(row.getValue("usage"));

      return (
        <div className="w-full">
          <div className="flex items-center">
            <Progress value={progress} />
            <span className="ml-2 text-xs">{progress}%</span>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "admin",
    header: "Admin",
    cell: ({ row }) => <div>{row.getValue("admin")}</div>
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
            placeholder="Search projects..."
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
          Showing {table.getFilteredRowModel().rows.length} of {data.length} projects
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
