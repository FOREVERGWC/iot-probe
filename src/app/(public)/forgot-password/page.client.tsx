'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/utils/trpc'
import { useToast } from '@/components/ui/use-toast'
import { EnvelopeClosedIcon, LockClosedIcon, MobileIcon } from '@radix-ui/react-icons'

export const forgotPasswordSchema = z.object({
	phone: z
		.string()
		.min(10, { message: '手机号至少需要 10 个字符' })
		.regex(/^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}?\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/, {
			message: '无效的手机号格式'
		}),
	verificationCode: z.string().min(4, { message: '验证码至少需要 4 个字符' }),
	newPassword: z
		.string()
		.min(6, { message: '密码至少需要 6 个字符' })
		.max(80, { message: '密码至多需要 20 个字符' })
		.regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d\S]+$/, {
			message: '密码必须包含字母和数字'
		})
})

const ForgotPasswordForm = () => {
	const { trigger: sendCodeTrigger } = api.sendVerificationCode.useSWRMutation()
	const { trigger: resetPasswordTrigger } = api.resetPassword.useSWRMutation()
	const { toast } = useToast() // 使用 Toast 的 hook
	const router = useRouter()

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			phone: '',
			verificationCode: '',
			newPassword: ''
		}
	})

	const handleSendCode = async () => {
		const phone = form.getValues('phone')
		try {
			await sendCodeTrigger({ phone })
			toast({
				title: '验证码已发送',
				description: '请检查您的手机',
				variant: 'default'
			})
		} catch (error: any) {
			toast({
				title: '发送验证码失败',
				description: error?.message || '请重试',
				variant: 'destructive'
			})
		}
	}

	const handleResetPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
		try {
			await resetPasswordTrigger(values)
			toast({
				title: '密码重置成功',
				description: '请使用新密码登录',
				variant: 'default'
			})
			router.push('/login')
		} catch (error: any) {
			toast({
				title: '密码重置失败',
				description: error?.message || '请重试',
				variant: 'destructive'
			})
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleResetPassword)} className="space-y-4">
				<FormField
					control={form.control}
					name="phone"
					render={({ field }) => (
						<FormItem>
							<div className="flex space-x-2">
								<FormControl>
									<div className="relative">
										<MobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
										<Input type="text" placeholder="手机号" {...field} className="pl-10" />
									</div>
								</FormControl>
								<Button type="button" onClick={handleSendCode}>
									发送验证码
								</Button>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="verificationCode"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative">
									<EnvelopeClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
									<Input type="text" placeholder="验证码" {...field} className="pl-10" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="newPassword"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="relative">
									<LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
									<Input type="password" placeholder="新密码" {...field} className="pl-10" />
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit">
					重置密码
				</Button>
			</form>
		</Form>
	)
}

export default ForgotPasswordForm
