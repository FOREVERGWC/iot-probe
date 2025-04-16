import React from 'react'
import LoginForm from './page.client'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const Page = () => {
	return (
		<>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">登录</CardTitle>
				<CardDescription className="text-center">登录系统</CardDescription>
			</CardHeader>
			<CardContent>
				<LoginForm />
				<p className="mt-4 text-center text-sm">
					<span>还没有账号？</span>
					<Link className="hover:text-gray-600" href="/register">
						注册
					</Link>
				</p>
			</CardContent>
		</>
	)
}

export default Page
