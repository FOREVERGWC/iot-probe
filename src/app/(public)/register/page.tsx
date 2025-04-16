import React from 'react'
import RegisterForm from './page.client'
import AuthPage from '../components/AuthPage'

const Page = () => {
	return (
		<AuthPage
			title="注册"
			description="注册账号"
			Form={RegisterForm}
			footerText="已经有账号？"
			footerLink={{
				text: '登录',
				href: '/login'
			}}
		/>
	)
}

export default Page
