'use client'

import { api } from '@/utils/trpc'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formattedDate } from '@/utils/time'
import { useToast } from '@/components/ui/use-toast'
import Loading from '@/app/loading'
import * as React from 'react'
import { useEffect } from 'react'
import DeviceLogDialog from '@/app/(non-public)/admin/device/modules/DeviceLogDialog'

export default function Page() {
	const { toast } = useToast()
	const { data, error, mutate } = api.devices.useSWR()
	const { trigger: unbindDeviceTrigger } = api.unbindDevice.useSWRMutation()

	useEffect(() => {
		const interval = setInterval(() => mutate(), 60000)
		return () => clearInterval(interval)
	}, [mutate])

	if (error) return <div>加载设备时出错！</div>
	if (!data) return <Loading />

	const handleUnbind = async (deviceId: string) => {
		await unbindDeviceTrigger({ device_id: deviceId })

		await mutate()

		toast({
			title: '解绑成功',
			description: '您已成功解绑设备！'
		})
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">设备管理</h1>

			<Table className="min-w-full">
				<TableHeader>
					<TableRow>
						<TableHead>设备 ID</TableHead>
						<TableHead>最后日志 ID</TableHead>
						<TableHead>日志数量</TableHead>
						<TableHead>最后上线时间</TableHead>
						<TableHead>固件版本</TableHead>
						<TableHead>绑定用户ID</TableHead>
						<TableHead>操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((device: any) => (
						<TableRow key={device.device_id}>
							<TableCell>{device.device_id}</TableCell>
							<TableCell>{device.latest_device_log_id}</TableCell>
							<TableCell>{device.device_log_num}</TableCell>
							<TableCell>{formattedDate(device.device_log?.update_time)}</TableCell>
							<TableCell>{device?.device_log?.firmware_version}</TableCell>
							<TableCell>{device.user_id || '未绑定'}</TableCell>
							<TableCell>
								{device.user_id && (
									<button
										className="px-3 py-1 rounded hover:bg-red-600 transition-colors"
										onClick={() => handleUnbind(device.device_id)}>
										解绑
									</button>
								)}
								<DeviceLogDialog deviceId={device.device_id} onSuccess={mutate}>
									{device.device_log_num > 0 && (
										<button className="px-3 py-1 rounded hover:bg-red-600 transition-colors">删除日志</button>
									)}
								</DeviceLogDialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
