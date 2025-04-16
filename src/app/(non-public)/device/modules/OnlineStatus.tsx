import React from 'react'
import { Badge } from '@/components/ui/badge'

interface OnlineStatusProps {
	isOnline: boolean
	isError?: boolean
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({ isOnline, isError = false }) => {
	let badgeColor = 'bg-yellow-500'
	let statusText = '异常'

	if (isOnline) {
		badgeColor = 'bg-green-500'
		statusText = '上线'
	} else if (!isOnline && !isError) {
		badgeColor = 'bg-red-500'
		statusText = '离线'
	}

	return <Badge className={badgeColor}>{statusText}</Badge>
}

export default OnlineStatus
