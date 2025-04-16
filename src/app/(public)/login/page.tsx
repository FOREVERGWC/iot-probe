import React from 'react'
import LoginForm from './page.client'
import AuthPage from '../components/AuthPage'

const Page = () => {
	return (
		<AuthPage
			title="登录"
			description="登录系统"
			Form={LoginForm}
			footerText="还没有账号？"
			footerLink={{
				text: '注册',
				href: '/register'
			}}
		/>
	)
}

export default Page
