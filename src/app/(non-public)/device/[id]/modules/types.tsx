import { ColumnDef } from "@tanstack/react-table";
import { RouterOutput } from "@/utils/trpc";
import { base64Decode, formattedDate } from "@/utils/time";
import EthernetStatus from "@/app/(non-public)/device/modules/EthernetStatus";
import PowerStatus from "@/app/(non-public)/device/modules/PowerStatus";
import OnlineStatus from "@/app/(non-public)/device/modules/OnlineStatus";
import React from "react";

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
            const value = row.getValue("online");
            return <OnlineStatus isOnline={value === -1} isError={value === 0} />
        },
    }
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
            const electric = row.getValue("electric") as number
            return <PowerStatus isOnline={true} electric={electric} />
        },
    }
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
            const ethernet = row.getValue("ethernet") as number || null
            return <EthernetStatus ethernet={ethernet} />;
        },
    }
];

/**
 * 探针发送数据
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
        header: "数据",
        cell: ({ row }) => {
            return <p>{base64Decode(row.getValue("serial_rx") || '')}</p>;
        }
    }
];

/**
 * 探针接收数据
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
        header: "数据",
        cell: ({ row }) => {
            return <p>{base64Decode(row.getValue("serial_tx") || '')}</p>;
        },
    }
];
