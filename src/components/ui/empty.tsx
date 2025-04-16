'use client'

import React from 'react'

type EmptyStateProps = {
	title?: string
	description?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ title = '暂无数据', description = '当前没有可显示的信息。' }) => {
	return (
		<div className="flex flex-col items-center justify-center h-full text-center">
			<h2 className="text-xl font-semibold text-gray-800">{title}</h2>
			<p className="text-gray-600 mt-2">{description}</p>
		</div>
	)
}

export default EmptyState
