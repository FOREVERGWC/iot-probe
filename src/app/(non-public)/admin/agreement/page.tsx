'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { api, fileApi } from '@/utils/trpc'
import Loading from '@/app/loading'
import { useToast } from '@/components/ui/use-toast'
import useSWR from 'swr'

interface Enclosure {
	id: number
	name: string
	key: string
	file_name: string
	file_path: string
}

export default function Page() {
	const { toast } = useToast()
	const { data, error, mutate } = api.enclosures.useSWR()
	// const { trigger: uploadFileTrigger } = fileApi.upload.useSWRMutation();
	const { trigger: enclosureUpdateTrigger } = api.enclosureUpdate.useSWRMutation()
	const [selectedEnclosure, setSelectedEnclosure] = useState<Enclosure>()
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	useEffect(() => {
		if (data && data.length > 0) {
			setSelectedEnclosure(data[0])
		}
	}, [data])

	if (error) return <div>加载附件时出错！</div>
	if (!data) return <Loading />

	const downloadFile = (path: string) => {
		const base = window.location.origin
		window.open(`${base}/${path}`, '_blank')
	}

	const handleUpload = async () => {
		if (!selectedFile) {
			toast({
				title: '上传失败',
				description: '请选择一个文件进行上传！',
				variant: 'destructive'
			})
			return
		}
		const formData = new FormData()
		formData.append('file', selectedFile)

		let path = ''
		fetch('/api/common/upload', {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(data => handleUpdate(selectedEnclosure?.id || 1, data.data, data.data))
	}

	const handleUpdate = async (id: number, file_path: string, file_name: string) => {
		await enclosureUpdateTrigger({ id: id, file_path: file_path, file_name: file_name })

		await mutate()

		toast({
			title: '更新成功',
			description: '您已成功更新附件！'
		})
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">服务协议及产品说明</h1>
			<div className="mb-4">
				<label htmlFor="enclosure-select" className="block text-sm font-medium text-gray-700 mb-2">
					选择文件:
				</label>
				<select
					id="enclosure-select"
					className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					value={selectedEnclosure?.id || ''}
					onChange={e => {
						const selectedId = parseInt(e.target.value)
						setSelectedEnclosure(data.find(item => item.id === selectedId))
					}}>
					{data.map(item => (
						<option key={item.id} value={item.id}>
							{item.name}
						</option>
					))}
				</select>
			</div>

			{selectedEnclosure && (
				<div className="mb-4">
					<p className="text-lg mb-2">当前文件: {selectedEnclosure.file_path}</p>
					<button
						onClick={() => downloadFile(selectedEnclosure.file_path)}
						disabled={!selectedEnclosure.file_name}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
						下载
					</button>
				</div>
			)}

			<div className="mt-6">
				<label className="block text-sm font-medium text-gray-700 mb-2">上传新的文件:</label>
				<input
					type="file"
					accept=".pdf"
					className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
					onChange={e => {
						const file = e.target.files?.[0]
						if (file) {
							const fileType = file.type
							if (fileType !== 'application/pdf') {
								toast({
									title: '上传失败',
									description: '只允许上传 PDF 文件！',
									variant: 'destructive'
								})
								e.target.value = ''
							} else {
								setSelectedFile(file)
							}
						}
					}}
				/>
				<button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600" onClick={handleUpload}>
					上传
				</button>
			</div>
		</div>
	)
}
