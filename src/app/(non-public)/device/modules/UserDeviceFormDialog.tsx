'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useSWR from 'swr'
import { api } from '@/utils/trpc'
import { useAuth } from '@/provider/auth.provider'
import { useToast } from '@/components/ui/use-toast'

type DeviceFormDialogProps = {
	deviceId?: string
	children: ReactNode
	onSuccess?: () => void
}

export default function UserDeviceFormDialog({ deviceId, onSuccess, children }: DeviceFormDialogProps) {
	const { state } = useAuth()
	const { toast } = useToast()
	const [deviceData, setDeviceData] = useState({
		device_id: deviceId || '',
		alias_name: ''
	})
	const [open, setOpen] = useState(false)

	const { data: existingDevice } = useSWR(
		open && deviceId ? `/api/trpc/device?input=${encodeURIComponent(JSON.stringify({ id: deviceId }))}` : null
	)

	useEffect(() => {
		if (existingDevice?.result?.data) {
			const device = existingDevice.result.data.device
			setDeviceData({
				device_id: device.device_id,
				alias_name: device.alias_name
			})
		}
	}, [existingDevice])

	const { trigger: updateAliasTrigger } = api.updateDeviceAlias.useSWRMutation()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!state.token) {
			toast({
				title: '更新失败',
				description: '用户未登录，无法更新设备别名。',
				variant: 'destructive'
			})
			return
		}

		try {
			await updateAliasTrigger({
				device_id: deviceData.device_id,
				alias_name: deviceData.alias_name
			})

			toast({
				title: '更新成功',
				description: `设备别名已更新为 "${deviceData.alias_name}"。`
			})

			if (onSuccess) {
				onSuccess()
			}

			setOpen(false)
		} catch (error) {
			toast({
				title: '更新失败',
				description: '更新设备别名时发生错误，请重试。',
				variant: 'destructive'
			})
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{deviceId ? '编辑别名' : '添加设备'}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={deviceData.device_id}
						onChange={e => setDeviceData({ ...deviceData, device_id: e.target.value })}
						placeholder="设备 ID"
						disabled={!!deviceId}
					/>
					<Input
						value={deviceData.alias_name}
						onChange={e => setDeviceData({ ...deviceData, alias_name: e.target.value })}
						placeholder="别名"
					/>
					<Button type="submit">{deviceId ? '更新别名' : '添加设备'}</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
