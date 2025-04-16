import { Badge } from '@/components/ui/badge'

export default function MsSpeed({ speed }: { speed: string }) {
	return (
		<>
			{speed}
			{parseInt(speed?.slice(0, -2)) > 9000 && (
				<Badge variant="destructive" className="mx-2">
					离线
				</Badge>
			)}
		</>
	)
}
