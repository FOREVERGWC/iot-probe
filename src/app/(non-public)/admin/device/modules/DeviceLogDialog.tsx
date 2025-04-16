'use client'

import { useState, ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/utils/trpc'
import { useToast } from '@/components/ui/use-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type DeviceLogDialogProps = {
	deviceId?: string
	children: ReactNode
	onSuccess?: () => void
}

const deleteLogSchema = z.object({
	device_id: z.string().max(18),
	num: z.number().min(1)
})

export default function DeviceLogDialog({ deviceId, onSuccess, children }: DeviceLogDialogProps) {
	const { toast } = useToast()
	const form = useForm<z.infer<typeof deleteLogSchema>>({
		resolver: zodResolver(deleteLogSchema),
		defaultValues: {
			device_id: deviceId,
			num: 1
		}
	})
	const [open, setOpen] = useState(false)
	const { trigger: deleteDeviceLogsTrigger } = api.deleteDeviceLogs.useSWRMutation()

	const handleSubmit = form.handleSubmit(async data => {
		await deleteDeviceLogsTrigger(data)
		toast({
			title: '删除成功！',
			description: '删除成功！'
		})
		if (onSuccess) onSuccess()
		setOpen(false)
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>删除数据</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input {...form.register('device_id')} placeholder="设备 ID" disabled={!!deviceId} />
					<Input {...form.register('num', { valueAsNumber: true })} placeholder="条数" />
					<Button type="submit">删除</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
