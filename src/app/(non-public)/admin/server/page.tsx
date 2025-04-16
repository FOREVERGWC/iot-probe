'use client'

import { api } from '@/utils/trpc'
import Loading from '@/app/loading'
import * as React from 'react'
import { useEffect } from 'react'

const Page = () => {
	const { data, error, mutate } = api.server.useSWR()

	useEffect(() => {
		const interval = setInterval(() => mutate(), 5000)
		return () => clearInterval(interval)
	}, [mutate])

	if (error) return <div>获取系统信息时出错！</div>
	if (!data) return <Loading />

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">服务器系统信息</h1>

			<div className="mb-6">
				<h2 className="text-xl font-semibold">CPU 使用率</h2>
				<ul>
					{data.cpuUsage.map((cpu: any) => (
						<li key={cpu.core}>
							核心 {cpu.core}: {cpu.usage}%
						</li>
					))}
				</ul>
			</div>

			<div className="mb-6">
				<h2 className="text-xl font-semibold">内存</h2>
				<p>全部: {(data.totalMem * 1.0) / 1024 / 1024 / 1024}G</p>
				<p>已使用: {(data.usedMem * 1.0) / 1024 / 1024 / 1024}G</p>
				<p>使用率: {data.memoryUsage}%</p>
			</div>

			{/*<div className="mb-6">*/}
			{/*    <h2 className="text-xl font-semibold">硬盘使用率</h2>*/}
			{/*    <p>已使用: {data.diskUsage.usage}%</p>*/}
			{/*</div>*/}
		</div>
	)
}

export default Page
