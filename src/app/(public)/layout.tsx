import React from 'react'
import { Card } from '@/components/ui/card'

const AuthLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => {
	return (
		<div className="absolute inset-0 top-16 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
			<div className="w-full max-w-[1200px] flex items-center justify-center">
				<div className="flex-1 max-w-[50%] p-8 hidden lg:block">
					<h1 className="text-4xl font-bold text-blue-900 mb-4">九溪云服务 - 智能物联网探针</h1>
					<p className="text-lg text-blue-700 mb-8">智能 · 高效 · 精准</p>
					<div className="space-y-4 text-blue-600">
						<p>· 实时监测数据，智能分析预警</p>
						<p>· 高效管理，便捷操作</p>
						<p>· 数据可视化，决策更精准</p>
					</div>
				</div>
				<div className="flex items-center justify-center min-h-screen">
					<Card className="mx-auto w-96 max-w-sm">{children}</Card>
				</div>
			</div>
		</div>
	)
}

export default AuthLayout
