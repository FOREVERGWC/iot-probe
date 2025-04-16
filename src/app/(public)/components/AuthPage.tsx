import React from 'react'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const AuthPage: React.FC<AuthPageProps> = ({ title, description, Form, footerText, footerLink }) => {
	return (
		<>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold">{title}</CardTitle>
				<CardDescription className="text-center">{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form />
				<p className="mt-4 text-center text-sm">
					<span>{footerText}</span>
					<Link className="hover:text-gray-600" href={footerLink.href}>
						{footerLink.text}
					</Link>
				</p>
			</CardContent>
		</>
	)
}

export default AuthPage
