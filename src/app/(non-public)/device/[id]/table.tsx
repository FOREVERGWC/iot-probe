"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// const
interface DeviceLog {
  /* 日志主键 */
  id: number;
  device_id: string | null;
  update_time: Date | null;
  card_number: string | null;
  /* 电话卡ID */
  iccid: string | null;
  /* 供电状态 */
  electric: string | null;
  /* 探针有限网络状态 */
  ethernet: "phy_conn_error" | "dhcp_timeout" | null;
  /* 探针IP */
  ip: string | null;
  /* 探针网关 */
  gateway: string | null;
  /* 内网延迟
   * >9000ms 断开 */
  intranet_ping: string | null;
  /* 内网延迟（大数据包） */
  intranet_ping_large: string | null;
  /* 内网探针记录 */
  intranet_ping_array: string | null;
  /* 外网延迟 */
  extranet_ping: string | null;
  /* 外网延迟（大数据包） */
  extranet_ping_large: string | null;
  importance_level: number | null;
}

export const columns: ColumnDef<DeviceLog>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  // {
  //   accessorKey: "device_id",
  //   header: "Device ID",
  // },
  // {
  //   accessorKey: "update_time",
  //   header: "Update Time",
  // },
  {
    accessorKey: "card_number",
    header: "Card Number",
  },
  {
    accessorKey: "iccid",
    header: "ICCID",
  },
  {
    accessorKey: "electric",
    header: "供电状态",
  },
  {
    accessorKey: "ethernet",
    header: "Ethernet",
  },
  // {
  //   accessorKey: "ip",
  //   header: "IP",
  // },
  // {
  //   accessorKey: "gateway",
  //   header: "Gateway",
  // },
  // {
  //   accessorKey: "intranet_ping",
  //   header: "Intranet Ping",
  // },
  // {
  //   accessorKey: "intranet_ping_large",
  //   header: "Intranet Ping Large",
  // },
  // {
  //   accessorKey: "intranet_ping_array",
  //   header: "Intranet Ping Array",
  // },
  // {
  //   accessorKey: "extranet_ping",
  //   header: "Extranet Ping",
  // },
  // {
  //   accessorKey: "extranet_ping_large",
  //   header: "Extranet Ping Large",
  // },
  // {
  //   accessorKey: "importance_level",
  //   header: "Importance Level",
  // },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
}
