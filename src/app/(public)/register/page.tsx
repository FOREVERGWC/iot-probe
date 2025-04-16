import Link from 'next/link'

import RegisterForm from './page.client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function LoginPage() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="mx-auto w-96 max-w-sm">
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
			</Card>
		</div>
	)
}

export default LoginPage
