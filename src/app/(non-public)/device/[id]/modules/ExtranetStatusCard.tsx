'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EmptyState from '@/components/ui/empty'
import { api } from '@/utils/trpc'
import MsSpeed from '@/app/(non-public)/device/[id]/modules/MsSpeed'
import { Trash } from 'lucide-react'

interface ExtranetStatusCardProps {
	deviceId: string
	extranetArray: string | null | undefined
	extranetPing: string
	extranetPingLarge: string
	onSuccess?: () => void
}

interface PingData {
	extranetIP: string
	speed: string
	speedLarge: string
}

export default function ExtranetStatusCard({
	deviceId,
	extranetArray,
	extranetPing,
	extranetPingLarge,
	onSuccess
}: ExtranetStatusCardProps) {
	const existingIps = extranetArray ? extranetArray.split(',') : []
	const pingData: PingData[] = [{ extranetIP: existingIps[0], speed: extranetPing, speedLarge: extranetPingLarge }]

	const [showInput, setShowInput] = useState(false)
	const [newUrl, setNewUrl] = useState('')
	const [error, setError] = useState<string | null>(null)
	const { trigger: updateDeviceTrigger } = api.updateDevice.useSWRMutation()

	const completePingData = existingIps.map(ip => {
		const existingPing = pingData.find(ping => ping.extranetIP === ip)
		return existingPing || { extranetIP: ip, speed: '未知', speedLarge: '未知' }
	})

	const handleDeleteIp = async (ipToDelete: string) => {
		const updatedIps = existingIps.filter(ip => ip !== ipToDelete)

		await updateDeviceTrigger({
			device_id: deviceId,
			extranet_array: updatedIps.join(',')
		})

		if (onSuccess) {
			onSuccess()
		}
	}

	const handleAddUrl = async () => {
		if (!newUrl.trim() || existingIps.length >= 3) return

		const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*(\/|\?|$)/i
		if (!urlRegex.test(newUrl.trim())) {
			setError('无效的网址格式')
			return
		}

		const updatedIps = [...existingIps, newUrl.trim()]

		await updateDeviceTrigger({
			device_id: deviceId,
			extranet_array: updatedIps.join(',')
		})

		setShowInput(false)
		setNewUrl('')
		setError(null)

		if (onSuccess) {
			onSuccess()
		}
	}

	const handleInputBlur = async () => {
		if (newUrl.trim()) {
			await handleAddUrl()
		}
	}

	return (
		<Card className="row-span-2">
			<CardHeader>
				<CardTitle>外网状态</CardTitle>
				<CardDescription>外网探针记录</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				{completePingData.length > 0 ? (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>网址</TableHead>
								<TableHead className="text-center">外网 Ping</TableHead>
								<TableHead className="text-center">外网 Ping Large</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{completePingData.map((ping, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">
										<div className="flex items-center justify-between">
											<span>{ping.extranetIP}</span>
											<Trash
												className="cursor-pointer text-gray-500 hover:text-red-500 ml-2"
												onClick={() => handleDeleteIp(ping.extranetIP)}
												size={20}
											/>
										</div>
									</TableCell>
									{index === 0 && (
										<>
											<TableCell rowSpan={existingIps.length} className="text-center align-middle">
												<MsSpeed speed={ping.speed!} />
											</TableCell>
											<TableCell rowSpan={existingIps.length} className="text-center align-middle">
												<MsSpeed speed={ping.speedLarge!} />
											</TableCell>
										</>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<EmptyState title="暂无外网探针数据" description="当前无外网探针数据，请添加新的探针记录。" />
				)}
			</CardContent>
			<CardFooter className="flex flex-col gap-2">
				{showInput ? (
					<>
						<input
							className="w-full p-2 border rounded"
							type="text"
							placeholder="输入网址"
							value={newUrl}
							onChange={e => setNewUrl(e.target.value)}
							onBlur={handleInputBlur}
						/>
						{error && <p className="text-red-500 text-sm">{error}</p>}
					</>
				) : (
					existingIps.length < 3 && <Button onClick={() => setShowInput(true)}>添加外网探针</Button>
				)}
			</CardFooter>
		</Card>
	)
}
