"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, RouterOutput } from "@/utils/trpc";
import { cn } from "@/libs/utils";
import Loading from "@/app/loading";
import { formattedDate } from "@/utils/time";

type ChangeLog = RouterOutput["deviceChangeLog"][number];

export const columns: ColumnDef<ChangeLog>[] = [
  {
    accessorKey: "update_time",
    header: "时间",
    cell: ({ row }) => {
      return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
    },
  },
  {
    accessorKey: "online",
    header: "状态",
    cell: ({ row }) => {
      return <p>{row.getValue("online") ? "上线" : "离线"}</p>;
    },
  },
  {
    id: "日志",
    enableHiding: false,
    cell: ({ row }) => {
      return <Button>查看</Button>;
    },
  },
];

export const columns2: ColumnDef<ChangeLog>[] = [
  {
    accessorKey: "update_time",
    header: "时间",
    cell: ({ row }) => {
      return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
    },
  },
  {
    accessorKey: "online",
    header: "状态",
    cell: ({ row }) => {
      return <p>{row.getValue("online") ? "上线" : "离线"}</p>;
    },
  },
  {
    id: "日志",
    enableHiding: false,
    cell: ({ row }) => {
      return <Button>查看</Button>;
    },
  },
];

export const columns3: ColumnDef<ChangeLog>[] = [
  {
    accessorKey: "update_time",
    header: "时间",
    cell: ({ row }) => {
      return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
    },
  },
  {
    accessorKey: "online",
    header: "状态",
    cell: ({ row }) => {
      return <p>{row.getValue("online") ? "上线" : "离线"}</p>;
    },
  },
  {
    id: "日志",
    enableHiding: false,
    cell: ({ row }) => {
      return <Button>查看</Button>;
    },
  },
];
const RecordChangeTable: React.FC<{
  device_id: string;
  className?: string;
}> = ({ device_id, className }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data, isLoading } = api.deviceChangeLog.useSWR({ device_id });

  // @ts-ignore
  const table = useReactTable({
    data: data!,
    // @ts-ignore
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
      rowSelection,
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={cn("w-full rounded-md border", className)}>
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
                          header.getContext(),
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
  );
};

export default RecordChangeTable;
