import React from 'react'
import ForgotPasswordForm from './page.client'
import AuthPage from '../components/AuthPage'

const Page = () => {
	return (
		<AuthPage
			title="找回"
			description="找回密码"
			Form={ForgotPasswordForm}
			footerText="已经有账号？"
			footerLink={{
				text: '登录',
				href: '/login'
			}}
		/>
	)
}

export default Page
