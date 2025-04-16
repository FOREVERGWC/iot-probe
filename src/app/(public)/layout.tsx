import React from 'react'
import { Card } from '@/components/ui/card'

const AuthLayout: React.FC<Readonly<{ children: React.ReactNode }>> = ({ children }) => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-muted/50 to-muted">
			<main className="container relative h-screen py-10">
				<div className="h-full w-full flex items-center justify-center">
					<div className="w-full max-w-[1200px] flex items-center justify-center gap-8">
						{/* 左侧信息区域 */}
						<div className="flex-1 max-w-[50%] p-8 hidden lg:block">
							<div className="space-y-6 mb-16">
								<h1 className="text-4xl font-bold tracking-tight text-foreground">九溪云服务 · 智能物联网探针</h1>
								<p className="text-lg text-muted-foreground">智能 · 高效 · 精准</p>
							</div>

							<div className="relative mb-8">
								<div className="absolute h-[1px] w-[180px] bg-gradient-to-r from-primary/50 to-transparent" />
							</div>

							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<div className="h-1 w-1 rounded-full bg-primary/70" />
									<p className="text-muted-foreground">实时监测数据，智能分析预警</p>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-1 w-1 rounded-full bg-primary/70" />
									<p className="text-muted-foreground">高效管理，便捷操作</p>
								</div>
								<div className="flex items-center gap-2">
									<div className="h-1 w-1 rounded-full bg-primary/70" />
									<p className="text-muted-foreground">数据可视化，决策更精准</p>
								</div>
							</div>
						</div>

						{/* 右侧表单区域 */}
						<div className="relative">
							<div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-3xl blur-2xl" />
							<Card className="relative mx-auto w-[380px] border-muted/50">{children}</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default AuthLayout
