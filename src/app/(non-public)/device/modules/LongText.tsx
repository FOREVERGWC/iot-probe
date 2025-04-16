import React, { useEffect, useRef } from 'react'
import { Copy } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

const LongText: React.FC<{ text: string }> = ({ text }) => {
	const { toast } = useToast()
	const textRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const textElement = textRef.current
		if (textElement) {
			const scrollWidth = textElement.scrollWidth
			const clientWidth = textElement.clientWidth

			if (scrollWidth > clientWidth) {
				textElement.classList.add('animate-scrolling')
			} else {
				textElement.classList.remove('animate-scrolling')
			}
		}
	}, [text])

	const handleCopy = () => {
		navigator.clipboard.writeText(text).then(() => {
			toast({
				title: '复制成功',
				description: '文本已复制到剪贴板。'
			})
		})
	}

	return (
		<div className="relative max-w-full overflow-hidden">
			<div ref={textRef} className="whitespace-nowrap pr-6">
				<span className="block max-w-full">{text}</span>
			</div>
			<div className="absolute right-0 top-0 h-full flex items-center justify-center bg-white">
				<Copy className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={handleCopy} size={20} />
			</div>
		</div>
	)
}

export default LongText
