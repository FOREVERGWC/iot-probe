import { ColumnDef } from "@tanstack/react-table";
import { RouterOutput } from "@/utils/trpc";
import {base64Encoded, formattedDate} from "@/utils/time";
import {Button} from "@/components/ui/button";

export type ChangeLog = RouterOutput["deviceChangeLog"][number];

/**
 * 设备状态
 */
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

/**
 * 电源状态
 */
export const columns2: ColumnDef<ChangeLog>[] = [
    {
        accessorKey: "update_time",
        header: "时间",
        cell: ({ row }) => {
            return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
        },
    },
    {
        accessorKey: "electric",
        header: "状态",
        cell: ({ row }) => {
            return <p>{row.getValue("electric") === -1 ? "正常" : "异常"}</p>;
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

/**
 * 以太网状态
 */
export const columns3: ColumnDef<ChangeLog>[] = [
    {
        accessorKey: "update_time",
        header: "时间",
        cell: ({ row }) => {
            return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
        },
    },
    {
        accessorKey: "ethernet",
        header: "状态",
        cell: ({ row }) => {
            return <p>{row.getValue("ethernet") === -1 ? "正常" : (row.getValue("ethernet") ? "异常" : "未知")}</p>;
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

/**
 * 发送数据
 */
export const columns4: ColumnDef<ChangeLog>[] = [
    {
        accessorKey: "update_time",
        header: "时间",
        cell: ({ row }) => {
            return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
        },
    },
    {
        accessorKey: "serial_rx",
        header: "发送数据",
        cell: ({ row }) => {
            return <p>{base64Encoded(row.getValue("serial_rx"))}</p>;
        }
    },
    {
        id: "日志",
        enableHiding: false,
        cell: ({ row }) => {
            return <Button>查看</Button>;
        },
    },
];

/**
 * 接收数据
 */
export const columns5: ColumnDef<ChangeLog>[] = [
    {
        accessorKey: "update_time",
        header: "时间",
        cell: ({ row }) => {
            return <p>{formattedDate(new Date(row.getValue("update_time")))}</p>;
        },
    },
    {
        accessorKey: "serial_tx",
        header: "接收数据",
        cell: ({ row }) => {
            return <p>{base64Encoded(row.getValue("serial_tx"))}</p>;
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
