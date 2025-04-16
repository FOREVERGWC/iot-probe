import React from 'react'
import RegisterForm from './page.client'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const Page = () => {
	return (
		<>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">注册</CardTitle>
				<CardDescription className="text-center">注册账号</CardDescription>
			</CardHeader>
			<CardContent>
				<RegisterForm />
				<p className="mt-4 text-center text-sm">
					<span>已经有账号？</span>
					<Link className="hover:text-gray-600" href="/login">
						登录
					</Link>
				</p>
			</CardContent>
		</>
	)
}

export default Page
