import React from 'react'
import ForgotPasswordForm from './page.client'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const Page = () => {
	return (
		<>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">找回</CardTitle>
				<CardDescription className="text-center">找回密码</CardDescription>
			</CardHeader>
			<CardContent>
				<ForgotPasswordForm />
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
