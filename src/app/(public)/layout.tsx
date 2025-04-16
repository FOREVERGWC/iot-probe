import React from 'react'
import { Card } from '@/components/ui/card'

const AuthLayout: React.FC<React.PropsWithChildren<object>> = ({ children }) => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<Card className="mx-auto w-96 max-w-sm">{children}</Card>
		</div>
	)
}

export default AuthLayout
