"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data: Customer[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    avatar: `https://bundui-images.netlify.app/avatars/01.png`,
    joinDate: "20/03/2024",
    lastActive: "05/04/2024",
    status: "active",
    satisfaction: 95
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    avatar: `https://bundui-images.netlify.app/avatars/02.png`,
    joinDate: "15/03/2024",
    lastActive: "10/04/2024",
    status: "inactive",
    satisfaction: 78
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@email.com",
    avatar: `https://bundui-images.netlify.app/avatars/03.png`,
    joinDate: "10/03/2024",
    lastActive: "01/04/2024",
    status: "premium",
    satisfaction: 100
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    avatar: `https://bundui-images.netlify.app/avatars/04.png`,
    joinDate: "05/03/2024",
    lastActive: "20/03/2024",
    status: "pending",
    satisfaction: 65
  },
  {
    id: 5,
    name: "David Wilson",
    email: "d.wilson@email.com",
    avatar: `https://bundui-images.netlify.app/avatars/05.png`,
    joinDate: "01/03/2024",
    lastActive: "15/04/2024",
    status: "active",
    satisfaction: 88
  },
  {
    id: 6,
    name: "Jessica Lee",
    email: "jessica.lee@email.com",
    avatar: `https://bundui-images.netlify.app/avatars/06.png`,
    joinDate: "25/02/2024",
    lastActive: "10/05/2024",
    status: "premium",
    satisfaction: 92
  }
];

type Customer = {
  id: number;
  name?: string;
  email?: string;
  avatar?: string;
  joinDate?: string;
  lastActive?: string;
  status: "pending" | "active" | "premium" | "inactive";
  satisfaction?: number;
};

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: "Customer Name",
    cell: ({ row }) => row.getValue("name")
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email")
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const avatar = row.getValue("avatar") as string;
      const name = row.getValue("name") as string;

      return (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatar} alt="shadcn ui kit" />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {name}
        </div>
      );
    }
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => row.getValue("joinDate")
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => row.getValue("lastActive")
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as "pending" | "active" | "premium" | "inactive";

      const statusClassMap: Record<typeof status, string> = {
        pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
        active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        premium: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
        inactive: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
      };

      return <Badge className={`capitalize ${statusClassMap[status]}`}>{status}</Badge>;
    }
  },
  {
    accessorKey: "satisfaction",
    header: "Satisfaction",
    cell: ({ row }) => (
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
        <Progress value={row.getValue("satisfaction")} className="h-2" />
        <span className="text-muted-foreground text-sm">{row.getValue("satisfaction")}/100</span>
      </div>
    )
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="text-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Customer</DropdownMenuItem>
              <DropdownMenuItem>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];

export function TableRecentProjects() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
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
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 6
      }
    }
  });

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <Input
            placeholder="Filter customers..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="[&:has([role=checkbox])]:pl-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="[&:has([role=checkbox])]:pl-3">
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
        <div className="flex items-center justify-end space-x-2 pt-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
