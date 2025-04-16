import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/libs/utils'
import { SWRProvider } from '@/provider/swr.provider'
import { Metadata } from 'next'
import { AuthProvider } from '@/provider/auth.provider'
import Navbar from '@/components/ui/navbar'
import React from 'react'
import { Toaster } from '@/components/ui/toaster'

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans'
})

export const metadata: Metadata = {
	title: '九溪云服务'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
				<AuthProvider>
					<Navbar />
					<Toaster />
					<SWRProvider>{children}</SWRProvider>
				</AuthProvider>
				<footer className="text-center py-4">
					<p>
						Copyright © 2023-2024 徐州九溪云商贸有限公司 All Rights Reserved 版权所有{' '}
						<a target="_blank" href="https://beian.miit.gov.cn/">
							苏ICP备2024095635号
						</a>
					</p>
				</footer>
			</body>
		</html>
	)
}
