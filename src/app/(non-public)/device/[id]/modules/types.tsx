import { ColumnDef } from '@tanstack/react-table'
import { RouterOutput } from '@/utils/trpc'
import { base64Decode, extractContent, extractText, formattedDate } from '@/utils/time'
import EthernetStatus from '@/app/(non-public)/device/modules/EthernetStatus'
import PowerStatus from '@/app/(non-public)/device/modules/PowerStatus'
import OnlineStatus from '@/app/(non-public)/device/modules/OnlineStatus'
import React from 'react'

export type ChangeLog = RouterOutput['deviceChangeLog'][number]

/**
 * 设备状态
 */
export const columns: ColumnDef<ChangeLog>[] = [
	{
		accessorKey: 'update_time',
		header: '时间',
		cell: ({ row }) => {
			return <p>{formattedDate(new Date(row.getValue('update_time')))}</p>
		}
	},
	{
		accessorKey: 'online',
		header: '状态',
		cell: ({ row }) => {
			const value = row.getValue('online')
			return <OnlineStatus isOnline={value === -1} isError={value === 0} />
		}
	}
]

/**
 * 电源状态
 */
export const columns2: ColumnDef<ChangeLog>[] = [
	{
		accessorKey: 'update_time',
		header: '时间',
		cell: ({ row }) => {
			return <p>{formattedDate(new Date(row.getValue('update_time')))}</p>
		}
	},
	{
		accessorKey: 'electric',
		header: '状态',
		cell: ({ row }) => {
			const electric = row.getValue('electric') as number
			return <PowerStatus isOnline={true} electric={electric} />
		}
	}
]

/**
 * 以太网状态
 */
export const columns3: ColumnDef<ChangeLog>[] = [
	{
		accessorKey: 'update_time',
		header: '时间',
		cell: ({ row }) => {
			return <p>{formattedDate(new Date(row.getValue('update_time')))}</p>
		}
	},
	{
		accessorKey: 'ethernet',
		header: '状态',
		cell: ({ row }) => {
			const ethernet = (row.getValue('ethernet') as number) || null
			return <EthernetStatus ethernet={ethernet} />
		}
	}
]

/**
 * 探针发送数据
 */
export const columns4: ColumnDef<ChangeLog>[] = [
	{
		accessorKey: 'update_time',
		header: '时间',
		cell: ({ row }) => {
			return <p className="whitespace-nowrap">{formattedDate(new Date(row.getValue('update_time')))}</p>
		}
	},
	{
		accessorKey: 'serial_rx',
		header: '数据',
		cell: ({ row }) => {
			const content = base64Decode(row.getValue('serial_rx') || '')
			const text = extractText(content)
			return <p>{text}</p>
		}
	},
	{
		accessorKey: 'power_voltage',
		header: '电源电压',
		cell: ({ row }) => {
			const content = getDecodedContent(row)
			if (!content) return <p></p>
			const data = content.find(item => item.startsWith('A3:'))
			const power_voltage = `${data ? (+data.split(':')[1] * 11).toFixed(2) : ''} V`
			return <p className="whitespace-nowrap">{power_voltage}</p>
		}
	},
	{
		accessorKey: 'super_cap_voltage',
		header: '超级电容电压',
		cell: ({ row }) => {
			const content = getDecodedContent(row)
			if (!content) return <p></p>
			const data = content.find(item => item.startsWith('A2:'))
			const super_cap_voltage = `${data ? (+data.split(':')[1] * 11).toFixed(2) : ''} V`
			return <p className="whitespace-nowrap">{super_cap_voltage}</p>
		}
	},
	// {
	//     accessorKey: "temperature",
	//     header: "温度",
	//     cell: ({ row }) => {
	//         const content = getDecodedContent(row);
	//         if (!content) return <p></p>;
	//         const data = content.find(item => item.startsWith('T:'));
	//         const temperature = `${data ? data.split(':')[1] : ''} ℃`;
	//         return <p className="whitespace-nowrap">{temperature}</p>;
	//     },
	// },
	// {
	//     accessorKey: "humidity",
	//     header: "湿度",
	//     cell: ({ row }) => {
	//         const content = getDecodedContent(row);
	//         if (!content) return <p></p>;
	//         const data = content.find(item => item.startsWith('R:'));
	//         const humidity = `${data ? data.split(':')[1] : ''} %`;
	//         return <p className="whitespace-nowrap">{humidity}</p>;
	//     },
	// },
	{
		accessorKey: 'uptime',
		header: '开机时间',
		cell: ({ row }) => {
			const content = getDecodedContent(row)
			if (!content) return <p></p>
			const data = content.find(item => item.startsWith('C:'))
			const uptime = `${data ? data.split(':')[1] : ''} 分`
			return <p className="whitespace-nowrap">{uptime}</p>
		}
	},
	{
		accessorKey: 'analog_input',
		header: '模拟量输入值',
		cell: ({ row }) => {
			const content = getDecodedContent(row)
			if (!content) return <p></p>
			const a0 = content.find(item => item.startsWith('A0:'))
			const s0 = `${a0 ? a0.split(':')[1] : ''} V`
			const a1 = content.find(item => item.startsWith('A1:'))
			const s1 = `${a1 ? a1.split(':')[1] : ''} V`
			return (
				<p>
					<span className="whitespace-nowrap font-mono">A0: {s0}</span>
					<br />
					<span className="whitespace-nowrap font-mono">A1: {s1}</span>
				</p>
			)
		}
	}
]

const getDecodedContent = (row: any) => {
	const content = base64Decode(row.getValue('serial_rx') || '')
	const data = extractContent(content)
	if (!data) return null
	return data.split(';')
}

/**
 * 探针接收数据
 */
export const columns5: ColumnDef<ChangeLog>[] = [
	{
		accessorKey: 'update_time',
		header: '时间',
		cell: ({ row }) => {
			return <p>{formattedDate(new Date(row.getValue('update_time')))}</p>
		}
	},
	{
		accessorKey: 'serial_tx',
		header: '数据',
		cell: ({ row }) => {
			return <p>{base64Decode(row.getValue('serial_tx') || '')}</p>
		}
	}
]
