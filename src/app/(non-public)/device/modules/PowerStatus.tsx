import React from 'react'
import { Badge } from '@/components/ui/badge'

interface PowerStatusProps {
	isOnline: boolean
	electric: string | number | undefined | null
}

const PowerStatus: React.FC<PowerStatusProps> = ({ isOnline, electric }) => {
	let badgeColor = 'bg-yellow-500'
	let badgeText = '未知'

	if (isOnline) {
		if (electric === 'correct' || electric === -1) {
			badgeColor = 'bg-green-500'
			badgeText = '正常'
		} else {
			badgeColor = 'bg-red-500'
			badgeText = '断电'
		}
	}

	return <Badge className={badgeColor}>{badgeText}</Badge>
}

export default PowerStatus
